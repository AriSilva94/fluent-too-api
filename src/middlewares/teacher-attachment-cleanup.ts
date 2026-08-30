import { rm } from 'node:fs/promises';
import type { Core } from '@strapi/strapi';
import { normalizePath } from './teacher-attachment-limit';

const TEACHER_REGISTER_PATH = '/api/profile/teacher';

export async function removeTempFile(strapi: Core.Strapi, file: any) {
  const files = Array.isArray(file) ? file : [file];

  for (const entry of files) {
    const filepath = entry?.filepath ?? entry?.path;
    if (!filepath) continue;
    try {
      await rm(filepath, { force: true });
    } catch (cleanupError) {
      strapi.log?.error?.('Falha ao remover arquivo temporário da candidatura de professor', cleanupError);
    }
  }
}

const middleware: Core.MiddlewareFactory = (_config, { strapi }) => async (ctx, next) => {
  if (ctx.method !== 'POST' || normalizePath(ctx.path) !== TEACHER_REGISTER_PATH) return next();

  try {
    await next();
  } finally {
    await removeTempFile(strapi, (ctx.request as any).files?.attachment);
  }
};

export default middleware;
