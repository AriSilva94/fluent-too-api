import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  const cdnUrl = env('S3_PUBLIC_URL', undefined);
  const mediaSources = ["'self'", 'data:', 'blob:', ...(cdnUrl ? [cdnUrl] : [])];

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'img-src': mediaSources,
            'media-src': mediaSources,
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: {
        origin: (env('CORS_ORIGINS', 'http://localhost:3000') as string).split(',').map((origin) => origin.trim()),
        methods: ['GET', 'POST', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization', 'Origin'],
        credentials: true,
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    // Recusa o multipart do cadastro de professor por content-length ANTES do
    // parser gravar o arquivo em disco.
    'global::teacher-attachment-limit',
    // Limita as rotas de perfil por IP antes do parser: o `rateLimit` de rota só é
    // composto depois de `authenticate`/`authorize` e não alcança a rajada anônima.
    'global::profile-rate-limit',
    'strapi::body',
    // Remove o arquivo temporário do anexo em TODA saída da rota — inclusive quando a
    // autenticação responde 401/403 e o controller nunca chega a rodar.
    'global::teacher-attachment-cleanup',
    {
      name: 'strapi::session',
      config: {
        // Dokploy/Traefik terminates TLS in front of the container; the app only
        // ever sees plain HTTP internally, so koa-session's default
        // `secure: NODE_ENV === 'production'` throws instead of setting the
        // cookie. This session is only used for the short-lived OAuth
        // grant handshake, not the app's real auth cookies.
        secure: false,
      },
    },
    'strapi::favicon',
    'strapi::public',
  ];
};

export default config;
