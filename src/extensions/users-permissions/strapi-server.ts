import { validateAttachmentFile, validateTeacherRegistration } from '../../api/teacher-application/services/registration';

function isUniqueConstraintError(error: unknown): boolean {
  const err = error as { name?: string; code?: string; message?: string } | undefined;
  if (!err) return false;
  const message = err.message ?? '';
  return (
    err.code === 'ER_DUP_ENTRY' ||
    err.code === '23505' ||
    /already taken|unique constraint|duplicate/i.test(message)
  );
}

export default (plugin: any) => {
  plugin.controllers.auth.registerTeacher = async (ctx: any) => {
    const strapi = ctx.state?.strapi ?? global.strapi;
    const validation = validateTeacherRegistration(ctx.request.body);
    if (!validation.ok) return ctx.badRequest(validation.error);

    const { email, password, bio, experience, languages, credentialUrl, attachment } = validation.data;

    const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email } });
    if (existingUser) return ctx.badRequest('EMAIL_ALREADY_REGISTERED');

    // Valida o arquivo de anexo (se enviado via multipart/form-data) ANTES de criar qualquer registro.
    const files = (ctx.request as any).files ?? {};
    const attachmentFile = files.attachment;
    if (attachmentFile) {
      const fileValidation = validateAttachmentFile(attachmentFile);
      if (!fileValidation.ok) return ctx.badRequest(fileValidation.error);
    }

    const pendingRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'teacher_pending' } });
    if (!pendingRole) return ctx.badRequest('ROLE_UNAVAILABLE');

    let user: any;
    try {
      user = await strapi.plugin('users-permissions').service('user').add({
        username: email,
        email,
        password,
        provider: 'local',
        confirmed: false,
        blocked: false,
        role: pendingRole.id,
      });
    } catch (error) {
      // Corrida entre requisições concorrentes: a constraint única de e-mail no banco pode
      // rejeitar a criação mesmo que o findOne acima não tenha encontrado nada.
      if (isUniqueConstraintError(error)) return ctx.badRequest('EMAIL_ALREADY_REGISTERED');
      throw error;
    }

    let uploadedFile: any;
    try {
      // O arquivo enviado via multipart tem prioridade sobre o id numérico enviado no JSON.
      let attachmentId = attachment;
      if (attachmentFile) {
        const uploaded = await strapi.plugin('upload').service('upload').upload({
          data: {},
          files: attachmentFile,
        });
        uploadedFile = Array.isArray(uploaded) ? uploaded[0] : uploaded;
        attachmentId = uploadedFile?.id;
      }

      await strapi.db.query('api::teacher-application.teacher-application').create({
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
      // Se a candidatura (ou o upload) falhar, remove o usuário criado e o arquivo já enviado
      // (se houver) para permitir uma nova tentativa sem deixar órfãos. A limpeza é
      // failure-tolerant: um erro nela não deve mascarar o erro original.
      if (uploadedFile) {
        try {
          await strapi.plugin('upload').service('upload').remove(uploadedFile);
        } catch (cleanupError) {
          strapi.log?.error?.('Falha ao remover arquivo órfão após erro no cadastro de professor', cleanupError);
        }
      }
      try {
        await strapi.db.query('plugin::users-permissions.user').delete({ where: { id: user.id } });
      } catch (cleanupError) {
        strapi.log?.error?.('Falha ao remover usuário órfão após erro no cadastro de professor', cleanupError);
      }
      throw error;
    }

    await strapi.plugin('users-permissions').service('user').sendConfirmationEmail(user);

    ctx.body = { user: { id: user.id, email: user.email, confirmed: user.confirmed } };
  };

  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/auth/local/register-teacher',
    handler: 'auth.registerTeacher',
    config: { prefix: '', auth: false, middlewares: [] },
  });

  return plugin;
};
