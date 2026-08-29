export default {
  routes: [
    { method: 'POST', path: '/profile/student', handler: 'profile.becomeStudent' },
    { method: 'POST', path: '/profile/teacher', handler: 'profile.becomeTeacher' },
    { method: 'GET', path: '/profile/application', handler: 'profile.myApplication' },
  ],
};
