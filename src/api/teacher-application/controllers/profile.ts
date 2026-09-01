import type { Core } from '@strapi/strapi';
import { canBecomeStudent, canBecomeTeacher } from '../../../auth/profile-transitions';
import { APP_ROLES } from '../../../auth/roles';
import { APPLICATION_STATUS } from '../services/review';
import { validateAttachmentFile, validateTeacherApplication } from '../services/registration';

const USER_UID = 'plugin::users-permissions.user';
const ROLE_UID = 'plugin::users-permissions.role';
const APPLICATION_UID = 'api::teacher-application.teacher-application';

class DuplicateApplicationError extends Error {}

function isUniqueConstraintError(error: unknown): boolean {
  const err = error as { code?: string; message?: string } | undefined;
  if (!err) return false;
  const message = err.message ?? '';
  return (
    err.code === 'ER_DUP_ENTRY' ||
    err.code === '23505' ||
    /already taken|unique constraint|duplicate/i.test(message)
  );
}

async function loadUserWithRole(strapi: Core.Strapi, id: number | string | undefined) {
  if (!id) return null;
  return strapi.db.query(USER_UID).findOne({ where: { id }, populate: ['role'] });
}

async function createTeacherApplication(strapi: Core.Strapi, ctx: any, user: any, attachmentFile: any) {
  const validation = validateTeacherApplication(ctx.request.body);
  if (!validation.ok) return ctx.badRequest(validation.error);

  const { bio, experience, languages, credentialUrl } = validation.data;

  if (attachmentFile) {
    const fileValidation = validateAttachmentFile(attachmentFile);
    if (!fileValidation.ok) return ctx.badRequest(fileValidation.error);
  }

  const pendingRole = await strapi.db.query(ROLE_UID).findOne({ where: { type: APP_ROLES.teacherPending } });
  if (!pendingRole) return ctx.badRequest('ROLE_UNAVAILABLE');

  let uploadedFile: any;
  try {
    let attachmentId: number | undefined;
    if (attachmentFile) {
      const uploaded = await strapi.plugin('upload').service('upload').upload({
        data: {},
        files: attachmentFile,
      });
      uploadedFile = Array.isArray(uploaded) ? uploaded[0] : uploaded;
      attachmentId = uploadedFile?.id;
    }

    await strapi.db.transaction(async () => {
      const existingApplication = await strapi.db.query(APPLICATION_UID).findOne({ where: { user: user.id } });
      if (existingApplication) throw new DuplicateApplicationError('TEACHER_APPLICATION_EXISTS');

      await strapi.db.query(APPLICATION_UID).create({
        data: {
          user: user.id,
          status: APPLICATION_STATUS.pending,
          bio,
          experience,
          languages,
          ...(credentialUrl ? { credentialUrl } : {}),
          ...(attachmentId ? { attachment: attachmentId } : {}),
        },
      });

      await strapi.db.query(USER_UID).update({ where: { id: user.id }, data: { role: pendingRole.id } });
    });
  } catch (error) {
    if (uploadedFile) {
      try {
        await strapi.plugin('upload').service('upload').remove(uploadedFile);
      } catch (cleanupError) {
        strapi.log?.error?.('Falha ao remover arquivo órfão após erro na candidatura de professor', cleanupError);
      }
    }

    if (error instanceof DuplicateApplicationError || isUniqueConstraintError(error)) {
      return ctx.badRequest('TEACHER_APPLICATION_EXISTS');
    }
    throw error;
  }

  ctx.body = { data: { role: APP_ROLES.teacherPending } };
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async becomeStudent(ctx: any) {
    const user = await loadUserWithRole(strapi, ctx.state.user?.id);
    if (!user) return ctx.unauthorized();

    let applicationStatus: 'pending' | 'approved' | 'rejected' | undefined;
    if (user.role?.type === APP_ROLES.teacherPending) {
      const application = await strapi.db.query(APPLICATION_UID).findOne({ where: { user: user.id } });
      applicationStatus = application?.status;
    }

    if (!canBecomeStudent(user.role?.type, applicationStatus)) return ctx.forbidden('PROFILE_ALREADY_SET');

    const studentRole = await strapi.db.query(ROLE_UID).findOne({ where: { type: APP_ROLES.student } });
    if (!studentRole) return ctx.badRequest('ROLE_UNAVAILABLE');

    await strapi.db.query(USER_UID).update({ where: { id: user.id }, data: { role: studentRole.id } });

    ctx.body = { data: { role: APP_ROLES.student } };
  },

  async becomeTeacher(ctx: any) {
    const user = await loadUserWithRole(strapi, ctx.state.user?.id);
    if (!user) return ctx.unauthorized();

    if (!canBecomeTeacher(user.role?.type)) return ctx.forbidden('PROFILE_ALREADY_SET');

    const existingApplication = await strapi.db.query(APPLICATION_UID).findOne({ where: { user: user.id } });
    if (existingApplication) return ctx.badRequest('TEACHER_APPLICATION_EXISTS');

    const attachmentFile = (ctx.request as any).files?.attachment;
    return createTeacherApplication(strapi, ctx, user, attachmentFile);
  },

  async myApplication(ctx: any) {
    if (!ctx.state.user?.id) return ctx.unauthorized();

    const application = await strapi.db.query(APPLICATION_UID).findOne({ where: { user: ctx.state.user.id } });

    ctx.body = {
      data: application
        ? {
            status: application.status,
            reviewNote: application.reviewNote ?? null,
            createdAt: application.createdAt,
          }
        : null,
    };
  },
});
