import { isAdminRole } from '../../../auth/roles';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type ReviewDecisionResult =
  | { ok: true; data: { status: ApplicationStatus; reviewedBy: number | string; reviewedAt: string; reviewNote: string | null } }
  | { ok: false; error: 'ALREADY_REVIEWED' | 'REVIEW_NOTE_REQUIRED' };

export function buildReviewDecision(
  application: { id: number | string; status: ApplicationStatus },
  decision: 'approved' | 'rejected',
  reviewerId: number | string,
  note: string | undefined,
  now: string
): ReviewDecisionResult {
  if (application.status !== 'pending') return { ok: false, error: 'ALREADY_REVIEWED' };

  const trimmedNote = (note ?? '').trim();
  if (decision === 'rejected' && !trimmedNote) return { ok: false, error: 'REVIEW_NOTE_REQUIRED' };

  return {
    ok: true,
    data: {
      status: decision,
      reviewedBy: reviewerId,
      reviewedAt: now,
      reviewNote: trimmedNote || null,
    },
  };
}

const UID = 'api::teacher-application.teacher-application';

export const SAFE_USER_SELECT = ['id', 'username', 'email', 'confirmed'];
export const SAFE_POPULATE = {
  user: { select: SAFE_USER_SELECT },
  reviewedBy: { select: SAFE_USER_SELECT },
  attachment: true,
};

export async function getReviewer(strapi: any, id: number | string | undefined) {
  if (!id) return null;
  const user = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id },
    populate: ['role'],
  });
  return user && isAdminRole(user.role?.type) ? user : null;
}

export async function reviewApplication(strapi: any, ctx: any, decision: 'approved' | 'rejected') {
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

  const updated = await strapi.db.transaction(async () => {
    const reviewedApplication = await strapi.db.query(UID).update({
      where: { id: application.id, status: 'pending' },
      data: result.data,
      populate: SAFE_POPULATE,
    });

    if (!reviewedApplication) return null;

    if (decision === 'approved') {
      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: application.user.id },
        data: { role: teacherRoleId },
      });
    }

    return reviewedApplication;
  });

  if (!updated) return ctx.conflict('ALREADY_REVIEWED');

  ctx.body = { data: updated };
}
