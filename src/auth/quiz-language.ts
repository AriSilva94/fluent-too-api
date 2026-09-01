import { APP_ROLES, isAdminRole } from './roles';

export const TARGET_LANGUAGE = { pt: 'pt', en: 'en', fr: 'fr' } as const;

export const SUPPORTED_LANGUAGES = [TARGET_LANGUAGE.pt, TARGET_LANGUAGE.en, TARGET_LANGUAGE.fr] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

type TeacherLike = {
  id: number | string;
  role?: { type?: string } | null;
  teachingLanguages?: unknown;
};

export function normalizeTeachingLanguages(value: unknown): SupportedLanguage[] {
  const list = Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
  const supported = list.filter((language): language is SupportedLanguage =>
    SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)
  );
  return Array.from(new Set(supported));
}

export function resolveQuizLanguages(
  payload: Record<string, unknown> | undefined | null,
  entries: { targetLanguage?: unknown }[]
): SupportedLanguage[] {
  const current = entries.map((entry) => entry.targetLanguage);
  const requested = (payload ?? {}).targetLanguage;
  return normalizeTeachingLanguages([...current, requested]);
}

export function canManageQuizLanguage(user: TeacherLike, languages: SupportedLanguage[]): boolean {
  if (isAdminRole(user.role?.type)) return true;
  if (user.role?.type !== APP_ROLES.teacher) return false;
  if (languages.length === 0) return false;

  const approved = normalizeTeachingLanguages(user.teachingLanguages);
  return languages.every((language) => approved.includes(language));
}
