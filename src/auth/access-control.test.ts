import { describe, expect, it } from 'vitest';
import { buildAccessControlPlan } from './access-control';

describe('access control', () => {
  it('define as seis roles do aplicativo', () => {
    const plan = buildAccessControlPlan();

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
    const plan = buildAccessControlPlan();

    expect(plan.permissions.teacher_pending).toEqual([
      ...plan.permissions.student,
      'api::teacher-application.profile.becomeStudent',
    ]);
  });

  it('dá ao professor as permissões do estudante mais criação de conteúdo', () => {
    const plan = buildAccessControlPlan();
    const extra = plan.permissions.teacher.filter((action) => !plan.permissions.student.includes(action));

    expect(extra).toEqual([
      'api::quiz.quiz.findMine',
      'api::quiz.quiz.create',
      'api::quiz.quiz.update',
      'api::quiz.quiz.delete',
      'api::blog-post.blog-post.create',
      'api::blog-post.blog-post.update',
      'api::blog-post.blog-post.delete',
    ]);
  });

  it('permite apenas admins revisarem candidaturas', () => {
    const plan = buildAccessControlPlan();
    const review = 'api::teacher-application.teacher-application.find';

    expect(plan.permissions.app_admin).toContain(review);
    expect(plan.permissions.super_admin).toContain(review);
    expect(plan.permissions.teacher).not.toContain(review);
    expect(plan.permissions.teacher_pending).not.toContain(review);
    expect(plan.permissions.student).not.toContain(review);
  });

  it('mantém authenticated com as permissões de estudante para usuários ainda não migrados', () => {
    const plan = buildAccessControlPlan();

    expect(plan.permissions.authenticated).toEqual(plan.permissions.student);
  });

  it('não concede papel de admin a partir de configuração', () => {
    const plan = buildAccessControlPlan() as Record<string, unknown>;

    expect(plan.adminEmail).toBeUndefined();
    expect(Object.keys(plan)).toEqual(['roles', 'permissions']);
  });

  it('permite Admin ver todos os recursos e gerenciar quizzes', () => {
    const plan = buildAccessControlPlan();

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
      'api::quiz.quiz.findMine',
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
      'api::quiz.quiz.publish',
      'api::quiz.quiz.unpublish',
    ]);
  });

  it('dá ao super admin tudo que o admin tem mais as ações de sistema', () => {
    const plan = buildAccessControlPlan();
    const extra = plan.permissions.super_admin.filter((action) => !plan.permissions.app_admin.includes(action));

    expect(extra).toEqual(['plugin::users-permissions.user.destroy']);
  });

  it('não deixa o dono do projeto apagar usuários', () => {
    const plan = buildAccessControlPlan();

    expect(plan.permissions.app_admin).not.toContain('plugin::users-permissions.user.destroy');
  });

  it('deixa só admins publicarem e despublicarem quiz', () => {
    const plan = buildAccessControlPlan();

    for (const action of ['api::quiz.quiz.publish', 'api::quiz.quiz.unpublish']) {
      expect(plan.permissions.app_admin).toContain(action);
      expect(plan.permissions.super_admin).toContain(action);
      expect(plan.permissions.teacher).not.toContain(action);
      expect(plan.permissions.student).not.toContain(action);
    }
  });


  it('permite ao admin moderar blog posts de qualquer professor', () => {
    const plan = buildAccessControlPlan();

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

  it('declara explicitamente tudo que é público e não preserva permissões acidentais', () => {
    const plan = buildAccessControlPlan();

    expect(plan.permissions.public).toEqual([
      'api::blog-post.blog-post.find',
      'api::blog-post.blog-post.findOne',
      'api::quiz.quiz.find',
      'api::quiz.quiz.findOne',
      'plugin::users-permissions.auth.callback',
      'plugin::users-permissions.auth.connect',
      'plugin::users-permissions.auth.emailConfirmation',
      'plugin::users-permissions.auth.forgotPassword',
      'plugin::users-permissions.auth.refresh',
      'plugin::users-permissions.auth.register',
      'plugin::users-permissions.auth.resetPassword',
      'plugin::users-permissions.auth.sendEmailConfirmation',
    ]);
    expect(plan.permissions.public).not.toContain('plugin::upload.content-api.upload');
    expect(plan.permissions.public).not.toContain('api::teacher-application.teacher-application.find');
  });

  it('permite usuário autenticado criar e listar o próprio histórico', () => {
    const plan = buildAccessControlPlan();

    expect(plan.permissions.authenticated).toEqual([
      'plugin::users-permissions.user.me',
      'plugin::users-permissions.auth.logout',
      'plugin::users-permissions.auth.changePassword',
      'api::quiz.quiz.find',
      'api::quiz.quiz.findOne',
      'api::quiz-attempt.quiz-attempt.find',
      'api::quiz-attempt.quiz-attempt.findOne',
      'api::quiz-attempt.quiz-attempt.create',
      'api::teacher-application.profile.myApplication',
    ]);
  });

  it('dá ao usuário sem perfil apenas acesso à própria conta e às transições de perfil', () => {
    const plan = buildAccessControlPlan();

    expect(plan.permissions.unassigned).toEqual([
      'plugin::users-permissions.user.me',
      'plugin::users-permissions.auth.logout',
      'plugin::users-permissions.auth.changePassword',
      'api::teacher-application.profile.becomeStudent',
      'api::teacher-application.profile.becomeTeacher',
      'api::teacher-application.profile.myApplication',
    ]);
  });

  it('deixa o estudante ler quizzes com o próprio token, inclusive os não públicos', () => {
    const plan = buildAccessControlPlan();

    expect(plan.permissions.student).toContain('api::quiz.quiz.find');
    expect(plan.permissions.student).toContain('api::quiz.quiz.findOne');
    expect(plan.permissions.teacher).toContain('api::quiz.quiz.find');
    expect(plan.permissions.teacher_pending).toContain('api::quiz.quiz.find');
  });

  it('não deixa o estudante criar, alterar nem apagar quiz', () => {
    const plan = buildAccessControlPlan();

    expect(plan.permissions.student).not.toContain('api::quiz.quiz.create');
    expect(plan.permissions.student).not.toContain('api::quiz.quiz.update');
    expect(plan.permissions.student).not.toContain('api::quiz.quiz.delete');
  });

  it('não deixa o usuário sem perfil tocar em quiz nem em revisão de candidatura', () => {
    const plan = buildAccessControlPlan();

    expect(plan.permissions.unassigned).not.toContain('api::quiz.quiz.find');
    expect(plan.permissions.unassigned).not.toContain('api::teacher-application.teacher-application.find');
    expect(plan.permissions.unassigned).not.toContain('api::teacher-application.teacher-application.approve');
  });
});
