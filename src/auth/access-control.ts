import type { Core } from '@strapi/strapi';

type AppRoleType = 'app_admin' | 'teacher';
type AccessRoleType = AppRoleType | 'public' | 'authenticated';

type AppRoleDefinition = {
  name: string;
  type: AppRoleType;
  description: string;
};

type AccessControlPlan = {
  adminEmail: string;
  roles: AppRoleDefinition[];
  permissions: Record<AccessRoleType, string[]>;
};

const readActions = [
  'api::about.about.find',
  'api::about.about.findOne',
  'api::article.article.find',
  'api::article.article.findOne',
  'api::author.author.find',
  'api::author.author.findOne',
  'api::category.category.find',
  'api::category.category.findOne',
  'api::global.global.find',
  'api::global.global.findOne',
  'api::quiz.quiz.find',
  'api::quiz.quiz.findOne',
  'api::quiz-attempt.quiz-attempt.find',
  'api::quiz-attempt.quiz-attempt.findOne',
];

const quizManagementActions = [
  'api::quiz.quiz.find',
  'api::quiz.quiz.findOne',
  'api::quiz.quiz.create',
  'api::quiz.quiz.update',
  'api::quiz.quiz.delete',
];

const quizAttemptManagementActions = [
  'api::quiz-attempt.quiz-attempt.find',
  'api::quiz-attempt.quiz-attempt.findOne',
  'api::quiz-attempt.quiz-attempt.create',
  'api::quiz-attempt.quiz-attempt.update',
  'api::quiz-attempt.quiz-attempt.delete',
];

const authenticatedUserActions = [
  'plugin::users-permissions.user.me',
  'plugin::users-permissions.auth.logout',
  'plugin::users-permissions.auth.changePassword',
];

const studentHistoryActions = [
  'api::quiz-attempt.quiz-attempt.find',
  'api::quiz-attempt.quiz-attempt.findOne',
  'api::quiz-attempt.quiz-attempt.create',
];

export function buildAccessControlPlan(adminEmail: string): AccessControlPlan {
  return {
    adminEmail: adminEmail.trim().toLowerCase(),
    roles: [
      {
        name: 'Admin',
        type: 'app_admin',
        description: 'Can view every app resource and manage quizzes',
      },
      {
        name: 'Teacher',
        type: 'teacher',
        description: 'Can create quizzes',
      },
    ],
    permissions: {
      app_admin: [
        ...authenticatedUserActions,
        ...readActions,
        ...quizManagementActions.filter((action) => !readActions.includes(action)),
        ...quizAttemptManagementActions.filter((action) => !readActions.includes(action)),
      ],
      teacher: [...authenticatedUserActions, ...studentHistoryActions, 'api::quiz.quiz.create'],
      public: ['api::quiz.quiz.find', 'api::quiz.quiz.findOne'],
      authenticated: [...authenticatedUserActions, ...studentHistoryActions],
    },
  };
}

export async function ensureAppAccessControl(strapi: Core.Strapi, adminEmail: string) {
  const plan = buildAccessControlPlan(adminEmail);
  const roles = new Map<AppRoleType, { id: number | string }>();

  for (const roleDefinition of plan.roles) {
    const role = await ensureRole(strapi, roleDefinition);
    roles.set(roleDefinition.type, role);
    await syncPermissions(strapi, role.id, plan.permissions[roleDefinition.type]);
  }

  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  if (publicRole) {
    await syncPermissions(strapi, publicRole.id, plan.permissions.public, { preserveExisting: true });
  }

  const authenticatedRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'authenticated' } });
  if (authenticatedRole) {
    await syncPermissions(strapi, authenticatedRole.id, plan.permissions.authenticated, { preserveExisting: true });
  }

  const adminRole = roles.get('app_admin');
  if (adminRole) {
    await assignUserRole(strapi, plan.adminEmail, adminRole.id);
  }
}

async function ensureRole(strapi: Core.Strapi, roleDefinition: AppRoleDefinition) {
  const roleQuery = strapi.db.query('plugin::users-permissions.role');
  const existingRole = await roleQuery.findOne({ where: { type: roleDefinition.type } });

  if (!existingRole) {
    return roleQuery.create({ data: roleDefinition });
  }

  if (existingRole.name !== roleDefinition.name || existingRole.description !== roleDefinition.description) {
    return roleQuery.update({
      where: { id: existingRole.id },
      data: {
        name: roleDefinition.name,
        description: roleDefinition.description,
      },
    });
  }

  return existingRole;
}

async function syncPermissions(
  strapi: Core.Strapi,
  roleId: number | string,
  expectedActions: string[],
  options: { preserveExisting?: boolean } = {}
) {
  const permissionQuery = strapi.db.query('plugin::users-permissions.permission');
  const currentPermissions = await permissionQuery.findMany({
    where: {
      role: {
        id: roleId,
      },
    },
  });
  const currentActions = new Set(currentPermissions.map((permission: { action: string }) => permission.action));
  const expectedActionSet = new Set(expectedActions);

  await Promise.all(
    options.preserveExisting
      ? []
      : currentPermissions
          .filter((permission: { action: string }) => !expectedActionSet.has(permission.action))
          .map((permission: { id: number | string }) => permissionQuery.delete({ where: { id: permission.id } }))
  );

  await Promise.all(
    expectedActions
      .filter((action) => !currentActions.has(action))
      .map((action) => permissionQuery.create({ data: { action, role: roleId } }))
  );
}

async function assignUserRole(strapi: Core.Strapi, email: string, roleId: number | string) {
  if (!email) return;

  const userQuery = strapi.db.query('plugin::users-permissions.user');
  const user = await userQuery.findOne({ where: { email } });

  if (!user || user.role?.id === roleId || user.role === roleId) return;

  await userQuery.update({
    where: { id: user.id },
    data: { role: roleId },
  });
}
