import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import path from 'node:path';
import type { Readable } from 'node:stream';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const PRIVATE_ATTACHMENT_PATH = 'private/teacher-applications';

const LOCAL_UPLOAD_PREFIX = '/uploads/';

export type StoredAttachment = {
  id: number | string;
  name?: string | null;
  mime?: string | null;
  size?: number | null;
  url?: string | null;
};

export type AttachmentView = {
  id: number | string;
  name: string | null;
  mime: string | null;
  size: number | null;
};

export type AttachmentStream = {
  body: Readable;
  contentType: string;
  filename: string;
};

export function toAttachmentView(file: StoredAttachment | null | undefined): AttachmentView | null {
  if (!file) return null;
  return { id: file.id, name: file.name ?? null, mime: file.mime ?? null, size: file.size ?? null };
}

export function objectKeyFromUrl(url: string, publicUrl: string | undefined): string | null {
  const base = (publicUrl ?? '').replace(/\/+$/, '');
  if (base && url.startsWith(`${base}/`)) return decodeURIComponent(url.slice(base.length + 1)) || null;

  try {
    return decodeURIComponent(new URL(url).pathname.replace(/^\/+/, '')) || null;
  } catch {
    return null;
  }
}

export function buildContentDisposition(filename: string) {
  const fallback = filename.replace(/[^\x20-\x7e]|["\\]/g, '_');
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

let s3Client: S3Client | undefined;

function getS3Client() {
  s3Client ??= new S3Client({
    endpoint: process.env.S3_ENDPOINT || undefined,
    region: process.env.S3_REGION || 'auto',
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.S3_ACCESS_SECRET ?? '',
    },
  });
  return s3Client;
}

async function openLocalFile(strapi: any, url: string) {
  const filePath = path.join(strapi.dirs.static.public, 'uploads', path.basename(url));
  try {
    await access(filePath);
  } catch {
    return null;
  }
  return createReadStream(filePath);
}

async function openS3Object(url: string) {
  const key = objectKeyFromUrl(url, process.env.S3_PUBLIC_URL);
  if (!key || !process.env.S3_BUCKET) return null;

  try {
    const object = await getS3Client().send(new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
    return (object.Body as Readable | undefined) ?? null;
  } catch {
    return null;
  }
}

export async function openAttachmentStream(strapi: any, file: StoredAttachment): Promise<AttachmentStream | null> {
  if (!file.url) return null;

  const body = file.url.startsWith(LOCAL_UPLOAD_PREFIX) ? await openLocalFile(strapi, file.url) : await openS3Object(file.url);
  if (!body) return null;

  return {
    body,
    contentType: file.mime || 'application/octet-stream',
    filename: file.name || path.basename(file.url),
  };
}
