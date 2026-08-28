import { factories } from '@strapi/strapi';
import type { Context } from 'koa';
import { stripOwner } from '../../../auth/ownership';

const UID = 'api::blog-post.blog-post';

export default factories.createCoreController('api::blog-post.blog-post' as never, ({ strapi }) => ({
  async create(ctx: Context) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    // `owner` é private no schema (não pode ser populado publicamente), então o content
    // API rejeita a chave `owner` no body do create. Removemos qualquer valor enviado pelo
    // cliente e deixamos o super.create rodar com o payload saneado.
    ctx.request.body = { data: stripOwner((ctx.request.body as any)?.data ?? {}) };
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
      await strapi.db.query(UID).update({ where: { id: row.id }, data: { owner: (user as any).id } });
    } catch (err) {
      const deleteWhere = created.documentId ? { documentId: created.documentId } : { id: created.id };
      await strapi.db.query(UID).delete({ where: deleteWhere }).catch(() => undefined);
      strapi.log.error('Falha ao vincular owner ao blog post recém-criado', err);
      return ctx.internalServerError('Falha ao vincular owner ao registro criado.');
    }

    return result;
  },
}));
