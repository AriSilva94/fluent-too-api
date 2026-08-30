import { describe, expect, it } from 'vitest';
import { buildReviewDecision } from './review';

const pending = { id: 10, status: 'pending' as const };

describe('decisão de candidatura', () => {
  it('aprova gravando revisor e data', () => {
    const result = buildReviewDecision(pending, 'approved', 7, undefined, '2026-08-28T12:00:00.000Z');

    expect(result).toEqual({
      ok: true,
      data: {
        status: 'approved',
        reviewedBy: 7,
        reviewedAt: '2026-08-28T12:00:00.000Z',
        reviewNote: null,
      },
    });
  });

  it('rejeita exigindo nota', () => {
    expect(buildReviewDecision(pending, 'rejected', 7, '   ', '2026-08-28T12:00:00.000Z')).toEqual({
      ok: false,
      error: 'REVIEW_NOTE_REQUIRED',
    });
  });

  it('grava a nota na rejeição', () => {
    const result = buildReviewDecision(pending, 'rejected', 7, 'Sem comprovação', '2026-08-28T12:00:00.000Z');

    expect(result).toEqual({
      ok: true,
      data: {
        status: 'rejected',
        reviewedBy: 7,
        reviewedAt: '2026-08-28T12:00:00.000Z',
        reviewNote: 'Sem comprovação',
      },
    });
  });

  it('recusa reprocessar candidatura já decidida', () => {
    expect(buildReviewDecision({ id: 10, status: 'approved' }, 'approved', 7, undefined, '2026-08-28T12:00:00.000Z')).toEqual({
      ok: false,
      error: 'ALREADY_REVIEWED',
    });
  });
});
