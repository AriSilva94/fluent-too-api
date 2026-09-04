import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import originCheck from './origin-check';

const originalCorsOrigins = process.env.CORS_ORIGINS;

function createContext(path: string, method = 'POST', headers: Record<string, string> = {}) {
  return {
    request: { path, method, headers },
    unauthorized: vi.fn(),
  } as any;
}

function run(ctx: any) {
  const middleware = originCheck({} as any, { strapi: {} } as any);
  return middleware(ctx, vi.fn(async () => {}));
}

describe('validacao de origem', () => {
  beforeEach(() => {
    process.env.CORS_ORIGINS = 'https://dev.fluent-too.com';
  });

  afterEach(() => {
    if (originalCorsOrigins === undefined) delete process.env.CORS_ORIGINS;
    else process.env.CORS_ORIGINS = originalCorsOrigins;
  });

  it('bloqueia escrita vinda de origem desconhecida', async () => {
    const ctx = createContext('/api/quiz-attempts', 'POST', { origin: 'https://evil.example' });

    await run(ctx);

    expect(ctx.unauthorized).toHaveBeenCalledWith('Origem da requisição não permitida.');
  });

  it('aceita escrita vinda da origem permitida', async () => {
    const ctx = createContext('/api/quiz-attempts', 'POST', { origin: 'https://dev.fluent-too.com' });

    await run(ctx);

    expect(ctx.unauthorized).not.toHaveBeenCalled();
  });

  it('libera o retorno do provedor OAuth, que chega com Referer do Google', async () => {
    const ctx = createContext('/api/connect/google/callback', 'GET', { referer: 'https://accounts.google.com/' });

    await run(ctx);

    expect(ctx.unauthorized).not.toHaveBeenCalled();
  });

  it('nao bloqueia navegacao de leitura vinda de fora', async () => {
    const ctx = createContext('/api/blog-posts', 'GET', { referer: 'https://www.google.com/' });

    await run(ctx);

    expect(ctx.unauthorized).not.toHaveBeenCalled();
  });

  it('ignora rotas fora de /api', async () => {
    const ctx = createContext('/admin', 'POST', { origin: 'https://evil.example' });

    await run(ctx);

    expect(ctx.unauthorized).not.toHaveBeenCalled();
  });

  it('libera chamada servidor-a-servidor sem Origin nem Referer', async () => {
    const ctx = createContext('/api/quiz-attempts', 'POST');

    await run(ctx);

    expect(ctx.unauthorized).not.toHaveBeenCalled();
  });
});
