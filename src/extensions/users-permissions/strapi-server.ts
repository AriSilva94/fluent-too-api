import { rm } from 'node:fs/promises';
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

/**
 * O middleware `strapi::body` só remove os arquivos temporários enviados no campo
 * `files`; o nosso campo é `attachment`, então nada limpa o arquivo gravado em disco
 * pelo formidable. A remoção precisa acontecer em TODA requisição, inclusive nas
 * recusadas, senão cada tentativa acumula um arquivo temporário.
 */
async function removeTempFile(strapi: any, file: any) {
  const filepath = file?.filepath ?? file?.path;
  if (!filepath) return;
  try {
    await rm(filepath, { force: true });
  } catch (cleanupError) {
    strapi?.log?.error?.('Falha ao remover arquivo temporário do cadastro de professor', cleanupError);
  }
}

export default (plugin: any) => {
  const originalAuthFactory = plugin.controllers.auth;

  plugin.controllers.auth = (params: any) => {
    const controller = typeof originalAuthFactory === 'function' ? originalAuthFactory(params) : originalAuthFactory;
    const strapi = params?.strapi;

    async function registerTeacher(ctx: any, attachmentFile: any) {
      const validation = validateTeacherRegistration(ctx.request.body);
      if (!validation.ok) return ctx.badRequest(validation.error);

      const { email, password, bio, experience, languages, credentialUrl } = validation.data;

      const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email } });
      if (existingUser) return ctx.badRequest('EMAIL_ALREADY_REGISTERED');

      // Valida o arquivo de anexo (se enviado via multipart/form-data) ANTES de criar qualquer registro.
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
        // O único anexo aceito é o arquivo enviado nesta requisição: aceitar um id de mídia
        // vindo do JSON deixaria um chamador anônimo anexar o arquivo de outra pessoa.
        let attachmentId: number | undefined;
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
    }

    return {
      ...controller,
      async registerTeacher(ctx: any) {
        const attachmentFile = (ctx.request as any).files?.attachment;
        try {
          return await registerTeacher(ctx, attachmentFile);
        } finally {
          await removeTempFile(strapi, attachmentFile);
        }
      },
    };
  };

  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/auth/local/register-teacher',
    handler: 'auth.registerTeacher',
    // Mesmo rate limit das rotas de auth de fábrica: sem ele um script anônimo cria
    // contas e dispara e-mails de confirmação em laço, além de enumerar e-mails
    // cadastrados pela resposta EMAIL_ALREADY_REGISTERED.
    config: { prefix: '', auth: false, middlewares: ['plugin::users-permissions.rateLimit'] },
  });

  const originalUserFactory = plugin.controllers.user;

  plugin.controllers.user = (params: any) => {
    const controller = typeof originalUserFactory === 'function' ? originalUserFactory(params) : originalUserFactory;
    const strapi = params?.strapi;

    return {
      ...controller,
      async me(ctx: any) {
        if (!ctx.state.user?.id) return ctx.unauthorized();

        const user = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: { id: ctx.state.user.id },
          populate: ['role'],
        });

        if (!user) return controller.me(ctx);

        ctx.body = {
          id: user.id,
          username: user.username,
          email: user.email,
          confirmed: user.confirmed,
          blocked: user.blocked,
          role: user.role ? { id: user.role.id, name: user.role.name, type: user.role.type } : null,
        };
      },
    };
  };

  return plugin;
};
