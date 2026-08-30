import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/avif',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedExecutableTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const useS3Upload = Boolean(env('S3_BUCKET') && env('S3_ACCESS_KEY_ID') && env('S3_ACCESS_SECRET'));
  const s3Acl = env('S3_ACL', undefined);

  return {
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
        callback: {
          validate(callback: string) {
            const frontendUrl = env('FRONTEND_PUBLIC_URL', 'http://localhost:3000');
            let uCallback: URL;
            let uFrontend: URL;

            try {
              uCallback = new URL(callback);
              uFrontend = new URL(frontendUrl);
            } catch {
              throw new Error('The callback is not a valid URL');
            }

            if (uCallback.origin !== uFrontend.origin) {
              throw new Error(`Forbidden callback provided: origin doesn't match FRONTEND_PUBLIC_URL.`);
            }

            if (uCallback.pathname !== '/api/auth/google/callback') {
              throw new Error(`Forbidden callback provided: unexpected pathname.`);
            }
          },
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
        ...(useS3Upload
          ? {
              provider: 'aws-s3',
              providerOptions: {
                baseUrl: env('S3_PUBLIC_URL'),
                rootPath: env('S3_ROOT_PATH', undefined),
                s3Options: {
                  endpoint: env('S3_ENDPOINT', undefined),
                  region: env('S3_REGION', 'auto'),
                  forcePathStyle: env.bool('S3_FORCE_PATH_STYLE', true),
                  credentials: {
                    accessKeyId: env('S3_ACCESS_KEY_ID'),
                    secretAccessKey: env('S3_ACCESS_SECRET'),
                  },
                  params: {
                    Bucket: env('S3_BUCKET'),
                    signedUrlExpires: env.int('S3_SIGNED_URL_EXPIRES', 900),
                    ...(s3Acl ? { ACL: s3Acl } : {}),
                  },
                },
              },
              actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
              },
            }
          : {}),
        security: {
          allowedTypes: allowedMediaTypes,
          deniedTypes: deniedExecutableTypes,
        },
      },
    },
  };
};

export default config;
