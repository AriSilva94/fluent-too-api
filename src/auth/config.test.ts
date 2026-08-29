import { describe, expect, it } from 'vitest';
import { buildAdvancedSettings, buildEmailTemplates, buildGoogleProvider } from './config';

describe('auth config', () => {
  it('preserva campos existentes e força cadastro com confirmação', () => {
    expect(buildAdvancedSettings({ default_role: 'public', extra: true }, 'https://app.example.com')).toEqual({
      default_role: 'unassigned',
      extra: true,
      unique_email: true,
      allow_register: true,
      email_confirmation: true,
      email_reset_password: 'https://app.example.com/auth/reset-password',
      email_confirmation_redirection: 'https://app.example.com/auth/email-confirmed',
    });
  });

  it('desabilita Google sem credenciais completas', () => {
    expect(buildGoogleProvider({}, 'https://api.example.com')).toMatchObject({ enabled: false });
    expect(buildGoogleProvider({ clientId: 'id', clientSecret: 'secret' }, 'https://api.example.com')).toMatchObject({
      enabled: true,
      key: 'id',
      secret: 'secret',
      callback: 'https://api.example.com/api/connect/google/callback',
    });
  });

  it('monta templates sem segredos', () => {
    const templates = buildEmailTemplates('Fluent Too <no-reply@example.com>', 'https://app.example.com');
    expect(templates.reset_password).toMatchObject({
      options: {
        from: { name: 'Fluent Too', email: 'no-reply@example.com' },
        object: 'Redefinição de senha Fluent Too',
      },
    });
    expect(templates.email_confirmation).toMatchObject({
      options: {
        from: { name: 'Fluent Too', email: 'no-reply@example.com' },
        object: 'Confirme seu e-mail na Fluent Too',
      },
    });
    expect(templates.reset_password.options.message).toContain('<%= URL %>?code=<%= TOKEN %>');
    expect(templates.email_confirmation.options.message).toContain('<%= URL %>?confirmation=<%= CODE %>');
    expect(templates.reset_password.options.message).toContain('#ff6700');
    expect(templates.reset_password.options.message).toContain('#4184f9');
    expect(templates.reset_password.options.message).toContain('Redefinir senha');
    expect(templates.reset_password.options.message).toContain('Se você não solicitou esta alteração');
    expect(templates.email_confirmation.options.message).toContain('#ff6700');
    expect(templates.email_confirmation.options.message).toContain('#4184f9');
    expect(templates.email_confirmation.options.message).toContain('Confirmar e-mail');
    expect(templates.email_confirmation.options.message).toContain('Fluent Too');
    expect(JSON.stringify(templates)).not.toContain('secret');
  });
});
