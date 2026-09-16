import { canMutateDocument } from '../auth/ownership';

const OWNED_CONTENT_UIDS = {
  quiz: 'api::quiz.quiz',
  'blog-post': 'api::blog-post.blog-post',
} as const;

type OwnedContentApi = keyof typeof OWNED_CONTENT_UIDS;

export default async (policyContext: any, _config: unknown, { strapi }: { strapi: any }) => {
  const userId = policyContext.state.user?.id;
  if (!userId) return false;

  const user = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: userId },
    populate: ['role'],
  });
  if (!user) return false;

  const uid = OWNED_CONTENT_UIDS[policyContext.state.route.info.apiName as OwnedContentApi];
  if (!uid) return false;

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
