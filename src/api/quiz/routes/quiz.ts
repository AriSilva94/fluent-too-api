import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::quiz.quiz', {
  config: {
    create: { policies: ['global::can-manage-quiz-language'] },
    update: { policies: ['global::is-owner-or-admin', 'global::can-manage-quiz-language'] },
    delete: { policies: ['global::is-owner-or-admin'] },
  },
});
