import { describe, expect, it } from 'vitest';
import { reviewApplication } from './review';

const APPLICATION_UID = 'api::teacher-application.teacher-application';
const USER_UID = 'plugin::users-permissions.user';
const ROLE_UID = 'plugin::users-permissions.role';

type Row = Record<string, any>;

function createStrapi({ users, applications }: { users: Row[]; applications: Row[] }) {
  const updatedUsers: Row[] = [];

  const strapi = {
    db: {
      async transaction(callback: () => Promise<any>) {
        return callback();
      },
      query(uid: string) {
        if (uid === USER_UID) {
          return {
            async findOne({ where }: any) {
              return users.find((user) => user.id === where.id) ?? null;
            },
            async update({ where, data }: any) {
              updatedUsers.push({ id: where.id, ...data });
              return { id: where.id, ...data };
            },
          };
        }

        if (uid === ROLE_UID) {
          return {
            async findOne({ where }: any) {
              return where.type === 'teacher' ? { id: 99, type: 'teacher' } : null;
            },
          };
        }

        if (uid === APPLICATION_UID) {
          return {
            async findOne({ where }: any) {
              return applications.find((application) => application.id === Number(where.id)) ?? null;
            },
            async update({ where, data }: any) {
              const application = applications.find(
                (candidate) => candidate.id === where.id && candidate.reviewStatus === where.reviewStatus
              );
              if (!application) return null;
              Object.assign(application, data);
              return application;
            },
          };
        }

        throw new Error(`UID inesperado: ${uid}`);
      },
    },
  };

  return { strapi, updatedUsers };
}

function createContext(userId: number | undefined, applicationId: number, body: Row = {}) {
  const calls: string[] = [];
  const ctx: Row = {
    state: { user: userId ? { id: userId } : undefined },
    params: { id: String(applicationId) },
    request: { body },
    body: undefined,
    forbidden: () => calls.push('forbidden'),
    notFound: () => calls.push('notFound'),
    conflict: (message?: string) => calls.push(`conflict:${message}`),
    badRequest: (message?: string) => calls.push(`badRequest:${message}`),
  };
  return { ctx, calls };
}

const admin = { id: 1, role: { type: 'app_admin' } };
const candidate = { id: 2, role: { type: 'teacher_pending' } };

describe('caminho de revisão da candidatura', () => {
  it('recusa quem não é admin', async () => {
    const { strapi, updatedUsers } = createStrapi({
      users: [admin, candidate],
      applications: [{ id: 10, reviewStatus: 'pending', user: { id: 2 } }],
    });
    const { ctx, calls } = createContext(2, 10);

    await reviewApplication(strapi, ctx, 'approved');

    expect(calls).toEqual(['forbidden']);
    expect(updatedUsers).toEqual([]);
  });

  it('aprova promovendo o candidato para teacher com os idiomas da candidatura', async () => {
    const { strapi, updatedUsers } = createStrapi({
      users: [admin, candidate],
      applications: [{ id: 10, reviewStatus: 'pending', user: { id: 2 }, languages: ['en', 'fr'] }],
    });
    const { ctx, calls } = createContext(1, 10);

    await reviewApplication(strapi, ctx, 'approved');

    expect(calls).toEqual([]);
    expect(ctx.body.data.status).toBe('approved');
    expect(ctx.body.data.reviewedBy).toBe(1);
    expect(updatedUsers).toEqual([{ id: 2, role: 99, teachingLanguages: ['en', 'fr'] }]);
  });

  it('descarta idioma não suportado gravado na candidatura', async () => {
    const { strapi, updatedUsers } = createStrapi({
      users: [admin, candidate],
      applications: [{ id: 10, reviewStatus: 'pending', user: { id: 2 }, languages: ['en', 'de'] }],
    });
    const { ctx } = createContext(1, 10);

    await reviewApplication(strapi, ctx, 'approved');

    expect(updatedUsers).toEqual([{ id: 2, role: 99, teachingLanguages: ['en'] }]);
  });

  it('promove com lista vazia quando a candidatura não tem idiomas', async () => {
    const { strapi, updatedUsers } = createStrapi({
      users: [admin, candidate],
      applications: [{ id: 10, reviewStatus: 'pending', user: { id: 2 } }],
    });
    const { ctx } = createContext(1, 10);

    await reviewApplication(strapi, ctx, 'approved');

    expect(updatedUsers).toEqual([{ id: 2, role: 99, teachingLanguages: [] }]);
  });

  it('devolve conflito na segunda aprovação', async () => {
    const applications = [{ id: 10, reviewStatus: 'pending', user: { id: 2 } }];
    const { strapi, updatedUsers } = createStrapi({ users: [admin, candidate], applications });

    const first = createContext(1, 10);
    await reviewApplication(strapi, first.ctx, 'approved');

    const second = createContext(1, 10);
    await reviewApplication(strapi, second.ctx, 'approved');

    expect(second.calls).toEqual(['conflict:ALREADY_REVIEWED']);
    expect(updatedUsers).toEqual([{ id: 2, role: 99, teachingLanguages: [] }]);
  });
});
