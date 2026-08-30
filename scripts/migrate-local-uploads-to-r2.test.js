import { describe, expect, it } from 'vitest';
import { rewriteUploadRecord } from './migrate-local-uploads-to-r2';

describe('rewriteUploadRecord', () => {
  it('reescreve url principal e formatos para o CDN/R2', () => {
    const record = {
      id: 7,
      url: '/uploads/banner_abcd.webp',
      formats: {
        thumbnail: {
          url: '/uploads/thumbnail_banner_abcd.webp',
        },
        small: {
          url: 'https://cdn-dev.fluent-too.com/assets/images/small_banner_abcd.webp',
        },
      },
    };

    const rewritten = rewriteUploadRecord(record, {
      publicUrl: 'https://cdn-dev.fluent-too.com/',
      rootPath: 'assets/images',
    });

    expect(rewritten.url).toBe('https://cdn-dev.fluent-too.com/assets/images/banner_abcd.webp');
    expect(rewritten.formats.thumbnail.url).toBe(
      'https://cdn-dev.fluent-too.com/assets/images/thumbnail_banner_abcd.webp'
    );
    expect(rewritten.formats.small.url).toBe('https://cdn-dev.fluent-too.com/assets/images/small_banner_abcd.webp');
  });
});
