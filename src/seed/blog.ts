import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import type { Core } from '@strapi/strapi';
import { BLOG_OWNER_EMAIL, BLOG_POSTS, COVER_IMAGES } from './blog-posts';

const UID = 'api::blog-post.blog-post';

export function shouldSeedBlog(existingCount: number): boolean {
  return existingCount === 0;
}

async function findOwner(strapi: Core.Strapi) {
  return strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: BLOG_OWNER_EMAIL } });
}

async function uploadCover(strapi: Core.Strapi, slug: string): Promise<number | null> {
  const origem = COVER_IMAGES[slug];
  if (!origem) return null;

  const resposta = await fetch(origem);
  if (!resposta.ok) return null;

  const nomeArquivo = `blog-cover-${slug}.jpg`;
  const caminho = path.join(os.tmpdir(), `${Date.now()}-${nomeArquivo}`);
  const buffer = Buffer.from(await resposta.arrayBuffer());
  await fs.writeFile(caminho, buffer);

  try {
    const enviado = await strapi.plugin('upload').service('upload').upload({
      data: { fileInfo: { alternativeText: `Cover image for ${slug}`, caption: slug, name: nomeArquivo } },
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

export async function seedBlogWhenEmpty(strapi: Core.Strapi) {
  const total = await strapi.db.query(UID).count();
  if (!shouldSeedBlog(total)) return;

  const owner = await findOwner(strapi);
  if (!owner) {
    strapi.log.warn(`Seed de blog ignorado: usuario ${BLOG_OWNER_EMAIL} nao existe neste ambiente.`);
    return;
  }

  const capaPorSlug: Record<string, number | null> = {};
  for (const slug of Object.keys(COVER_IMAGES)) {
    capaPorSlug[slug] = await uploadCover(strapi, slug).catch(() => null);
  }

  let criados = 0;
  for (const post of BLOG_POSTS) {
    await strapi.documents(UID as never).create({
      data: {
        ...post,
        author: owner.username,
        owner: owner.id,
        coverImage: capaPorSlug[post.slug] ?? undefined,
      } as never,
      status: 'published',
    });
    criados += 1;
  }

  strapi.log.info(`Seed de blog: ${criados} posts criados para ${owner.username}.`);
}
