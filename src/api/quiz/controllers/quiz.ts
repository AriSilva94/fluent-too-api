import { factories } from '@strapi/strapi';
import type { Context } from 'koa';
import { stripOwner } from '../../../auth/ownership';

const UID = 'api::quiz.quiz';

export default factories.createCoreController('api::quiz.quiz', ({ strapi }) => ({
  async create(ctx: Context) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    // `owner` é private no schema (não pode ser populado publicamente), então o content
    // API rejeita a chave `owner` no body do create. Removemos qualquer valor enviado pelo
    // cliente e deixamos o super.create rodar com o payload saneado.
    ctx.request.body = { data: stripOwner(ctx.request.body?.data ?? {}) };
    const result = await super.create(ctx);
    const created = (result as any)?.data;
    if (!created) return result;

    // O owner é atribuído depois, fora do body, via query engine (que não passa pela
    // validação de input do content API) — sempre a partir do usuário autenticado.
    try {
      const row =
        (await strapi.db.query(UID).findOne({ where: { documentId: created.documentId } })) ??
        (await strapi.db.query(UID).findOne({ where: { id: created.id } }));
      if (!row) throw new Error('Registro criado não encontrado para vincular owner.');
      await strapi.db.query(UID).update({ where: { id: row.id }, data: { owner: user.id } });
    } catch (err) {
      const deleteWhere = created.documentId ? { documentId: created.documentId } : { id: created.id };
      await strapi.db.query(UID).delete({ where: deleteWhere }).catch(() => undefined);
      strapi.log.error('Falha ao vincular owner ao quiz recém-criado', err);
      return ctx.internalServerError('Falha ao vincular owner ao registro criado.');
    }

    return result;
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
    return super.find(ctx);
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
