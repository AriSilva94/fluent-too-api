import { normalizeTeachingLanguages } from '../../auth/quiz-language';

export default (plugin: any) => {
  const originalUserFactory = plugin.controllers.user;

  plugin.controllers.user = (params: any) => {
    const controller = typeof originalUserFactory === 'function' ? originalUserFactory(params) : originalUserFactory;
    const strapi = params?.strapi;

    return {
      ...controller,
      async me(ctx: any) {
        if (!ctx.state.user?.id) return ctx.unauthorized();

        const user = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: { id: ctx.state.user.id },
          populate: ['role'],
        });

        if (!user) return controller.me(ctx);

        ctx.body = {
          id: user.id,
          username: user.username,
          email: user.email,
          confirmed: user.confirmed,
          blocked: user.blocked,
          role: user.role ? { id: user.role.id, name: user.role.name, type: user.role.type } : null,
          teachingLanguages: normalizeTeachingLanguages(user.teachingLanguages),
        };
      },
      async resetPassword(ctx: any) {
        const code = ctx.request.body?.code;
        if (typeof code === 'string') {
          const user = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { resetPasswordToken: code },
            select: ['id', 'resetPasswordTokenExpiresAt'],
          });
          if (!user || !user.resetPasswordTokenExpiresAt || new Date(user.resetPasswordTokenExpiresAt).getTime() <= Date.now()) {
            return ctx.badRequest('Incorrect code provided');
          }
        }
        return controller.resetPassword(ctx);
      },
      async changePassword(ctx: any) {
        const result = await controller.changePassword(ctx);
        if (ctx.state.user?.id) {
          await strapi.db.query('plugin::users-permissions.user').update({
            where: { id: ctx.state.user.id },
            data: { resetPasswordToken: null, resetPasswordTokenExpiresAt: null },
          });
        }
        return result;
      },
    };
  };

  return plugin;
};
