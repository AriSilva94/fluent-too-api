import { factories } from '@strapi/strapi';
import type { Context } from 'koa';
import { buildOwnedCreateData } from '../../../auth/ownership';

export default factories.createCoreController('api::blog-post.blog-post' as never, () => ({
  async create(ctx: Context) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();
    ctx.request.body = { data: buildOwnedCreateData((ctx.request.body as any)?.data ?? {}, user as any) };
    return super.create(ctx);
  },
}));
