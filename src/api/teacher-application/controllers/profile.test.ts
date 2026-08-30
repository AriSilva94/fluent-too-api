import { describe, expect, it } from 'vitest';
import createProfileController from './profile';

const USER_UID = 'plugin::users-permissions.user';
const ROLE_UID = 'plugin::users-permissions.role';
const APPLICATION_UID = 'api::teacher-application.teacher-application';

type Row = Record<string, any>;

function createStrapi({
  users,
  roles,
  applications,
  onCreateApplication,
}: {
  users: Row[];
  roles: Row[];
  applications: Row[];
  onCreateApplication: () => Promise<any>;
}) {
  const updatedUsers: Row[] = [];
  const removedUploads: Row[] = [];

  const strapi: any = {
    log: { error: () => {} },
    db: {
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
              return roles.find((role) => role.type === where.type) ?? null;
            },
          };
        }

        if (uid === APPLICATION_UID) {
          return {
            async findOne({ where }: any) {
              return applications.find((application) => application.user === where.user) ?? null;
            },
            create: onCreateApplication,
          };
        }

        throw new Error(`UID inesperado: ${uid}`);
      },
      async transaction(cb: (...args: any[]) => Promise<any>) {
        return cb({});
      },
    },
    plugin(name: string) {
      if (name !== 'upload') throw new Error(`plugin inesperado: ${name}`);
      return {
        service: () => ({
          async upload() {
            return { id: 555 };
          },
          async remove(file: Row) {
            removedUploads.push(file);
          },
        }),
      };
    },
  };

  return { strapi, updatedUsers, removedUploads };
}

function createContext(userId: number, body: Row, files?: Row) {
  const calls: string[] = [];
  const ctx: Row = {
    state: { user: { id: userId } },
    request: { body, files },
    body: undefined,
    unauthorized: () => calls.push('unauthorized'),
    forbidden: (message?: string) => calls.push(`forbidden:${message}`),
    badRequest: (message?: string) => calls.push(`badRequest:${message}`),
  };
  return { ctx, calls };
}

const unassignedUser = { id: 1, role: { type: 'unassigned' } };
const pendingRole = { id: 42, type: 'teacher_pending' };
const validPayload = { bio: 'Professora de inglês há 5 anos.', experience: 'CELTA, aulas para adultos.', languages: ['en'] };

function duplicateKeyError() {
  const error: any = new Error('duplicate key value violates unique constraint');
  error.code = 'ER_DUP_ENTRY';
  return error;
}

describe('candidatura a professor — corrida de duplicidade', () => {
  it('devolve TEACHER_APPLICATION_EXISTS quando o create perde a corrida, em vez de estourar um 500', async () => {
    const { strapi } = createStrapi({
      users: [unassignedUser],
      roles: [pendingRole],
      applications: [],
      onCreateApplication: async () => {
        throw duplicateKeyError();
      },
    });
    const controller = createProfileController({ strapi });
    const { ctx, calls } = createContext(1, validPayload);

    await controller.becomeTeacher(ctx);

    expect(calls).toEqual(['badRequest:TEACHER_APPLICATION_EXISTS']);
  });

  it('não deixa o anexo do perdedor da corrida órfão', async () => {
    const { strapi, removedUploads } = createStrapi({
      users: [unassignedUser],
      roles: [pendingRole],
      applications: [],
      onCreateApplication: async () => {
        throw duplicateKeyError();
      },
    });
    const controller = createProfileController({ strapi });
    const { ctx, calls } = createContext(1, validPayload, {
      attachment: { size: 1024, mimetype: 'application/pdf' },
    });

    await controller.becomeTeacher(ctx);

    expect(calls).toEqual(['badRequest:TEACHER_APPLICATION_EXISTS']);
    expect(removedUploads).toEqual([{ id: 555 }]);
  });

  it('cria a candidatura e troca a role quando não há disputa', async () => {
    const { strapi, updatedUsers } = createStrapi({
      users: [unassignedUser],
      roles: [pendingRole],
      applications: [],
      onCreateApplication: async () => ({ id: 10 }),
    });
    const controller = createProfileController({ strapi });
    const { ctx, calls } = createContext(1, validPayload);

    await controller.becomeTeacher(ctx);

    expect(calls).toEqual([]);
    expect(ctx.body).toEqual({ data: { role: 'teacher_pending' } });
    expect(updatedUsers).toEqual([{ id: 1, role: 42 }]);
  });
});
