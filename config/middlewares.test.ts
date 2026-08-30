import { describe, expect, it } from 'vitest';
import middlewaresConfig from './middlewares';

function createEnv(vars: Record<string, string | undefined>) {
  return ((key: string, defaultValue?: unknown) => (key in vars ? vars[key] : defaultValue)) as any;
}

describe('middlewares config', () => {
  it('permite carregar midia do CDN configurado', () => {
    const middlewares = middlewaresConfig({
      env: createEnv({
        CORS_ORIGINS: 'http://localhost:3000',
        S3_PUBLIC_URL: 'https://cdn-dev.fluent-too.com',
      }),
    } as any) as any[];

    const security = middlewares.find((middleware) => middleware.name === 'strapi::security');

    expect(security.config.contentSecurityPolicy.directives['img-src']).toContain('https://cdn-dev.fluent-too.com');
    expect(security.config.contentSecurityPolicy.directives['media-src']).toContain('https://cdn-dev.fluent-too.com');
  });
});
