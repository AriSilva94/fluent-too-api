#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');
const { lookup } = require('mime-types');
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');

const LOCAL_UPLOAD_PREFIX = '/uploads/';

function stripSlashes(value) {
  return String(value || '').replace(/^\/+|\/+$/g, '');
}

function normalizePublicUrl(value) {
  return String(value || '').replace(/\/+$/g, '');
}

function isLocalUploadUrl(value) {
  return typeof value === 'string' && value.startsWith(LOCAL_UPLOAD_PREFIX);
}

function filenameFromUploadUrl(url) {
  return decodeURIComponent(url.slice(LOCAL_UPLOAD_PREFIX.length));
}

function toObjectKey(url, config) {
  const rootPath = stripSlashes(config.rootPath);
  const filename = filenameFromUploadUrl(url);
  return rootPath ? `${rootPath}/${filename}` : filename;
}

function toCdnUrl(url, config) {
  if (!isLocalUploadUrl(url)) return url;
  return `${normalizePublicUrl(config.publicUrl)}/${toObjectKey(url, config)}`;
}

function rewriteFormatUrls(value, config) {
  if (Array.isArray(value)) return value.map((item) => rewriteFormatUrls(item, config));
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      key === 'url' && typeof entry === 'string' ? toCdnUrl(entry, config) : rewriteFormatUrls(entry, config),
    ])
  );
}

function collectLocalUploadUrls(value, urls = new Set()) {
  if (isLocalUploadUrl(value)) urls.add(value);
  if (Array.isArray(value)) {
    for (const item of value) collectLocalUploadUrls(item, urls);
  } else if (value && typeof value === 'object') {
    for (const entry of Object.values(value)) collectLocalUploadUrls(entry, urls);
  }
  return urls;
}

function rewriteUploadRecord(record, config) {
  return {
    ...record,
    url: toCdnUrl(record.url, config),
    formats: rewriteFormatUrls(record.formats, config),
  };
}

function getDatabaseConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    };
  }

  return {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number.parseInt(process.env.DATABASE_PORT || '5432', 10),
    database: process.env.DATABASE_NAME || process.env.POSTGRES_DB || 'strapi',
    user: process.env.DATABASE_USERNAME || process.env.DATABASE_USER || process.env.POSTGRES_USER || 'strapi',
    password: process.env.DATABASE_PASSWORD || process.env.POSTGRES_PASSWORD || '',
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  };
}

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function getMigrationConfig() {
  return {
    bucket: getRequiredEnv('S3_BUCKET'),
    endpoint: getRequiredEnv('S3_ENDPOINT'),
    accessKeyId: getRequiredEnv('S3_ACCESS_KEY_ID'),
    secretAccessKey: getRequiredEnv('S3_ACCESS_SECRET'),
    publicUrl: getRequiredEnv('S3_PUBLIC_URL'),
    rootPath: process.env.S3_ROOT_PATH || 'assets/images',
    region: process.env.S3_REGION || 'auto',
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
    uploadsDir: process.env.UPLOADS_DIR || path.join(__dirname, '..', 'public', 'uploads'),
    dryRun: process.argv.includes('--dry-run'),
  };
}

async function uploadObject(s3, filePath, key, config) {
  const contentType = lookup(filePath) || 'application/octet-stream';

  await s3.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: fs.createReadStream(filePath),
      ContentType: contentType,
    })
  );
}

async function migrate() {
  const config = getMigrationConfig();
  const db = new Client(getDatabaseConfig());
  const s3 = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    forcePathStyle: config.forcePathStyle,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  await db.connect();

  try {
    const result = await db.query(`
      select id, name, url, formats, mime
      from files
      where url like '/uploads/%'
         or formats::text like '%/uploads/%'
      order by id
    `);

    let uploaded = 0;
    let updated = 0;
    const missing = [];

    for (const record of result.rows) {
      const localUrls = collectLocalUploadUrls({ url: record.url, formats: record.formats });

      for (const url of localUrls) {
        const filename = filenameFromUploadUrl(url);
        const filePath = path.join(config.uploadsDir, filename);
        const key = toObjectKey(url, config);

        if (!fs.existsSync(filePath)) {
          missing.push({ id: record.id, url, filePath });
          continue;
        }

        if (config.dryRun) {
          console.log(`[dry-run] upload ${filePath} -> s3://${config.bucket}/${key}`);
        } else {
          await uploadObject(s3, filePath, key, config);
        }
        uploaded += 1;
      }

      const rewritten = rewriteUploadRecord(record, config);

      if (config.dryRun) {
        console.log(`[dry-run] update files.id=${record.id}: ${record.url} -> ${rewritten.url}`);
      } else {
        await db.query(
          `update files
           set url = $1,
               formats = $2,
               provider = 'aws-s3',
               updated_at = now()
           where id = $3`,
          [rewritten.url, rewritten.formats, record.id]
        );
      }
      updated += 1;
    }

    console.log(`${config.dryRun ? 'Dry run' : 'Migration'} complete: ${uploaded} object(s), ${updated} file record(s).`);

    if (missing.length > 0) {
      console.warn(`Missing local file(s): ${missing.length}`);
      for (const item of missing) console.warn(`files.id=${item.id} ${item.url} expected at ${item.filePath}`);
      if (!config.dryRun) process.exitCode = 1;
    }
  } finally {
    await db.end();
  }
}

if (require.main === module) {
  migrate().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  collectLocalUploadUrls,
  rewriteUploadRecord,
  toCdnUrl,
  toObjectKey,
};
