import type { Core } from '@strapi/strapi';
import { normalizeTeachingLanguages } from './quiz-language';

const USER_UID = 'plugin::users-permissions.user';
const APPLICATION_UID = 'api::teacher-application.teacher-application';

export type BackfillCandidate = {
  id: number | string;
  teachingLanguages?: unknown;
};

export function selectUsersNeedingBackfill(users: BackfillCandidate[]) {
  return users.filter((user) => normalizeTeachingLanguages(user.teachingLanguages).length === 0).map((user) => user.id);
}

export async function backfillTeachingLanguages(strapi: Core.Strapi) {
  const userQuery = strapi.db.query(USER_UID);
  const teachers = (await userQuery.findMany({
    where: { role: { type: 'teacher' } },
    select: ['id', 'teachingLanguages'],
  })) as BackfillCandidate[];

  const ids = selectUsersNeedingBackfill(teachers ?? []);
  if (ids.length === 0) return 0;

  let updated = 0;
  for (const id of ids) {
    const application = await strapi.db.query(APPLICATION_UID).findOne({
      where: { user: id, status: 'approved' },
    });
    const languages = normalizeTeachingLanguages(application?.languages);
    if (languages.length === 0) continue;

    await userQuery.update({ where: { id }, data: { teachingLanguages: languages } });
    updated++;
  }

  if (updated > 0) {
    strapi.log.info(`[auth] idiomas de ensino preenchidos para ${updated} professores`);
  }

  return updated;
}
