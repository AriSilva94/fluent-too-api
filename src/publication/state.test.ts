import { describe, expect, it } from 'vitest';
import { documentIdsOf, mergePublicationState, withPublicationState } from './state';

describe('mergePublicationState', () => {
  it('marca como publicado o quiz que tem versão publicada', () => {
    const entries = [{ documentId: 'abc', publishedAt: null }];
    const merged = mergePublicationState(entries, new Map([['abc', '2026-01-01T00:00:00.000Z']]));

    expect(merged).toEqual([{ documentId: 'abc', publishedAt: '2026-01-01T00:00:00.000Z' }]);
  });

  it('mantém nulo o quiz sem versão publicada', () => {
    const entries = [{ documentId: 'abc', publishedAt: null }];

    expect(mergePublicationState(entries, new Map())).toEqual([{ documentId: 'abc', publishedAt: null }]);
  });

  it('não inventa estado para entrada sem documentId', () => {
    const entries = [{ publishedAt: '2026-01-01T00:00:00.000Z' }];

    expect(mergePublicationState(entries, new Map())).toEqual([{ publishedAt: null }]);
  });

  it('lista os documentIds válidos para a consulta', () => {
    expect(documentIdsOf([{ documentId: 'abc' }, { documentId: 42 }, {}, { documentId: 'abc' }])).toEqual(['abc']);
  });
});

describe('withPublicationState', () => {
  function fakeStrapi(published: { documentId: string; publishedAt: Date }[]) {
    const calls: any[] = [];
    return {
      calls,
      db: {
        query: (uid: string) => ({
          findMany: async (params: any) => {
            calls.push({ uid, params });
            return published;
          },
        }),
      },
    };
  }

  it('preenche publishedAt do irmão publicado ao listar rascunhos', async () => {
    const strapi = fakeStrapi([{ documentId: 'abc', publishedAt: new Date('2026-01-01T00:00:00.000Z') }]);
    const rascunhos = [
      { documentId: 'abc', publishedAt: null },
      { documentId: 'def', publishedAt: null },
    ];

    const merged = await withPublicationState(strapi, 'api::blog-post.blog-post', rascunhos);

    expect(merged).toEqual([
      { documentId: 'abc', publishedAt: '2026-01-01T00:00:00.000Z' },
      { documentId: 'def', publishedAt: null },
    ]);
    expect(strapi.calls[0].uid).toBe('api::blog-post.blog-post');
    expect(strapi.calls[0].params.where.documentId.$in).toEqual(['abc', 'def']);
  });

  it('nao consulta o banco quando nao ha documentId', async () => {
    const strapi = fakeStrapi([]);

    expect(await withPublicationState(strapi, 'api::quiz.quiz', [{}])).toEqual([{}]);
    expect(strapi.calls).toHaveLength(0);
  });
});
