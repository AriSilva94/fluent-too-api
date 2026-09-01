import { describe, expect, it } from 'vitest';
import { shouldSeed } from './content';
import { QUIZZES } from './quizzes';
import { BLOG_POSTS, COVER_IMAGES } from './blog-posts';

describe('shouldSeedBlog', () => {
  it('semeia apenas quando nao ha nenhum post', () => {
    expect(shouldSeed(0)).toBe(true);
  });

  it('nao toca em ambiente que ja tem conteudo', () => {
    expect(shouldSeed(1)).toBe(false);
    expect(shouldSeed(18)).toBe(false);
  });
});

describe('dados do seed', () => {
  it('traz os seis artigos nos tres idiomas', () => {
    expect(BLOG_POSTS).toHaveLength(18);

    const porIdioma = BLOG_POSTS.reduce<Record<string, number>>((mapa, post) => {
      mapa[post.targetLanguage] = (mapa[post.targetLanguage] ?? 0) + 1;
      return mapa;
    }, {});

    expect(porIdioma).toEqual({ pt: 6, en: 6, fr: 6 });
  });

  it('tem capa para cada slug distinto', () => {
    const slugs = [...new Set(BLOG_POSTS.map((post) => post.slug))];

    expect(slugs).toHaveLength(6);
    for (const slug of slugs) expect(COVER_IMAGES[slug]).toBeTruthy();
  });

  it('nao fixa autor no dado, porque ele vem do usuario dono', () => {
    for (const post of BLOG_POSTS) expect(post).not.toHaveProperty('author');
  });
});

describe('dados dos quizzes', () => {
  it('traz os 18 quizzes originais, 6 por idioma', () => {
    expect(QUIZZES).toHaveLength(18);

    const porIdioma = QUIZZES.reduce<Record<string, number>>((mapa, quiz) => {
      mapa[quiz.targetLanguage] = (mapa[quiz.targetLanguage] ?? 0) + 1;
      return mapa;
    }, {});

    expect(porIdioma).toEqual({ pt: 6, en: 6, fr: 6 });
  });

  it('cobre os seis niveis e os tres tipos', () => {
    expect([...new Set(QUIZZES.map((quiz) => quiz.level))].sort()).toEqual(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
    expect([...new Set(QUIZZES.map((quiz) => quiz.type))].sort()).toEqual(['fill-gap', 'flashcard', 'multiple-choice']);
  });

  it('nao tem slug repetido, que o schema rejeitaria', () => {
    expect(new Set(QUIZZES.map((quiz) => quiz.slug)).size).toBe(QUIZZES.length);
  });
});
