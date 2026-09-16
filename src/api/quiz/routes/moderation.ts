const adminOnly = { policies: ['global::is-admin'] };

export default {
  routes: [
    { method: 'POST', path: '/quizzes/:id/publish', handler: 'quiz.publish', config: adminOnly },
    { method: 'POST', path: '/quizzes/:id/unpublish', handler: 'quiz.unpublish', config: adminOnly },
  ],
};
