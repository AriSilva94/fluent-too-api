import { describe, expect, it, vi } from 'vitest';
import profileRateLimit from './profile-rate-limit';

function createStrapi(rateLimit: any) {
  return { middleware: vi.fn(() => rateLimit) } as any;
}

function createContext(path: string) {
  return { method: 'POST', path } as any;
}

describe('rate limit das rotas de perfil', () => {
  it('delega ao rateLimit do users-permissions nas rotas de perfil', async () => {
    const inner = vi.fn(async (_ctx: any, next: any) => next());
    const factory = vi.fn(() => inner);
    const strapi = createStrapi(factory);
    const middleware = profileRateLimit({} as any, { strapi } as any);
    const next = vi.fn();

    await middleware(createContext('/api/profile/teacher'), next);

    expect(strapi.middleware).toHaveBeenCalledWith('plugin::users-permissions.rateLimit');
    expect(inner).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledOnce();
  });

  it('cobre as três rotas de perfil, inclusive com barra final', async () => {
    const inner = vi.fn(async (_ctx: any, next: any) => next());
    const strapi = createStrapi(() => inner);
    const middleware = profileRateLimit({} as any, { strapi } as any);

    for (const path of ['/api/profile/student', '/api/profile/teacher/', '/api/profile/application']) {
      await middleware(createContext(path), vi.fn());
    }

    expect(inner).toHaveBeenCalledTimes(3);
  });

  it('não limita outras rotas', async () => {
    const inner = vi.fn();
    const strapi = createStrapi(() => inner);
    const middleware = profileRateLimit({} as any, { strapi } as any);
    const next = vi.fn();

    await middleware(createContext('/api/quiz-attempts'), next);

    expect(inner).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
  });

  it('segue adiante se o middleware do plugin não estiver disponível', async () => {
    const strapi = { middleware: vi.fn(() => undefined) } as any;
    const middleware = profileRateLimit({} as any, { strapi } as any);
    const next = vi.fn();

    await middleware(createContext('/api/profile/teacher'), next);

    expect(next).toHaveBeenCalledOnce();
  });
});
