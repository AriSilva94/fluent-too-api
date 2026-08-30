import type { GradeResult } from './grade';

type AttemptInput = {
  attemptKey?: string;
  answers?: unknown;
};

type UserLike = {
  id: number | string;
  role?: {
    type?: string;
  };
};

export type QuizRecord = {
  id: number | string;
  slug: string;
  title: string;
  targetLanguage: 'pt' | 'en' | 'fr';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  type: 'multiple-choice' | 'fill-gap' | 'flashcard';
};

// `strapi.db.query` (Query Engine) não aplica a sanitização do Content API: um
// `populate: ['quiz']` puro devolveria também `quiz.owner`, que o schema marca
// `private` só para as rotas de Content API. Selecionar os campos explicitamente
// evita esse vazamento independente de o schema do quiz ganhar campos privados novos.
export const SAFE_QUIZ_POPULATE = {
  quiz: {
    select: ['id', 'title', 'slug', 'targetLanguage', 'level', 'type'],
  },
};

export const QUIZ_SELECT_FOR_GRADING = ['id', 'slug', 'title', 'targetLanguage', 'level', 'type', 'questions'];

// Score, contagens e metadados do quiz vêm do registro do quiz e do `grade`
// recalculado no backend — nunca do que o cliente mandou. Só `answers` (a
// resposta em si) e `attemptKey` (dedupe opcional) atravessam sem reprocessar.
export function buildAttemptCreateData(input: AttemptInput, user: UserLike, quiz: QuizRecord, grade: GradeResult) {
  return {
    attemptKey: resolveAttemptKey(input, quiz, grade),
    quizSlug: quiz.slug,
    quizTitle: quiz.title,
    targetLanguage: quiz.targetLanguage,
    level: quiz.level,
    quizType: quiz.type,
    score: grade.score,
    correctCount: grade.correctCount,
    incorrectCount: grade.incorrectCount,
    totalCount: grade.totalCount,
    answers: input.answers ?? {},
    details: grade.details,
    completedAt: new Date().toISOString(),
    user: user.id,
    quiz: quiz.id,
  };
}

export function buildAttemptFindFilters(user: UserLike) {
  return user.role?.type === 'app_admin' ? {} : { user: { id: user.id } };
}

export function buildAttemptDuplicateFilters(input: AttemptInput, user: UserLike) {
  if (!input.attemptKey?.trim()) return null;
  return {
    user: { id: user.id },
    attemptKey: input.attemptKey.trim(),
  };
}

function resolveAttemptKey(input: AttemptInput, quiz: QuizRecord, grade: GradeResult) {
  return (
    input.attemptKey?.trim() ||
    [quiz.slug, grade.score, grade.correctCount, grade.incorrectCount, grade.totalCount, JSON.stringify(input.answers ?? {})].join(
      '|'
    )
  );
}
