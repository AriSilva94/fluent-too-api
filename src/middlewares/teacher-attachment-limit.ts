import type { Core } from '@strapi/strapi';

const TEACHER_REGISTER_PATH = '/api/profile/teacher';

export const MAX_TEACHER_REGISTER_BODY_BYTES = 5 * 1024 * 1024 + 256 * 1024;

export const ATTACHMENT_ERROR = { fileTooLarge: 'FILE_TOO_LARGE', lengthRequired: 'LENGTH_REQUIRED' } as const;

export type AttachmentError = (typeof ATTACHMENT_ERROR)[keyof typeof ATTACHMENT_ERROR];

export type ContentLengthCheck =
  | { ok: true }
  | { ok: false; error: AttachmentError };

export function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

export function checkContentLength(header: string | undefined, maxBytes: number): ContentLengthCheck {
  if (header === undefined) return { ok: false, error: ATTACHMENT_ERROR.lengthRequired };

  const length = Number(header);
  if (!Number.isFinite(length) || length < 0) return { ok: false, error: ATTACHMENT_ERROR.lengthRequired };
  if (length > maxBytes) return { ok: false, error: ATTACHMENT_ERROR.fileTooLarge };

  return { ok: true };
}

const middleware: Core.MiddlewareFactory = () => async (ctx, next) => {
  if (ctx.method !== 'POST' || normalizePath(ctx.path) !== TEACHER_REGISTER_PATH) return next();

  const result = checkContentLength(ctx.request.headers['content-length'], MAX_TEACHER_REGISTER_BODY_BYTES);
  if (!result.ok) {
    ctx.status = result.error === ATTACHMENT_ERROR.fileTooLarge ? 413 : 411;
    ctx.body = { error: { status: ctx.status, name: 'PayloadTooLarge', message: result.error } };
    return;
  }

  return next();
};

export default middleware;
