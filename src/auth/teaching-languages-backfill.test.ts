import { describe, expect, it } from 'vitest';
import { backfillTeachingLanguages, selectUsersNeedingBackfill } from './teaching-languages-backfill';

const USER_UID = 'plugin::users-permissions.user';
const APPLICATION_UID = 'api::teacher-application.teacher-application';

type Row = Record<string, any>;

function createStrapi({ teachers, applications }: { teachers: Row[]; applications: Row[] }) {
  const updates: Row[] = [];

  const strapi: any = {
    log: { info: () => {} },
    db: {
      query(uid: string) {
        if (uid === USER_UID) {
          return {
            async findMany() {
              return teachers;
            },
            async update({ where, data }: any) {
              updates.push({ id: where.id, ...data });
            },
          };
        }

        if (uid === APPLICATION_UID) {
          return {
            async findOne({ where }: any) {
              return (
                applications.find(
                  (application) => application.user === where.user && application.status === where.status
                ) ?? null
              );
            },
          };
        }

        throw new Error(`UID inesperado: ${uid}`);
      },
    },
  };

  return { strapi, updates };
}

describe('selectUsersNeedingBackfill', () => {
  it('escolhe apenas quem está sem idioma', () => {
    expect(
      selectUsersNeedingBackfill([
        { id: 1, teachingLanguages: ['en'] },
        { id: 2, teachingLanguages: [] },
        { id: 3 },
        { id: 4, teachingLanguages: ['de'] },
      ])
    ).toEqual([2, 3, 4]);
  });
});

describe('backfillTeachingLanguages', () => {
  it('preenche a partir da candidatura aprovada', async () => {
    const { strapi, updates } = createStrapi({
      teachers: [{ id: 2, teachingLanguages: [] }],
      applications: [{ user: 2, status: 'approved', languages: ['en', 'fr'] }],
    });

    expect(await backfillTeachingLanguages(strapi)).toBe(1);
    expect(updates).toEqual([{ id: 2, teachingLanguages: ['en', 'fr'] }]);
  });

  it('não mexe em quem já tem idioma', async () => {
    const { strapi, updates } = createStrapi({
      teachers: [{ id: 2, teachingLanguages: ['en'] }],
      applications: [{ user: 2, status: 'approved', languages: ['fr'] }],
    });

    expect(await backfillTeachingLanguages(strapi)).toBe(0);
    expect(updates).toEqual([]);
  });

  it('ignora professor sem candidatura aprovada', async () => {
    const { strapi, updates } = createStrapi({
      teachers: [{ id: 2, teachingLanguages: [] }],
      applications: [{ user: 2, status: 'pending', languages: ['fr'] }],
    });

    expect(await backfillTeachingLanguages(strapi)).toBe(0);
    expect(updates).toEqual([]);
  });

  it('ignora candidatura cujos idiomas não são suportados', async () => {
    const { strapi, updates } = createStrapi({
      teachers: [{ id: 2, teachingLanguages: [] }],
      applications: [{ user: 2, status: 'approved', languages: ['de'] }],
    });

    expect(await backfillTeachingLanguages(strapi)).toBe(0);
    expect(updates).toEqual([]);
  });
});
