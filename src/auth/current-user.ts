import { isAdminRole } from './roles';

export async function isAdminUserId(strapi: any, userId: number | string | undefined) {
  if (!userId) return false;

  const user = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: userId },
    populate: ['role'],
  });

  return Boolean(user) && isAdminRole(user.role?.type);
}
