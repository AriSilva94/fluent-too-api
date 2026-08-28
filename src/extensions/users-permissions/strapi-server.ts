import { validateAttachmentFile, validateTeacherRegistration } from '../../api/teacher-application/services/registration';

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

    const user = await strapi.plugin('users-permissions').service('user').add({
      username: email,
      email,
      password,
      provider: 'local',
      confirmed: false,
      blocked: false,
      role: pendingRole.id,
    });

    try {
      // O arquivo enviado via multipart tem prioridade sobre o id numérico enviado no JSON.
      let attachmentId = attachment;
      if (attachmentFile) {
        const uploaded = await strapi.plugin('upload').service('upload').upload({
          data: {},
          files: attachmentFile,
        });
        attachmentId = Array.isArray(uploaded) ? uploaded[0]?.id : uploaded?.id;
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
      // Se a candidatura (ou o upload) falhar, remove o usuário criado para permitir uma nova tentativa.
      await strapi.db.query('plugin::users-permissions.user').delete({ where: { id: user.id } });
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
