import { APP_ROLES } from '../../../auth/roles';
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

export const SAFE_QUIZ_POPULATE = {
  quiz: {
    select: ['id', 'title', 'slug', 'targetLanguage', 'level', 'type'],
  },
};

export const QUIZ_SELECT_FOR_GRADING = ['id', 'slug', 'title', 'targetLanguage', 'level', 'type', 'questions'];

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
  return user.role?.type === APP_ROLES.appAdmin ? {} : { user: { id: user.id } };
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
