const supportedLanguages = ['pt', 'en', 'fr'];

export type TeacherApplicationInput = {
  bio: string;
  experience: string;
  languages: string[];
  credentialUrl?: string;
};

export type TeacherApplicationResult =
  | { ok: true; data: TeacherApplicationInput }
  | { ok: false; error: 'REQUIRED' };

export function validateTeacherApplication(input: unknown): TeacherApplicationResult {
  const value = (input ?? {}) as Record<string, unknown>;
  const bio = String(value.bio ?? '').trim();
  const experience = String(value.experience ?? '').trim();
  // Um multipart com um único campo `languages` chega como string, não como array:
  // sem normalizar, escolher um idioma só era recusado com REQUIRED.
  const rawLanguages = Array.isArray(value.languages)
    ? value.languages
    : value.languages === undefined || value.languages === null
      ? []
      : [value.languages];
  const languages = rawLanguages.filter((language): language is string => supportedLanguages.includes(String(language)));
  const credentialUrl = String(value.credentialUrl ?? '').trim();

  if (!bio || !experience || languages.length === 0) return { ok: false, error: 'REQUIRED' };

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
