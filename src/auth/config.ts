export function buildAdvancedSettings(current: Record<string, unknown>, frontendUrl: string) {
  return {
    ...current,
    unique_email: true,
    allow_register: true,
    email_confirmation: true,
    email_reset_password: `${trimTrailingSlash(frontendUrl)}/auth/reset-password`,
    email_confirmation_redirection: `${trimTrailingSlash(frontendUrl)}/auth/email-confirmed`,
    default_role: 'student',
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
  const resetUrl = '<%= URL %>?code=<%= TOKEN %>';
  const confirmationUrl = '<%= URL %>?confirmation=<%= CODE %>';

  return {
    ...current,
    reset_password: {
      display: 'Email.template.reset_password',
      icon: 'sync',
      options: {
        from: fromIdentity,
        response_email: '',
        object: 'Redefinição de senha Fluent Too',
        message: buildBrandedEmail({
          title: 'Redefina sua senha',
          intro: 'Recebemos uma solicitação para criar uma nova senha na sua conta Fluent Too.',
          body: 'Clique no botão abaixo para escolher uma nova senha e voltar aos seus estudos.',
          ctaLabel: 'Redefinir senha',
          ctaUrl: resetUrl,
          fallbackUrl: `${url}/auth/reset-password`,
          note: 'Se você não solicitou esta alteração, ignore este e-mail. Sua senha atual continuará funcionando.',
        }),
      },
    },
    email_confirmation: {
      display: 'Email.template.email_confirmation',
      icon: 'check-square',
      options: {
        from: fromIdentity,
        response_email: '',
        object: 'Confirme seu e-mail na Fluent Too',
        message: buildBrandedEmail({
          title: 'Confirme seu e-mail',
          intro: 'Sua conta Fluent Too está quase pronta.',
          body: 'Confirme seu endereço de e-mail para liberar o acesso completo à plataforma e manter seu histórico de estudo seguro.',
          ctaLabel: 'Confirmar e-mail',
          ctaUrl: confirmationUrl,
          fallbackUrl: `${url}/auth/email-confirmed`,
          note: 'Se você não criou uma conta na Fluent Too, pode ignorar este e-mail com segurança.',
        }),
      },
    },
  };
}

function buildBrandedEmail({
  title,
  intro,
  body,
  ctaLabel,
  ctaUrl,
  fallbackUrl,
  note,
}: {
  title: string;
  intro: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  fallbackUrl: string;
  note: string;
}) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:0;background:#eef5ff;font-family:'Trebuchet MS',Helvetica,sans-serif;color:#171717;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;border-collapse:collapse;">
            <tr>
              <td style="padding:0 0 18px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:0;">
                      <div style="display:inline-block;border-radius:14px;background:#ff6700;padding:12px 18px;color:#ffffff;font-size:22px;font-weight:800;line-height:1;">Fluent Too</div>
                    </td>
                    <td align="right" style="padding:0;color:#4184f9;font-size:13px;font-weight:700;">Estudo guiado de idiomas</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="border-radius:18px;background:#ffffff;padding:0;box-shadow:0 18px 54px rgba(65,132,249,0.14);overflow:hidden;">
                <div style="height:8px;background:#ff6700;line-height:8px;font-size:8px;">&nbsp;</div>
                <div style="padding:34px 30px 30px 30px;">
                  <h1 style="margin:0;color:#4184f9;font-size:32px;line-height:1.12;font-weight:900;">${title}</h1>
                  <p style="margin:18px 0 0 0;color:#171717;font-size:18px;line-height:1.55;font-weight:700;">${intro}</p>
                  <p style="margin:12px 0 0 0;color:#4b5563;font-size:16px;line-height:1.65;">${body}</p>
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0 0;">
                    <tr>
                      <td bgcolor="#ff6700" style="border-radius:10px;">
                        <a href="${ctaUrl}" style="display:inline-block;padding:15px 24px;color:#ffffff;font-size:16px;font-weight:900;text-decoration:none;">${ctaLabel}</a>
                      </td>
                    </tr>
                  </table>
                  <div style="margin:28px 0 0 0;border-radius:14px;background:#fff7f1;padding:16px 18px;">
                    <p style="margin:0;color:#9a3d00;font-size:14px;line-height:1.6;font-weight:700;">${note}</p>
                  </div>
                  <p style="margin:24px 0 0 0;color:#6b7280;font-size:13px;line-height:1.6;">Se o botão não funcionar, copie e cole este link no navegador:</p>
                  <p style="margin:8px 0 0 0;word-break:break-all;color:#4184f9;font-size:13px;line-height:1.6;"><a href="${ctaUrl}" style="color:#4184f9;text-decoration:underline;">${ctaUrl}</a></p>
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:18px 12px 0 12px;color:#6b7280;font-size:12px;line-height:1.6;">
                Fluent Too · <a href="${fallbackUrl}" style="color:#4184f9;text-decoration:underline;">${fallbackUrl}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `.trim();
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function parseEmailIdentity(value: string) {
  const match = value.match(/^\s*(.*?)\s*<([^<>]+)>\s*$/);
  if (!match) return { name: '', email: value.trim() };
  return { name: match[1].trim(), email: match[2].trim() };
}
