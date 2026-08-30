import { rm } from 'node:fs/promises';
import type { Core } from '@strapi/strapi';
import { normalizePath } from './teacher-attachment-limit';

const TEACHER_REGISTER_PATH = '/api/profile/teacher';

/**
 * Remove o arquivo temporário gravado pelo formidable. A limpeza do próprio
 * `strapi::body` só cobre o campo `files`; o nosso campo se chama `attachment`.
 */
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

/**
 * A limpeza NÃO pode viver no controller: `strapi::body` é global e roda antes do
 * roteador, então o formidable já gravou o anexo em disco quando a autenticação ou a
 * permissão da rota respondem 401/403 — e nesse caso o controller nunca roda. Sem
 * isto, um laço anônimo de uploads (abaixo do teto de content-length) enche o disco
 * sem conta e sem token.
 *
 * Precisa ser global (e não middleware de rota): os middlewares de rota do Strapi são
 * compostos DEPOIS de `authenticate`/`authorize`, ou seja, também não rodariam no 401.
 */
const middleware: Core.MiddlewareFactory = (_config, { strapi }) => async (ctx, next) => {
  if (ctx.method !== 'POST' || normalizePath(ctx.path) !== TEACHER_REGISTER_PATH) return next();

  try {
    await next();
  } finally {
    await removeTempFile(strapi, (ctx.request as any).files?.attachment);
  }
};

export default middleware;
