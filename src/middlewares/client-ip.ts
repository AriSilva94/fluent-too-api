import { timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import type { Core } from '@strapi/strapi';

export const CLIENT_IP_HEADER = 'x-fluent-client-ip';
export const INTERNAL_SECRET_HEADER = 'x-fluent-internal-secret';
const CLOUDFLARE_IP_HEADER = 'cf-connecting-ip';

type Headers = Record<string, string | string[] | undefined>;

function readHeader(headers: Headers, name: string) {
  const value = headers[name];
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
}

function sameSecret(received: string | undefined, expected: string | undefined) {
  if (!received || !expected) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function validIp(value: string | undefined) {
  return value && isIP(value) ? value : null;
}

export function resolveClientIp(headers: Headers, secret: string | undefined) {
  if (sameSecret(readHeader(headers, INTERNAL_SECRET_HEADER), secret)) {
    const forwarded = validIp(readHeader(headers, CLIENT_IP_HEADER));
    if (forwarded) return forwarded;
  }

  return validIp(readHeader(headers, CLOUDFLARE_IP_HEADER));
}

const middleware: Core.MiddlewareFactory = () => async (ctx, next) => {
  const clientIp = resolveClientIp(ctx.request.headers, process.env.INTERNAL_PROXY_SECRET);
  if (clientIp) ctx.request.ip = clientIp;
  return next();
};

export default middleware;
