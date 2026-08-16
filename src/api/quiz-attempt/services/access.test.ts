import { describe, expect, it } from 'vitest';
import { buildAttemptCreateData, buildAttemptFindFilters, buildAttemptDuplicateFilters } from './access';

describe('quiz attempt access', () => {
  it('monta dados da tentativa vinculando usuário e quiz', () => {
    expect(
      buildAttemptCreateData(
        {
          quizSlug: 'a1-pt-basics-mc',
          quizTitle: 'Saudacoes basicas',
          targetLanguage: 'pt',
          level: 'A1',
          quizType: 'multiple-choice',
          score: 80,
          correctCount: 4,
          incorrectCount: 1,
          totalCount: 5,
          answers: { q1: 'Bom dia' },
          details: { q1: true },
        },
        { id: 10 },
        { id: 20 }
      )
    ).toMatchObject({
      quizSlug: 'a1-pt-basics-mc',
      attemptKey: expect.any(String),
      score: 80,
      user: 10,
      quiz: 20,
    });
  });

  it('filtra histórico por usuário quando não é admin', () => {
    expect(buildAttemptFindFilters({ id: 10, role: { type: 'authenticated' } })).toEqual({ user: { id: 10 } });
  });

  it('monta filtro de duplicidade para a mesma tentativa recente', () => {
    expect(
      buildAttemptDuplicateFilters(
        {
          quizSlug: 'a1-pt-basics-mc',
          quizTitle: 'Saudacoes basicas',
          targetLanguage: 'pt',
          level: 'A1',
          quizType: 'multiple-choice',
          score: 80,
          correctCount: 4,
          incorrectCount: 1,
          totalCount: 5,
          attemptKey: 'attempt-123',
        },
        { id: 10 }
      )
    ).toEqual({
      user: { id: 10 },
      attemptKey: 'attempt-123',
    });
  });

  it('não monta filtro de duplicidade sem chave explícita da tentativa', () => {
    expect(
      buildAttemptDuplicateFilters(
        {
          quizSlug: 'a1-pt-basics-mc',
          quizTitle: 'Saudacoes basicas',
          targetLanguage: 'pt',
          level: 'A1',
          quizType: 'multiple-choice',
          score: 80,
          correctCount: 4,
          incorrectCount: 1,
          totalCount: 5,
        },
        { id: 10 }
      )
    ).toBeNull();
  });

  it('não filtra histórico quando é admin do app', () => {
    expect(buildAttemptFindFilters({ id: 10, role: { type: 'app_admin' } })).toEqual({});
  });
});
