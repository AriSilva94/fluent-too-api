const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const supportedLanguages = ['pt', 'en', 'fr'];

export type TeacherRegistrationInput = {
  email: string;
  password: string;
  bio: string;
  experience: string;
  languages: string[];
  credentialUrl?: string;
  attachment?: number;
};

export type TeacherRegistrationResult =
  | { ok: true; data: TeacherRegistrationInput }
  | { ok: false; error: 'REQUIRED' | 'INVALID_EMAIL' | 'WEAK_PASSWORD' };

export function validateTeacherRegistration(input: unknown): TeacherRegistrationResult {
  const value = (input ?? {}) as Record<string, unknown>;
  const email = String(value.email ?? '').trim().toLowerCase();
  const password = String(value.password ?? '');
  const bio = String(value.bio ?? '').trim();
  const experience = String(value.experience ?? '').trim();
  const languages = Array.isArray(value.languages)
    ? value.languages.filter((language): language is string => supportedLanguages.includes(String(language)))
    : [];
  const credentialUrl = String(value.credentialUrl ?? '').trim();
  const attachment = Number(value.attachment);

  if (!emailPattern.test(email)) return { ok: false, error: 'INVALID_EMAIL' };
  if (password.length < 8) return { ok: false, error: 'WEAK_PASSWORD' };
  if (!bio || !experience || languages.length === 0) return { ok: false, error: 'REQUIRED' };

  return {
    ok: true,
    data: {
      email,
      password,
      bio,
      experience,
      languages,
      ...(credentialUrl ? { credentialUrl } : {}),
      ...(Number.isFinite(attachment) && attachment > 0 ? { attachment } : {}),
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
