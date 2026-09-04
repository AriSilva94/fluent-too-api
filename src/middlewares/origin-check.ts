const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

// Only apply protection for API routes (skip admin/content-manager)
function isProtected(ctx: any) {
  if (!ctx.request.path.startsWith('/api/')) return false;
  if (ctx.request.path.startsWith('/api/connect/')) return false;
  return !SAFE_METHODS.includes(ctx.request.method);
}

export default (config: any, { strapi }: any) => {
  return async (ctx: any, next: any) => {
    if (isProtected(ctx)) {
      const origin = ctx.request.headers.origin;
      const referer = ctx.request.headers.referer;

      const allowedOrigins = process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
        : ['http://localhost:3000'];

      let isAllowed = false;

      // If there's an Origin, validate it
      if (origin) {
        isAllowed = allowedOrigins.includes(origin);
      }
      // If no Origin but Referer, validate Referer
      else if (referer) {
        isAllowed = allowedOrigins.some(o => referer.startsWith(o));
      }
      // If neither (Postman/Server-to-Server), let it through or block based on strictness.
      // Usually S2S doesn't send these, so we allow it but enforce CORS for browsers.
      else {
        isAllowed = true;
      }

      if (!isAllowed) {
        return ctx.unauthorized('Origem da requisição não permitida.');
      }
    }

    await next();
  };
};
