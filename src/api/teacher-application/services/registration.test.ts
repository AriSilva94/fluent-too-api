import { describe, expect, it } from 'vitest';
import { validateAttachmentFile, validateTeacherApplication } from './registration';

const valid = {
  bio: 'Professor de inglês há 8 anos.',
  experience: 'Cambridge CELTA, aulas para adultos.',
  languages: ['en', 'fr'],
};

describe('validação da candidatura de professor', () => {
  it('aceita o payload completo', () => {
    const result = validateTeacherApplication(valid);

    expect(result).toEqual({ ok: true, data: valid });
  });

  it('exige bio e experiência', () => {
    expect(validateTeacherApplication({ ...valid, bio: '   ' })).toEqual({ ok: false, error: 'REQUIRED' });
    expect(validateTeacherApplication({ ...valid, experience: '' })).toEqual({ ok: false, error: 'REQUIRED' });
  });

  it('recusa bio ou experiência acima do limite de tamanho', () => {
    expect(validateTeacherApplication({ ...valid, bio: 'x'.repeat(2001) })).toEqual({ ok: false, error: 'TOO_LONG' });
    expect(validateTeacherApplication({ ...valid, experience: 'x'.repeat(2001) })).toEqual({ ok: false, error: 'TOO_LONG' });
  });

  it('exige pelo menos um idioma válido', () => {
    expect(validateTeacherApplication({ ...valid, languages: [] })).toEqual({ ok: false, error: 'REQUIRED' });
    expect(validateTeacherApplication({ ...valid, languages: ['de'] })).toEqual({ ok: false, error: 'REQUIRED' });
  });

  it('aceita um idioma único vindo do multipart como string', () => {
    expect(validateTeacherApplication({ ...valid, languages: 'en' })).toEqual({
      ok: true,
      data: { bio: valid.bio, experience: valid.experience, languages: ['en'] },
    });
    expect(validateTeacherApplication({ ...valid, languages: 'de' })).toEqual({ ok: false, error: 'REQUIRED' });
  });

  it('ignora qualquer role enviada pelo cliente', () => {
    const result = validateTeacherApplication({ ...valid, role: 'app_admin' });

    expect(result.ok && 'role' in result.data).toBe(false);
  });

  it('ignora um id de anexo enviado pelo cliente no JSON', () => {
    const result = validateTeacherApplication({ ...valid, attachment: 42 });

    expect(result.ok && 'attachment' in result.data).toBe(false);
  });

  it('aceita um credentialUrl http/https', () => {
    expect(validateTeacherApplication({ ...valid, credentialUrl: 'https://exemplo.com/certificado' })).toEqual({
      ok: true,
      data: { ...valid, credentialUrl: 'https://exemplo.com/certificado' },
    });
    expect(validateTeacherApplication({ ...valid, credentialUrl: 'http://exemplo.com' }).ok).toBe(true);
  });

  it('rejeita um credentialUrl javascript:, que executaria no admin que revisa', () => {
    expect(validateTeacherApplication({ ...valid, credentialUrl: 'javascript:alert(1)' })).toEqual({
      ok: false,
      error: 'INVALID_URL',
    });
  });

  it('rejeita um credentialUrl relativo, que não é uma URL absoluta', () => {
    expect(validateTeacherApplication({ ...valid, credentialUrl: '/certificado.pdf' })).toEqual({
      ok: false,
      error: 'INVALID_URL',
    });
    expect(validateTeacherApplication({ ...valid, credentialUrl: 'exemplo.com/certificado' })).toEqual({
      ok: false,
      error: 'INVALID_URL',
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
