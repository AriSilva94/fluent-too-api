import { describe, expect, it } from 'vitest';
import { MAX_QUESTIONS_PER_QUIZ, resolveQuizType, validateQuestions } from './questions';

const multipleChoice = { id: 'q1', question: 'Como se diz bom dia?', options: ['Bom dia', 'Boa noite'], correctAnswer: 'Bom dia' };
const fillGap = { id: 'q1', parts: ['Ele ', ' na escola.'], correctAnswers: ['estuda'] };
const flashcard = { id: 'q1', front: 'obrigado', back: 'thank you' };

describe('validateQuestions — regras comuns', () => {
  it('exige uma lista com pelo menos uma questão', () => {
    expect(validateQuestions('multiple-choice', [])).toEqual({ ok: false, error: 'QUESTIONS_REQUIRED' });
    expect(validateQuestions('multiple-choice', undefined)).toEqual({ ok: false, error: 'QUESTIONS_REQUIRED' });
    expect(validateQuestions('multiple-choice', { q1: 'x' })).toEqual({ ok: false, error: 'QUESTIONS_REQUIRED' });
  });

  it('recusa quiz acima do limite de questões', () => {
    const questions = Array.from({ length: MAX_QUESTIONS_PER_QUIZ + 1 }, (_, index) => ({
      ...multipleChoice,
      id: `q${index}`,
    }));

    expect(validateQuestions('multiple-choice', questions)).toEqual({ ok: false, error: 'TOO_MANY_QUESTIONS' });
  });

  it('exige id não vazio em cada questão', () => {
    expect(validateQuestions('multiple-choice', [{ ...multipleChoice, id: '  ' }])).toEqual({
      ok: false,
      error: 'INVALID_QUESTION_ID',
      index: 0,
    });
  });

  it('recusa ids repetidos, que quebrariam a correção', () => {
    expect(validateQuestions('multiple-choice', [multipleChoice, { ...multipleChoice }])).toEqual({
      ok: false,
      error: 'DUPLICATE_QUESTION_ID',
      index: 1,
    });
  });

  it('recusa um tipo de quiz desconhecido', () => {
    expect(validateQuestions('cloze' as never, [multipleChoice])).toEqual({ ok: false, error: 'INVALID_QUIZ_TYPE' });
  });
});

describe('validateQuestions — multiple-choice', () => {
  it('aceita questão completa', () => {
    expect(validateQuestions('multiple-choice', [multipleChoice])).toEqual({ ok: true });
  });

  it('exige enunciado', () => {
    expect(validateQuestions('multiple-choice', [{ ...multipleChoice, question: '' }])).toEqual({
      ok: false,
      error: 'INVALID_QUESTION',
      index: 0,
    });
  });

  it('exige pelo menos duas opções', () => {
    expect(validateQuestions('multiple-choice', [{ ...multipleChoice, options: ['Bom dia'] }])).toEqual({
      ok: false,
      error: 'INVALID_QUESTION',
      index: 0,
    });
  });

  it('exige que a resposta correta esteja entre as opções', () => {
    expect(validateQuestions('multiple-choice', [{ ...multipleChoice, correctAnswer: 'Boa tarde' }])).toEqual({
      ok: false,
      error: 'INVALID_QUESTION',
      index: 0,
    });
  });

  it('recusa opções repetidas, que tornam a correção ambígua', () => {
    expect(validateQuestions('multiple-choice', [{ ...multipleChoice, options: ['Bom dia', 'Bom dia'] }])).toEqual({
      ok: false,
      error: 'INVALID_QUESTION',
      index: 0,
    });
  });
});

describe('validateQuestions — fill-gap', () => {
  it('aceita questão completa', () => {
    expect(validateQuestions('fill-gap', [fillGap])).toEqual({ ok: true });
  });

  it('aceita várias lacunas', () => {
    expect(
      validateQuestions('fill-gap', [{ id: 'q1', parts: ['It is ', ' the ', '.'], correctAnswers: ['on', 'table'] }])
    ).toEqual({ ok: true });
  });

  it('aceita lacuna no começo da frase, com o primeiro pedaço vazio', () => {
    expect(validateQuestions('fill-gap', [{ id: 'q1', parts: ['', ' é meu amigo.'], correctAnswers: ['Ele'] }])).toEqual({
      ok: true,
    });
  });

  it('exige que o número de respostas bata com o número de lacunas', () => {
    expect(validateQuestions('fill-gap', [{ ...fillGap, correctAnswers: [] }])).toEqual({
      ok: false,
      error: 'INVALID_QUESTION',
      index: 0,
    });
    expect(validateQuestions('fill-gap', [{ ...fillGap, correctAnswers: ['estuda', 'sobra'] }])).toEqual({
      ok: false,
      error: 'INVALID_QUESTION',
      index: 0,
    });
  });

  it('exige pelo menos dois pedaços de texto, ou seja, uma lacuna', () => {
    expect(validateQuestions('fill-gap', [{ id: 'q1', parts: ['Sem lacuna.'], correctAnswers: [] }])).toEqual({
      ok: false,
      error: 'INVALID_QUESTION',
      index: 0,
    });
  });

  it('recusa resposta vazia no meio da lista', () => {
    expect(
      validateQuestions('fill-gap', [{ id: 'q1', parts: ['It is ', ' the ', '.'], correctAnswers: ['on', '  '] }])
    ).toEqual({
      ok: false,
      error: 'INVALID_QUESTION',
      index: 0,
    });
  });

  it('recusa parts que não são texto', () => {
    expect(validateQuestions('fill-gap', [{ id: 'q1', parts: ['Ele ', 42], correctAnswers: ['estuda'] }])).toEqual({
      ok: false,
      error: 'INVALID_QUESTION',
      index: 0,
    });
  });
});

describe('validateQuestions — flashcard', () => {
  it('aceita questão completa', () => {
    expect(validateQuestions('flashcard', [flashcard])).toEqual({ ok: true });
  });

  it('exige frente e verso', () => {
    expect(validateQuestions('flashcard', [{ ...flashcard, back: '' }])).toEqual({
      ok: false,
      error: 'INVALID_QUESTION',
      index: 0,
    });
  });

  it('aponta o índice da questão inválida', () => {
    expect(validateQuestions('flashcard', [flashcard, { ...flashcard, id: 'q2', front: '' }])).toEqual({
      ok: false,
      error: 'INVALID_QUESTION',
      index: 1,
    });
  });
});

describe('resolveQuizType', () => {
  it('usa o tipo do payload na criação', () => {
    expect(resolveQuizType({ type: 'flashcard' }, [])).toBe('flashcard');
  });

  it('cai no tipo já gravado quando o payload não manda tipo', () => {
    expect(resolveQuizType({ questions: [] }, [{ type: 'fill-gap' }])).toBe('fill-gap');
  });

  it('deixa o payload sobrescrever o tipo gravado', () => {
    expect(resolveQuizType({ type: 'flashcard' }, [{ type: 'fill-gap' }])).toBe('flashcard');
  });

  it('devolve null quando o tipo é inválido ou ausente', () => {
    expect(resolveQuizType({ type: 'cloze' }, [])).toBeNull();
    expect(resolveQuizType({}, [])).toBeNull();
    expect(resolveQuizType(undefined, [])).toBeNull();
  });
});
