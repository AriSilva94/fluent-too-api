import { factories } from '@strapi/strapi';
import { isAdminRole } from '../../../auth/roles';
import { buildReviewDecision } from '../services/review';

const UID = 'api::teacher-application.teacher-application' as never;

// Campos seguros do usuário: nunca incluir password/tokens privados, que a
// query engine (strapi.db.query) NÃO sanitiza automaticamente como o content-API faz.
const SAFE_USER_SELECT = ['id', 'username', 'email', 'confirmed'];
const SAFE_POPULATE = {
  user: { select: SAFE_USER_SELECT },
  reviewedBy: { select: SAFE_USER_SELECT },
  attachment: true,
};

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

  let teacherRoleId: number | string | undefined;
  if (decision === 'approved') {
    const teacherRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'teacher' } });
    if (!teacherRole) return ctx.badRequest('ROLE_UNAVAILABLE');
    teacherRoleId = teacherRole.id;
  }

  // Atualização condicional: só grava se a candidatura ainda estiver 'pending'
  // no momento da escrita, fechando a janela de corrida entre duas revisões
  // concorrentes que ambas passaram pela pré-checagem acima. A promoção de
  // role só acontece depois de confirmar que esta chamada venceu a corrida.
  const updated = await strapi.db.query(UID).update({
    where: { id: application.id, status: 'pending' },
    data: result.data,
    populate: SAFE_POPULATE,
  });

  if (!updated) return ctx.conflict('ALREADY_REVIEWED');

  if (decision === 'approved') {
    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: application.user.id },
      data: { role: teacherRoleId },
    });
  }

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
