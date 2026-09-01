import { describe, expect, it } from 'vitest';
import policy from './can-manage-quiz-language';

const USER_UID = 'plugin::users-permissions.user';
const QUIZ_UID = 'api::quiz.quiz';

type Row = Record<string, any>;

function createStrapi({ users, quizzes }: { users: Row[]; quizzes: Row[] }) {
  return {
    db: {
      query(uid: string) {
        if (uid === USER_UID) {
          return {
            async findOne({ where }: any) {
              return users.find((user) => user.id === where.id) ?? null;
            },
          };
        }

        if (uid === QUIZ_UID) {
          return {
            async findMany({ where }: any) {
              return quizzes.filter((quiz) =>
                where.documentId ? quiz.documentId === where.documentId : String(quiz.id) === String(where.id)
              );
            },
          };
        }

        throw new Error(`UID inesperado: ${uid}`);
      },
    },
  };
}

function createContext(userId: number | undefined, body: Row, params: Row = {}) {
  return {
    state: { user: userId ? { id: userId } : undefined },
    params,
    request: { body },
  };
}

const teacherEn = { id: 1, role: { type: 'teacher' }, teachingLanguages: ['en'] };
const admin = { id: 2, role: { type: 'app_admin' } };
const student = { id: 3, role: { type: 'student' }, teachingLanguages: ['en'] };

describe('policy can-manage-quiz-language', () => {
  it('recusa quem não está autenticado', async () => {
    const strapi = createStrapi({ users: [teacherEn], quizzes: [] });
    const ctx = createContext(undefined, { data: { targetLanguage: 'en' } });

    expect(await policy(ctx, undefined, { strapi })).toBe(false);
  });

  it('deixa o professor criar quiz no idioma aprovado', async () => {
    const strapi = createStrapi({ users: [teacherEn], quizzes: [] });
    const ctx = createContext(1, { data: { targetLanguage: 'en' } });

    expect(await policy(ctx, undefined, { strapi })).toBe(true);
  });

  it('barra o professor em idioma fora da aprovação', async () => {
    const strapi = createStrapi({ users: [teacherEn], quizzes: [] });
    const ctx = createContext(1, { data: { targetLanguage: 'pt' } });

    expect(await policy(ctx, undefined, { strapi })).toBe(false);
  });

  it('barra o professor que tenta mover um quiz de outro idioma para o dele', async () => {
    const strapi = createStrapi({
      users: [teacherEn],
      quizzes: [{ id: 10, documentId: 'doc-10', targetLanguage: 'pt' }],
    });
    const ctx = createContext(1, { data: { targetLanguage: 'en' } }, { id: 'doc-10' });

    expect(await policy(ctx, undefined, { strapi })).toBe(false);
  });

  it('deixa o professor editar quiz que já está no idioma aprovado, sem mexer no idioma', async () => {
    const strapi = createStrapi({
      users: [teacherEn],
      quizzes: [{ id: 10, documentId: 'doc-10', targetLanguage: 'en' }],
    });
    const ctx = createContext(1, { data: { title: 'Novo título' } }, { id: 'doc-10' });

    expect(await policy(ctx, undefined, { strapi })).toBe(true);
  });

  it('libera o admin em qualquer idioma', async () => {
    const strapi = createStrapi({
      users: [admin],
      quizzes: [{ id: 10, documentId: 'doc-10', targetLanguage: 'pt' }],
    });
    const ctx = createContext(2, { data: { targetLanguage: 'fr' } }, { id: 'doc-10' });

    expect(await policy(ctx, undefined, { strapi })).toBe(true);
  });

  it('barra quem não é professor nem admin', async () => {
    const strapi = createStrapi({ users: [student], quizzes: [] });
    const ctx = createContext(3, { data: { targetLanguage: 'en' } });

    expect(await policy(ctx, undefined, { strapi })).toBe(false);
  });

  it('encontra o quiz pelo id numérico quando o documentId não bate', async () => {
    const strapi = createStrapi({
      users: [teacherEn],
      quizzes: [{ id: 10, documentId: 'doc-10', targetLanguage: 'pt' }],
    });
    const ctx = createContext(1, { data: {} }, { id: '10' });

    expect(await policy(ctx, undefined, { strapi })).toBe(false);
  });
});
