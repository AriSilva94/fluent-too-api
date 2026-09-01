export const APP_ROLES = {
  superAdmin: 'super_admin',
  appAdmin: 'app_admin',
  teacher: 'teacher',
  teacherPending: 'teacher_pending',
  student: 'student',
  unassigned: 'unassigned',
} as const;

export type AppRoleType = (typeof APP_ROLES)[keyof typeof APP_ROLES];

export const ADMIN_ROLE_TYPES = [APP_ROLES.appAdmin, APP_ROLES.superAdmin] as const;

export function isAdminRole(type?: string | null) {
  return ADMIN_ROLE_TYPES.includes(type as (typeof ADMIN_ROLE_TYPES)[number]);
}

export function isContentCreatorRole(type?: string | null) {
  return type === APP_ROLES.teacher || isAdminRole(type);
}
