import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::quiz.quiz', {
  config: {
    update: { policies: ['global::is-owner-or-admin'] },
    delete: { policies: ['global::is-owner-or-admin'] },
  },
});
