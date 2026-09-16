import { describe, expect, it } from 'vitest';
import { buildReviewDecision, promoteApprovedCandidate, toApplicationView } from './review';

const pending = { id: 10, reviewStatus: 'pending' as const };

describe('decisão de candidatura', () => {
  it('aprova gravando revisor e data', () => {
    const result = buildReviewDecision(pending, 'approved', 7, undefined, '2026-08-28T12:00:00.000Z');

    expect(result).toEqual({
      ok: true,
      data: {
        reviewStatus: 'approved',
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
        reviewStatus: 'rejected',
        reviewedBy: 7,
        reviewedAt: '2026-08-28T12:00:00.000Z',
        reviewNote: 'Sem comprovação',
      },
    });
  });

  it('recusa reprocessar candidatura já decidida', () => {
    expect(buildReviewDecision({ id: 10, reviewStatus: 'approved' }, 'approved', 7, undefined, '2026-08-28T12:00:00.000Z')).toEqual({
      ok: false,
      error: 'ALREADY_REVIEWED',
    });
  });
});

describe('promoção do candidato aprovado', () => {
  function createStrapi(application: Record<string, any> | null, candidate: Record<string, any> | null) {
    const updates: Record<string, any>[] = [];
    const strapi = {
      db: {
        query(uid: string) {
          if (uid === 'api::teacher-application.teacher-application') {
            return { async findOne() { return application; } };
          }
          if (uid === 'plugin::users-permissions.user') {
            return {
              async findOne() { return candidate; },
              async update({ where, data }: any) { updates.push({ id: where.id, ...data }); },
            };
          }
          return { async findOne() { return { id: 99, type: 'teacher' }; } };
        },
      },
    };
    return { strapi, updates };
  }

  it('promove candidato aprovado que ainda não é teacher', async () => {
    const { strapi, updates } = createStrapi(
      { id: 10, reviewStatus: 'approved', user: { id: 2 }, languages: ['en', 'de'] },
      { id: 2, role: { type: 'teacher_pending' } }
    );

    await expect(promoteApprovedCandidate(strapi, 10)).resolves.toBe(true);
    expect(updates).toEqual([{ id: 2, role: 99, teachingLanguages: ['en'] }]);
  });

  it('ignora candidatura que não está aprovada', async () => {
    const { strapi, updates } = createStrapi(
      { id: 10, reviewStatus: 'pending', user: { id: 2 } },
      { id: 2, role: { type: 'teacher_pending' } }
    );

    await expect(promoteApprovedCandidate(strapi, 10)).resolves.toBe(false);
    expect(updates).toEqual([]);
  });

  it('não repete a promoção de quem já é teacher', async () => {
    const { strapi, updates } = createStrapi(
      { id: 10, reviewStatus: 'approved', user: { id: 2 } },
      { id: 2, role: { type: 'teacher' } }
    );

    await expect(promoteApprovedCandidate(strapi, 10)).resolves.toBe(false);
    expect(updates).toEqual([]);
  });
});

describe('view pública da candidatura', () => {
  it('expõe reviewStatus como status', () => {
    expect(toApplicationView({ id: 1, reviewStatus: 'approved' as const, reviewNote: null })).toEqual({
      id: 1,
      status: 'approved',
      reviewNote: null,
    });
  });
});
