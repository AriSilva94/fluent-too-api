import { describe, expect, it } from 'vitest';
import { canBecomeStudent, canBecomeTeacher } from './profile-transitions';

describe('transições de perfil', () => {
  it('deixa quem não escolheu virar estudante', () => {
    expect(canBecomeStudent('unassigned')).toBe(true);
  });

  it('deixa o professor rejeitado virar estudante', () => {
    expect(canBecomeStudent('teacher_pending', 'rejected')).toBe(true);
  });

  it('não deixa o professor em análise virar estudante', () => {
    expect(canBecomeStudent('teacher_pending', 'pending')).toBe(false);
  });

  it('não deixa quem já escolheu trocar de perfil', () => {
    expect(canBecomeStudent('student')).toBe(false);
    expect(canBecomeStudent('teacher')).toBe(false);
    expect(canBecomeTeacher('student')).toBe(false);
    expect(canBecomeTeacher('teacher')).toBe(false);
    expect(canBecomeTeacher('teacher_pending')).toBe(false);
  });

  it('só deixa quem não escolheu se candidatar a professor', () => {
    expect(canBecomeTeacher('unassigned')).toBe(true);
  });

  it('trata role ausente como proibida', () => {
    expect(canBecomeStudent(undefined)).toBe(false);
    expect(canBecomeTeacher(undefined)).toBe(false);
  });
});
