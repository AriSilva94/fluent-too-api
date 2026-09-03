import type { Core } from '@strapi/strapi';
import { migrateAuthenticatedUsersToStudent } from './role-migration';
import { backfillTeachingLanguages } from './teaching-languages-backfill';
import { isAdminRole } from './roles';

type AppRoleType = 'super_admin' | 'app_admin' | 'teacher' | 'teacher_pending' | 'student' | 'unassigned';
type AccessRoleType = AppRoleType | 'public' | 'authenticated';

type AppRoleDefinition = {
  name: string;
  type: AppRoleType;
  description: string;
};

type AccessControlPlan = {
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
  'api::blog-post.blog-post.find',
  'api::blog-post.blog-post.findOne',
];

const quizOwnListAction = 'api::quiz.quiz.findMine';
const quizOwnReachAction = 'api::quiz.quiz.findMineReach';

const quizManagementActions = [
  'api::quiz.quiz.find',
  'api::quiz.quiz.findOne',
  quizOwnListAction,
  quizOwnReachAction,
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

const notificationActions = ['api::notification.notification.find', 'api::notification.notification.markSeen'];

const authenticatedUserActions = [
  ...notificationActions,
  'plugin::users-permissions.user.me',
  'plugin::users-permissions.auth.logout',
  'plugin::users-permissions.auth.changePassword',
];

const studentHistoryActions = [
  'api::quiz-attempt.quiz-attempt.find',
  'api::quiz-attempt.quiz-attempt.findOne',
  'api::quiz-attempt.quiz-attempt.create',
];

const blogManagementActions = [
  'api::blog-post.blog-post.create',
  'api::blog-post.blog-post.update',
  'api::blog-post.blog-post.delete',
];

const contentCreationActions = [
  quizOwnListAction,
  quizOwnReachAction,
  'api::quiz.quiz.create',
  'api::quiz.quiz.update',
  'api::quiz.quiz.delete',
  ...blogManagementActions,
];

const teacherApplicationReviewActions = [
  'api::teacher-application.teacher-application.find',
  'api::teacher-application.teacher-application.findOne',
  'api::teacher-application.teacher-application.approve',
  'api::teacher-application.teacher-application.reject',
];

const publicAuthActions = [
  'plugin::users-permissions.auth.callback',
  'plugin::users-permissions.auth.connect',
  'plugin::users-permissions.auth.emailConfirmation',
  'plugin::users-permissions.auth.forgotPassword',
  'plugin::users-permissions.auth.refresh',
  'plugin::users-permissions.auth.register',
  'plugin::users-permissions.auth.resetPassword',
  'plugin::users-permissions.auth.sendEmailConfirmation',
];

const becomeStudentAction = 'api::teacher-application.profile.becomeStudent';
const becomeTeacherAction = 'api::teacher-application.profile.becomeTeacher';
const myApplicationAction = 'api::teacher-application.profile.myApplication';

const quizReadActions = ['api::quiz.quiz.find', 'api::quiz.quiz.findOne'];

const studentActions = [
  ...authenticatedUserActions,
  ...quizReadActions,
  ...studentHistoryActions,
  myApplicationAction,
];

const quizModerationActions = ['api::quiz.quiz.publish', 'api::quiz.quiz.unpublish'];

const systemActions = ['plugin::users-permissions.user.destroy'];

export function buildAccessControlPlan(): AccessControlPlan {
  const contentAdminActions = [
    ...authenticatedUserActions,
    ...readActions,
    ...quizManagementActions.filter((action) => !readActions.includes(action)),
    ...quizAttemptManagementActions.filter((action) => !readActions.includes(action)),
    ...blogManagementActions,
    ...teacherApplicationReviewActions,
    ...quizModerationActions,
  ];

  return {
    roles: [
      { name: 'Super Admin', type: 'super_admin', description: 'Full application access' },
      { name: 'Admin', type: 'app_admin', description: 'Can view every app resource and manage quizzes' },
      { name: 'Teacher', type: 'teacher', description: 'Can create quizzes and blog posts' },
      { name: 'Teacher (pending)', type: 'teacher_pending', description: 'Teacher waiting for manual approval' },
      { name: 'Student', type: 'student', description: 'Can take quizzes and see own history' },
      { name: 'Unassigned', type: 'unassigned', description: 'Signed up but has not chosen a profile yet' },
    ],
    permissions: {
      super_admin: [...contentAdminActions, ...systemActions],
      app_admin: contentAdminActions,
      teacher: [...studentActions, ...contentCreationActions],
      teacher_pending: [...studentActions, becomeStudentAction],
      student: [...studentActions],
      unassigned: [...authenticatedUserActions, becomeStudentAction, becomeTeacherAction, myApplicationAction],
      public: [
        'api::blog-post.blog-post.find',
        'api::blog-post.blog-post.findOne',
        'api::quiz.quiz.find',
        'api::quiz.quiz.findOne',
        ...publicAuthActions,
      ],
      authenticated: [...studentActions],
    },
  };
}

export async function ensureAppAccessControl(strapi: Core.Strapi) {
  const plan = buildAccessControlPlan();

  for (const roleDefinition of plan.roles) {
    const role = await ensureRole(strapi, roleDefinition);
    await syncPermissions(strapi, role.id, plan.permissions[roleDefinition.type]);
  }

  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  if (publicRole) {
    await syncPermissions(strapi, publicRole.id, plan.permissions.public);
  }

  const authenticatedRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'authenticated' } });
  if (authenticatedRole) {
    await syncPermissions(strapi, authenticatedRole.id, plan.permissions.authenticated);
  }

  await migrateAuthenticatedUsersToStudent(strapi);
  await backfillTeachingLanguages(strapi);
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

