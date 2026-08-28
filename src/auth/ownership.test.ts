import { describe, expect, it } from 'vitest';
import { canMutateEntry, stripOwner } from './ownership';

const teacher = { id: 5, role: { type: 'teacher' } };
const otherTeacher = { id: 6, role: { type: 'teacher' } };
const admin = { id: 1, role: { type: 'app_admin' } };

describe('ownership de conteúdo', () => {
  it('remove o owner enviado pelo cliente, ignorando o valor recebido', () => {
    expect(stripOwner({ title: 'Quiz', owner: 999 })).toEqual({ title: 'Quiz' });
  });

  it('não quebra quando o corpo não tem owner', () => {
    expect(stripOwner({ title: 'Quiz' })).toEqual({ title: 'Quiz' });
  });

  it('permite o dono alterar', () => {
    expect(canMutateEntry({ owner: { id: 5 } }, teacher)).toBe(true);
  });

  it('bloqueia quem não é dono', () => {
    expect(canMutateEntry({ owner: { id: 5 } }, otherTeacher)).toBe(false);
  });

  it('permite admin alterar qualquer registro', () => {
    expect(canMutateEntry({ owner: { id: 5 } }, admin)).toBe(true);
    expect(canMutateEntry({ owner: null }, admin)).toBe(true);
  });

  it('bloqueia registro sem dono para não-admin', () => {
    expect(canMutateEntry({ owner: null }, teacher)).toBe(false);
  });
});
