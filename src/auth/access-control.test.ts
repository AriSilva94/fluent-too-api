import { describe, expect, it } from 'vitest';
import { buildAccessControlPlan } from './access-control';

describe('access control', () => {
  it('define roles do aplicativo com nomes em inglês', () => {
    const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

    expect(plan.roles).toEqual([
      {
        name: 'Admin',
        type: 'app_admin',
        description: 'Can view every app resource and manage quizzes',
      },
      {
        name: 'Teacher',
        type: 'teacher',
        description: 'Can create quizzes',
      },
    ]);
  });

  it('promove o usuário informado para Admin', () => {
    const plan = buildAccessControlPlan('ARIOVALDO.BSJUNIOR@GMAIL.COM');

    expect(plan.adminEmail).toBe('ariovaldo.bsjunior@gmail.com');
  });

  it('permite Admin ver todos os recursos e gerenciar quizzes', () => {
    const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

    expect(plan.permissions.app_admin).toEqual([
      'plugin::users-permissions.user.me',
      'plugin::users-permissions.auth.logout',
      'plugin::users-permissions.auth.changePassword',
      'api::about.about.find',
      'api::about.about.findOne',
      'api::article.article.find',
      'api::article.article.findOne',
      'api::author.author.find',
      'api::author.author.findOne',
      'api::category.category.find',
      'api::category.category.findOne',
      'api::global.global.find',
      'api::global.global.findOne',
      'api::quiz.quiz.find',
      'api::quiz.quiz.findOne',
      'api::quiz-attempt.quiz-attempt.find',
      'api::quiz-attempt.quiz-attempt.findOne',
      'api::quiz.quiz.create',
      'api::quiz.quiz.update',
      'api::quiz.quiz.delete',
      'api::quiz-attempt.quiz-attempt.create',
      'api::quiz-attempt.quiz-attempt.update',
      'api::quiz-attempt.quiz-attempt.delete',
    ]);
  });

  it('permite Teacher apenas criar quizzes', () => {
    const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

    expect(plan.permissions.teacher).toEqual([
      'plugin::users-permissions.user.me',
      'plugin::users-permissions.auth.logout',
      'plugin::users-permissions.auth.changePassword',
      'api::quiz-attempt.quiz-attempt.find',
      'api::quiz-attempt.quiz-attempt.findOne',
      'api::quiz-attempt.quiz-attempt.create',
      'api::quiz.quiz.create',
    ]);
  });

  it('permite leitura pública de quizzes publicados', () => {
    const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

    expect(plan.permissions.public).toEqual(['api::quiz.quiz.find', 'api::quiz.quiz.findOne']);
  });

  it('permite usuário autenticado criar e listar o próprio histórico', () => {
    const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

    expect(plan.permissions.authenticated).toEqual([
      'plugin::users-permissions.user.me',
      'plugin::users-permissions.auth.logout',
      'plugin::users-permissions.auth.changePassword',
      'api::quiz-attempt.quiz-attempt.find',
      'api::quiz-attempt.quiz-attempt.findOne',
      'api::quiz-attempt.quiz-attempt.create',
    ]);
  });
});
