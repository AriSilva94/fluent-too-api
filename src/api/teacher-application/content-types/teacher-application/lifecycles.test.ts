import { describe, expect, it } from 'vitest';
import lifecycles, { needsReviewedAt } from './lifecycles';

describe('lifecycles da candidatura', () => {
  it('exige data de revisão apenas em decisões sem data', () => {
    expect(needsReviewedAt({ reviewStatus: 'approved' })).toBe(true);
    expect(needsReviewedAt({ reviewStatus: 'rejected' })).toBe(true);
    expect(needsReviewedAt({ reviewStatus: 'pending' })).toBe(false);
    expect(needsReviewedAt({ reviewStatus: 'approved', reviewedAt: '2026-09-01T00:00:00.000Z' })).toBe(false);
    expect(needsReviewedAt(undefined)).toBe(false);
  });

  it('carimba a data de revisão quando o painel decide sem informá-la', () => {
    const event = { params: { data: { reviewStatus: 'approved' } as Record<string, any> } };

    lifecycles.beforeUpdate(event);

    expect(event.params.data.reviewedAt).toBeInstanceOf(Date);
  });

  it('preserva a data já informada', () => {
    const event = { params: { data: { reviewStatus: 'approved', reviewedAt: '2026-09-01T00:00:00.000Z' } } };

    lifecycles.beforeUpdate(event);

    expect(event.params.data.reviewedAt).toBe('2026-09-01T00:00:00.000Z');
  });
});
