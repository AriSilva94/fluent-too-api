import { rm } from 'node:fs/promises';
import type { Core } from '@strapi/strapi';
import { canBecomeStudent, canBecomeTeacher } from '../../../auth/profile-transitions';
import { validateAttachmentFile, validateTeacherApplication } from '../services/registration';

const USER_UID = 'plugin::users-permissions.user';
const ROLE_UID = 'plugin::users-permissions.role';
const APPLICATION_UID = 'api::teacher-application.teacher-application';

async function loadUserWithRole(strapi: Core.Strapi, id: number | string | undefined) {
  if (!id) return null;
  return strapi.db.query(USER_UID).findOne({ where: { id }, populate: ['role'] });
}

/**
 * Mesma limpeza de `registerTeacher`: o middleware `strapi::body` só remove os
 * arquivos temporários do campo `files`, não do campo `attachment` do formidable.
 * Precisa rodar em toda saída da rota, inclusive nas recusadas.
 */
async function removeTempFile(strapi: Core.Strapi, file: any) {
  const filepath = file?.filepath ?? file?.path;
  if (!filepath) return;
  try {
    await rm(filepath, { force: true });
  } catch (cleanupError) {
    strapi.log?.error?.('Falha ao remover arquivo temporário da candidatura de professor', cleanupError);
  }
}

async function createTeacherApplication(strapi: Core.Strapi, ctx: any, user: any, attachmentFile: any) {
  const validation = validateTeacherApplication(ctx.request.body);
  if (!validation.ok) return ctx.badRequest(validation.error);

  const { bio, experience, languages, credentialUrl } = validation.data;

  // Valida o arquivo de anexo (se enviado via multipart/form-data) ANTES de criar qualquer registro.
  if (attachmentFile) {
    const fileValidation = validateAttachmentFile(attachmentFile);
    if (!fileValidation.ok) return ctx.badRequest(fileValidation.error);
  }

  const pendingRole = await strapi.db.query(ROLE_UID).findOne({ where: { type: 'teacher_pending' } });
  if (!pendingRole) return ctx.badRequest('ROLE_UNAVAILABLE');

  let uploadedFile: any;
  try {
    // O único anexo aceito é o arquivo enviado nesta requisição: aceitar um id de mídia
    // vindo do JSON deixaria o usuário anexar o arquivo de outra pessoa.
    let attachmentId: number | undefined;
    if (attachmentFile) {
      const uploaded = await strapi.plugin('upload').service('upload').upload({
        data: {},
        files: attachmentFile,
      });
      uploadedFile = Array.isArray(uploaded) ? uploaded[0] : uploaded;
      attachmentId = uploadedFile?.id;
    }

    await strapi.db.query(APPLICATION_UID).create({
      data: {
        user: user.id,
        status: 'pending',
        bio,
        experience,
        languages,
        ...(credentialUrl ? { credentialUrl } : {}),
        ...(attachmentId ? { attachment: attachmentId } : {}),
      },
    });
  } catch (error) {
    // Se a candidatura (ou o upload) falhar, remove o arquivo já enviado (se houver)
    // para permitir uma nova tentativa sem deixar órfãos. O usuário já existia antes
    // desta chamada, então nada além do arquivo precisa ser desfeito.
    if (uploadedFile) {
      try {
        await strapi.plugin('upload').service('upload').remove(uploadedFile);
      } catch (cleanupError) {
        strapi.log?.error?.('Falha ao remover arquivo órfão após erro na candidatura de professor', cleanupError);
      }
    }
    throw error;
  }

  // A role só muda depois da candidatura ser criada com sucesso, para o usuário
  // continuar `unassigned` (e poder tentar de novo) se algo acima falhar.
  await strapi.db.query(USER_UID).update({ where: { id: user.id }, data: { role: pendingRole.id } });

  ctx.body = { data: { role: 'teacher_pending' } };
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async becomeStudent(ctx: any) {
    const user = await loadUserWithRole(strapi, ctx.state.user?.id);
    if (!user) return ctx.unauthorized();

    let applicationStatus: 'pending' | 'approved' | 'rejected' | undefined;
    if (user.role?.type === 'teacher_pending') {
      const application = await strapi.db.query(APPLICATION_UID).findOne({ where: { user: user.id } });
      applicationStatus = application?.status;
    }

    if (!canBecomeStudent(user.role?.type, applicationStatus)) return ctx.forbidden('PROFILE_ALREADY_SET');

    const studentRole = await strapi.db.query(ROLE_UID).findOne({ where: { type: 'student' } });
    if (!studentRole) return ctx.badRequest('ROLE_UNAVAILABLE');

    await strapi.db.query(USER_UID).update({ where: { id: user.id }, data: { role: studentRole.id } });

    ctx.body = { data: { role: 'student' } };
  },

  async becomeTeacher(ctx: any) {
    const user = await loadUserWithRole(strapi, ctx.state.user?.id);
    if (!user) return ctx.unauthorized();

    if (!canBecomeTeacher(user.role?.type)) return ctx.forbidden('PROFILE_ALREADY_SET');

    const existingApplication = await strapi.db.query(APPLICATION_UID).findOne({ where: { user: user.id } });
    if (existingApplication) return ctx.badRequest('TEACHER_APPLICATION_EXISTS');

    const attachmentFile = (ctx.request as any).files?.attachment;
    try {
      return await createTeacherApplication(strapi, ctx, user, attachmentFile);
    } finally {
      await removeTempFile(strapi, attachmentFile);
    }
  },

  async myApplication(ctx: any) {
    if (!ctx.state.user?.id) return ctx.unauthorized();

    // Nunca populamos `user`: esta rota devolve só a candidatura do próprio chamador,
    // identificado pelo filtro abaixo, e nenhum dado de outro usuário.
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
