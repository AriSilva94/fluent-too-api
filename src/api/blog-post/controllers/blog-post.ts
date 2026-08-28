import { factories } from '@strapi/strapi';
import type { Context } from 'koa';
import { assignOwnerToDocument, stripOwner } from '../../../auth/ownership';

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
      // Com draftAndPublish o create gera duas linhas (rascunho e publicada) com o mesmo
      // documentId. O owner precisa ir para TODAS elas: gravar em uma linha só deixa a
      // outra sem dono e a policy de ownership pode acabar lendo justamente essa.
      const where = created.documentId ? { documentId: created.documentId } : { id: created.id };
      await assignOwnerToDocument(strapi, UID, where, (user as any).id);
    } catch (err) {
      // Rollback do documento inteiro: apagar uma linha só deixaria a versão publicada
      // viva, sem dono e visível publicamente.
      if (created.documentId) {
        await strapi.documents(UID as never).delete({ documentId: created.documentId }).catch(() => undefined);
      } else {
        await strapi.db.query(UID).delete({ where: { id: created.id } }).catch(() => undefined);
      }
      strapi.log.error('Falha ao vincular owner ao blog post recém-criado', err);
      return ctx.internalServerError('Falha ao vincular owner ao registro criado.');
    }

    return result;
  },
}));
