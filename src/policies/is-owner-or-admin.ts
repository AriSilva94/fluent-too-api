import { canMutateEntry } from '../auth/ownership';

export default async (policyContext: any, _config: unknown, { strapi }: { strapi: any }) => {
  const userId = policyContext.state.user?.id;
  if (!userId) return false;

  const user = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: userId },
    populate: ['role'],
  });
  if (!user) return false;

  const uid = policyContext.state.route.info.apiName === 'quiz' ? 'api::quiz.quiz' : 'api::blog-post.blog-post';
  const entry =
    (await strapi.db.query(uid).findOne({
      where: { documentId: policyContext.params.id },
      populate: ['owner'],
    })) ??
    (await strapi.db.query(uid).findOne({
      where: { id: policyContext.params.id },
      populate: ['owner'],
    }));

  if (!entry) return false;
  return canMutateEntry(entry, user);
};
