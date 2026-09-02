import { describe, expect, it } from 'vitest';
import pkg from './legacy-blog-date.js';

const { parseLegacyBlogDate } = pkg;

describe('normalizacao das datas legadas do blog', () => {
  it('converte o formato português', () => {
    expect(parseLegacyBlogDate('20 de Fevereiro, 2026')).toBe('2026-02-20');
    expect(parseLegacyBlogDate('1 de Março, 2026')).toBe('2026-03-01');
    expect(parseLegacyBlogDate('18 de Dezembro, 2025')).toBe('2025-12-18');
  });

  it('converte o formato francês, com ou sem acento', () => {
    expect(parseLegacyBlogDate('20 fevrier 2026')).toBe('2026-02-20');
    expect(parseLegacyBlogDate('20 février 2026')).toBe('2026-02-20');
    expect(parseLegacyBlogDate('18 decembre 2025')).toBe('2025-12-18');
    expect(parseLegacyBlogDate('1 mars 2026')).toBe('2026-03-01');
  });

  it('converte o formato inglês', () => {
    expect(parseLegacyBlogDate('20 February 2026')).toBe('2026-02-20');
    expect(parseLegacyBlogDate('1 March 2026')).toBe('2026-03-01');
  });

  it('mantém o que já está em ISO', () => {
    expect(parseLegacyBlogDate('2026-02-20')).toBe('2026-02-20');
    expect(parseLegacyBlogDate('2026-02-20T00:00:00.000Z')).toBe('2026-02-20');
  });

  it('recusa o que não dá para interpretar', () => {
    expect(parseLegacyBlogDate('sem data')).toBeNull();
    expect(parseLegacyBlogDate('20 de Fevereiro')).toBeNull();
    expect(parseLegacyBlogDate('')).toBeNull();
    expect(parseLegacyBlogDate(undefined)).toBeNull();
    expect(parseLegacyBlogDate('40 de Janeiro, 2026')).toBeNull();
  });
});
