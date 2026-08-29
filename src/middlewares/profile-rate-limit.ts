import type { Core } from '@strapi/strapi';
import { normalizePath } from './teacher-attachment-limit';

const PROFILE_PATHS = ['/api/profile/student', '/api/profile/teacher', '/api/profile/application'];

/**
 * O `rateLimit` declarado em `routes/profile.ts` não cobre o caso que importa aqui:
 * o Strapi compõe os middlewares de rota DEPOIS de `authenticate`/`authorize`, então
 * numa rajada anônima (401/403) ele nunca chega a rodar — e o multipart já foi lido e
 * gravado em disco por `strapi::body`, que é global e roda antes do roteador.
 *
 * Por isso o mesmo middleware do users-permissions é aplicado também aqui, global e
 * restrito a estas rotas, ANTES do parser. É o único ponto em que o limite alcança
 * quem nem tem conta.
 */
const middleware: Core.MiddlewareFactory = (_config, { strapi }) => {
  let rateLimit: ((ctx: any, next: () => Promise<any>) => Promise<any>) | undefined;

  return async (ctx, next) => {
    if (!PROFILE_PATHS.includes(normalizePath(ctx.path))) return next();

    // Resolvido sob demanda: no momento em que os middlewares globais são
    // instanciados o plugin users-permissions ainda não registrou o dele.
    if (!rateLimit) {
      const factory = strapi.middleware('plugin::users-permissions.rateLimit') as any;
      if (!factory) return next();
      rateLimit = factory({}, { strapi });
    }

    return rateLimit!(ctx, next);
  };
};

export default middleware;
