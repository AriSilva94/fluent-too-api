import { factories } from '@strapi/strapi';
import type { Context } from 'koa';
import { assignOwnerToDocument, stripOwner } from '../../../auth/ownership';
import { DRAFT_STATUS, withPublicationState } from '../../../publication/state';

const UID = 'api::blog-post.blog-post';

export default factories.createCoreController('api::blog-post.blog-post' as never, ({ strapi }) => ({
  async create(ctx: Context) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    ctx.request.body = { data: stripOwner((ctx.request.body as any)?.data ?? {}) };
    const result = await super.create(ctx);
    const created = (result as any)?.data;
    if (!created) return result;

    try {
      const where = created.documentId ? { documentId: created.documentId } : { id: created.id };
      await assignOwnerToDocument(strapi, UID, where, (user as any).id);
    } catch (err) {
      if (created.documentId) {
        await strapi.documents(UID as never).delete({ documentId: created.documentId }).catch(() => undefined);
      } else {
        await strapi.db.query(UID).delete({ where: { id: created.id } }).catch(() => undefined);
      }
      strapi.log.error('Falha ao vincular owner ao blog post recém-criado', err);
      return ctx.internalServerError('Falha ao vincular owner ao registro criado.');
    }

    await publishBlogPost(strapi, created.documentId);

    return result;
  },

  async find(ctx: Context) {
    const result = await super.find(ctx);

    if (ctx.query.status === DRAFT_STATUS && Array.isArray((result as any)?.data)) {
      (result as any).data = await withPublicationState(strapi, UID, (result as any).data);
    }

    return result;
  },

  async update(ctx: Context) {
    if (!ctx.state.user) return ctx.unauthorized();

    ctx.request.body = { data: stripOwner((ctx.request.body as any)?.data ?? {}) };
    const result = await super.update(ctx);

    await publishBlogPost(strapi, (result as any)?.data?.documentId ?? (ctx.params.id as string));

    return result;
  },
}));

async function publishBlogPost(strapi: any, documentId: string | undefined) {
  if (!documentId) return;

  try {
    await strapi.documents(UID).publish({ documentId });
  } catch (err) {
    strapi.log.error('Falha ao publicar blog post automaticamente', err);
  }
}
