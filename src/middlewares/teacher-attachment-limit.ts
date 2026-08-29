import type { Core } from '@strapi/strapi';

const TEACHER_REGISTER_PATH = '/api/profile/teacher';

// 5 MB de anexo (o mesmo limite de `validateAttachmentFile`) + folga para os
// demais campos de texto do multipart e para os cabeçalhos de cada parte.
export const MAX_TEACHER_REGISTER_BODY_BYTES = 5 * 1024 * 1024 + 256 * 1024;

export type ContentLengthCheck =
  | { ok: true }
  | { ok: false; error: 'FILE_TOO_LARGE' | 'LENGTH_REQUIRED' };

/**
 * O middleware `strapi::body` grava o arquivo em disco antes de qualquer validação
 * de aplicação (o teto real seria o padrão de 200 MB do formidable). Como o corpo é
 * consumido pelo parser global, que roda ANTES do roteador, a recusa precisa
 * acontecer aqui — antes dos bytes serem escritos.
 */
export function checkContentLength(header: string | undefined, maxBytes: number): ContentLengthCheck {
  if (header === undefined) return { ok: false, error: 'LENGTH_REQUIRED' };

  const length = Number(header);
  if (!Number.isFinite(length) || length < 0) return { ok: false, error: 'LENGTH_REQUIRED' };
  if (length > maxBytes) return { ok: false, error: 'FILE_TOO_LARGE' };

  return { ok: true };
}

const middleware: Core.MiddlewareFactory = () => async (ctx, next) => {
  if (ctx.method !== 'POST' || ctx.path !== TEACHER_REGISTER_PATH) return next();

  const result = checkContentLength(ctx.request.headers['content-length'], MAX_TEACHER_REGISTER_BODY_BYTES);
  if (!result.ok) {
    ctx.status = result.error === 'FILE_TOO_LARGE' ? 413 : 411;
    ctx.body = { error: { status: ctx.status, name: 'PayloadTooLarge', message: result.error } };
    return;
  }

  return next();
};

export default middleware;
