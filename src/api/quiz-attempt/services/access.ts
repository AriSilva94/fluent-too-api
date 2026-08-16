type AttemptInput = {
  attemptKey?: string;
  quizSlug: string;
  quizTitle: string;
  targetLanguage: 'pt' | 'en' | 'fr';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  quizType: 'multiple-choice' | 'fill-gap' | 'flashcard';
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalCount: number;
  answers?: unknown;
  details?: unknown;
};

type UserLike = {
  id: number | string;
  role?: {
    type?: string;
  };
};

type QuizLike = {
  id: number | string;
};

export function buildAttemptCreateData(input: AttemptInput, user: UserLike, quiz?: QuizLike | null) {
  return {
    attemptKey: resolveAttemptKey(input),
    quizSlug: input.quizSlug,
    quizTitle: input.quizTitle,
    targetLanguage: input.targetLanguage,
    level: input.level,
    quizType: input.quizType,
    score: input.score,
    correctCount: input.correctCount,
    incorrectCount: input.incorrectCount,
    totalCount: input.totalCount,
    answers: input.answers ?? {},
    details: input.details ?? {},
    completedAt: new Date().toISOString(),
    user: user.id,
    ...(quiz ? { quiz: quiz.id } : {}),
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

function resolveAttemptKey(input: AttemptInput) {
  return input.attemptKey?.trim() || [
    input.quizSlug,
    input.score,
    input.correctCount,
    input.incorrectCount,
    input.totalCount,
    JSON.stringify(input.answers ?? {}),
    JSON.stringify(input.details ?? {}),
  ].join('|');
}
