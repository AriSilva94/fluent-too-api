export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type ReviewDecisionResult =
  | { ok: true; data: { status: ApplicationStatus; reviewedBy: number | string; reviewedAt: string; reviewNote: string | null } }
  | { ok: false; error: 'ALREADY_REVIEWED' | 'REVIEW_NOTE_REQUIRED' };

export function buildReviewDecision(
  application: { id: number | string; status: ApplicationStatus },
  decision: 'approved' | 'rejected',
  reviewerId: number | string,
  note: string | undefined,
  now: string
): ReviewDecisionResult {
  if (application.status !== 'pending') return { ok: false, error: 'ALREADY_REVIEWED' };

  const trimmedNote = (note ?? '').trim();
  if (decision === 'rejected' && !trimmedNote) return { ok: false, error: 'REVIEW_NOTE_REQUIRED' };

  return {
    ok: true,
    data: {
      status: decision,
      reviewedBy: reviewerId,
      reviewedAt: now,
      reviewNote: trimmedNote || null,
    },
  };
}
