// O `rateLimit` do users-permissions, que a antiga rota pública carregava de propósito.
// Aqui ele cobre só o abuso de quem já passou pela autenticação: o Strapi compõe os
// middlewares de rota DEPOIS de `authenticate`/`authorize`, então numa rajada anônima
// (401/403) este nunca roda. O limite que alcança quem não tem conta — e que precisa
// vir antes de `strapi::body` gravar o multipart em disco — é o middleware global
// `global::profile-rate-limit`.
const rateLimited = { middlewares: ['plugin::users-permissions.rateLimit'] };

export default {
  routes: [
    { method: 'POST', path: '/profile/student', handler: 'profile.becomeStudent', config: rateLimited },
    { method: 'POST', path: '/profile/teacher', handler: 'profile.becomeTeacher', config: rateLimited },
    { method: 'GET', path: '/profile/application', handler: 'profile.myApplication', config: rateLimited },
  ],
};
