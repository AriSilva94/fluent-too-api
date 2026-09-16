import { describe, expect, it } from 'vitest';
import { buildContentDisposition, objectKeyFromUrl, toAttachmentView } from './attachment';

describe('anexo da candidatura', () => {
  it('expõe só metadados, nunca a URL', () => {
    const view = toAttachmentView({
      id: 3,
      name: 'curriculo.pdf',
      mime: 'application/pdf',
      size: 120,
      url: 'https://cdn.fluent-too.com/assets/images/private/teacher-applications/curriculo_abc.pdf',
    });

    expect(view).toEqual({ id: 3, name: 'curriculo.pdf', mime: 'application/pdf', size: 120 });
  });

  it('retorna nulo sem anexo', () => {
    expect(toAttachmentView(null)).toBeNull();
  });

  it('extrai a chave do objeto a partir da URL pública do CDN', () => {
    expect(
      objectKeyFromUrl(
        'https://cdn.fluent-too.com/assets/images/private/teacher-applications/cv_abc.pdf',
        'https://cdn.fluent-too.com/'
      )
    ).toBe('assets/images/private/teacher-applications/cv_abc.pdf');
  });

  it('usa o pathname quando a URL não bate com o CDN configurado', () => {
    expect(objectKeyFromUrl('https://outro.example/assets/images/cv_abc.pdf', 'https://cdn.fluent-too.com')).toBe(
      'assets/images/cv_abc.pdf'
    );
  });

  it('monta Content-Disposition seguro para nomes com acento e aspas', () => {
    expect(buildContentDisposition('currículo "final".pdf')).toBe(
      `attachment; filename="curr_culo _final_.pdf"; filename*=UTF-8''curr%C3%ADculo%20%22final%22.pdf`
    );
  });
});
