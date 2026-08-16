import type { Core } from '@strapi/strapi';
import { ensureAppAccessControl } from './auth/access-control';
import { buildAdvancedSettings, buildEmailTemplates, buildGoogleProvider } from './auth/config';

async function setStoreValue(strapi: Core.Strapi, key: string, value: unknown) {
  const store = strapi.store({ type: 'plugin', name: 'users-permissions', key });
  const current = await store.get({});
  if (JSON.stringify(current) !== JSON.stringify(value)) {
    await store.set({ value });
  }
}

export default {
  register() {},
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const frontendUrl = process.env.FRONTEND_PUBLIC_URL ?? 'http://localhost:3000';
    const strapiPublicUrl = strapi.config.get<string>('server.url', process.env.STRAPI_PUBLIC_URL ?? 'http://localhost:1337');
    const emailFrom = process.env.EMAIL_FROM ?? 'Fluent Too <no-reply@example.com>';

    const advancedStore = strapi.store({ type: 'plugin', name: 'users-permissions', key: 'advanced' });
    const grantStore = strapi.store({ type: 'plugin', name: 'users-permissions', key: 'grant' });
    const emailStore = strapi.store({ type: 'plugin', name: 'users-permissions', key: 'email' });

    const advanced = buildAdvancedSettings(((await advancedStore.get({})) ?? {}) as Record<string, unknown>, frontendUrl);
    const grant = ((await grantStore.get({})) ?? {}) as Record<string, Record<string, unknown>>;
    const email = buildEmailTemplates(emailFrom, frontendUrl, ((await emailStore.get({})) ?? {}) as Record<string, unknown>);

    grant.google = buildGoogleProvider(
      { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET },
      strapiPublicUrl,
      grant.google ?? {}
    );

    await setStoreValue(strapi, 'advanced', advanced);
    await setStoreValue(strapi, 'grant', grant);
    await setStoreValue(strapi, 'email', email);
    await ensureAppAccessControl(strapi, process.env.APP_ADMIN_EMAIL ?? 'ariovaldo.bsjunior@gmail.com');
  },
};
