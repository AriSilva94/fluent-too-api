import { isAdminRole } from '../auth/roles';

export default async (policyContext: any, _config: unknown, { strapi }: { strapi: any }) => {
  const userId = policyContext.state.user?.id;
  if (!userId) return false;

  const user = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: userId },
    populate: ['role'],
  });

  return Boolean(user) && isAdminRole(user.role?.type);
};
