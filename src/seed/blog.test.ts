import { describe, expect, it } from 'vitest';
import { shouldSeedBlog } from './blog';
import { BLOG_POSTS, COVER_IMAGES } from './blog-posts';

describe('shouldSeedBlog', () => {
  it('semeia apenas quando nao ha nenhum post', () => {
    expect(shouldSeedBlog(0)).toBe(true);
  });

  it('nao toca em ambiente que ja tem conteudo', () => {
    expect(shouldSeedBlog(1)).toBe(false);
    expect(shouldSeedBlog(18)).toBe(false);
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
