import { factories } from '@strapi/strapi';
import type { Context } from 'koa';
import { assignOwnerToDocument, stripOwner } from '../../../auth/ownership';
import { resolveQuizType, validateQuestions } from '../services/questions';
import { documentIdsOf, mergePublicationState } from '../services/publication';

const MODERATION_ACTION = { publish: 'publish', unpublish: 'unpublish' } as const;

type ModerationAction = (typeof MODERATION_ACTION)[keyof typeof MODERATION_ACTION];

const UID = 'api::quiz.quiz';

const DRAFT_STATUS = 'draft';

export default factories.createCoreController('api::quiz.quiz', ({ strapi }) => ({
  async create(ctx: Context) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const payload = stripOwner(ctx.request.body?.data ?? {});

    const invalid = await validateQuizPayload(strapi, payload, undefined);
    if (invalid) return ctx.badRequest(invalid.error, { index: invalid.index });

    ctx.request.body = { data: payload };
    const result = await super.create(ctx);
    const created = (result as any)?.data;
    if (!created) return result;

    try {
      const where = created.documentId ? { documentId: created.documentId } : { id: created.id };
      await assignOwnerToDocument(strapi, UID, where, user.id);
    } catch (err) {
      if (created.documentId) {
        await strapi.documents(UID).delete({ documentId: created.documentId }).catch(() => undefined);
      } else {
        await strapi.db.query(UID).delete({ where: { id: created.id } }).catch(() => undefined);
      }
      strapi.log.error('Falha ao vincular owner ao quiz recém-criado', err);
      return ctx.internalServerError('Falha ao vincular owner ao registro criado.');
    }

    await publishQuiz(strapi, created.documentId);

    return result;
  },

  async update(ctx: Context) {
    if (!ctx.state.user) return ctx.unauthorized();

    const payload = stripOwner(ctx.request.body?.data ?? {});

    const invalid = await validateQuizPayload(strapi, payload, ctx.params.id);
    if (invalid) return ctx.badRequest(invalid.error, { index: invalid.index });

    ctx.request.body = { data: payload };
    const result = await super.update(ctx);

    await publishQuiz(strapi, (result as any)?.data?.documentId ?? ctx.params.id);

    return result;
  },

  async publish(ctx: Context) {
    return moderate(strapi, ctx, MODERATION_ACTION.publish);
  },

  async unpublish(ctx: Context) {
    return moderate(strapi, ctx, MODERATION_ACTION.unpublish);
  },

  async findMine(ctx: Context) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const controller = this as any;
    const sanitizedQuery = (await controller.sanitizeQuery(ctx)) as Record<string, unknown>;
    const filters = (sanitizedQuery.filters ?? {}) as Record<string, unknown>;

    const { results, pagination } = await (strapi.service(UID) as any).find({
      ...sanitizedQuery,
      filters: { ...filters, owner: { id: user.id } },
    });

    const sanitized = await controller.sanitizeOutput(results, ctx);
    return controller.transformResponse(await withPublicationState(strapi, sanitized), { pagination });
  },

  async find(ctx: Context) {
    const isAuthenticated = Boolean(ctx.state.user);
    if (!isAuthenticated) {
      const existingFilters =
        typeof ctx.query.filters === 'object' && ctx.query.filters !== null ? ctx.query.filters : {};
      ctx.query = {
        ...ctx.query,
        filters: {
          ...existingFilters,
          isPublic: { $eq: true },
        },
      };
    }

    const result = await super.find(ctx);
    if (ctx.query.status === DRAFT_STATUS && Array.isArray((result as any)?.data)) {
      (result as any).data = await withPublicationState(strapi, (result as any).data);
    }
    return result;
  },

  async findOne(ctx: Context) {
    const isAuthenticated = Boolean(ctx.state.user);
    const result = await super.findOne(ctx);
    if (!isAuthenticated && result?.data?.isPublic === false) {
      return ctx.forbidden('This quiz requires authentication.');
    }
    return result;
  },
}));

async function withPublicationState(strapi: any, entries: any[]) {
  const documentIds = documentIdsOf(entries);
  if (documentIds.length === 0) return entries;

  const published = await strapi.db.query(UID).findMany({
    where: { documentId: { $in: documentIds }, publishedAt: { $notNull: true } },
    select: ['documentId', 'publishedAt'],
  });

  const publishedAtByDocumentId = new Map<string, string>(
    (published ?? []).map((entry: any) => [entry.documentId, new Date(entry.publishedAt).toISOString()])
  );

  return mergePublicationState(entries, publishedAtByDocumentId);
}

async function validateQuizPayload(strapi: any, payload: Record<string, unknown>, id: string | number | undefined) {
  const touchesQuestions = 'questions' in payload || 'type' in payload;
  if (!touchesQuestions && id) return null;

  const entries = await loadQuizEntries(strapi, id);
  const type = resolveQuizType(payload, entries);
  if (!type) return { error: 'INVALID_QUIZ_TYPE' as const, index: undefined };

  const questions = 'questions' in payload ? payload.questions : entries[0]?.questions;
  const result = validateQuestions(type, questions);

  return result.ok ? null : { error: result.error, index: result.index };
}

async function loadQuizEntries(strapi: any, id: string | number | undefined) {
  if (!id) return [];

  const byDocumentId = await strapi.db.query(UID).findMany({
    where: { documentId: id },
    select: ['type', 'questions'],
  });
  if (byDocumentId?.length) return byDocumentId;

  const byId = await strapi.db.query(UID).findMany({ where: { id }, select: ['type', 'questions'] });
  return byId ?? [];
}

async function moderate(strapi: any, ctx: Context, action: ModerationAction) {
  const documentId = await resolveDocumentId(strapi, ctx.params.id);
  if (!documentId) return ctx.notFound();

  try {
    await strapi.documents(UID)[action]({ documentId });
  } catch (err) {
    strapi.log.error(`Falha ao ${action} quiz`, err);
    return ctx.badRequest('MODERATION_FAILED');
  }

  ctx.body = { data: { documentId, published: action === MODERATION_ACTION.publish } };
}

async function resolveDocumentId(strapi: any, id: string | number | undefined) {
  if (!id) return null;

  const entries = await loadQuizEntriesById(strapi, id);
  return entries[0]?.documentId ?? null;
}

async function loadQuizEntriesById(strapi: any, id: string | number) {
  const byDocumentId = await strapi.db.query(UID).findMany({ where: { documentId: id }, select: ['documentId'] });
  if (byDocumentId?.length) return byDocumentId;

  const byId = await strapi.db.query(UID).findMany({ where: { id }, select: ['documentId'] });
  return byId ?? [];
}

async function publishQuiz(strapi: any, documentId: string | undefined) {
  if (!documentId) return;

  try {
    await strapi.documents(UID).publish({ documentId });
  } catch (err) {
    strapi.log.error('Falha ao publicar quiz automaticamente', err);
  }
}
