import { factories } from '@strapi/strapi';
import { getReviewer, reviewApplication, SAFE_POPULATE } from '../services/review';

const UID = 'api::teacher-application.teacher-application' as never;

export default factories.createCoreController(UID, ({ strapi }) => ({
  async find(ctx) {
    const reviewer = await getReviewer(strapi, ctx.state.user?.id);
    if (!reviewer) return ctx.forbidden();

    const status = ctx.query?.status;
    const entries = await strapi.db.query(UID).findMany({
      where: typeof status === 'string' ? { status } : {},
      orderBy: { createdAt: 'desc' },
      populate: SAFE_POPULATE,
    });

    ctx.body = { data: entries };
  },

  async findOne(ctx) {
    const reviewer = await getReviewer(strapi, ctx.state.user?.id);
    if (!reviewer) return ctx.forbidden();

    const entry = await strapi.db.query(UID).findOne({
      where: { id: ctx.params.id },
      populate: SAFE_POPULATE,
    });

    if (!entry) return ctx.notFound();
    ctx.body = { data: entry };
  },

  async approve(ctx) {
    return reviewApplication(strapi, ctx, 'approved');
  },

  async reject(ctx) {
    return reviewApplication(strapi, ctx, 'rejected');
  },
}));
