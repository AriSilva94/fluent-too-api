import { describe, expect, it } from 'vitest';
import { assignOwnerToDocument, canMutateDocument, canMutateEntry, stripOwner } from './ownership';

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

describe('ownership de um documento com draft e published', () => {
  it('reconhece o dono quando qualquer linha do documento aponta para ele', () => {
    expect(canMutateDocument([{ owner: null }, { owner: { id: 5 } }], teacher)).toBe(true);
  });

  it('bloqueia quando nenhuma linha é do usuário', () => {
    expect(canMutateDocument([{ owner: { id: 5 } }, { owner: { id: 5 } }], otherTeacher)).toBe(false);
    expect(canMutateDocument([], teacher)).toBe(false);
  });

  it('mantém o admin liberado', () => {
    expect(canMutateDocument([{ owner: null }], admin)).toBe(true);
  });

  it('grava o owner em todas as linhas do documento', async () => {
    const updates: unknown[] = [];
    const strapi = {
      db: {
        query: () => ({
          findMany: async () => [{ id: 11 }, { id: 12 }],
          update: async (params: unknown) => updates.push(params),
        }),
      },
    };

    await assignOwnerToDocument(strapi, 'api::quiz.quiz', { documentId: 'abc' }, 5);

    expect(updates).toEqual([
      { where: { id: 11 }, data: { owner: 5 } },
      { where: { id: 12 }, data: { owner: 5 } },
    ]);
  });

  it('falha quando o documento não é encontrado', async () => {
    const strapi = { db: { query: () => ({ findMany: async () => [] }) } };

    await expect(assignOwnerToDocument(strapi, 'api::quiz.quiz', { documentId: 'abc' }, 5)).rejects.toThrow();
  });
});
