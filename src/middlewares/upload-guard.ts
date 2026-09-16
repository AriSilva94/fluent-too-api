import type { Core } from '@strapi/strapi';
import { normalizePath } from './teacher-attachment-limit';

const UPLOAD_PATH = '/api/upload';
const ENTRY_LINK_FIELDS = ['ref', 'refId', 'field', 'path'];

export function isForbiddenUploadRequest(ctx: { method: string; path: string; query?: Record<string, unknown>; request?: { body?: unknown } }) {
  if (ctx.method !== 'POST' || normalizePath(ctx.path) !== UPLOAD_PATH) return false;

  if (ctx.query && ctx.query.id !== undefined) return true;

  const body = ctx.request?.body;
  if (!body || typeof body !== 'object') return false;
  return ENTRY_LINK_FIELDS.some((field) => field in body);
}

const middleware: Core.MiddlewareFactory = () => async (ctx, next) => {
  if (isForbiddenUploadRequest(ctx as any)) return ctx.forbidden('UPLOAD_OPERATION_NOT_ALLOWED');
  return next();
};

export default middleware;
