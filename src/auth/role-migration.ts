import type { Core } from '@strapi/strapi';

export type MigratableUser = {
  id: number | string;
  role?: { type?: string } | null;
};

export function selectUsersToMigrate(users: MigratableUser[], fromType: string) {
  return users.filter((user) => user.role?.type === fromType).map((user) => user.id);
}

export async function migrateAuthenticatedUsersToStudent(strapi: Core.Strapi) {
  const roleQuery = strapi.db.query('plugin::users-permissions.role');
  const studentRole = await roleQuery.findOne({ where: { type: 'student' } });
  if (!studentRole) return 0;

  const userQuery = strapi.db.query('plugin::users-permissions.user');
  const users = (await userQuery.findMany({
    where: { role: { type: 'authenticated' } },
    populate: ['role'],
  })) as MigratableUser[];

  const ids = selectUsersToMigrate(users, 'authenticated');
  for (const id of ids) {
    await userQuery.update({ where: { id }, data: { role: studentRole.id } });
  }

  if (ids.length > 0) {
    strapi.log.info(`[auth] migrados ${ids.length} usuários de authenticated para student`);
  }

  return ids.length;
}
