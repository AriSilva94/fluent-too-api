export const ADMIN_ROLE_TYPES = ['app_admin', 'super_admin'] as const;

export function isAdminRole(type?: string | null) {
  return ADMIN_ROLE_TYPES.includes(type as (typeof ADMIN_ROLE_TYPES)[number]);
}

export function isContentCreatorRole(type?: string | null) {
  return type === 'teacher' || isAdminRole(type);
}
