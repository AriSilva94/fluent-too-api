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
    'global::origin-check',
    'global::teacher-attachment-limit',
    'global::profile-rate-limit',
    'strapi::body',
    'global::teacher-attachment-cleanup',
    {
      name: 'strapi::session',
      config: {
        secure: false,
      },
    },
    'strapi::favicon',
    'strapi::public',
  ];
};

export default config;
