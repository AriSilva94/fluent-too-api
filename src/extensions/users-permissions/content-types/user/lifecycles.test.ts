import { describe, expect, it, vi } from 'vitest';
import lifecycle from './lifecycles';

describe('user reset token lifecycle', () => {
  it('define expiração ao emitir token', () => {
    const event = { params: { data: { resetPasswordToken: 'token' } } };
    const before = Date.now();

    lifecycle.beforeUpdate(event);

    const expiry = new Date(event.params.data.resetPasswordTokenExpiresAt).getTime();
    expect(expiry).toBeGreaterThanOrEqual(before + 60 * 60 * 1000 - 1000);
    expect(expiry).toBeLessThanOrEqual(Date.now() + 60 * 60 * 1000 + 1000);
  });

  it('remove expiração ao consumir ou invalidar token', () => {
    const event = { params: { data: { resetPasswordToken: null } } };

    lifecycle.beforeUpdate(event);

    expect(event.params.data.resetPasswordTokenExpiresAt).toBeNull();
  });

  it('não altera atualizações que não tratam token', () => {
    const event = { params: { data: { password: 'new-password' } } };
    const spy = vi.spyOn(Date, 'now');

    lifecycle.beforeUpdate(event);

    expect(event.params.data).toEqual({ password: 'new-password' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
