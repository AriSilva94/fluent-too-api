import { factories } from '@strapi/strapi';
import { isAdminRole } from '../../../auth/roles';
import { buildReviewDecision } from '../services/review';

const UID = 'api::teacher-application.teacher-application' as never;

export default factories.createCoreController(UID, ({ strapi }) => ({
  async find(ctx) {
    const reviewer = await getReviewer(strapi, ctx.state.user?.id);
    if (!reviewer) return ctx.forbidden();

    const status = ctx.query?.status;
    const entries = await strapi.db.query(UID).findMany({
      where: typeof status === 'string' ? { status } : {},
      orderBy: { createdAt: 'desc' },
      populate: ['user', 'attachment', 'reviewedBy'],
    });

    ctx.body = { data: entries };
  },

  async findOne(ctx) {
    const reviewer = await getReviewer(strapi, ctx.state.user?.id);
    if (!reviewer) return ctx.forbidden();

    const entry = await strapi.db.query(UID).findOne({
      where: { id: ctx.params.id },
      populate: ['user', 'attachment', 'reviewedBy'],
    });

    if (!entry) return ctx.notFound();
    ctx.body = { data: entry };
  },

  async approve(ctx) {
    return review(ctx, 'approved');
  },

  async reject(ctx) {
    return review(ctx, 'rejected');
  },
}));

async function review(ctx: any, decision: 'approved' | 'rejected') {
  const strapi = global.strapi;
  const reviewer = await getReviewer(strapi, ctx.state.user?.id);
  if (!reviewer) return ctx.forbidden();

  const application = await strapi.db.query(UID).findOne({
    where: { id: ctx.params.id },
    populate: ['user'],
  });
  if (!application) return ctx.notFound();

  const note = ctx.request.body?.reviewNote;
  const result = buildReviewDecision(application, decision, reviewer.id, note, new Date().toISOString());
  if (!result.ok) {
    return result.error === 'ALREADY_REVIEWED' ? ctx.conflict(result.error) : ctx.badRequest(result.error);
  }

  if (decision === 'approved') {
    const teacherRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'teacher' } });
    if (!teacherRole) return ctx.badRequest('ROLE_UNAVAILABLE');

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: application.user.id },
      data: { role: teacherRole.id },
    });
  }

  const updated = await strapi.db.query(UID).update({
    where: { id: application.id },
    data: result.data,
    populate: ['user', 'attachment', 'reviewedBy'],
  });

  ctx.body = { data: updated };
}

async function getReviewer(strapi: any, id: number | string | undefined) {
  if (!id) return null;
  const user = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id },
    populate: ['role'],
  });
  return user && isAdminRole(user.role?.type) ? user : null;
}
