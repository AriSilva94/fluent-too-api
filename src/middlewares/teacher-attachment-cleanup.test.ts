import { mkdtemp, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import teacherAttachmentCleanup from './teacher-attachment-cleanup';

const strapi = { log: { error: () => {} } } as any;

async function createTempFile() {
  const dir = await mkdtemp(join(tmpdir(), 'anexo-'));
  const filepath = join(dir, 'certificado.pdf');
  await writeFile(filepath, 'conteudo');
  return filepath;
}

function createContext(path: string, method: string, filepath?: string) {
  return {
    method,
    path,
    request: { files: filepath ? { attachment: { filepath, size: 8, mimetype: 'application/pdf' } } : undefined },
  } as any;
}

describe('limpeza do anexo temporário', () => {
  it('remove o arquivo quando a rota é recusada antes do controller (401/403)', async () => {
    const filepath = await createTempFile();
    const cleanup = teacherAttachmentCleanup({} as any, { strapi } as any);

    // `authenticate` responde 401 sem chamar o handler: o controller nunca roda.
    await cleanup(createContext('/api/profile/teacher', 'POST', filepath), async () => {});

    expect(existsSync(filepath)).toBe(false);
  });

  it('remove o arquivo também quando o handler lança', async () => {
    const filepath = await createTempFile();
    const cleanup = teacherAttachmentCleanup({} as any, { strapi } as any);

    await expect(
      cleanup(createContext('/api/profile/teacher', 'POST', filepath), async () => {
        throw new Error('falha no handler');
      })
    ).rejects.toThrow('falha no handler');

    expect(existsSync(filepath)).toBe(false);
  });

  it('não quebra quando o arquivo já foi consumido pelo upload', async () => {
    const cleanup = teacherAttachmentCleanup({} as any, { strapi } as any);
    const ctx = createContext('/api/profile/teacher', 'POST', join(tmpdir(), 'nao-existe-mais.pdf'));

    await expect(cleanup(ctx, async () => {})).resolves.toBeUndefined();
  });

  it('cobre a rota com barra final, igual à guarda de tamanho', async () => {
    const filepath = await createTempFile();
    const cleanup = teacherAttachmentCleanup({} as any, { strapi } as any);

    await cleanup(createContext('/api/profile/teacher/', 'POST', filepath), async () => {});

    expect(existsSync(filepath)).toBe(false);
  });

  it('não mexe em outras rotas', async () => {
    const cleanup = teacherAttachmentCleanup({} as any, { strapi } as any);
    const next = vi.fn();

    await cleanup(createContext('/api/profile/student', 'POST'), next);

    expect(next).toHaveBeenCalledOnce();
  });
});
