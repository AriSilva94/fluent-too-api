import { normalizeTeachingLanguages } from '../../../auth/quiz-language';
import { APP_ROLES, isAdminRole } from '../../../auth/roles';

export const APPLICATION_STATUS = { pending: 'pending', approved: 'approved', rejected: 'rejected' } as const;

export type ApplicationStatus = (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

export const REVIEW_DECISION = { approved: APPLICATION_STATUS.approved, rejected: APPLICATION_STATUS.rejected } as const;

export type ReviewDecision = (typeof REVIEW_DECISION)[keyof typeof REVIEW_DECISION];

export const REVIEW_ERROR = { alreadyReviewed: 'ALREADY_REVIEWED', reviewNoteRequired: 'REVIEW_NOTE_REQUIRED' } as const;

export type ReviewError = (typeof REVIEW_ERROR)[keyof typeof REVIEW_ERROR];

export type ReviewDecisionResult =
  | {
      ok: true;
      data: { reviewStatus: ApplicationStatus; reviewedBy: number | string; reviewedAt: string; reviewNote: string | null };
    }
  | { ok: false; error: ReviewError };

export function buildReviewDecision(
  application: { id: number | string; reviewStatus: ApplicationStatus },
  decision: ReviewDecision,
  reviewerId: number | string,
  note: string | undefined,
  now: string
): ReviewDecisionResult {
  if (application.reviewStatus !== APPLICATION_STATUS.pending) return { ok: false, error: REVIEW_ERROR.alreadyReviewed };

  const trimmedNote = (note ?? '').trim();
  if (decision === REVIEW_DECISION.rejected && !trimmedNote) return { ok: false, error: REVIEW_ERROR.reviewNoteRequired };

  return {
    ok: true,
    data: {
      reviewStatus: decision,
      reviewedBy: reviewerId,
      reviewedAt: now,
      reviewNote: trimmedNote || null,
    },
  };
}

export function toApplicationView<T extends { reviewStatus?: ApplicationStatus }>(entry: T) {
  const { reviewStatus, ...rest } = entry;
  return { ...rest, status: reviewStatus } as Omit<T, 'reviewStatus'> & { status: ApplicationStatus | undefined };
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

export async function promoteApprovedCandidate(strapi: any, applicationId: number | string) {
  const application = await strapi.db.query(UID).findOne({
    where: { id: applicationId },
    populate: ['user'],
  });
  if (!application || application.reviewStatus !== APPLICATION_STATUS.approved || !application.user?.id) return false;

  const candidate = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: application.user.id },
    populate: ['role'],
  });
  if (!candidate || candidate.role?.type === APP_ROLES.teacher) return false;

  const teacherRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: APP_ROLES.teacher } });
  if (!teacherRole) return false;

  await strapi.db.query('plugin::users-permissions.user').update({
    where: { id: candidate.id },
    data: {
      role: teacherRole.id,
      teachingLanguages: normalizeTeachingLanguages(application.languages),
    },
  });

  return true;
}

export async function reviewApplication(strapi: any, ctx: any, decision: ReviewDecision) {
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
    return result.error === REVIEW_ERROR.alreadyReviewed ? ctx.conflict(result.error) : ctx.badRequest(result.error);
  }

  let teacherRoleId: number | string | undefined;
  if (decision === REVIEW_DECISION.approved) {
    const teacherRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: APP_ROLES.teacher } });
    if (!teacherRole) return ctx.badRequest('ROLE_UNAVAILABLE');
    teacherRoleId = teacherRole.id;
  }

  const updated = await strapi.db.transaction(async () => {
    const reviewedApplication = await strapi.db.query(UID).update({
      where: { id: application.id, reviewStatus: APPLICATION_STATUS.pending },
      data: result.data,
      populate: SAFE_POPULATE,
    });

    if (!reviewedApplication) return null;

    if (decision === REVIEW_DECISION.approved) {
      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: application.user.id },
        data: {
          role: teacherRoleId,
          teachingLanguages: normalizeTeachingLanguages(application.languages),
        },
      });
    }

    return reviewedApplication;
  });

  if (!updated) return ctx.conflict(REVIEW_ERROR.alreadyReviewed);

  ctx.body = { data: toApplicationView(updated) };
}
