import { describe, expect, it } from 'vitest';
import { canManageQuizLanguage, normalizeTeachingLanguages, resolveQuizLanguages } from './quiz-language';

const teacher = (languages: unknown) => ({ id: 1, role: { type: 'teacher' }, teachingLanguages: languages });

describe('normalizeTeachingLanguages', () => {
  it('mantém apenas os idiomas suportados', () => {
    expect(normalizeTeachingLanguages(['en', 'de', 'fr'])).toEqual(['en', 'fr']);
  });

  it('aceita um idioma único vindo como string', () => {
    expect(normalizeTeachingLanguages('pt')).toEqual(['pt']);
  });

  it('devolve lista vazia para valores ausentes ou inválidos', () => {
    expect(normalizeTeachingLanguages(undefined)).toEqual([]);
    expect(normalizeTeachingLanguages(null)).toEqual([]);
    expect(normalizeTeachingLanguages(42)).toEqual([]);
    expect(normalizeTeachingLanguages(['de'])).toEqual([]);
  });

  it('remove duplicatas', () => {
    expect(normalizeTeachingLanguages(['en', 'en'])).toEqual(['en']);
  });
});

describe('canManageQuizLanguage', () => {
  it('libera admin para qualquer idioma', () => {
    expect(canManageQuizLanguage({ id: 1, role: { type: 'app_admin' } }, ['fr'])).toBe(true);
    expect(canManageQuizLanguage({ id: 1, role: { type: 'super_admin' } }, ['pt', 'en', 'fr'])).toBe(true);
  });

  it('libera professor apenas nos idiomas aprovados', () => {
    expect(canManageQuizLanguage(teacher(['en']), ['en'])).toBe(true);
    expect(canManageQuizLanguage(teacher(['en', 'fr']), ['fr'])).toBe(true);
  });

  it('barra professor em idioma fora da aprovação', () => {
    expect(canManageQuizLanguage(teacher(['en']), ['pt'])).toBe(false);
  });

  it('barra professor quando qualquer um dos idiomas envolvidos não é aprovado', () => {
    expect(canManageQuizLanguage(teacher(['en']), ['en', 'pt'])).toBe(false);
  });

  it('barra professor sem idioma aprovado', () => {
    expect(canManageQuizLanguage(teacher([]), ['en'])).toBe(false);
    expect(canManageQuizLanguage(teacher(undefined), ['en'])).toBe(false);
  });

  it('barra professor quando nenhum idioma foi informado no payload', () => {
    expect(canManageQuizLanguage(teacher(['en']), [])).toBe(false);
  });

  it('barra quem não é professor nem admin', () => {
    expect(canManageQuizLanguage({ id: 1, role: { type: 'student' }, teachingLanguages: ['en'] }, ['en'])).toBe(false);
  });
});

describe('resolveQuizLanguages', () => {
  it('junta o idioma atual do quiz com o idioma pedido no payload', () => {
    expect(resolveQuizLanguages({ targetLanguage: 'pt' }, [{ targetLanguage: 'en' }])).toEqual(['en', 'pt']);
  });

  it('não duplica quando o idioma não muda', () => {
    expect(resolveQuizLanguages({ targetLanguage: 'en' }, [{ targetLanguage: 'en' }])).toEqual(['en']);
  });

  it('usa só o payload quando o quiz ainda não existe (criação)', () => {
    expect(resolveQuizLanguages({ targetLanguage: 'fr' }, [])).toEqual(['fr']);
  });

  it('ignora idioma inválido vindo do payload', () => {
    expect(resolveQuizLanguages({ targetLanguage: 'de' }, [{ targetLanguage: 'en' }])).toEqual(['en']);
  });

  it('devolve vazio quando não há idioma nenhum', () => {
    expect(resolveQuizLanguages({}, [])).toEqual([]);
  });
});
