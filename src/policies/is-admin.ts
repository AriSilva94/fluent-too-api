import { isAdminUserId } from '../auth/current-user';

export default async (policyContext: any, _config: unknown, { strapi }: { strapi: any }) => {
  return isAdminUserId(strapi, policyContext.state.user?.id);
};
