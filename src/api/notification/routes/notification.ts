export default {
  routes: [
    { method: 'GET', path: '/notifications', handler: 'notification.find' },
    { method: 'POST', path: '/notifications/seen', handler: 'notification.markSeen' },
  ],
};
