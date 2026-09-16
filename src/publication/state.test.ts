import { describe, expect, it } from 'vitest';
import { documentIdsOf, hasPublishedVersion, mergePublicationState, withPublicationState } from './state';

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

describe('hasPublishedVersion', () => {
  const UID = 'api::quiz.quiz';
  const rows = [
    { id: 1, documentId: 'abc', publishedAt: null },
    { id: 2, documentId: 'abc', publishedAt: new Date('2026-01-01T00:00:00.000Z') },
    { id: 3, documentId: 'xyz', publishedAt: null },
  ];

  function fakeStrapi() {
    return {
      db: {
        query: () => ({
          findOne: async ({ where }: any) =>
            rows.find(
              (row) =>
                (where.documentId === undefined || row.documentId === where.documentId) &&
                (where.id === undefined || row.id === where.id) &&
                (where.publishedAt === undefined || row.publishedAt !== null)
            ) ?? null,
        }),
      },
    };
  }

  it('detecta versão publicada pelo documentId', async () => {
    expect(await hasPublishedVersion(fakeStrapi(), UID, 'abc')).toBe(true);
  });

  it('detecta versão publicada pelo id numérico do rascunho', async () => {
    expect(await hasPublishedVersion(fakeStrapi(), UID, '1')).toBe(true);
  });

  it('retorna falso para documento despublicado', async () => {
    expect(await hasPublishedVersion(fakeStrapi(), UID, 'xyz')).toBe(false);
    expect(await hasPublishedVersion(fakeStrapi(), UID, 3)).toBe(false);
  });

  it('retorna falso sem id', async () => {
    expect(await hasPublishedVersion(fakeStrapi(), UID, undefined)).toBe(false);
  });
});
