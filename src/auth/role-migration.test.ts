import { describe, expect, it } from 'vitest';
import { selectUsersToMigrate } from './role-migration';

describe('migração de roles', () => {
  it('seleciona apenas usuários na role de origem', () => {
    const users = [
      { id: 1, role: { type: 'authenticated' } },
      { id: 2, role: { type: 'student' } },
      { id: 3, role: { type: 'app_admin' } },
      { id: 4, role: { type: 'authenticated' } },
    ];

    expect(selectUsersToMigrate(users, 'authenticated')).toEqual([1, 4]);
  });

  it('ignora usuários sem role', () => {
    expect(selectUsersToMigrate([{ id: 1 }], 'authenticated')).toEqual([]);
  });

  it('é idempotente: nada a migrar quando ninguém está na role de origem', () => {
    const users = [{ id: 1, role: { type: 'student' } }];

    expect(selectUsersToMigrate(users, 'authenticated')).toEqual([]);
  });
});
