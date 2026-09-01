import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import type { Core } from '@strapi/strapi';

export const CONTENT_OWNER_EMAIL = 'fluentoo.ish@gmail.com';

export function shouldSeed(existingCount: number): boolean {
  return existingCount === 0;
}

export async function findContentOwner(strapi: Core.Strapi) {
  return strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: CONTENT_OWNER_EMAIL } });
}

export async function uploadRemoteImage(
  strapi: Core.Strapi,
  origem: string,
  nomeArquivo: string,
  legenda: string
): Promise<number | null> {
  const resposta = await fetch(origem);
  if (!resposta.ok) return null;

  const caminho = path.join(os.tmpdir(), `${Date.now()}-${nomeArquivo}`);
  const buffer = Buffer.from(await resposta.arrayBuffer());
  await fs.writeFile(caminho, buffer);

  try {
    const enviado = await strapi.plugin('upload').service('upload').upload({
      data: { fileInfo: { alternativeText: legenda, caption: legenda, name: nomeArquivo } },
      files: {
        filepath: caminho,
        originalFilename: nomeArquivo,
        mimetype: resposta.headers.get('content-type') ?? 'image/jpeg',
        size: buffer.length,
      },
    });

    const arquivo = Array.isArray(enviado) ? enviado[0] : enviado;
    return arquivo?.id ?? null;
  } finally {
    await fs.unlink(caminho).catch(() => undefined);
  }
}

export async function uploadLocalImage(
  strapi: Core.Strapi,
  caminho: string,
  nomeArquivo: string,
  legenda: string
): Promise<number | null> {
  const conteudo = await fs.readFile(caminho).catch(() => null);
  if (!conteudo) return null;

  const enviado = await strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: { alternativeText: legenda, caption: legenda, name: nomeArquivo } },
    files: {
      filepath: caminho,
      originalFilename: nomeArquivo,
      mimetype: nomeArquivo.endsWith('.svg') ? 'image/svg+xml' : 'image/png',
      size: conteudo.length,
    },
  });

  const arquivo = Array.isArray(enviado) ? enviado[0] : enviado;
  return arquivo?.id ?? null;
}
