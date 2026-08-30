import { describe, expect, it } from 'vitest';
import { buildAttemptCreateData, buildAttemptFindFilters, buildAttemptDuplicateFilters } from './access';
import type { QuizRecord } from './access';
import type { GradeResult } from './grade';

const quiz: QuizRecord = {
  id: 20,
  slug: 'a1-pt-basics-mc',
  title: 'Saudacoes basicas',
  targetLanguage: 'pt',
  level: 'A1',
  type: 'multiple-choice',
};

const grade: GradeResult = {
  score: 80,
  correctCount: 4,
  incorrectCount: 1,
  totalCount: 5,
  details: { q1: true },
};

describe('quiz attempt access', () => {
  it('monta dados da tentativa a partir do quiz e do resultado recalculado, ignorando score/quizTitle enviados pelo cliente', () => {
    expect(
      buildAttemptCreateData(
        {
          answers: { q1: 'Bom dia' },
          // Um cliente malicioso poderia mandar isso, mas buildAttemptCreateData nunca lê daqui.
          ...({ score: 100, quizTitle: 'Forjado' } as never),
        },
        { id: 10 },
        quiz,
        grade
      )
    ).toMatchObject({
      quizSlug: 'a1-pt-basics-mc',
      quizTitle: 'Saudacoes basicas',
      attemptKey: expect.any(String),
      score: 80,
      correctCount: 4,
      user: 10,
      quiz: 20,
    });
  });

  it('filtra histórico por usuário quando não é admin', () => {
    expect(buildAttemptFindFilters({ id: 10, role: { type: 'authenticated' } })).toEqual({ user: { id: 10 } });
  });

  it('monta filtro de duplicidade para a mesma tentativa recente', () => {
    expect(buildAttemptDuplicateFilters({ attemptKey: 'attempt-123' }, { id: 10 })).toEqual({
      user: { id: 10 },
      attemptKey: 'attempt-123',
    });
  });

  it('não monta filtro de duplicidade sem chave explícita da tentativa', () => {
    expect(buildAttemptDuplicateFilters({}, { id: 10 })).toBeNull();
  });

  it('não filtra histórico quando é admin do app', () => {
    expect(buildAttemptFindFilters({ id: 10, role: { type: 'app_admin' } })).toEqual({});
  });
});
