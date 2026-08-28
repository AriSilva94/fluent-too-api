import { canMutateDocument } from '../auth/ownership';

export default async (policyContext: any, _config: unknown, { strapi }: { strapi: any }) => {
  const userId = policyContext.state.user?.id;
  if (!userId) return false;

  const user = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: userId },
    populate: ['role'],
  });
  if (!user) return false;

  const uid = policyContext.state.route.info.apiName === 'quiz' ? 'api::quiz.quiz' : 'api::blog-post.blog-post';

  // Com draftAndPublish o documento tem mais de uma linha; lê-las todas evita depender
  // de qual linha um findOne sem ordenação devolveria.
  let entries = await strapi.db.query(uid).findMany({
    where: { documentId: policyContext.params.id },
    populate: ['owner'],
  });
  if (!entries || entries.length === 0) {
    entries = await strapi.db.query(uid).findMany({
      where: { id: policyContext.params.id },
      populate: ['owner'],
    });
  }

  if (!entries || entries.length === 0) return false;
  return canMutateDocument(entries, user);
};
