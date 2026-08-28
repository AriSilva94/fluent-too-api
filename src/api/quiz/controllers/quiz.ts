import { factories } from '@strapi/strapi';
import type { Context } from 'koa';
import { buildOwnedCreateData } from '../../../auth/ownership';

export default factories.createCoreController('api::quiz.quiz', ({ strapi }) => ({
  async create(ctx: Context) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();
    ctx.request.body = { data: buildOwnedCreateData(ctx.request.body?.data ?? {}, user) };
    return super.create(ctx);
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
