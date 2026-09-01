import { QUIZ_TYPE, type QuizQuestionType } from '../../quiz-attempt/services/grade';

export const MAX_QUESTIONS_PER_QUIZ = 50;
export const MAX_OPTIONS_PER_QUESTION = 8;

export type QuestionsValidationError =
  | 'QUESTIONS_REQUIRED'
  | 'TOO_MANY_QUESTIONS'
  | 'INVALID_QUIZ_TYPE'
  | 'INVALID_QUESTION_ID'
  | 'DUPLICATE_QUESTION_ID'
  | 'INVALID_QUESTION';

export type QuestionsValidationResult =
  | { ok: true }
  | { ok: false; error: QuestionsValidationError; index?: number };

const validators: Record<QuizQuestionType, (question: Record<string, unknown>) => boolean> = {
  [QUIZ_TYPE.multipleChoice]: isValidMultipleChoice,
  [QUIZ_TYPE.fillGap]: isValidFillGap,
  [QUIZ_TYPE.flashcard]: isValidFlashcard,
};

export function validateQuestions(type: QuizQuestionType, questions: unknown): QuestionsValidationResult {
  const validateQuestion = validators[type];
  if (!validateQuestion) return { ok: false, error: 'INVALID_QUIZ_TYPE' };

  if (!Array.isArray(questions) || questions.length === 0) return { ok: false, error: 'QUESTIONS_REQUIRED' };
  if (questions.length > MAX_QUESTIONS_PER_QUIZ) return { ok: false, error: 'TOO_MANY_QUESTIONS' };

  const seenIds = new Set<string>();

  for (const [index, raw] of questions.entries()) {
    const question = (raw ?? {}) as Record<string, unknown>;

    const id = readText(question.id);
    if (!id) return { ok: false, error: 'INVALID_QUESTION_ID', index };
    if (seenIds.has(id)) return { ok: false, error: 'DUPLICATE_QUESTION_ID', index };
    seenIds.add(id);

    if (!validateQuestion(question)) return { ok: false, error: 'INVALID_QUESTION', index };
  }

  return { ok: true };
}

export function resolveQuizType(
  payload: Record<string, unknown> | undefined | null,
  entries: { type?: unknown }[]
): QuizQuestionType | null {
  const requested = (payload ?? {}).type;
  const current = entries.find((entry) => isQuizType(entry.type))?.type;
  const resolved = requested ?? current;
  return isQuizType(resolved) ? resolved : null;
}

function isQuizType(value: unknown): value is QuizQuestionType {
  return Object.values(QUIZ_TYPE).includes(value as QuizQuestionType);
}

function isValidMultipleChoice(question: Record<string, unknown>) {
  if (!readText(question.question)) return false;

  const options = Array.isArray(question.options) ? question.options.map(readText) : [];
  if (options.length < 2 || options.length > MAX_OPTIONS_PER_QUESTION) return false;
  if (options.some((option) => !option)) return false;
  if (new Set(options).size !== options.length) return false;

  const correctAnswer = readText(question.correctAnswer);
  return Boolean(correctAnswer) && options.includes(correctAnswer);
}

function isValidFillGap(question: Record<string, unknown>) {
  const parts = Array.isArray(question.parts) ? question.parts : [];
  if (parts.length < 2 || parts.some((part) => typeof part !== 'string')) return false;

  const answers = Array.isArray(question.correctAnswers) ? question.correctAnswers.map(readText) : [];
  return answers.length === parts.length - 1 && answers.every(Boolean);
}

function isValidFlashcard(question: Record<string, unknown>) {
  return Boolean(readText(question.front)) && Boolean(readText(question.back));
}

function readText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}
