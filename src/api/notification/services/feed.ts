import { APP_ROLES, isAdminRole } from '../../../auth/roles';

export const NOTIFICATION_KIND = {
  teacherApplication: 'teacher_application',
  newStudent: 'new_student',
  newTeacher: 'new_teacher',
  quizAttempt: 'quiz_attempt',
  applicationDecision: 'application_decision',
  newQuiz: 'new_quiz',
} as const;

export type NotificationKind = (typeof NOTIFICATION_KIND)[keyof typeof NOTIFICATION_KIND];

export type NotificationItem = {
  id: string;
  kind: NotificationKind;
  createdAt: string;
  read: boolean;
  href: string | null;
  data: Record<string, string | number | null>;
};

export type NotificationFeed = {
  items: NotificationItem[];
  unreadCount: number;
  seenAt: string | null;
};

export type NotificationScope = {
  pendingApplications: boolean;
  newMembers: boolean;
  quizAttempts: boolean;
  ownApplication: boolean;
  newQuizzes: boolean;
};

const EMPTY_SCOPE: NotificationScope = {
  pendingApplications: false,
  newMembers: false,
  quizAttempts: false,
  ownApplication: false,
  newQuizzes: false,
};

export function resolveScope(roleType?: string | null): NotificationScope {
  if (isAdminRole(roleType)) {
    return { ...EMPTY_SCOPE, pendingApplications: true, newMembers: true };
  }
  if (roleType === APP_ROLES.teacher) {
    return { ...EMPTY_SCOPE, quizAttempts: true, ownApplication: true };
  }
  if (roleType === APP_ROLES.teacherPending) {
    return { ...EMPTY_SCOPE, ownApplication: true };
  }
  if (roleType === APP_ROLES.student) {
    return { ...EMPTY_SCOPE, newQuizzes: true };
  }
  return EMPTY_SCOPE;
}

type PersonRow = { id: number | string; username?: string | null; email?: string | null };

type ApplicationRow = {
  id: number | string;
  createdAt?: string | null;
  reviewStatus?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string | null;
  user?: PersonRow | null;
};

type AttemptRow = {
  id: number | string;
  completedAt?: string | null;
  createdAt?: string | null;
  quizTitle?: string | null;
  quizSlug?: string | null;
  score?: number | null;
  user?: PersonRow | null;
};

type MemberRow = PersonRow & { createdAt?: string | null; role?: { type?: string | null } | null };

type QuizRow = {
  id: number | string;
  slug?: string | null;
  title?: string | null;
  targetLanguage?: string | null;
  level?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
};

export type FeedSources = {
  pendingApplications?: ApplicationRow[];
  newMembers?: MemberRow[];
  attempts?: AttemptRow[];
  ownApplication?: ApplicationRow | null;
  newQuizzes?: QuizRow[];
};

export const FEED_LIMIT = 12;

export function displayName(person?: PersonRow | null) {
  if (!person) return null;
  const username = typeof person.username === 'string' ? person.username.trim() : '';
  const email = typeof person.email === 'string' ? person.email.trim() : '';
  const candidate = username || email;
  return candidate ? candidate.split('@')[0] : null;
}

function timestamp(value?: string | null) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

export function buildNotificationFeed(input: {
  roleType?: string | null;
  sources: FeedSources;
  seenAt?: string | null;
  limit?: number;
}): NotificationFeed {
  const scope = resolveScope(input.roleType);
  const seenAt = timestamp(input.seenAt) ?? null;
  const seenTime = seenAt ? Date.parse(seenAt) : 0;
  const items: NotificationItem[] = [];

  if (scope.pendingApplications) {
    for (const application of input.sources.pendingApplications ?? []) {
      const createdAt = timestamp(application.createdAt);
      if (!createdAt) continue;
      items.push({
        id: `${NOTIFICATION_KIND.teacherApplication}:${application.id}`,
        kind: NOTIFICATION_KIND.teacherApplication,
        createdAt,
        read: false,
        href: '/admin/teachers',
        data: { name: displayName(application.user), email: application.user?.email ?? null },
      });
    }
  }

  if (scope.newMembers) {
    for (const member of input.sources.newMembers ?? []) {
      const createdAt = timestamp(member.createdAt);
      if (!createdAt) continue;
      const isTeacher = member.role?.type === APP_ROLES.teacher;
      items.push({
        id: `${isTeacher ? NOTIFICATION_KIND.newTeacher : NOTIFICATION_KIND.newStudent}:${member.id}`,
        kind: isTeacher ? NOTIFICATION_KIND.newTeacher : NOTIFICATION_KIND.newStudent,
        createdAt,
        read: false,
        href: null,
        data: { name: displayName(member), email: member.email ?? null },
      });
    }
  }

  if (scope.quizAttempts) {
    for (const attempt of input.sources.attempts ?? []) {
      const createdAt = timestamp(attempt.completedAt ?? attempt.createdAt);
      if (!createdAt) continue;
      items.push({
        id: `${NOTIFICATION_KIND.quizAttempt}:${attempt.id}`,
        kind: NOTIFICATION_KIND.quizAttempt,
        createdAt,
        read: false,
        href: attempt.quizSlug ? `/quizzes/${attempt.quizSlug}` : '/teacher/quizzes',
        data: {
          name: displayName(attempt.user),
          quizTitle: attempt.quizTitle ?? null,
          score: typeof attempt.score === 'number' ? attempt.score : null,
        },
      });
    }
  }

  if (scope.ownApplication) {
    const application = input.sources.ownApplication;
    const reviewedAt = timestamp(application?.reviewedAt);
    if (application && reviewedAt && application.reviewStatus && application.reviewStatus !== 'pending') {
      items.push({
        id: `${NOTIFICATION_KIND.applicationDecision}:${application.id}`,
        kind: NOTIFICATION_KIND.applicationDecision,
        createdAt: reviewedAt,
        read: false,
        href: '/dashboard',
        data: { status: application.reviewStatus, note: application.reviewNote ?? null },
      });
    }
  }

  if (scope.newQuizzes) {
    for (const quiz of input.sources.newQuizzes ?? []) {
      const createdAt = timestamp(quiz.publishedAt ?? quiz.createdAt);
      if (!createdAt) continue;
      items.push({
        id: `${NOTIFICATION_KIND.newQuiz}:${quiz.id}`,
        kind: NOTIFICATION_KIND.newQuiz,
        createdAt,
        read: false,
        href: quiz.slug ? `/quizzes/${quiz.slug}` : '/quizzes',
        data: {
          title: quiz.title ?? null,
          targetLanguage: quiz.targetLanguage ?? null,
          level: quiz.level ?? null,
        },
      });
    }
  }

  items.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  const limited = items.slice(0, input.limit ?? FEED_LIMIT).map((item) => ({
    ...item,
    read: seenTime > 0 && Date.parse(item.createdAt) <= seenTime,
  }));

  return {
    items: limited,
    unreadCount: limited.filter((item) => !item.read).length,
    seenAt,
  };
}
