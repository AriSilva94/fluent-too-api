import type { Core } from '@strapi/strapi';
import { APP_ROLES } from '../../../auth/roles';
import { buildNotificationFeed, FEED_LIMIT, resolveScope, type FeedSources } from '../services/feed';

const USER_UID = 'plugin::users-permissions.user';
const APPLICATION_UID = 'api::teacher-application.teacher-application';
const ATTEMPT_UID = 'api::quiz-attempt.quiz-attempt';
const QUIZ_UID = 'api::quiz.quiz';

const WINDOW_DAYS = 30;
const SOURCE_LIMIT = FEED_LIMIT;
const PERSON_SELECT = ['id', 'username', 'email'];

function windowStart(now: Date) {
  return new Date(now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
}

async function loadUser(strapi: Core.Strapi, id: number | string | undefined) {
  if (!id) return null;
  return strapi.db.query(USER_UID).findOne({ where: { id }, populate: ['role'] });
}

async function collectSources(strapi: Core.Strapi, user: any, since: string): Promise<FeedSources> {
  const scope = resolveScope(user.role?.type);
  const sources: FeedSources = {};

  if (scope.pendingApplications) {
    sources.pendingApplications = await strapi.db.query(APPLICATION_UID).findMany({
      where: { reviewStatus: 'pending' },
      orderBy: { createdAt: 'desc' },
      limit: SOURCE_LIMIT,
      populate: { user: { select: PERSON_SELECT } },
    });
  }

  if (scope.newMembers) {
    sources.newMembers = await strapi.db.query(USER_UID).findMany({
      where: {
        createdAt: { $gte: since },
        role: { type: { $in: [APP_ROLES.student, APP_ROLES.teacher] } },
        id: { $ne: user.id },
      },
      orderBy: { createdAt: 'desc' },
      limit: SOURCE_LIMIT,
      select: [...PERSON_SELECT, 'createdAt'],
      populate: { role: { select: ['type'] } },
    });
  }

  if (scope.quizAttempts) {
    sources.attempts = await strapi.db.query(ATTEMPT_UID).findMany({
      where: {
        completedAt: { $gte: since },
        quiz: { owner: { id: user.id } },
        user: { id: { $ne: user.id } },
      },
      orderBy: { completedAt: 'desc' },
      limit: SOURCE_LIMIT,
      select: ['id', 'completedAt', 'quizTitle', 'quizSlug', 'score'],
      populate: { user: { select: PERSON_SELECT } },
    });
  }

  if (scope.ownApplication) {
    sources.ownApplication = await strapi.db.query(APPLICATION_UID).findOne({
      where: { user: { id: user.id } },
      select: ['id', 'reviewStatus', 'reviewedAt', 'reviewNote', 'createdAt'],
    });
  }

  if (scope.newQuizzes) {
    sources.newQuizzes = await strapi.db.query(QUIZ_UID).findMany({
      where: { publishedAt: { $gte: since, $notNull: true }, isPublic: true },
      orderBy: { publishedAt: 'desc' },
      limit: SOURCE_LIMIT,
      select: ['id', 'slug', 'title', 'targetLanguage', 'level', 'publishedAt'],
    });
  }

  return sources;
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx: any) {
    const user = await loadUser(strapi, ctx.state.user?.id);
    if (!user) return ctx.unauthorized();

    const sources = await collectSources(strapi, user, windowStart(new Date()));
    ctx.body = {
      data: buildNotificationFeed({
        roleType: user.role?.type,
        sources,
        seenAt: user.notificationsSeenAt ?? null,
      }),
    };
  },

  async markSeen(ctx: any) {
    const user = await loadUser(strapi, ctx.state.user?.id);
    if (!user) return ctx.unauthorized();

    const seenAt = new Date().toISOString();
    await strapi.db.query(USER_UID).update({ where: { id: user.id }, data: { notificationsSeenAt: seenAt } });
    ctx.body = { data: { seenAt } };
  },
});
