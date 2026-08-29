import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import YAML from 'yaml';

describe('compose api environment', () => {
  it('repassa as variaveis S3/R2 para o container da API', () => {
    const compose = YAML.parse(readFileSync('compose.yaml', 'utf8'));
    const apiEnvironment = compose.services.api.environment;

    expect(apiEnvironment).toMatchObject({
      S3_ENDPOINT: '${S3_ENDPOINT:-}',
      S3_REGION: '${S3_REGION:-auto}',
      S3_BUCKET: '${S3_BUCKET:-}',
      S3_ACCESS_KEY_ID: '${S3_ACCESS_KEY_ID:-}',
      S3_ACCESS_SECRET: '${S3_ACCESS_SECRET:-}',
      S3_PUBLIC_URL: '${S3_PUBLIC_URL:-}',
      S3_ROOT_PATH: '${S3_ROOT_PATH:-assets/images}',
      S3_FORCE_PATH_STYLE: '${S3_FORCE_PATH_STYLE:-true}',
      S3_ACL: '${S3_ACL:-}',
      S3_SIGNED_URL_EXPIRES: '${S3_SIGNED_URL_EXPIRES:-900}',
    });
  });
});
