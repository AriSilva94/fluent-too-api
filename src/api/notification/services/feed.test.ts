import { describe, expect, it } from 'vitest';
import { buildNotificationFeed, displayName, NOTIFICATION_KIND, resolveScope } from './feed';

const sources = {
  pendingApplications: [{ id: 7, createdAt: '2026-08-30T10:00:00.000Z', user: { id: 3, username: 'ana', email: 'ana@x.com' } }],
  newMembers: [
    { id: 3, createdAt: '2026-08-29T10:00:00.000Z', username: 'ana', email: 'ana@x.com', role: { type: 'student' } },
    { id: 4, createdAt: '2026-08-28T10:00:00.000Z', username: 'bruno', email: 'bruno@x.com', role: { type: 'teacher' } },
  ],
  attempts: [
    { id: 11, completedAt: '2026-08-31T10:00:00.000Z', quizTitle: 'Verbos', quizSlug: 'verbos', score: 80, user: { id: 3, username: 'ana', email: 'ana@x.com' } },
  ],
  ownApplication: { id: 7, reviewStatus: 'approved', reviewedAt: '2026-08-27T10:00:00.000Z', reviewNote: null },
  newQuizzes: [{ id: 21, slug: 'saudacoes', title: 'Saudações', targetLanguage: 'fr', level: 'A1', publishedAt: '2026-08-26T10:00:00.000Z' }],
};

describe('escopo por papel', () => {
  it('admin vê candidaturas e novos membros, nada de aluno', () => {
    expect(resolveScope('app_admin')).toMatchObject({ pendingApplications: true, newMembers: true, newQuizzes: false });
    expect(resolveScope('super_admin').pendingApplications).toBe(true);
  });

  it('professor vê tentativas nos próprios quizzes', () => {
    expect(resolveScope('teacher')).toMatchObject({ quizAttempts: true, pendingApplications: false, newMembers: false });
  });

  it('aluno vê apenas quizzes novos', () => {
    expect(resolveScope('student')).toMatchObject({ newQuizzes: true, quizAttempts: false, newMembers: false });
  });

  it('sem papel não vê nada', () => {
    expect(resolveScope(undefined)).toMatchObject({ pendingApplications: false, newMembers: false, newQuizzes: false });
    expect(resolveScope('unassigned').newQuizzes).toBe(false);
  });
});

describe('montagem do feed', () => {
  it('ignora fontes fora do escopo do papel', () => {
    const feed = buildNotificationFeed({ roleType: 'student', sources });
    expect(feed.items).toHaveLength(1);
    expect(feed.items[0].kind).toBe(NOTIFICATION_KIND.newQuiz);
  });

  it('separa aluno novo de professor novo pelo papel do membro', () => {
    const feed = buildNotificationFeed({ roleType: 'app_admin', sources });
    const kinds = feed.items.map((item) => item.kind);
    expect(kinds).toContain(NOTIFICATION_KIND.newStudent);
    expect(kinds).toContain(NOTIFICATION_KIND.newTeacher);
  });

  it('ordena do mais recente para o mais antigo', () => {
    const feed = buildNotificationFeed({ roleType: 'app_admin', sources });
    expect(feed.items.map((item) => item.createdAt)).toEqual([
      '2026-08-30T10:00:00.000Z',
      '2026-08-29T10:00:00.000Z',
      '2026-08-28T10:00:00.000Z',
    ]);
  });

  it('conta como lido o que é anterior à marca d água', () => {
    const feed = buildNotificationFeed({ roleType: 'app_admin', sources, seenAt: '2026-08-29T10:00:00.000Z' });
    expect(feed.unreadCount).toBe(1);
    expect(feed.items.find((item) => item.kind === NOTIFICATION_KIND.newStudent)?.read).toBe(true);
  });

  it('sem marca d água tudo é não lido', () => {
    expect(buildNotificationFeed({ roleType: 'app_admin', sources }).unreadCount).toBe(3);
  });

  it('respeita o limite antes de contar', () => {
    const feed = buildNotificationFeed({ roleType: 'app_admin', sources, limit: 1 });
    expect(feed.items).toHaveLength(1);
    expect(feed.unreadCount).toBe(1);
  });

  it('descarta registro sem data utilizável', () => {
    const feed = buildNotificationFeed({
      roleType: 'app_admin',
      sources: { pendingApplications: [{ id: 1, createdAt: null, user: null }, { id: 2, createdAt: 'quando der', user: null }] },
    });
    expect(feed.items).toHaveLength(0);
  });

  it('só notifica candidatura já decidida', () => {
    const pending = buildNotificationFeed({
      roleType: 'teacher_pending',
      sources: { ownApplication: { id: 7, reviewStatus: 'pending', reviewedAt: null } },
    });
    expect(pending.items).toHaveLength(0);

    const decided = buildNotificationFeed({ roleType: 'teacher_pending', sources });
    expect(decided.items[0]).toMatchObject({ kind: NOTIFICATION_KIND.applicationDecision, href: '/dashboard', data: { status: 'approved' } });
  });

  it('aponta a tentativa para o quiz respondido', () => {
    const feed = buildNotificationFeed({ roleType: 'teacher', sources });
    expect(feed.items[0]).toMatchObject({ href: '/quizzes/verbos', data: { name: 'ana', quizTitle: 'Verbos', score: 80 } });
  });
});

describe('nome exibido', () => {
  it('prefere o username', () => {
    expect(displayName({ id: 1, username: 'ana', email: 'outra@x.com' })).toBe('ana');
  });

  it('corta o dominio quando o username e um e-mail', () => {
    expect(displayName({ id: 1, username: 'prof.novo04@fluent.local', email: 'prof.novo04@fluent.local' })).toBe('prof.novo04');
  });

  it('cai para a parte local do e-mail', () => {
    expect(displayName({ id: 1, username: '', email: 'bruno.silva@x.com' })).toBe('bruno.silva');
  });

  it('devolve nulo sem dados', () => {
    expect(displayName(null)).toBeNull();
    expect(displayName({ id: 1 })).toBeNull();
  });
});
