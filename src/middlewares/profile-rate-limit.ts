import type { Core } from '@strapi/strapi';
import { normalizePath } from './teacher-attachment-limit';

const PROFILE_PATHS = ['/api/profile/student', '/api/profile/teacher', '/api/profile/application'];

const middleware: Core.MiddlewareFactory = (_config, { strapi }) => {
  let rateLimit: ((ctx: any, next: () => Promise<any>) => Promise<any>) | undefined;

  return async (ctx, next) => {
    if (!PROFILE_PATHS.includes(normalizePath(ctx.path))) return next();

    if (!rateLimit) {
      const factory = strapi.middleware('plugin::users-permissions.rateLimit') as any;
      if (!factory) return next();
      rateLimit = factory({}, { strapi });
    }

    return rateLimit!(ctx, next);
  };
};

export default middleware;
