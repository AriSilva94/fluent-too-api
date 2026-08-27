import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
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
  'strapi::body',
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

export default config;
