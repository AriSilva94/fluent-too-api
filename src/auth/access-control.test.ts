import { describe, expect, it } from 'vitest';
import { buildAccessControlPlan } from './access-control';

describe('access control', () => {
  it('define as seis roles do aplicativo', () => {
    const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

    expect(plan.roles.map((role) => role.type)).toEqual([
      'super_admin',
      'app_admin',
      'teacher',
      'teacher_pending',
      'student',
      'unassigned',
    ]);
  });

  it('dá ao professor pendente as permissões do estudante mais a transição para estudante', () => {
    const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

    expect(plan.permissions.teacher_pending).toEqual([
      ...plan.permissions.student,
      'api::teacher-application.profile.becomeStudent',
    ]);
  });

  it('dá ao professor as permissões do estudante mais criação de conteúdo', () => {
    const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');
    const extra = plan.permissions.teacher.filter((action) => !plan.permissions.student.includes(action));

    expect(extra).toEqual([
      'api::quiz.quiz.create',
      'api::quiz.quiz.update',
      'api::quiz.quiz.delete',
      'api::blog-post.blog-post.create',
      'api::blog-post.blog-post.update',
      'api::blog-post.blog-post.delete',
    ]);
  });

  it('permite apenas admins revisarem candidaturas', () => {
    const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');
    const review = 'api::teacher-application.teacher-application.find';

    expect(plan.permissions.app_admin).toContain(review);
    expect(plan.permissions.super_admin).toContain(review);
    expect(plan.permissions.teacher).not.toContain(review);
    expect(plan.permissions.teacher_pending).not.toContain(review);
    expect(plan.permissions.student).not.toContain(review);
  });

  it('mantém authenticated com as permissões de estudante para usuários ainda não migrados', () => {
    const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

    expect(plan.permissions.authenticated).toEqual(plan.permissions.student);
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
      'api::blog-post.blog-post.find',
      'api::blog-post.blog-post.findOne',
      'api::quiz.quiz.create',
      'api::quiz.quiz.update',
      'api::quiz.quiz.delete',
      'api::quiz-attempt.quiz-attempt.create',
      'api::quiz-attempt.quiz-attempt.update',
      'api::quiz-attempt.quiz-attempt.delete',
      'api::blog-post.blog-post.create',
      'api::blog-post.blog-post.update',
      'api::blog-post.blog-post.delete',
      'api::teacher-application.teacher-application.find',
      'api::teacher-application.teacher-application.findOne',
      'api::teacher-application.teacher-application.approve',
      'api::teacher-application.teacher-application.reject',
    ]);
  });


  it('permite ao admin moderar blog posts de qualquer professor', () => {
    const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

    for (const action of [
      'api::blog-post.blog-post.find',
      'api::blog-post.blog-post.findOne',
      'api::blog-post.blog-post.create',
      'api::blog-post.blog-post.update',
      'api::blog-post.blog-post.delete',
    ]) {
      expect(plan.permissions.app_admin).toContain(action);
      expect(plan.permissions.super_admin).toContain(action);
    }
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
      'api::teacher-application.profile.myApplication',
    ]);
  });

  it('dá ao usuário sem perfil apenas acesso à própria conta e às transições de perfil', () => {
    const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

    expect(plan.permissions.unassigned).toEqual([
      'plugin::users-permissions.user.me',
      'plugin::users-permissions.auth.logout',
      'plugin::users-permissions.auth.changePassword',
      'api::teacher-application.profile.becomeStudent',
      'api::teacher-application.profile.becomeTeacher',
      'api::teacher-application.profile.myApplication',
    ]);
  });

  it('não deixa o usuário sem perfil tocar em quiz nem em revisão de candidatura', () => {
    const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

    expect(plan.permissions.unassigned).not.toContain('api::quiz.quiz.find');
    expect(plan.permissions.unassigned).not.toContain('api::teacher-application.teacher-application.find');
    expect(plan.permissions.unassigned).not.toContain('api::teacher-application.teacher-application.approve');
  });
});
