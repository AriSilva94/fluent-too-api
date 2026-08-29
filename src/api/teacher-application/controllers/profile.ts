import type { Core } from '@strapi/strapi';
import { canBecomeStudent, canBecomeTeacher } from '../../../auth/profile-transitions';
import { validateAttachmentFile, validateTeacherApplication } from '../services/registration';

const USER_UID = 'plugin::users-permissions.user';
const ROLE_UID = 'plugin::users-permissions.role';
const APPLICATION_UID = 'api::teacher-application.teacher-application';

// Sinaliza, dentro do bloco `try/catch` da transação, que o `findOne` de dentro dela
// encontrou uma candidatura concorrente — distinto de um erro de infraestrutura, mas
// tratado do mesmo jeito (TEACHER_APPLICATION_EXISTS) por quem chama.
class DuplicateApplicationError extends Error {}

/**
 * Mesma checagem do antigo `registerTeacher`: sem um índice único garantido pelo
 * relacionamento `oneToOne`, uma corrida entre duas chamadas concorrentes pode fazer
 * o `create` do perdedor falhar na constraint do banco em vez de ser barrado pelo
 * `findOne` — isso não pode virar um 500 genérico.
 */
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

/**
 * O anexo já pode ter sido consumido (ou removido do disco) por quem chama: o
 * middleware global `teacher-attachment-cleanup` é o dono do arquivo temporário,
 * porque precisa limpá-lo também nas saídas em que este controller não roda.
 */
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

    // A checagem de duplicidade, a criação da candidatura e a troca de role precisam
    // ser atômicas: sem transação, duas chamadas concorrentes do mesmo usuário podem
    // passar pelo `findOne` antes de qualquer `create` existir e as duas seguirem em
    // frente (ou uma delas vira uma candidatura fantasma sem a role correspondente).
    await strapi.db.transaction(async () => {
      const existingApplication = await strapi.db.query(APPLICATION_UID).findOne({ where: { user: user.id } });
      if (existingApplication) throw new DuplicateApplicationError('TEACHER_APPLICATION_EXISTS');

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

      // A role só muda depois da candidatura ser criada com sucesso, e na mesma
      // transação: se a criação (ou a transação) falhar, a role não muda e o
      // usuário continua `unassigned`, podendo tentar de novo.
      await strapi.db.query(USER_UID).update({ where: { id: user.id }, data: { role: pendingRole.id } });
    });
  } catch (error) {
    // Se a candidatura (ou o upload) falhar — incluindo o perdedor de uma corrida
    // entre duas chamadas concorrentes — remove o arquivo já enviado (se houver)
    // para permitir uma nova tentativa sem deixar órfãos. O usuário já existia antes
    // desta chamada, então nada além do arquivo precisa ser desfeito.
    if (uploadedFile) {
      try {
        await strapi.plugin('upload').service('upload').remove(uploadedFile);
      } catch (cleanupError) {
        strapi.log?.error?.('Falha ao remover arquivo órfão após erro na candidatura de professor', cleanupError);
      }
    }

    // Cobre tanto a checagem explícita acima (achou uma candidatura concorrente já
    // commitada) quanto uma constraint única do banco rejeitando o `create` do
    // perdedor da corrida mesmo com o `findOne` dele não tendo achado nada.
    if (error instanceof DuplicateApplicationError || isUniqueConstraintError(error)) {
      return ctx.badRequest('TEACHER_APPLICATION_EXISTS');
    }
    throw error;
  }

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

    // Checagem rápida só para evitar validar e enviar um anexo à toa quando já existe
    // candidatura no caminho feliz; NÃO é a guarda contra a corrida entre duas chamadas
    // concorrentes — essa vive dentro da transação de `createTeacherApplication`.
    const existingApplication = await strapi.db.query(APPLICATION_UID).findOne({ where: { user: user.id } });
    if (existingApplication) return ctx.badRequest('TEACHER_APPLICATION_EXISTS');

    const attachmentFile = (ctx.request as any).files?.attachment;
    return createTeacherApplication(strapi, ctx, user, attachmentFile);
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
