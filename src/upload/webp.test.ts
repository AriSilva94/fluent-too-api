import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { convertUploadFileToWebp } from './webp';

async function createTempPng() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'fluent-too-webp-'));
  const filepath = path.join(dir, 'upload.png');
  await sharp({
    create: {
      width: 24,
      height: 24,
      channels: 3,
      background: '#ff6600',
    },
  })
    .png()
    .toFile(filepath);
  return { dir, filepath };
}

async function removeTempDir(dir: string) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
      return;
    } catch (error) {
      if (attempt === 4) throw error;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
}

describe('convertUploadFileToWebp', () => {
  it('converte imagem raster para webp e atualiza metadados do upload', async () => {
    const { dir, filepath } = await createTempPng();
    const file = {
      filepath,
      originalFilename: 'banner.png',
      mimetype: 'image/png',
      size: (await fs.stat(filepath)).size,
    };

    try {
      const converted = await convertUploadFileToWebp(file);
      const metadata = await sharp(await fs.readFile(file.filepath)).metadata();

      expect(converted).toBe(true);
      expect(file.originalFilename).toBe('banner.webp');
      expect(file.mimetype).toBe('image/webp');
      expect(file.filepath.endsWith('.webp')).toBe(true);
      expect(file.size).toBe((await fs.stat(file.filepath)).size);
      expect(metadata.format).toBe('webp');
    } finally {
      await removeTempDir(dir);
    }
  });

  it('mantem svg sem conversao', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'fluent-too-webp-'));
    const filepath = path.join(dir, 'icon.svg');
    await fs.writeFile(filepath, '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    const file = {
      filepath,
      originalFilename: 'icon.svg',
      mimetype: 'image/svg+xml',
      size: (await fs.stat(filepath)).size,
    };

    try {
      await expect(convertUploadFileToWebp(file)).resolves.toBe(false);
      expect(file.originalFilename).toBe('icon.svg');
      expect(file.mimetype).toBe('image/svg+xml');
    } finally {
      await removeTempDir(dir);
    }
  });
});
