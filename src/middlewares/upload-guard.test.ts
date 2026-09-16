import { describe, expect, it, vi } from 'vitest';
import uploadGuard, { isForbiddenUploadRequest } from './upload-guard';

function createContext(overrides: Record<string, unknown> = {}) {
  return {
    method: 'POST',
    path: '/api/upload',
    query: {},
    request: { body: {} },
    forbidden: vi.fn(),
    ...overrides,
  } as any;
}

describe('guarda do upload público', () => {
  it('bloqueia substituição de arquivo existente via ?id', () => {
    expect(isForbiddenUploadRequest(createContext({ query: { id: '12' } }))).toBe(true);
  });

  it('bloqueia vínculo do arquivo a um registro arbitrário', () => {
    expect(isForbiddenUploadRequest(createContext({ request: { body: { ref: 'api::quiz.quiz', refId: '1', field: 'image' } } }))).toBe(true);
  });

  it('bloqueia escolha de caminho no storage', () => {
    expect(isForbiddenUploadRequest(createContext({ request: { body: { path: 'private/teacher-applications' } } }))).toBe(true);
  });

  it('libera upload novo simples', () => {
    expect(isForbiddenUploadRequest(createContext({ path: '/api/upload/', request: { body: { fileInfo: '{}' } } }))).toBe(false);
  });

  it('ignora outras rotas', () => {
    expect(isForbiddenUploadRequest(createContext({ path: '/api/quizzes', query: { id: '1' } }))).toBe(false);
  });

  it('responde 403 sem seguir adiante', async () => {
    const ctx = createContext({ query: { id: '12' } });
    const next = vi.fn();

    await uploadGuard({}, { strapi: {} as any })(ctx, next);

    expect(ctx.forbidden).toHaveBeenCalledWith('UPLOAD_OPERATION_NOT_ALLOWED');
    expect(next).not.toHaveBeenCalled();
  });
});
