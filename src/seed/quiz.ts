import path from 'node:path';
import type { Core } from '@strapi/strapi';
import { QUIZZES, LEVEL_IMAGE_FILES } from './quizzes';
import { findContentOwner, shouldSeed, uploadLocalImage } from './content';

const UID = 'api::quiz.quiz';

const LEVELS_DIR = path.join(process.cwd(), 'public', 'seed-levels');

async function uploadLevelImages(strapi: Core.Strapi): Promise<Record<string, number | null>> {
  const porNivel: Record<string, number | null> = {};

  for (const [nivel, arquivo] of Object.entries(LEVEL_IMAGE_FILES)) {
    porNivel[nivel] = await uploadLocalImage(
      strapi,
      path.join(LEVELS_DIR, arquivo),
      arquivo,
      `Ilustracao do nivel ${nivel}`
    ).catch(() => null);
  }

  return porNivel;
}

export async function seedQuizzesWhenEmpty(strapi: Core.Strapi) {
  const total = await strapi.db.query(UID).count();
  if (!shouldSeed(total)) return;

  const owner = await findContentOwner(strapi);
  if (!owner) {
    strapi.log.warn('Seed de quizzes ignorado: usuario dono do conteudo nao existe neste ambiente.');
    return;
  }

  const imagemPorNivel = await uploadLevelImages(strapi);

  let criados = 0;
  for (const quiz of QUIZZES) {
    await strapi.documents(UID as never).create({
      data: { ...quiz, owner: owner.id, image: imagemPorNivel[quiz.level] ?? undefined } as never,
      status: 'published',
    });
    criados += 1;
  }

  strapi.log.info(`Seed de quizzes: ${criados} criados para ${owner.username}.`);
}
