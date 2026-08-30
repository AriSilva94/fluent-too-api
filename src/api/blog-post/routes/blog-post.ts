import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::blog-post.blog-post', {
  config: {
    update: { policies: ['global::is-owner-or-admin'] },
    delete: { policies: ['global::is-owner-or-admin'] },
  },
});
