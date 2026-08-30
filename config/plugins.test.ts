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
