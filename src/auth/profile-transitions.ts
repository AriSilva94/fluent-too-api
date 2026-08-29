export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export function canBecomeStudent(roleType?: string | null, applicationStatus?: ApplicationStatus) {
  if (roleType === 'unassigned') return true;
  return roleType === 'teacher_pending' && applicationStatus === 'rejected';
}

export function canBecomeTeacher(roleType?: string | null) {
  return roleType === 'unassigned';
}
