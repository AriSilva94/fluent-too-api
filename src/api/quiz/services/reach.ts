export type ReachRow = {
  quizSlug?: string | null;
  quizTitle?: string | null;
  score?: number | null;
  user?: { id: number | string } | null;
};

export type ReachSummary = {
  attempts: number;
  learners: number;
  averageScore: number;
  topQuiz: { slug: string; title: string; attempts: number } | null;
};

export const EMPTY_REACH: ReachSummary = { attempts: 0, learners: 0, averageScore: 0, topQuiz: null };

export function summarizeReach(rows: ReachRow[]): ReachSummary {
  if (rows.length === 0) return EMPTY_REACH;

  const learners = new Set<string>();
  const perQuiz = new Map<string, { slug: string; title: string; attempts: number }>();
  let scoreTotal = 0;
  let scored = 0;

  for (const row of rows) {
    if (row.user?.id !== undefined && row.user?.id !== null) learners.add(String(row.user.id));
    if (typeof row.score === 'number') {
      scoreTotal += row.score;
      scored += 1;
    }

    const slug = typeof row.quizSlug === 'string' ? row.quizSlug : '';
    if (!slug) continue;
    const current = perQuiz.get(slug) ?? { slug, title: row.quizTitle ?? slug, attempts: 0 };
    current.attempts += 1;
    perQuiz.set(slug, current);
  }

  const ranked = [...perQuiz.values()].sort((a, b) => b.attempts - a.attempts || a.slug.localeCompare(b.slug));

  return {
    attempts: rows.length,
    learners: learners.size,
    averageScore: scored > 0 ? Math.round(scoreTotal / scored) : 0,
    topQuiz: ranked[0] ?? null,
  };
}
