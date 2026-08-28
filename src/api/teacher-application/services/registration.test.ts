import { describe, expect, it } from 'vitest';
import { validateAttachmentFile, validateTeacherRegistration } from './registration';

const valid = {
  email: 'Prof@Example.com',
  password: 'senha-forte-123',
  bio: 'Professor de inglês há 8 anos.',
  experience: 'Cambridge CELTA, aulas para adultos.',
  languages: ['en', 'fr'],
};

describe('validação do cadastro de professor', () => {
  it('normaliza o e-mail e aceita o payload completo', () => {
    const result = validateTeacherRegistration(valid);

    expect(result).toEqual({ ok: true, data: { ...valid, email: 'prof@example.com' } });
  });

  it('exige bio e experiência', () => {
    expect(validateTeacherRegistration({ ...valid, bio: '   ' })).toEqual({ ok: false, error: 'REQUIRED' });
    expect(validateTeacherRegistration({ ...valid, experience: '' })).toEqual({ ok: false, error: 'REQUIRED' });
  });

  it('exige pelo menos um idioma válido', () => {
    expect(validateTeacherRegistration({ ...valid, languages: [] })).toEqual({ ok: false, error: 'REQUIRED' });
    expect(validateTeacherRegistration({ ...valid, languages: ['de'] })).toEqual({ ok: false, error: 'REQUIRED' });
  });

  it('ignora qualquer role enviada pelo cliente', () => {
    const result = validateTeacherRegistration({ ...valid, role: 'app_admin' });

    expect(result.ok && 'role' in result.data).toBe(false);
  });

  it('rejeita e-mail inválido', () => {
    expect(validateTeacherRegistration({ ...valid, email: 'nao-e-email' })).toEqual({
      ok: false,
      error: 'INVALID_EMAIL',
    });
  });
});

describe('validação do arquivo de anexo (attachment)', () => {
  it('aceita um arquivo dentro do limite e com mimetype permitido', () => {
    expect(validateAttachmentFile({ size: 1024, mimetype: 'application/pdf' })).toEqual({ ok: true });
    expect(validateAttachmentFile({ size: 1024, mimetype: 'image/png' })).toEqual({ ok: true });
    expect(validateAttachmentFile({ size: 1024, mimetype: 'image/jpeg' })).toEqual({ ok: true });
  });

  it('rejeita arquivo maior que 5 MB', () => {
    const result = validateAttachmentFile({ size: 5 * 1024 * 1024 + 1, mimetype: 'application/pdf' });

    expect(result).toEqual({ ok: false, error: 'FILE_TOO_LARGE' });
  });

  it('rejeita mimetype não permitido', () => {
    const result = validateAttachmentFile({ size: 1024, mimetype: 'application/zip' });

    expect(result).toEqual({ ok: false, error: 'INVALID_FILE_TYPE' });
  });

  it('usa o campo type quando mimetype não está presente', () => {
    expect(validateAttachmentFile({ size: 1024, type: 'application/pdf' })).toEqual({ ok: true });
    expect(validateAttachmentFile({ size: 1024, type: 'application/zip' })).toEqual({
      ok: false,
      error: 'INVALID_FILE_TYPE',
    });
  });
});
