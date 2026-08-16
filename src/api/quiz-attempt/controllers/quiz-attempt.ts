import { factories } from '@strapi/strapi';
import { buildAttemptCreateData, buildAttemptDuplicateFilters, buildAttemptFindFilters } from '../services/access';

export default factories.createCoreController('api::quiz-attempt.quiz-attempt' as never, ({ strapi }) => ({
  async create(ctx) {
    const user = await getUserWithRole(strapi, ctx.state.user?.id);
    if (!user) return ctx.unauthorized();

    const input = ctx.request.body?.data ?? ctx.request.body ?? {};
    const quiz = input.quizSlug
      ? await strapi.db.query('api::quiz.quiz').findOne({ where: { slug: input.quizSlug } })
      : null;
    const duplicateFilters = buildAttemptDuplicateFilters(input, user);
    const existingEntry = duplicateFilters
      ? await strapi.db.query('api::quiz-attempt.quiz-attempt').findOne({
          where: duplicateFilters,
          populate: ['quiz'],
        })
      : null;

    if (existingEntry) {
      ctx.body = { data: existingEntry };
      return;
    }

    const entry = await strapi.db.query('api::quiz-attempt.quiz-attempt').create({
      data: buildAttemptCreateData(input, user, quiz),
      populate: ['quiz'],
    }).catch(async (error: unknown) => {
      if (!duplicateFilters) throw error;
      const duplicateEntry = await strapi.db.query('api::quiz-attempt.quiz-attempt').findOne({
        where: duplicateFilters,
        populate: ['quiz'],
      });
      if (!duplicateEntry) throw error;
      return duplicateEntry;
    });

    ctx.body = { data: entry };
  },

  async find(ctx) {
    const user = await getUserWithRole(strapi, ctx.state.user?.id);
    if (!user) return ctx.unauthorized();

    const entries = await strapi.db.query('api::quiz-attempt.quiz-attempt').findMany({
      where: buildAttemptFindFilters(user),
      orderBy: { completedAt: 'desc' },
      limit: 20,
      populate: ['quiz'],
    });

    ctx.body = { data: entries };
  },

  async findOne(ctx) {
    const user = await getUserWithRole(strapi, ctx.state.user?.id);
    if (!user) return ctx.unauthorized();

    const entry = await strapi.db.query('api::quiz-attempt.quiz-attempt').findOne({
      where: {
        id: ctx.params.id,
        ...buildAttemptFindFilters(user),
      },
      populate: ['quiz'],
    });

    if (!entry) return ctx.notFound();
    ctx.body = { data: entry };
  },
}));

async function getUserWithRole(strapi: any, id: number | string | undefined) {
  if (!id) return null;
  return strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id },
    populate: ['role'],
  });
}
