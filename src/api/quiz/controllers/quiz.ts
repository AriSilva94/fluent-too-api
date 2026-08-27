import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::quiz.quiz', ({ strapi }) => ({
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
