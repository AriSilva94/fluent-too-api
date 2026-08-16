import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedExecutableTypes = [
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      jwtSecret: env('JWT_SECRET'),
      accessTokenLifespan: 600,
      maxRefreshTokenLifespan: 2592000,
      idleRefreshTokenLifespan: 1209600,
      maxSessionLifespan: 2592000,
      idleSessionLifespan: 1209600,
      sessions: {
        httpOnly: false,
      },
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'localhost'),
        port: env.int('SMTP_PORT', 1025),
        secure: env.bool('SMTP_SECURE', false),
        auth:
          env('SMTP_USER') && env('SMTP_PASS')
            ? {
                user: env('SMTP_USER'),
                pass: env('SMTP_PASS'),
              }
            : undefined,
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'Fluent Too <no-reply@example.com>'),
        defaultReplyTo: env('EMAIL_REPLY_TO', env('EMAIL_FROM', 'Fluent Too <no-reply@example.com>')),
      },
    },
  },
  upload: {
    config: {
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes: deniedExecutableTypes,
      },
    },
  },
});

export default config;
