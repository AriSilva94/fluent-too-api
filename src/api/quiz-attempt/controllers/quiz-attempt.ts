import { factories } from '@strapi/strapi';
import {
  buildAttemptCreateData,
  buildAttemptDuplicateFilters,
  buildAttemptFindFilters,
  QUIZ_SELECT_FOR_GRADING,
  SAFE_QUIZ_POPULATE,
  type QuizRecord,
} from '../services/access';
import { gradeQuiz } from '../services/grade';

export default factories.createCoreController('api::quiz-attempt.quiz-attempt' as never, ({ strapi }) => ({
  async create(ctx) {
    const user = await getUserWithRole(strapi, ctx.state.user?.id);
    if (!user) return ctx.unauthorized();

    const input = ctx.request.body?.data ?? ctx.request.body ?? {};
    const quizSlug = typeof input.quizSlug === 'string' ? input.quizSlug : undefined;
    if (!quizSlug) return ctx.badRequest('QUIZ_SLUG_REQUIRED');

    const quiz: (QuizRecord & { questions: unknown }) | null = await strapi.db
      .query('api::quiz.quiz')
      .findOne({ where: { slug: quizSlug }, select: QUIZ_SELECT_FOR_GRADING });
    if (!quiz) return ctx.badRequest('QUIZ_NOT_FOUND');

    const grade = gradeQuiz(quiz.type, quiz.questions, input.answers);

    const duplicateFilters = buildAttemptDuplicateFilters(input, user);
    const existingEntry = duplicateFilters
      ? await strapi.db.query('api::quiz-attempt.quiz-attempt').findOne({
          where: duplicateFilters,
          populate: SAFE_QUIZ_POPULATE,
        })
      : null;

    if (existingEntry) {
      ctx.body = { data: existingEntry };
      return;
    }

    const entry = await strapi.db
      .query('api::quiz-attempt.quiz-attempt')
      .create({
        data: buildAttemptCreateData(input, user, quiz, grade),
        populate: SAFE_QUIZ_POPULATE,
      })
      .catch(async (error: unknown) => {
        if (!duplicateFilters) throw error;
        const duplicateEntry = await strapi.db.query('api::quiz-attempt.quiz-attempt').findOne({
          where: duplicateFilters,
          populate: SAFE_QUIZ_POPULATE,
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
      populate: SAFE_QUIZ_POPULATE,
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
      populate: SAFE_QUIZ_POPULATE,
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
