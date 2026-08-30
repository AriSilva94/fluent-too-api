const supportedLanguages = ['pt', 'en', 'fr'];

export type TeacherApplicationInput = {
  bio: string;
  experience: string;
  languages: string[];
  credentialUrl?: string;
};

export type TeacherApplicationResult =
  | { ok: true; data: TeacherApplicationInput }
  | { ok: false; error: 'REQUIRED' | 'INVALID_URL' | 'TOO_LONG' };

const MAX_BIO_LENGTH = 2000;
const MAX_EXPERIENCE_LENGTH = 2000;
const MAX_CREDENTIAL_URL_LENGTH = 2048;

export function isHttpUrl(value: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }

  return parsed.protocol === 'http:' || parsed.protocol === 'https:';
}

export function validateTeacherApplication(input: unknown): TeacherApplicationResult {
  const value = (input ?? {}) as Record<string, unknown>;
  const bio = String(value.bio ?? '').trim();
  const experience = String(value.experience ?? '').trim();
  const rawLanguages = Array.isArray(value.languages)
    ? value.languages
    : value.languages === undefined || value.languages === null
      ? []
      : [value.languages];
  const languages = rawLanguages.filter((language): language is string => supportedLanguages.includes(String(language)));
  const credentialUrl = String(value.credentialUrl ?? '').trim();

  if (!bio || !experience || languages.length === 0) return { ok: false, error: 'REQUIRED' };
  if (bio.length > MAX_BIO_LENGTH || experience.length > MAX_EXPERIENCE_LENGTH || credentialUrl.length > MAX_CREDENTIAL_URL_LENGTH) {
    return { ok: false, error: 'TOO_LONG' };
  }
  if (credentialUrl && !isHttpUrl(credentialUrl)) return { ok: false, error: 'INVALID_URL' };

  return {
    ok: true,
    data: {
      bio,
      experience,
      languages,
      ...(credentialUrl ? { credentialUrl } : {}),
    },
  };
}

const MAX_ATTACHMENT_SIZE_BYTES = 5 * 1024 * 1024;
const allowedAttachmentMimeTypes = ['application/pdf', 'image/png', 'image/jpeg'];

export type AttachmentFileLike = {
  size?: number;
  mimetype?: string;
  type?: string;
};

export type AttachmentValidationResult =
  | { ok: true }
  | { ok: false; error: 'FILE_TOO_LARGE' | 'INVALID_FILE_TYPE' };

export function validateAttachmentFile(file: AttachmentFileLike): AttachmentValidationResult {
  const mimetype = file.mimetype ?? file.type ?? '';
  const size = file.size ?? 0;

  if (size > MAX_ATTACHMENT_SIZE_BYTES) return { ok: false, error: 'FILE_TOO_LARGE' };
  if (!allowedAttachmentMimeTypes.includes(mimetype)) return { ok: false, error: 'INVALID_FILE_TYPE' };

  return { ok: true };
}
