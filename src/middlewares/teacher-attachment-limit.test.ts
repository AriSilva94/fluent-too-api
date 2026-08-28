import { describe, expect, it } from 'vitest';
import { checkContentLength, MAX_TEACHER_REGISTER_BODY_BYTES } from './teacher-attachment-limit';

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
