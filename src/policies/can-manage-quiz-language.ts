import { canManageQuizLanguage, resolveQuizLanguages } from '../auth/quiz-language';

const QUIZ_UID = 'api::quiz.quiz';

export default async (policyContext: any, _config: unknown, { strapi }: { strapi: any }) => {
  const userId = policyContext.state.user?.id;
  if (!userId) return false;

  const user = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: userId },
    populate: ['role'],
  });
  if (!user) return false;

  const entries = await loadQuizLanguages(strapi, policyContext.params?.id);
  const payload = policyContext.request?.body?.data;

  return canManageQuizLanguage(user, resolveQuizLanguages(payload, entries));
};

async function loadQuizLanguages(strapi: any, id: string | number | undefined) {
  if (!id) return [];

  const byDocumentId = await strapi.db.query(QUIZ_UID).findMany({
    where: { documentId: id },
    select: ['targetLanguage'],
  });
  if (byDocumentId?.length) return byDocumentId;

  const byId = await strapi.db.query(QUIZ_UID).findMany({
    where: { id },
    select: ['targetLanguage'],
  });
  return byId ?? [];
}
