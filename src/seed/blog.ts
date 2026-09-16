import type { Core } from '@strapi/strapi';
import { BLOG_POSTS, COVER_IMAGES } from './blog-posts';
import { findContentOwner, shouldSeed, uploadRemoteImage } from './content';

const UID = 'api::blog-post.blog-post';

export async function seedBlogWhenEmpty(strapi: Core.Strapi) {
  const total = await strapi.db.query(UID).count();
  if (!shouldSeed(total)) return;

  const owner = await findContentOwner(strapi);
  if (!owner) {
    strapi.log.warn('Seed de blog ignorado: usuario dono do conteudo nao existe neste ambiente.');
    return;
  }

  const capaPorSlug: Record<string, number | null> = {};
  for (const slug of Object.keys(COVER_IMAGES)) {
    capaPorSlug[slug] = await uploadRemoteImage(strapi, COVER_IMAGES[slug], `blog-cover-${slug}.jpg`, `Capa de ${slug}`).catch(() => null);
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
