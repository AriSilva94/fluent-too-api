import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

type UploadFile = {
  filepath: string;
  originalFilename?: string | null;
  mimetype?: string | null;
  size: number;
};

const rasterMimeTypes = new Set(['image/jpeg', 'image/png', 'image/tiff', 'image/avif']);

function toWebpName(filename: string) {
  const ext = path.extname(filename);
  const basename = ext ? filename.slice(0, -ext.length) : filename;
  return `${basename}.webp`;
}

export async function convertUploadFileToWebp(file: UploadFile) {
  if (!file.filepath || !file.mimetype || !rasterMimeTypes.has(file.mimetype)) return false;

  const ext = path.extname(file.filepath);
  const webpPath = ext ? file.filepath.slice(0, -ext.length) + '.webp' : `${file.filepath}.webp`;
  const targetPath = webpPath === file.filepath ? `${file.filepath}.optimized.webp` : webpPath;
  const output = await sharp(file.filepath, { animated: false }).rotate().webp({ quality: 80, effort: 6 }).toBuffer();
  await fs.writeFile(targetPath, output);
  await fs.unlink(file.filepath);

  file.filepath = targetPath;
  file.originalFilename = toWebpName(file.originalFilename ?? path.basename(targetPath));
  file.mimetype = 'image/webp';
  file.size = output.length;

  return true;
}

export function patchUploadServiceForWebp(strapi: { plugin: (name: string) => { service: (name: string) => Record<string, unknown> } }) {
  const uploadService = strapi.plugin('upload').service('upload');
  const originalUpload = uploadService.upload as (input: { data: unknown; files: UploadFile | UploadFile[] }, options?: unknown) => Promise<unknown>;
  const originalReplace = uploadService.replace as (id: unknown, input: { data: unknown; file: UploadFile }, options?: unknown) => Promise<unknown>;

  uploadService.upload = async (input: { data: unknown; files: UploadFile | UploadFile[] }, options?: unknown) => {
    const files = Array.isArray(input.files) ? input.files : [input.files];
    await Promise.all(files.map((file) => convertUploadFileToWebp(file)));
    return originalUpload.call(uploadService, input, options);
  };

  if (typeof originalReplace === 'function') {
    uploadService.replace = async (id: unknown, input: { data: unknown; file: UploadFile }, options?: unknown) => {
      await convertUploadFileToWebp(input.file);
      return originalReplace.call(uploadService, id, input, options);
    };
  }
}
