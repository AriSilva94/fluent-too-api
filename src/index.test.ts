import type { Core } from '@strapi/strapi';
import { afterEach, describe, expect, it, vi } from 'vitest';
import app from './index';

vi.mock('./auth/access-control', () => ({ ensureAppAccessControl: vi.fn() }));
vi.mock('./database/indexes', () => ({ dropObsoleteIndexes: vi.fn(), ensureAppIndexes: vi.fn() }));
vi.mock('./upload/webp', () => ({ patchUploadServiceForWebp: vi.fn() }));
vi.mock('./seed/blog', () => ({ seedBlogWhenEmpty: vi.fn().mockResolvedValue(undefined) }));
vi.mock('./seed/quiz', () => ({ seedQuizzesWhenEmpty: vi.fn().mockResolvedValue(undefined) }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

async function googleCallback(profile: Record<string, unknown>, ok = true) {
  vi.stubEnv('GOOGLE_CLIENT_ID', 'test-client');
  vi.stubEnv('GOOGLE_CLIENT_SECRET', 'test-secret');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok, json: async () => profile }));
  const add = vi.fn();
  const strapi = {
    store: () => ({ get: async () => ({}), set: vi.fn() }),
    config: { get: () => 'https://api.example.com' },
    plugin: () => ({ service: () => ({ add }) }),
  } as unknown as Core.Strapi;

  await app.bootstrap({ strapi });
  expect(add).toHaveBeenCalledWith('google', expect.objectContaining({ enabled: true }));
  return add.mock.calls[0][1].authCallback({ accessToken: 'test-token' });
}

describe('validação da identidade Google', () => {
  it.each([true, 'true'])('aceita e-mail verificado com valor %s', async (emailVerified) => {
    await expect(googleCallback({
      aud: 'test-client', email: 'user@example.com', email_verified: emailVerified,
    })).resolves.toEqual({ username: 'user', email: 'user@example.com' });
  });

  it.each([false, 'false', undefined, null, '', 1])('rejeita verificação inválida: %s', async (emailVerified) => {
    await expect(googleCallback({
      aud: 'test-client', email: 'user@example.com', email_verified: emailVerified,
    })).rejects.toThrow('Invalid Google identity');
  });

  it('rejeita token de outro aplicativo', async () => {
    await expect(googleCallback({
      aud: 'other-client', email: 'user@example.com', email_verified: 'true',
    })).rejects.toThrow('Invalid Google identity');
  });

  it('rejeita perfil sem e-mail', async () => {
    await expect(googleCallback({ aud: 'test-client', email_verified: 'true' }))
      .rejects.toThrow('Invalid Google identity');
  });

  it('rejeita token recusado pelo Google', async () => {
    await expect(googleCallback({}, false)).rejects.toThrow('Invalid Google token');
  });
});
