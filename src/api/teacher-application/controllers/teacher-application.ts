import { factories } from '@strapi/strapi';
import { getReviewer, reviewApplication, SAFE_POPULATE, toApplicationView } from '../services/review';

const UID = 'api::teacher-application.teacher-application' as never;
const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 25;
const allowedStatuses = ['pending', 'approved', 'rejected'];

function resolvePagination(query: Record<string, unknown>) {
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(query.pageSize) || DEFAULT_PAGE_SIZE));
  return { page, pageSize, offset: (page - 1) * pageSize };
}

export default factories.createCoreController(UID, ({ strapi }) => ({
  async find(ctx) {
    const reviewer = await getReviewer(strapi, ctx.state.user?.id);
    if (!reviewer) return ctx.forbidden();

    const status = ctx.query?.status;
    const where = typeof status === 'string' && allowedStatuses.includes(status) ? { reviewStatus: status } : {};
    const { page, pageSize, offset } = resolvePagination(ctx.query ?? {});

    const [entries, total] = await Promise.all([
      strapi.db.query(UID).findMany({
        where,
        orderBy: { createdAt: 'desc' },
        populate: SAFE_POPULATE,
        limit: pageSize,
        offset,
      }),
      strapi.db.query(UID).count({ where }),
    ]);

    ctx.body = { data: entries.map(toApplicationView), meta: { pagination: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) } } };
  },

  async findOne(ctx) {
    const reviewer = await getReviewer(strapi, ctx.state.user?.id);
    if (!reviewer) return ctx.forbidden();

    const entry = await strapi.db.query(UID).findOne({
      where: { id: ctx.params.id },
      populate: SAFE_POPULATE,
    });

    if (!entry) return ctx.notFound();
    ctx.body = { data: toApplicationView(entry) };
  },

  async approve(ctx) {
    return reviewApplication(strapi, ctx, 'approved');
  },

  async reject(ctx) {
    return reviewApplication(strapi, ctx, 'rejected');
  },
}));
