import { describe, expect, it } from 'vitest';
import { documentIdsOf, mergePublicationState } from './publication';

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
