export default {
  routes: [
    {
      method: 'GET',
      path: '/teacher-applications/:id/attachment',
      handler: 'teacher-application.attachment',
    },
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
