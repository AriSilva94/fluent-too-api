import { afterEach, describe, expect, it, vi } from 'vitest';
import clientIp, { resolveClientIp } from './client-ip';

const SECRET = 'segredo-compartilhado';

describe('resolução do IP do cliente', () => {
  afterEach(() => {
    delete process.env.INTERNAL_PROXY_SECRET;
  });

  it('usa o IP repassado pelo Next quando o segredo confere', () => {
    const headers = {
      'x-fluent-internal-secret': SECRET,
      'x-fluent-client-ip': '203.0.113.7',
      'cf-connecting-ip': '198.51.100.1',
    };

    expect(resolveClientIp(headers, SECRET)).toBe('203.0.113.7');
  });

  it('ignora IP repassado sem segredo válido e cai no Cloudflare', () => {
    const headers = {
      'x-fluent-internal-secret': 'errado',
      'x-fluent-client-ip': '203.0.113.7',
      'cf-connecting-ip': '198.51.100.1',
    };

    expect(resolveClientIp(headers, SECRET)).toBe('198.51.100.1');
  });

  it('não confia no cabeçalho do Next quando o segredo não está configurado', () => {
    const headers = { 'x-fluent-internal-secret': '', 'x-fluent-client-ip': '203.0.113.7' };

    expect(resolveClientIp(headers, undefined)).toBeNull();
  });

  it('descarta valor que não é IP', () => {
    expect(resolveClientIp({ 'cf-connecting-ip': 'nao-e-ip' }, SECRET)).toBeNull();
  });

  it('sobrescreve ctx.request.ip antes do rate limit', async () => {
    process.env.INTERNAL_PROXY_SECRET = SECRET;
    const ctx = {
      request: {
        ip: '10.0.0.5',
        headers: { 'x-fluent-internal-secret': SECRET, 'x-fluent-client-ip': '2001:db8::1' },
      },
    } as any;
    const next = vi.fn();

    await clientIp({}, { strapi: {} as any })(ctx, next);

    expect(ctx.request.ip).toBe('2001:db8::1');
    expect(next).toHaveBeenCalled();
  });
});
