import { describe, expect, it } from 'vitest';
import pluginsConfig from './plugins';

function createEnv(vars: Record<string, string | undefined>) {
  const env = ((key: string, defaultValue?: unknown) => (key in vars ? vars[key] : defaultValue)) as any;
  env.bool = (key: string, defaultValue?: boolean) => {
    const value = vars[key];
    if (value === undefined || value === '') return defaultValue;
    return value === 'true';
  };
  env.int = (key: string, defaultValue?: number) => {
    const value = vars[key];
    if (value === undefined || value === '') return defaultValue;
    return Number.parseInt(value, 10);
  };
  return env;
}

describe('plugins config', () => {
  it('configura upload no R2 sem enviar ACL vazia', () => {
    const config = pluginsConfig({
      env: createEnv({
        S3_BUCKET: 'fluent-too',
        S3_ACCESS_KEY_ID: 'access-key',
        S3_ACCESS_SECRET: 'secret-key',
        S3_ENDPOINT: 'https://account.r2.cloudflarestorage.com',
        S3_PUBLIC_URL: 'https://cdn-dev.fluent-too.com',
        S3_ROOT_PATH: 'assets/images',
        S3_REGION: 'auto',
        S3_FORCE_PATH_STYLE: 'true',
        S3_ACL: '',
      }),
    } as any) as any;

    const upload = config.upload.config;

    expect(upload.provider).toBe('aws-s3');
    expect(upload.providerOptions.s3Options.params).toMatchObject({
      Bucket: 'fluent-too',
      signedUrlExpires: 900,
    });
    expect(upload.providerOptions.s3Options.params).not.toHaveProperty('ACL');
  });
});

describe('validação do callback do Google', () => {
  function validate(callback: string) {
    const config = pluginsConfig({
      env: createEnv({ FRONTEND_PUBLIC_URL: 'https://fluent-too.com' }),
    } as any) as any;
    return () => config['users-permissions'].config.callback.validate(callback);
  }

  it('aceita callback do front com nonce no caminho', () => {
    expect(validate('https://fluent-too.com/api/auth/google/callback/0123456789abcdef0123456789abcdef')).not.toThrow();
  });

  it('recusa callback sem nonce, de outra origem ou com caminho extra', () => {
    expect(validate('https://fluent-too.com/api/auth/google/callback')).toThrow();
    expect(validate('https://evil.example/api/auth/google/callback/0123456789abcdef0123456789abcdef')).toThrow();
    expect(validate('https://fluent-too.com/api/auth/google/callback/0123456789abcdef0123456789abcdef/x')).toThrow();
  });
});
