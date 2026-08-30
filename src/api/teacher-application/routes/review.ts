export default {
  routes: [
    {
      method: 'POST',
      path: '/teacher-applications/:id/approve',
      handler: 'teacher-application.approve',
    },
    {
      method: 'POST',
      path: '/teacher-applications/:id/reject',
      handler: 'teacher-application.reject',
    },
  ],
};
