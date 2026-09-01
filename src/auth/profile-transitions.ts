import { APPLICATION_STATUS, type ApplicationStatus } from '../api/teacher-application/services/review';
import { APP_ROLES } from './roles';

export type { ApplicationStatus };

export function canBecomeStudent(roleType?: string | null, applicationStatus?: ApplicationStatus) {
  if (roleType === APP_ROLES.unassigned) return true;
  return roleType === APP_ROLES.teacherPending && applicationStatus === APPLICATION_STATUS.rejected;
}

export function canBecomeTeacher(roleType?: string | null) {
  return roleType === APP_ROLES.unassigned;
}
