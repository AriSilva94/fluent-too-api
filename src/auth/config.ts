export function buildAdvancedSettings(current: Record<string, unknown>, frontendUrl: string) {
  return {
    ...current,
    unique_email: true,
    allow_register: true,
    email_confirmation: true,
    email_reset_password: `${trimTrailingSlash(frontendUrl)}/auth/reset-password`,
    email_confirmation_redirection: `${trimTrailingSlash(frontendUrl)}/auth/email-confirmed`,
    default_role: 'authenticated',
  };
}

export function buildGoogleProvider(
  credentials: { clientId?: string; clientSecret?: string },
  strapiPublicUrl: string,
  current: Record<string, unknown> = {}
) {
  if (!credentials.clientId || !credentials.clientSecret) {
    return { ...current, enabled: false };
  }

  return {
    ...current,
    enabled: true,
    key: credentials.clientId,
    secret: credentials.clientSecret,
    callback: `${trimTrailingSlash(strapiPublicUrl)}/api/connect/google/callback`,
  };
}

export function buildEmailTemplates(from: string, frontendUrl: string, current: Record<string, unknown> = {}) {
  const url = trimTrailingSlash(frontendUrl);
  const fromIdentity = parseEmailIdentity(from);
  return {
    ...current,
    reset_password: {
      display: 'Email.template.reset_password',
      icon: 'sync',
      options: {
        from: fromIdentity,
        response_email: '',
        object: 'Redefinição de senha Fluent Too',
        message: `<p>Use este link para redefinir sua senha: <%= URL %>?code=<%= TOKEN %></p><p>${url}/auth/reset-password</p>`,
      },
    },
    email_confirmation: {
      display: 'Email.template.email_confirmation',
      icon: 'check-square',
      options: {
        from: fromIdentity,
        response_email: '',
        object: 'Confirme seu e-mail na Fluent Too',
        message: `<p>Confirme seu e-mail acessando: <%= URL %>?confirmation=<%= CODE %></p><p>${url}/auth/email-confirmed</p>`,
      },
    },
  };
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function parseEmailIdentity(value: string) {
  const match = value.match(/^\s*(.*?)\s*<([^<>]+)>\s*$/);
  if (!match) return { name: '', email: value.trim() };
  return { name: match[1].trim(), email: match[2].trim() };
}
