export type QuizQuestionType = 'multiple-choice' | 'fill-gap' | 'flashcard';

export type GradeResult = {
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalCount: number;
  details: Record<string, boolean>;
};

export function gradeQuiz(type: QuizQuestionType, questions: unknown, answers: unknown): GradeResult {
  const list = Array.isArray(questions) ? questions : [];
  const answerMap = answers && typeof answers === 'object' ? (answers as Record<string, unknown>) : {};

  const details: Record<string, boolean> = {};
  let correct = 0;

  for (const question of list) {
    const id = String((question as { id?: unknown })?.id ?? '');
    const isCorrect = gradeQuestion(type, question, answerMap[id]);
    details[id] = isCorrect;
    if (isCorrect) correct++;
  }

  const totalCount = list.length;
  return {
    score: totalCount > 0 ? Math.round((correct / totalCount) * 100) : 0,
    correctCount: correct,
    incorrectCount: totalCount - correct,
    totalCount,
    details,
  };
}

function gradeQuestion(type: QuizQuestionType, question: unknown, answer: unknown): boolean {
  const q = (question ?? {}) as Record<string, unknown>;

  if (type === 'multiple-choice') {
    return typeof answer === 'string' && answer === q.correctAnswer;
  }

  if (type === 'flashcard') {
    return answer === true;
  }

  if (type === 'fill-gap') {
    const expected = Array.isArray(q.correctAnswers) ? (q.correctAnswers as unknown[]) : [];
    const given = Array.isArray(answer) ? answer : [];
    if (given.length !== expected.length || expected.length === 0) return false;
    return given.every(
      (value, i) => typeof value === 'string' && value.trim().toLowerCase() === String(expected[i]).trim().toLowerCase()
    );
  }

  return false;
}
