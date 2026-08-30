const rateLimited = { middlewares: ['plugin::users-permissions.rateLimit'] };

export default {
  routes: [
    { method: 'POST', path: '/profile/student', handler: 'profile.becomeStudent', config: rateLimited },
    { method: 'POST', path: '/profile/teacher', handler: 'profile.becomeTeacher', config: rateLimited },
    { method: 'GET', path: '/profile/application', handler: 'profile.myApplication', config: rateLimited },
  ],
};
