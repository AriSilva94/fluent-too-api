import { describe, expect, it } from 'vitest';
import { EMPTY_REACH, summarizeReach } from './reach';

const rows = [
  { quizSlug: 'verbos', quizTitle: 'Verbos', score: 80, user: { id: 1 } },
  { quizSlug: 'verbos', quizTitle: 'Verbos', score: 60, user: { id: 2 } },
  { quizSlug: 'cores', quizTitle: 'Cores', score: 100, user: { id: 1 } },
];

describe('alcance dos quizzes do professor', () => {
  it('devolve zerado sem tentativas', () => {
    expect(summarizeReach([])).toEqual(EMPTY_REACH);
  });

  it('conta tentativas e alunos distintos', () => {
    expect(summarizeReach(rows)).toMatchObject({ attempts: 3, learners: 2, averageScore: 80 });
  });

  it('elege o quiz mais respondido', () => {
    expect(summarizeReach(rows).topQuiz).toEqual({ slug: 'verbos', title: 'Verbos', attempts: 2 });
  });

  it('ignora nota ausente na média', () => {
    expect(summarizeReach([{ quizSlug: 'a', quizTitle: 'A', score: 90, user: { id: 1 } }, { quizSlug: 'a', score: null, user: { id: 1 } }]).averageScore).toBe(90);
  });

  it('tolera tentativa sem usuário ou sem slug', () => {
    expect(summarizeReach([{ quizSlug: null, score: 50, user: null }])).toMatchObject({ attempts: 1, learners: 0, topQuiz: null });
  });
});
