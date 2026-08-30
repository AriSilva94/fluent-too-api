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
        };
      },
    };
  };

  return plugin;
};
