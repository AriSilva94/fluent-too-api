import { describe, expect, it } from 'vitest';
import { gradeQuiz } from './grade';

describe('gradeQuiz', () => {
  it('corrige multipla escolha comparando com o gabarito do quiz', () => {
    const questions = [
      { id: 'q1', correctAnswer: 'Bom dia' },
      { id: 'q2', correctAnswer: 'Boa noite' },
    ];

    expect(gradeQuiz('multiple-choice', questions, { q1: 'Bom dia', q2: 'errado' })).toEqual({
      score: 50,
      correctCount: 1,
      incorrectCount: 1,
      totalCount: 2,
      details: { q1: true, q2: false },
    });
  });

  it('ignora um score forjado pelo cliente e recalcula do zero', () => {
    const questions = [{ id: 'q1', correctAnswer: 'certo' }];
    const result = gradeQuiz('multiple-choice', questions, { q1: 'errado' });
    expect(result.score).toBe(0);
    expect(result.correctCount).toBe(0);
  });

  it('exige acertar todos os gaps de fill-gap para pontuar a questão', () => {
    const questions = [{ id: 'q1', correctAnswers: ['on', 'the'] }];

    expect(gradeQuiz('fill-gap', questions, { q1: ['On', ' The '] })).toEqual({
      score: 100,
      correctCount: 1,
      incorrectCount: 0,
      totalCount: 1,
      details: { q1: true },
    });

    expect(gradeQuiz('fill-gap', questions, { q1: ['on'] })).toEqual({
      score: 0,
      correctCount: 0,
      incorrectCount: 1,
      totalCount: 1,
      details: { q1: false },
    });
  });

  it('conta flashcard como certo apenas quando a resposta é true', () => {
    const questions = [{ id: 'q1' }, { id: 'q2' }];

    expect(gradeQuiz('flashcard', questions, { q1: true, q2: 'true' })).toEqual({
      score: 50,
      correctCount: 1,
      incorrectCount: 1,
      totalCount: 2,
      details: { q1: true, q2: false },
    });
  });

  it('lida com quiz sem perguntas sem dividir por zero', () => {
    expect(gradeQuiz('multiple-choice', [], {})).toEqual({
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      totalCount: 0,
      details: {},
    });
  });
});
