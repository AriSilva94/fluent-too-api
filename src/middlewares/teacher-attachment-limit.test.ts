import { describe, expect, it, vi } from 'vitest';
import teacherAttachmentLimit, { checkContentLength, MAX_TEACHER_REGISTER_BODY_BYTES } from './teacher-attachment-limit';

function createContext(path: string, method: string, contentLength?: string) {
  return {
    method,
    path,
    request: { headers: contentLength === undefined ? {} : { 'content-length': contentLength } },
    status: 200,
    body: undefined,
  } as any;
}

describe('limite de corpo do cadastro de professor', () => {
  it('aceita um corpo dentro do limite', () => {
    expect(checkContentLength(String(5 * 1024 * 1024), MAX_TEACHER_REGISTER_BODY_BYTES)).toEqual({ ok: true });
  });

  it('recusa um corpo maior que o limite antes de gravar o arquivo', () => {
    expect(checkContentLength(String(MAX_TEACHER_REGISTER_BODY_BYTES + 1), MAX_TEACHER_REGISTER_BODY_BYTES)).toEqual({
      ok: false,
      error: 'FILE_TOO_LARGE',
    });
  });

  it('exige content-length para não deixar o corpo sem teto', () => {
    expect(checkContentLength(undefined, MAX_TEACHER_REGISTER_BODY_BYTES)).toEqual({
      ok: false,
      error: 'LENGTH_REQUIRED',
    });
    expect(checkContentLength('abc', MAX_TEACHER_REGISTER_BODY_BYTES)).toEqual({
      ok: false,
      error: 'LENGTH_REQUIRED',
    });
  });
});

describe('rota guardada pelo middleware', () => {
  it('guarda /api/profile/teacher em vez da antiga rota pública', async () => {
    const guard = teacherAttachmentLimit({} as any, {} as any);
    const next = vi.fn();

    const ctx = createContext('/api/profile/teacher', 'POST', String(MAX_TEACHER_REGISTER_BODY_BYTES + 1));
    await guard(ctx, next);

    expect(next).not.toHaveBeenCalled();
    expect(ctx.status).toBe(413);
  });

  it('deixa passar qualquer outra rota, inclusive a antiga rota pública removida', async () => {
    const guard = teacherAttachmentLimit({} as any, {} as any);
    const next = vi.fn();

    const ctx = createContext('/api/auth/local/register-teacher', 'POST', String(MAX_TEACHER_REGISTER_BODY_BYTES + 1));
    await guard(ctx, next);

    expect(next).toHaveBeenCalledOnce();
  });
});
