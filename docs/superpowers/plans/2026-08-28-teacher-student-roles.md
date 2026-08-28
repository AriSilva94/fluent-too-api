# Roles de professor e estudante — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir cadastro como professor com aprovação manual, separando os usuários em cinco roles nomeadas, sem alterar o fluxo atual do estudante.

**Architecture:** Toda a autorização vive nas roles do plugin `users-permissions` do Strapi, sincronizadas no bootstrap por `src/auth/access-control.ts`. Regras novas entram como funções puras em `src/**/services/*.ts` (testadas com vitest, sem subir o Strapi) e controllers finos que as consomem — o mesmo padrão de `src/api/quiz-attempt`. No Next, o gating é feito em server components lendo `resolveSession`, com funções puras em `lib/auth/roles.ts`.

**Tech Stack:** Strapi 5.52 (TypeScript, vitest), Next 16 App Router (TypeScript, Tailwind 4, vitest + Testing Library), PostgreSQL.

**Spec:** `fluent-too-api/docs/superpowers/specs/2026-08-28-teacher-student-roles-design.md`

## Global Constraints

- Dois repositórios git separados, ambos na branch `develop`: `fluent-too-api` (Strapi) e `fluent-too` (Next). Cada task diz em qual repo roda. Commits nunca cruzam repos.
- Roles são do plugin `users-permissions`, nunca admin users do Strapi. Os `type` são exatamente: `super_admin`, `app_admin`, `teacher`, `teacher_pending`, `student`.
- Nenhum endpoint aceita `role` vinda do payload do cliente, em nenhuma circunstância.
- Professor pendente tem exatamente as permissões de estudante, mas nunca a role de estudante.
- Testes: `npm test` (vitest) nos dois repos. Lint no front: `npm run lint`.
- Sem libs novas nos dois repos.
- Textos de UI ficam em `messages/pt-br.json`, `messages/en-us.json`, `messages/fr-fr.json` — os três sempre juntos.
- Não alterar o fluxo de registro/login do estudante: mesma rota, mesma validação, mesma confirmação de e-mail.
- `syncPermissions` para `public` e `authenticated` continua com `preserveExisting: true` — o role `public` tem permissões concedidas manualmente pelo admin (leitura de `blog-post`, por exemplo) que não podem ser apagadas.

---

## Estrutura de arquivos

**`fluent-too-api`:**

| arquivo | responsabilidade |
|---|---|
| `src/auth/access-control.ts` (modificar) | plano de roles e permissões; ganha 3 roles novas |
| `src/auth/role-migration.ts` (criar) | função pura que decide quem migra de `authenticated` para `student` |
| `src/auth/roles.ts` (criar) | `AppRoleType`, `isAdminRole`, `isContentCreatorRole` — compartilhado por policies e controllers |
| `src/api/teacher-application/**` (criar) | content-type, rotas, controller e serviço da candidatura |
| `src/api/teacher-application/services/review.ts` (criar) | funções puras: transição de status e dados da decisão |
| `src/api/teacher-application/services/registration.ts` (criar) | função pura: validação do payload de cadastro de professor |
| `src/extensions/users-permissions/strapi-server.ts` (criar) | `register-teacher` e `me` com role |
| `src/api/quiz/content-types/quiz/schema.json` (modificar) | campo `owner` |
| `src/api/blog-post/content-types/blog-post/schema.json` (modificar) | campo `owner` |
| `src/policies/is-owner-or-admin.ts` (criar) | policy global de ownership |
| `src/api/quiz/routes/quiz.ts`, `src/api/blog-post/routes/blog-post.ts` (modificar) | aplicar a policy em update/delete |
| `src/api/quiz/controllers/quiz.ts`, `src/api/blog-post/controllers/blog-post.ts` (modificar) | forçar `owner` no create |
| `src/auth/ownership.ts` (criar) | funções puras de ownership: `buildOwnedCreateData`, `canMutateEntry` |

**`fluent-too`:**

| arquivo | responsabilidade |
|---|---|
| `lib/auth/contracts.ts` (modificar) | `AppRole`, `AuthUser.role`, `TeacherRegisterPayload`, códigos de erro novos |
| `lib/auth/roles.ts` (criar) | `canCreateContent`, `canReviewTeachers`, `isPendingTeacher` |
| `lib/auth/teacher-registration.ts` (criar) | validação do payload + do anexo, montagem do `FormData` para o Strapi |
| `app/api/auth/register-teacher/route.ts` (criar) | rota proxy multipart |
| `app/[locale]/register/ProfileChooser.tsx` (criar) | passo 1: estudante ou professor |
| `app/[locale]/register/TeacherRegisterForm.tsx` (criar) | formulário de candidatura |
| `app/[locale]/dashboard/page.tsx` (modificar) | aviso de candidatura pendente/rejeitada |
| `lib/teacher-applications/client.ts` (criar) | cliente das rotas de candidatura no Strapi |
| `app/api/teacher-applications/route.ts` e `app/api/teacher-applications/[id]/[action]/route.ts` (criar) | proxies de listagem e decisão |
| `app/[locale]/admin/teachers/page.tsx` + `TeacherApplicationsPanel.tsx` (criar) | tela de aprovação |
| `messages/*.json` (modificar) | textos novos nos 3 idiomas |

---

### Task 1: Cinco roles no plano de acesso (repo `fluent-too-api`)

**Files:**
- Modify: `src/auth/access-control.ts`
- Modify: `src/auth/access-control.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `AppRoleType = 'super_admin' | 'app_admin' | 'teacher' | 'teacher_pending' | 'student'`; `buildAccessControlPlan(adminEmail: string): AccessControlPlan` com `permissions` chaveado por `AppRoleType | 'public' | 'authenticated'`.

- [ ] **Step 1: Escrever os testes que falham**

Em `src/auth/access-control.test.ts`, substituir o teste `'define roles do aplicativo com nomes em inglês'` e o `'permite Teacher apenas criar quizzes'` por:

```ts
it('define as cinco roles do aplicativo', () => {
  const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

  expect(plan.roles.map((role) => role.type)).toEqual([
    'super_admin',
    'app_admin',
    'teacher',
    'teacher_pending',
    'student',
  ]);
});

it('dá ao professor pendente exatamente as permissões do estudante', () => {
  const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

  expect(plan.permissions.teacher_pending).toEqual(plan.permissions.student);
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
```

No teste existente `'permite Admin ver todos os recursos e gerenciar quizzes'`, acrescentar ao final do array esperado, na ordem:

```ts
      'api::teacher-application.teacher-application.find',
      'api::teacher-application.teacher-application.findOne',
      'api::teacher-application.teacher-application.approve',
      'api::teacher-application.teacher-application.reject',
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- src/auth/access-control.test.ts`
Expected: FAIL — `plan.roles` só tem `app_admin` e `teacher`; `plan.permissions.student` é `undefined`.

- [ ] **Step 3: Implementar**

Em `src/auth/access-control.ts`:

```ts
type AppRoleType = 'super_admin' | 'app_admin' | 'teacher' | 'teacher_pending' | 'student';
```

Acrescentar as listas de ações abaixo das existentes:

```ts
const blogManagementActions = [
  'api::blog-post.blog-post.create',
  'api::blog-post.blog-post.update',
  'api::blog-post.blog-post.delete',
];

const contentCreationActions = [
  'api::quiz.quiz.create',
  'api::quiz.quiz.update',
  'api::quiz.quiz.delete',
  ...blogManagementActions,
];

const teacherApplicationReviewActions = [
  'api::teacher-application.teacher-application.find',
  'api::teacher-application.teacher-application.findOne',
  'api::teacher-application.teacher-application.approve',
  'api::teacher-application.teacher-application.reject',
];

const studentActions = [...authenticatedUserActions, ...studentHistoryActions];
```

Trocar o corpo de `buildAccessControlPlan` por:

```ts
export function buildAccessControlPlan(adminEmail: string): AccessControlPlan {
  const adminActions = [
    ...authenticatedUserActions,
    ...readActions,
    ...quizManagementActions.filter((action) => !readActions.includes(action)),
    ...quizAttemptManagementActions.filter((action) => !readActions.includes(action)),
    ...teacherApplicationReviewActions,
  ];

  return {
    adminEmail: adminEmail.trim().toLowerCase(),
    roles: [
      { name: 'Super Admin', type: 'super_admin', description: 'Full application access' },
      { name: 'Admin', type: 'app_admin', description: 'Can view every app resource and manage quizzes' },
      { name: 'Teacher', type: 'teacher', description: 'Can create quizzes and blog posts' },
      { name: 'Teacher (pending)', type: 'teacher_pending', description: 'Teacher waiting for manual approval' },
      { name: 'Student', type: 'student', description: 'Can take quizzes and see own history' },
    ],
    permissions: {
      super_admin: adminActions,
      app_admin: adminActions,
      teacher: [...studentActions, ...contentCreationActions],
      teacher_pending: [...studentActions],
      student: [...studentActions],
      public: ['api::quiz.quiz.find', 'api::quiz.quiz.findOne'],
      authenticated: [...studentActions],
    },
  };
}
```

O teste do `app_admin` espera as ações de revisão no fim do array — por isso `teacherApplicationReviewActions` entra por último em `adminActions`.

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test -- src/auth/access-control.test.ts`
Expected: PASS, todos os testes do arquivo.

- [ ] **Step 5: Commit**

```bash
git add src/auth/access-control.ts src/auth/access-control.test.ts
git commit -m "feat: define roles de super admin, admin, professor e estudante"
```

---

### Task 2: Migração de `authenticated` para `student` (repo `fluent-too-api`)

**Files:**
- Create: `src/auth/role-migration.ts`
- Create: `src/auth/role-migration.test.ts`
- Modify: `src/auth/access-control.ts` (chamar a migração dentro de `ensureAppAccessControl`)

**Interfaces:**
- Consumes: `buildAccessControlPlan` da Task 1.
- Produces: `selectUsersToMigrate(users: MigratableUser[], fromType: string): (number | string)[]` e `migrateAuthenticatedUsersToStudent(strapi: Core.Strapi): Promise<number>` (retorna quantos migraram).

- [ ] **Step 1: Escrever o teste que falha**

`src/auth/role-migration.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { selectUsersToMigrate } from './role-migration';

describe('migração de roles', () => {
  it('seleciona apenas usuários na role de origem', () => {
    const users = [
      { id: 1, role: { type: 'authenticated' } },
      { id: 2, role: { type: 'student' } },
      { id: 3, role: { type: 'app_admin' } },
      { id: 4, role: { type: 'authenticated' } },
    ];

    expect(selectUsersToMigrate(users, 'authenticated')).toEqual([1, 4]);
  });

  it('ignora usuários sem role', () => {
    expect(selectUsersToMigrate([{ id: 1 }], 'authenticated')).toEqual([]);
  });

  it('é idempotente: nada a migrar quando ninguém está na role de origem', () => {
    const users = [{ id: 1, role: { type: 'student' } }];

    expect(selectUsersToMigrate(users, 'authenticated')).toEqual([]);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- src/auth/role-migration.test.ts`
Expected: FAIL — `Cannot find module './role-migration'`.

- [ ] **Step 3: Implementar**

`src/auth/role-migration.ts`:

```ts
import type { Core } from '@strapi/strapi';

export type MigratableUser = {
  id: number | string;
  role?: { type?: string } | null;
};

export function selectUsersToMigrate(users: MigratableUser[], fromType: string) {
  return users.filter((user) => user.role?.type === fromType).map((user) => user.id);
}

export async function migrateAuthenticatedUsersToStudent(strapi: Core.Strapi) {
  const roleQuery = strapi.db.query('plugin::users-permissions.role');
  const studentRole = await roleQuery.findOne({ where: { type: 'student' } });
  if (!studentRole) return 0;

  const userQuery = strapi.db.query('plugin::users-permissions.user');
  const users = (await userQuery.findMany({
    where: { role: { type: 'authenticated' } },
    populate: ['role'],
  })) as MigratableUser[];

  const ids = selectUsersToMigrate(users, 'authenticated');
  for (const id of ids) {
    await userQuery.update({ where: { id }, data: { role: studentRole.id } });
  }

  if (ids.length > 0) {
    strapi.log.info(`[auth] migrados ${ids.length} usuários de authenticated para student`);
  }

  return ids.length;
}
```

Em `src/auth/access-control.ts`, importar e chamar no fim de `ensureAppAccessControl`, depois de `assignUserRole`:

```ts
import { migrateAuthenticatedUsersToStudent } from './role-migration';
// ...
  await migrateAuthenticatedUsersToStudent(strapi);
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS, incluindo os testes da Task 1.

- [ ] **Step 5: Subir o Strapi uma vez e conferir a migração**

Run: `npm run develop`
Expected: log `[auth] migrados N usuários de authenticated para student` no primeiro boot; no segundo boot o log não aparece (idempotente). Conferir no admin (Settings → Users & Permissions → Roles) que as 5 roles existem.

- [ ] **Step 6: Commit**

```bash
git add src/auth/role-migration.ts src/auth/role-migration.test.ts src/auth/access-control.ts
git commit -m "feat: migra usuarios de authenticated para student no bootstrap"
```

---

### Task 3: Content-type `teacher-application` (repo `fluent-too-api`)

**Files:**
- Create: `src/api/teacher-application/content-types/teacher-application/schema.json`
- Create: `src/api/teacher-application/routes/teacher-application.ts`
- Create: `src/api/teacher-application/controllers/teacher-application.ts`
- Create: `src/api/teacher-application/services/teacher-application.ts`

**Interfaces:**
- Consumes: nada.
- Produces: UID `api::teacher-application.teacher-application` com os campos `user`, `status`, `languages`, `bio`, `experience`, `credentialUrl`, `attachment`, `reviewedBy`, `reviewedAt`, `reviewNote`.

- [ ] **Step 1: Criar o schema**

`src/api/teacher-application/content-types/teacher-application/schema.json`:

```json
{
  "kind": "collectionType",
  "collectionName": "teacher_applications",
  "info": {
    "singularName": "teacher-application",
    "pluralName": "teacher-applications",
    "displayName": "Teacher Application",
    "description": "Candidatura de professor aguardando aprovação manual"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "user": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "plugin::users-permissions.user",
      "required": true
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "approved", "rejected"],
      "required": true,
      "default": "pending"
    },
    "languages": {
      "type": "json"
    },
    "bio": {
      "type": "text",
      "required": true
    },
    "experience": {
      "type": "text",
      "required": true
    },
    "credentialUrl": {
      "type": "string"
    },
    "attachment": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images", "files"]
    },
    "reviewedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "reviewedAt": {
      "type": "datetime"
    },
    "reviewNote": {
      "type": "text"
    }
  }
}
```

- [ ] **Step 2: Criar rotas, controller e serviço padrão**

`src/api/teacher-application/services/teacher-application.ts`:

```ts
import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::teacher-application.teacher-application' as never);
```

`src/api/teacher-application/controllers/teacher-application.ts`:

```ts
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::teacher-application.teacher-application' as never);
```

`src/api/teacher-application/routes/teacher-application.ts`:

```ts
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::teacher-application.teacher-application' as never);
```

- [ ] **Step 3: Subir o Strapi e conferir**

Run: `npm run develop`
Expected: boot sem erro; "Teacher Application" aparece no Content Manager; a tabela `teacher_applications` é criada.

- [ ] **Step 4: Commit**

```bash
git add src/api/teacher-application
git commit -m "feat: content-type de candidatura de professor"
```

---

### Task 4: Cadastro de professor (repo `fluent-too-api`)

**Files:**
- Create: `src/api/teacher-application/services/registration.ts`
- Create: `src/api/teacher-application/services/registration.test.ts`
- Create: `src/extensions/users-permissions/strapi-server.ts`

**Interfaces:**
- Consumes: content-type da Task 3, roles da Task 1.
- Produces: `validateTeacherRegistration(input: unknown): TeacherRegistrationResult`, com
  `type TeacherRegistrationResult = { ok: true; data: TeacherRegistrationInput } | { ok: false; error: string }`
  e `TeacherRegistrationInput = { email: string; password: string; bio: string; experience: string; languages: string[]; credentialUrl?: string; attachment?: number }`.
  Endpoint `POST /api/auth/local/register-teacher`.

- [ ] **Step 1: Escrever o teste que falha**

`src/api/teacher-application/services/registration.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { validateTeacherRegistration } from './registration';

const valid = {
  email: 'Prof@Example.com',
  password: 'senha-forte-123',
  bio: 'Professor de inglês há 8 anos.',
  experience: 'Cambridge CELTA, aulas para adultos.',
  languages: ['en', 'fr'],
};

describe('validação do cadastro de professor', () => {
  it('normaliza o e-mail e aceita o payload completo', () => {
    const result = validateTeacherRegistration(valid);

    expect(result).toEqual({ ok: true, data: { ...valid, email: 'prof@example.com' } });
  });

  it('exige bio e experiência', () => {
    expect(validateTeacherRegistration({ ...valid, bio: '   ' })).toEqual({ ok: false, error: 'REQUIRED' });
    expect(validateTeacherRegistration({ ...valid, experience: '' })).toEqual({ ok: false, error: 'REQUIRED' });
  });

  it('exige pelo menos um idioma válido', () => {
    expect(validateTeacherRegistration({ ...valid, languages: [] })).toEqual({ ok: false, error: 'REQUIRED' });
    expect(validateTeacherRegistration({ ...valid, languages: ['de'] })).toEqual({ ok: false, error: 'REQUIRED' });
  });

  it('ignora qualquer role enviada pelo cliente', () => {
    const result = validateTeacherRegistration({ ...valid, role: 'app_admin' });

    expect(result.ok && 'role' in result.data).toBe(false);
  });

  it('rejeita e-mail inválido', () => {
    expect(validateTeacherRegistration({ ...valid, email: 'nao-e-email' })).toEqual({
      ok: false,
      error: 'INVALID_EMAIL',
    });
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- src/api/teacher-application/services/registration.test.ts`
Expected: FAIL — `Cannot find module './registration'`.

- [ ] **Step 3: Implementar a validação**

`src/api/teacher-application/services/registration.ts`:

```ts
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const supportedLanguages = ['pt', 'en', 'fr'];

export type TeacherRegistrationInput = {
  email: string;
  password: string;
  bio: string;
  experience: string;
  languages: string[];
  credentialUrl?: string;
  attachment?: number;
};

export type TeacherRegistrationResult =
  | { ok: true; data: TeacherRegistrationInput }
  | { ok: false; error: 'REQUIRED' | 'INVALID_EMAIL' | 'WEAK_PASSWORD' };

export function validateTeacherRegistration(input: unknown): TeacherRegistrationResult {
  const value = (input ?? {}) as Record<string, unknown>;
  const email = String(value.email ?? '').trim().toLowerCase();
  const password = String(value.password ?? '');
  const bio = String(value.bio ?? '').trim();
  const experience = String(value.experience ?? '').trim();
  const languages = Array.isArray(value.languages)
    ? value.languages.filter((language): language is string => supportedLanguages.includes(String(language)))
    : [];
  const credentialUrl = String(value.credentialUrl ?? '').trim();
  const attachment = Number(value.attachment);

  if (!emailPattern.test(email)) return { ok: false, error: 'INVALID_EMAIL' };
  if (password.length < 8) return { ok: false, error: 'WEAK_PASSWORD' };
  if (!bio || !experience || languages.length === 0) return { ok: false, error: 'REQUIRED' };

  return {
    ok: true,
    data: {
      email,
      password,
      bio,
      experience,
      languages,
      ...(credentialUrl ? { credentialUrl } : {}),
      ...(Number.isFinite(attachment) && attachment > 0 ? { attachment } : {}),
    },
  };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test -- src/api/teacher-application/services/registration.test.ts`
Expected: PASS.

- [ ] **Step 5: Criar o endpoint**

`src/extensions/users-permissions/strapi-server.ts`:

```ts
import { validateTeacherRegistration } from '../../api/teacher-application/services/registration';

export default (plugin: any) => {
  plugin.controllers.auth.registerTeacher = async (ctx: any) => {
    const strapi = ctx.state?.strapi ?? global.strapi;
    const validation = validateTeacherRegistration(ctx.request.body);
    if (!validation.ok) return ctx.badRequest(validation.error);

    const { email, password, bio, experience, languages, credentialUrl, attachment } = validation.data;

    const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email } });
    if (existingUser) return ctx.badRequest('EMAIL_ALREADY_REGISTERED');

    const pendingRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'teacher_pending' } });
    if (!pendingRole) return ctx.badRequest('ROLE_UNAVAILABLE');

    const user = await strapi.plugin('users-permissions').service('user').add({
      username: email,
      email,
      password,
      provider: 'local',
      confirmed: false,
      blocked: false,
      role: pendingRole.id,
    });

    await strapi.db.query('api::teacher-application.teacher-application').create({
      data: {
        user: user.id,
        status: 'pending',
        bio,
        experience,
        languages,
        ...(credentialUrl ? { credentialUrl } : {}),
        ...(attachment ? { attachment } : {}),
      },
    });

    await strapi.plugin('users-permissions').service('user').sendConfirmationEmail(user);

    ctx.body = { user: { id: user.id, email: user.email, confirmed: user.confirmed } };
  };

  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/auth/local/register-teacher',
    handler: 'auth.registerTeacher',
    config: { prefix: '', auth: false, middlewares: [] },
  });

  return plugin;
};
```

- [ ] **Step 6: Testar o endpoint manualmente**

Run:
```bash
npm run develop
# em outro terminal
curl -s -X POST http://localhost:1337/api/auth/local/register-teacher \
  -H 'Content-Type: application/json' \
  -d '{"email":"prof.teste@example.com","password":"senha-forte-123","bio":"bio","experience":"exp","languages":["en"],"role":"app_admin"}'
```
Expected: 200 com `{"user":{...}}`. No Content Manager: usuário criado com role **Teacher (pending)** (nunca `app_admin` — a role do payload é ignorada) e uma Teacher Application com status `pending`. Repetir o mesmo curl retorna 400 `EMAIL_ALREADY_REGISTERED`.

- [ ] **Step 7: Commit**

```bash
git add src/api/teacher-application/services src/extensions
git commit -m "feat: endpoint de cadastro de professor com role pendente"
```

---

### Task 5: `/api/users/me` devolvendo a role (repo `fluent-too-api`)

**Files:**
- Modify: `src/extensions/users-permissions/strapi-server.ts`

**Interfaces:**
- Consumes: extension da Task 4.
- Produces: `GET /api/users/me` retornando `{ id, email, username, confirmed, blocked, role: { id, name, type } }`.

- [ ] **Step 1: Conferir o comportamento atual**

Run:
```bash
npm run develop
# logar como qualquer usuário e usar o JWT
curl -s http://localhost:1337/api/users/me -H "Authorization: Bearer $JWT"
```
Expected: resposta **sem** o campo `role` — é o que a task corrige.

- [ ] **Step 2: Implementar o override**

Em `src/extensions/users-permissions/strapi-server.ts`, antes do `return plugin`:

```ts
  const originalMe = plugin.controllers.user.me;

  plugin.controllers.user.me = async (ctx: any) => {
    const strapi = ctx.state?.strapi ?? global.strapi;
    if (!ctx.state.user?.id) return ctx.unauthorized();

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: ctx.state.user.id },
      populate: ['role'],
    });

    if (!user) return originalMe(ctx);

    ctx.body = {
      id: user.id,
      username: user.username,
      email: user.email,
      confirmed: user.confirmed,
      blocked: user.blocked,
      role: user.role ? { id: user.role.id, name: user.role.name, type: user.role.type } : null,
    };
  };
```

- [ ] **Step 3: Verificar**

Run: `curl -s http://localhost:1337/api/users/me -H "Authorization: Bearer $JWT"`
Expected: JSON com `"role": { "id": ..., "name": "Student", "type": "student" }`. Repetir com o professor pendente criado na Task 4 (confirmando o e-mail antes): `"type": "teacher_pending"`.

- [ ] **Step 4: Commit**

```bash
git add src/extensions/users-permissions/strapi-server.ts
git commit -m "feat: expoe role do usuario em /api/users/me"
```

---

### Task 6: Aprovação e rejeição de candidaturas (repo `fluent-too-api`)

**Files:**
- Create: `src/api/teacher-application/services/review.ts`
- Create: `src/api/teacher-application/services/review.test.ts`
- Modify: `src/api/teacher-application/controllers/teacher-application.ts`
- Modify: `src/api/teacher-application/routes/teacher-application.ts`
- Create: `src/auth/roles.ts`

**Interfaces:**
- Consumes: content-type da Task 3, roles da Task 1.
- Produces: `isAdminRole(type?: string): boolean`; `buildReviewDecision(application, decision, reviewerId, note?)` retornando `{ ok: true; data: {...} } | { ok: false; error: 'ALREADY_REVIEWED' | 'REVIEW_NOTE_REQUIRED' }`; rotas `POST /api/teacher-applications/:id/approve` e `/reject`.

- [ ] **Step 1: Escrever o teste que falha**

`src/api/teacher-application/services/review.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildReviewDecision } from './review';

const pending = { id: 10, status: 'pending' as const };

describe('decisão de candidatura', () => {
  it('aprova gravando revisor e data', () => {
    const result = buildReviewDecision(pending, 'approved', 7, undefined, '2026-08-28T12:00:00.000Z');

    expect(result).toEqual({
      ok: true,
      data: {
        status: 'approved',
        reviewedBy: 7,
        reviewedAt: '2026-08-28T12:00:00.000Z',
        reviewNote: null,
      },
    });
  });

  it('rejeita exigindo nota', () => {
    expect(buildReviewDecision(pending, 'rejected', 7, '   ', '2026-08-28T12:00:00.000Z')).toEqual({
      ok: false,
      error: 'REVIEW_NOTE_REQUIRED',
    });
  });

  it('grava a nota na rejeição', () => {
    const result = buildReviewDecision(pending, 'rejected', 7, 'Sem comprovação', '2026-08-28T12:00:00.000Z');

    expect(result).toEqual({
      ok: true,
      data: {
        status: 'rejected',
        reviewedBy: 7,
        reviewedAt: '2026-08-28T12:00:00.000Z',
        reviewNote: 'Sem comprovação',
      },
    });
  });

  it('recusa reprocessar candidatura já decidida', () => {
    expect(buildReviewDecision({ id: 10, status: 'approved' }, 'approved', 7, undefined, '2026-08-28T12:00:00.000Z')).toEqual({
      ok: false,
      error: 'ALREADY_REVIEWED',
    });
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- src/api/teacher-application/services/review.test.ts`
Expected: FAIL — `Cannot find module './review'`.

- [ ] **Step 3: Implementar o serviço e o helper de role**

`src/auth/roles.ts`:

```ts
export const ADMIN_ROLE_TYPES = ['app_admin', 'super_admin'] as const;

export function isAdminRole(type?: string | null) {
  return ADMIN_ROLE_TYPES.includes(type as (typeof ADMIN_ROLE_TYPES)[number]);
}

export function isContentCreatorRole(type?: string | null) {
  return type === 'teacher' || isAdminRole(type);
}
```

`src/api/teacher-application/services/review.ts`:

```ts
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type ReviewDecisionResult =
  | { ok: true; data: { status: ApplicationStatus; reviewedBy: number | string; reviewedAt: string; reviewNote: string | null } }
  | { ok: false; error: 'ALREADY_REVIEWED' | 'REVIEW_NOTE_REQUIRED' };

export function buildReviewDecision(
  application: { id: number | string; status: ApplicationStatus },
  decision: 'approved' | 'rejected',
  reviewerId: number | string,
  note: string | undefined,
  now: string
): ReviewDecisionResult {
  if (application.status !== 'pending') return { ok: false, error: 'ALREADY_REVIEWED' };

  const trimmedNote = (note ?? '').trim();
  if (decision === 'rejected' && !trimmedNote) return { ok: false, error: 'REVIEW_NOTE_REQUIRED' };

  return {
    ok: true,
    data: {
      status: decision,
      reviewedBy: reviewerId,
      reviewedAt: now,
      reviewNote: trimmedNote || null,
    },
  };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test -- src/api/teacher-application/services/review.test.ts`
Expected: PASS.

- [ ] **Step 5: Implementar controller e rotas**

`src/api/teacher-application/controllers/teacher-application.ts`:

```ts
import { factories } from '@strapi/strapi';
import { isAdminRole } from '../../../auth/roles';
import { buildReviewDecision } from '../services/review';

const UID = 'api::teacher-application.teacher-application' as never;

export default factories.createCoreController(UID, ({ strapi }) => ({
  async find(ctx) {
    const reviewer = await getReviewer(strapi, ctx.state.user?.id);
    if (!reviewer) return ctx.forbidden();

    const status = ctx.query?.status;
    const entries = await strapi.db.query(UID).findMany({
      where: typeof status === 'string' ? { status } : {},
      orderBy: { createdAt: 'desc' },
      populate: ['user', 'attachment', 'reviewedBy'],
    });

    ctx.body = { data: entries };
  },

  async findOne(ctx) {
    const reviewer = await getReviewer(strapi, ctx.state.user?.id);
    if (!reviewer) return ctx.forbidden();

    const entry = await strapi.db.query(UID).findOne({
      where: { id: ctx.params.id },
      populate: ['user', 'attachment', 'reviewedBy'],
    });

    if (!entry) return ctx.notFound();
    ctx.body = { data: entry };
  },

  async approve(ctx) {
    return review(ctx, 'approved');
  },

  async reject(ctx) {
    return review(ctx, 'rejected');
  },
}));

async function review(ctx: any, decision: 'approved' | 'rejected') {
  const strapi = global.strapi;
  const reviewer = await getReviewer(strapi, ctx.state.user?.id);
  if (!reviewer) return ctx.forbidden();

  const application = await strapi.db.query(UID).findOne({
    where: { id: ctx.params.id },
    populate: ['user'],
  });
  if (!application) return ctx.notFound();

  const note = ctx.request.body?.reviewNote;
  const result = buildReviewDecision(application, decision, reviewer.id, note, new Date().toISOString());
  if (!result.ok) {
    return result.error === 'ALREADY_REVIEWED' ? ctx.conflict(result.error) : ctx.badRequest(result.error);
  }

  if (decision === 'approved') {
    const teacherRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'teacher' } });
    if (!teacherRole) return ctx.badRequest('ROLE_UNAVAILABLE');

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: application.user.id },
      data: { role: teacherRole.id },
    });
  }

  const updated = await strapi.db.query(UID).update({
    where: { id: application.id },
    data: result.data,
    populate: ['user', 'attachment', 'reviewedBy'],
  });

  ctx.body = { data: updated };
}

async function getReviewer(strapi: any, id: number | string | undefined) {
  if (!id) return null;
  const user = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id },
    populate: ['role'],
  });
  return user && isAdminRole(user.role?.type) ? user : null;
}
```

`src/api/teacher-application/routes/teacher-application.ts` passa a exportar rotas customizadas junto do core router — criar `src/api/teacher-application/routes/review.ts`:

```ts
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
```

O core router de `teacher-application.ts` fica como está (Task 3).

- [ ] **Step 6: Verificar ponta a ponta**

Run: `npm run develop`, depois com um JWT de `app_admin` e outro de `student`:
```bash
curl -s http://localhost:1337/api/teacher-applications -H "Authorization: Bearer $ADMIN_JWT"
curl -s http://localhost:1337/api/teacher-applications -H "Authorization: Bearer $STUDENT_JWT"
curl -s -X POST http://localhost:1337/api/teacher-applications/1/approve -H "Authorization: Bearer $ADMIN_JWT"
curl -s -X POST http://localhost:1337/api/teacher-applications/1/approve -H "Authorization: Bearer $ADMIN_JWT"
```
Expected: admin lista; student recebe 403; a primeira aprovação retorna 200 e muda a role do usuário para **Teacher**; a segunda retorna 409 `ALREADY_REVIEWED`.

- [ ] **Step 7: Commit**

```bash
git add src/auth/roles.ts src/api/teacher-application
git commit -m "feat: aprovacao e rejeicao de candidaturas de professor"
```

---

### Task 7: Ownership de quiz e blog post (repo `fluent-too-api`)

**Files:**
- Modify: `src/api/quiz/content-types/quiz/schema.json`
- Modify: `src/api/blog-post/content-types/blog-post/schema.json`
- Create: `src/auth/ownership.ts`
- Create: `src/auth/ownership.test.ts`
- Create: `src/policies/is-owner-or-admin.ts`
- Modify: `src/api/quiz/controllers/quiz.ts`
- Create: `src/api/blog-post/controllers/blog-post.ts` (hoje é o core controller padrão — conferir e substituir)
- Modify: `src/api/quiz/routes/quiz.ts`, `src/api/blog-post/routes/blog-post.ts`

**Interfaces:**
- Consumes: `isAdminRole` da Task 6.
- Produces: `buildOwnedCreateData(input, user)` e `canMutateEntry(entry, user)`.

- [ ] **Step 1: Escrever o teste que falha**

`src/auth/ownership.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildOwnedCreateData, canMutateEntry } from './ownership';

const teacher = { id: 5, role: { type: 'teacher' } };
const otherTeacher = { id: 6, role: { type: 'teacher' } };
const admin = { id: 1, role: { type: 'app_admin' } };

describe('ownership de conteúdo', () => {
  it('força o owner a partir do usuário autenticado', () => {
    expect(buildOwnedCreateData({ title: 'Quiz', owner: 999 }, teacher)).toEqual({ title: 'Quiz', owner: 5 });
  });

  it('permite o dono alterar', () => {
    expect(canMutateEntry({ owner: { id: 5 } }, teacher)).toBe(true);
  });

  it('bloqueia quem não é dono', () => {
    expect(canMutateEntry({ owner: { id: 5 } }, otherTeacher)).toBe(false);
  });

  it('permite admin alterar qualquer registro', () => {
    expect(canMutateEntry({ owner: { id: 5 } }, admin)).toBe(true);
    expect(canMutateEntry({ owner: null }, admin)).toBe(true);
  });

  it('bloqueia registro sem dono para não-admin', () => {
    expect(canMutateEntry({ owner: null }, teacher)).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- src/auth/ownership.test.ts`
Expected: FAIL — `Cannot find module './ownership'`.

- [ ] **Step 3: Implementar**

`src/auth/ownership.ts`:

```ts
import { isAdminRole } from './roles';

type OwnerUser = { id: number | string; role?: { type?: string } | null };

export function buildOwnedCreateData(input: Record<string, unknown>, user: OwnerUser) {
  const { owner: _ignoredOwner, ...rest } = input ?? {};
  return { ...rest, owner: user.id };
}

export function canMutateEntry(entry: { owner?: { id: number | string } | null }, user: OwnerUser) {
  if (isAdminRole(user.role?.type)) return true;
  return Boolean(entry.owner) && String(entry.owner?.id) === String(user.id);
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test -- src/auth/ownership.test.ts`
Expected: PASS.

- [ ] **Step 5: Adicionar o campo `owner` e ligar nas rotas**

Em `src/api/quiz/content-types/quiz/schema.json` e `src/api/blog-post/content-types/blog-post/schema.json`, acrescentar em `attributes`:

```json
    "owner": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    }
```

`src/policies/is-owner-or-admin.ts`:

```ts
import { canMutateEntry } from '../auth/ownership';

export default async (policyContext: any, _config: unknown, { strapi }: { strapi: any }) => {
  const userId = policyContext.state.user?.id;
  if (!userId) return false;

  const user = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: userId },
    populate: ['role'],
  });
  if (!user) return false;

  const uid = policyContext.state.route.info.apiName === 'quiz' ? 'api::quiz.quiz' : 'api::blog-post.blog-post';
  const entry = await strapi.db.query(uid).findOne({
    where: { documentId: policyContext.params.id },
    populate: ['owner'],
  }) ?? await strapi.db.query(uid).findOne({
    where: { id: policyContext.params.id },
    populate: ['owner'],
  });

  if (!entry) return false;
  return canMutateEntry(entry, user);
};
```

Em `src/api/quiz/routes/quiz.ts`:

```ts
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::quiz.quiz', {
  config: {
    update: { policies: ['global::is-owner-or-admin'] },
    delete: { policies: ['global::is-owner-or-admin'] },
  },
});
```

Em `src/api/blog-post/routes/blog-post.ts`, o mesmo com `'api::blog-post.blog-post'`.

No `src/api/quiz/controllers/quiz.ts`, acrescentar ao objeto do controller (mantendo `find` e `findOne` como estão):

```ts
  async create(ctx: Context) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();
    ctx.request.body = { data: buildOwnedCreateData(ctx.request.body?.data ?? {}, user) };
    return super.create(ctx);
  },
```

com `import { buildOwnedCreateData } from '../../../auth/ownership';` no topo.

`src/api/blog-post/controllers/blog-post.ts` (substituir o conteúdo atual):

```ts
import { factories } from '@strapi/strapi';
import type { Context } from 'koa';
import { buildOwnedCreateData } from '../../../auth/ownership';

export default factories.createCoreController('api::blog-post.blog-post' as never, () => ({
  async create(ctx: Context) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();
    ctx.request.body = { data: buildOwnedCreateData((ctx.request.body as any)?.data ?? {}, user as any) };
    return super.create(ctx);
  },
}));
```

- [ ] **Step 6: Verificar ponta a ponta**

Run: `npm run develop`, com o JWT do professor aprovado da Task 6 e um segundo professor:
```bash
curl -s -X POST http://localhost:1337/api/quizzes -H "Authorization: Bearer $TEACHER_JWT" \
  -H 'Content-Type: application/json' \
  -d '{"data":{"title":"Teste","slug":"teste","targetLanguage":"en","level":"A1","type":"multiple-choice","questions":[],"owner":999}}'
curl -s -X PUT http://localhost:1337/api/quizzes/<documentId> -H "Authorization: Bearer $OTHER_TEACHER_JWT" \
  -H 'Content-Type: application/json' -d '{"data":{"title":"Invadido"}}'
```
Expected: o create grava `owner` = id do professor autenticado (nunca 999); o update do outro professor retorna 403; o mesmo update com `$ADMIN_JWT` retorna 200.

- [ ] **Step 7: Rodar a suíte e commitar**

Run: `npm test`
Expected: PASS.

```bash
git add src/auth/ownership.ts src/auth/ownership.test.ts src/policies src/api/quiz src/api/blog-post
git commit -m "feat: professor so edita o proprio conteudo"
```

---

### Task 8: Contratos e helpers de role no front (repo `fluent-too`)

**Files:**
- Modify: `lib/auth/contracts.ts`
- Create: `lib/auth/roles.ts`
- Create: `lib/auth/roles.test.ts`

**Interfaces:**
- Consumes: `/api/users/me` com `role` (Task 5).
- Produces: `AppRole`; `AuthUser.role`; `canCreateContent(role?: AppRole)`, `canReviewTeachers(role?: AppRole)`, `isPendingTeacher(role?: AppRole)`; `TeacherRegisterPayload`.

- [ ] **Step 1: Escrever o teste que falha**

`lib/auth/roles.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { canCreateContent, canReviewTeachers, isPendingTeacher } from "./roles";

describe("capacidades por role", () => {
  it("define quem cria conteúdo", () => {
    expect(canCreateContent("teacher")).toBe(true);
    expect(canCreateContent("app_admin")).toBe(true);
    expect(canCreateContent("super_admin")).toBe(true);
    expect(canCreateContent("teacher_pending")).toBe(false);
    expect(canCreateContent("student")).toBe(false);
    expect(canCreateContent(undefined)).toBe(false);
  });

  it("define quem revisa candidaturas", () => {
    expect(canReviewTeachers("app_admin")).toBe(true);
    expect(canReviewTeachers("super_admin")).toBe(true);
    expect(canReviewTeachers("teacher")).toBe(false);
    expect(canReviewTeachers("student")).toBe(false);
    expect(canReviewTeachers(undefined)).toBe(false);
  });

  it("identifica professor pendente", () => {
    expect(isPendingTeacher("teacher_pending")).toBe(true);
    expect(isPendingTeacher("teacher")).toBe(false);
    expect(isPendingTeacher(undefined)).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- lib/auth/roles.test.ts`
Expected: FAIL — módulo `./roles` não existe.

- [ ] **Step 3: Implementar**

`lib/auth/roles.ts`:

```ts
import type { AppRole } from "./contracts";

export function canCreateContent(role?: AppRole) {
  return role === "teacher" || canReviewTeachers(role);
}

export function canReviewTeachers(role?: AppRole) {
  return role === "app_admin" || role === "super_admin";
}

export function isPendingTeacher(role?: AppRole) {
  return role === "teacher_pending";
}
```

Em `lib/auth/contracts.ts`:

```ts
export type AppRole = "super_admin" | "app_admin" | "teacher" | "teacher_pending" | "student";

export type AuthUser = {
  id: number;
  email: string;
  username?: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: { id: number; name: string; type: AppRole } | null;
};

export type TeacherRegisterPayload = {
  email: string;
  password: string;
  passwordConfirmation: string;
  bio: string;
  experience: string;
  languages: string[];
  credentialUrl?: string;
};
```

E acrescentar a `AuthErrorCode`: `"TEACHER_APPLICATION_EXISTS" | "FILE_TOO_LARGE" | "INVALID_FILE_TYPE" | "REVIEW_NOTE_REQUIRED" | "ALREADY_REVIEWED"`.

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test && npm run lint`
Expected: PASS nos dois.

- [ ] **Step 5: Commit**

```bash
git add lib/auth/contracts.ts lib/auth/roles.ts lib/auth/roles.test.ts
git commit -m "feat: contratos e helpers de role no front"
```

---

### Task 9: Registro com escolha de perfil (repo `fluent-too`)

**Files:**
- Create: `lib/auth/teacher-registration.ts`
- Create: `lib/auth/teacher-registration.test.ts`
- Create: `app/api/auth/register-teacher/route.ts`
- Create: `app/[locale]/register/ProfileChooser.tsx`
- Create: `app/[locale]/register/TeacherRegisterForm.tsx`
- Modify: `app/[locale]/register/page.tsx`
- Modify: `messages/pt-br.json`, `messages/en-us.json`, `messages/fr-fr.json`

**Interfaces:**
- Consumes: `TeacherRegisterPayload` (Task 8), endpoint `register-teacher` (Task 4).
- Produces: `validateTeacherRegister(input)`, `validateAttachment(file)`, rota `POST /api/auth/register-teacher`.

- [ ] **Step 1: Escrever o teste que falha**

`lib/auth/teacher-registration.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateAttachment, validateTeacherRegister } from "./teacher-registration";

const valid = {
  email: "Prof@Example.com",
  password: "senha-forte-123",
  passwordConfirmation: "senha-forte-123",
  bio: "Professor de inglês.",
  experience: "CELTA, 8 anos.",
  languages: ["en"],
};

describe("validação do cadastro de professor", () => {
  it("aceita payload completo normalizando o e-mail", () => {
    const result = validateTeacherRegister(valid);

    expect(result).toEqual({ ok: true, data: { ...valid, email: "prof@example.com" } });
  });

  it("reaproveita as regras de senha do registro comum", () => {
    const result = validateTeacherRegister({ ...valid, passwordConfirmation: "outra" });

    expect(result).toEqual({ ok: false, fieldErrors: { passwordConfirmation: "PASSWORDS_DO_NOT_MATCH" } });
  });

  it("exige bio, experiência e idioma", () => {
    expect(validateTeacherRegister({ ...valid, bio: " " })).toEqual({ ok: false, fieldErrors: { bio: "REQUIRED" } });
    expect(validateTeacherRegister({ ...valid, experience: "" })).toEqual({
      ok: false,
      fieldErrors: { experience: "REQUIRED" },
    });
    expect(validateTeacherRegister({ ...valid, languages: [] })).toEqual({
      ok: false,
      fieldErrors: { languages: "REQUIRED" },
    });
  });
});

describe("validação do anexo", () => {
  it("aceita ausência de anexo", () => {
    expect(validateAttachment(null)).toEqual({ ok: true });
  });

  it("recusa arquivo acima de 5 MB", () => {
    expect(validateAttachment({ size: 5 * 1024 * 1024 + 1, type: "application/pdf" })).toEqual({
      ok: false,
      error: "FILE_TOO_LARGE",
    });
  });

  it("recusa tipo não permitido", () => {
    expect(validateAttachment({ size: 1000, type: "application/x-msdownload" })).toEqual({
      ok: false,
      error: "INVALID_FILE_TYPE",
    });
  });

  it("aceita pdf, png e jpeg", () => {
    expect(validateAttachment({ size: 1000, type: "application/pdf" })).toEqual({ ok: true });
    expect(validateAttachment({ size: 1000, type: "image/png" })).toEqual({ ok: true });
    expect(validateAttachment({ size: 1000, type: "image/jpeg" })).toEqual({ ok: true });
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- lib/auth/teacher-registration.test.ts`
Expected: FAIL — módulo não existe.

- [ ] **Step 3: Implementar a validação**

`lib/auth/teacher-registration.ts`:

```ts
import type { AuthErrorCode, TeacherRegisterPayload } from "./contracts";
import { validateRegister } from "./validation";

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = ["application/pdf", "image/png", "image/jpeg"];
const SUPPORTED_LANGUAGES = ["pt", "en", "fr"];

export type TeacherRegisterResult =
  | { ok: true; data: TeacherRegisterPayload }
  | { ok: false; fieldErrors: Record<string, "REQUIRED" | "INVALID_EMAIL" | "WEAK_PASSWORD" | "PASSWORDS_DO_NOT_MATCH"> };

export function validateTeacherRegister(input: TeacherRegisterPayload): TeacherRegisterResult {
  const base = validateRegister({
    email: input.email,
    password: input.password,
    passwordConfirmation: input.passwordConfirmation,
  });
  if (!base.ok) return base;

  const bio = (input.bio ?? "").trim();
  const experience = (input.experience ?? "").trim();
  const languages = (input.languages ?? []).filter((language) => SUPPORTED_LANGUAGES.includes(language));

  if (!bio) return { ok: false, fieldErrors: { bio: "REQUIRED" } };
  if (!experience) return { ok: false, fieldErrors: { experience: "REQUIRED" } };
  if (languages.length === 0) return { ok: false, fieldErrors: { languages: "REQUIRED" } };

  return {
    ok: true,
    data: {
      ...base.data,
      bio,
      experience,
      languages,
      ...(input.credentialUrl?.trim() ? { credentialUrl: input.credentialUrl.trim() } : {}),
    },
  };
}

export function validateAttachment(
  file: { size: number; type: string } | null
): { ok: true } | { ok: false; error: Extract<AuthErrorCode, "FILE_TOO_LARGE" | "INVALID_FILE_TYPE"> } {
  if (!file) return { ok: true };
  if (file.size > MAX_ATTACHMENT_BYTES) return { ok: false, error: "FILE_TOO_LARGE" };
  if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) return { ok: false, error: "INVALID_FILE_TYPE" };
  return { ok: true };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test -- lib/auth/teacher-registration.test.ts`
Expected: PASS.

- [ ] **Step 5: Criar a rota proxy**

`app/api/auth/register-teacher/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getSiteUrl, isTrustedOrigin } from "@/lib/auth/request";
import { validateAttachment, validateTeacherRegister } from "@/lib/auth/teacher-registration";

const STRAPI_URL = process.env.STRAPI_INTERNAL_URL ?? "http://localhost:1337";

export async function POST(request: Request) {
  if (!isTrustedOrigin(request.headers.get("origin"), getSiteUrl(request))) {
    return NextResponse.json({ ok: false, error: "INVALID_ORIGIN" }, { status: 403 });
  }

  const form = await request.formData();
  const payload = validateTeacherRegister({
    email: String(form.get("email") ?? ""),
    password: String(form.get("password") ?? ""),
    passwordConfirmation: String(form.get("passwordConfirmation") ?? ""),
    bio: String(form.get("bio") ?? ""),
    experience: String(form.get("experience") ?? ""),
    languages: form.getAll("languages").map(String),
    credentialUrl: String(form.get("credentialUrl") ?? ""),
  });
  if (!payload.ok) return NextResponse.json({ ok: false, fieldErrors: payload.fieldErrors }, { status: 400 });

  const file = form.get("attachment");
  const attachment = file instanceof File && file.size > 0 ? file : null;
  const attachmentCheck = validateAttachment(attachment);
  if (!attachmentCheck.ok) return NextResponse.json({ ok: false, error: attachmentCheck.error }, { status: 400 });

  let attachmentId: number | undefined;
  if (attachment) {
    const upload = new FormData();
    upload.append("files", attachment);
    const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, { method: "POST", body: upload });
    if (!uploadResponse.ok) return NextResponse.json({ ok: false, error: "SERVICE_UNAVAILABLE" }, { status: 503 });
    const uploaded = (await uploadResponse.json()) as Array<{ id: number }>;
    attachmentId = uploaded[0]?.id;
  }

  const response = await fetch(`${STRAPI_URL}/api/auth/local/register-teacher`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload.data, ...(attachmentId ? { attachment: attachmentId } : {}) }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
    const message = body.error?.message ?? "UNKNOWN_ERROR";
    const error = message === "EMAIL_ALREADY_REGISTERED" ? "EMAIL_ALREADY_REGISTERED" : message;
    return NextResponse.json({ ok: false, error }, { status: response.status });
  }

  return NextResponse.json({ ok: true });
}
```

Se o upload público não estiver liberado no Strapi, a permissão `plugin::upload.content-api.upload` precisa estar ativa para o role `public` — conferir em Settings → Roles → Public e anotar no Step 7.

- [ ] **Step 6: Criar as telas**

`app/[locale]/register/ProfileChooser.tsx` — client component com dois botões (`student` / `teacher`) que troca o estado local; renderiza `RegisterForm` (existente, inalterado) ou `TeacherRegisterForm`. Textos vindos de `dict.auth.profileStudent`, `dict.auth.profileTeacher`, `dict.auth.profileTitle`.

`app/[locale]/register/TeacherRegisterForm.tsx` — client component com os campos de `RegisterForm` mais `bio` (textarea), `experience` (textarea), `languages` (checkboxes pt/en/fr), `credentialUrl` (url, opcional), `attachment` (`input type="file"`, opcional). Submete `FormData` para `/api/auth/register-teacher` e, no sucesso, redireciona para `/${locale}/email-confirmation?email=...` — mesmo destino do estudante.

`app/[locale]/register/page.tsx` passa a renderizar `<ProfileChooser dict={dict} locale={locale} />`.

Chaves novas em `messages/*.json` (bloco `auth`), nos três idiomas: `profileTitle`, `profileStudent`, `profileStudentHint`, `profileTeacher`, `profileTeacherHint`, `teacherBioLabel`, `teacherExperienceLabel`, `teacherLanguagesLabel`, `teacherCredentialLabel`, `teacherAttachmentLabel`, `teacherAttachmentHint`, `teacherSubmit`, e em `auth.errors`: `TEACHER_APPLICATION_EXISTS`, `FILE_TOO_LARGE`, `INVALID_FILE_TYPE`.

- [ ] **Step 7: Verificar manualmente**

Run: `npm run dev` (front) com o Strapi rodando; abrir `http://localhost:3000/pt-br/register`.
Expected: passo de escolha aparece; caminho estudante idêntico ao de hoje; caminho professor com anexo cria o usuário como **Teacher (pending)** e a candidatura no Strapi; anexo de 6 MB é recusado no front com a mensagem de `FILE_TOO_LARGE`.

- [ ] **Step 8: Rodar tudo e commitar**

Run: `npm test && npm run lint`
Expected: PASS.

```bash
git add lib/auth/teacher-registration.ts lib/auth/teacher-registration.test.ts app/api/auth/register-teacher app/[locale]/register messages
git commit -m "feat: cadastro com escolha entre estudante e professor"
```

---

### Task 10: Aviso de candidatura no dashboard (repo `fluent-too`)

**Files:**
- Modify: `app/[locale]/dashboard/page.tsx`
- Create: `lib/teacher-applications/client.ts`
- Create: `lib/teacher-applications/client.test.ts`
- Modify: `messages/pt-br.json`, `messages/en-us.json`, `messages/fr-fr.json`

**Interfaces:**
- Consumes: `isPendingTeacher` (Task 8), `role` em `me` (Task 5), endpoints da Task 6.
- Produces: `createTeacherApplicationsClient({ baseUrl?, fetcher? })` com `list(accessToken, status?)`, `getMine(accessToken)`, `approve(accessToken, id)`, `reject(accessToken, id, note)`.

- [ ] **Step 1: Escrever o teste que falha**

`lib/teacher-applications/client.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { createTeacherApplicationsClient } from "./client";

function fetcherReturning(body: unknown, status = 200) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status }));
}

describe("cliente de candidaturas", () => {
  it("lista filtrando por status com o token do admin", async () => {
    const fetcher = fetcherReturning({ data: [{ id: 1, status: "pending" }] });
    const client = createTeacherApplicationsClient({ baseUrl: "http://api", fetcher });

    const result = await client.list("token-admin", "pending");

    expect(result).toEqual([{ id: 1, status: "pending" }]);
    expect(fetcher).toHaveBeenCalledWith(
      "http://api/api/teacher-applications?status=pending",
      expect.objectContaining({ headers: { Authorization: "Bearer token-admin" } })
    );
  });

  it("devolve lista vazia quando a API falha", async () => {
    const client = createTeacherApplicationsClient({
      baseUrl: "http://api",
      fetcher: fetcherReturning({}, 500),
    });

    expect(await client.list("token-admin")).toEqual([]);
  });

  it("rejeita enviando a nota", async () => {
    const fetcher = fetcherReturning({ data: { id: 1, status: "rejected" } });
    const client = createTeacherApplicationsClient({ baseUrl: "http://api", fetcher });

    const result = await client.reject("token-admin", 1, "Sem comprovação");

    expect(result).toEqual({ ok: true });
    expect(fetcher).toHaveBeenCalledWith(
      "http://api/api/teacher-applications/1/reject",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ reviewNote: "Sem comprovação" }) })
    );
  });

  it("propaga conflito de candidatura já decidida", async () => {
    const client = createTeacherApplicationsClient({
      baseUrl: "http://api",
      fetcher: fetcherReturning({ error: { message: "ALREADY_REVIEWED" } }, 409),
    });

    expect(await client.approve("token-admin", 1)).toEqual({ ok: false, error: "ALREADY_REVIEWED" });
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- lib/teacher-applications/client.test.ts`
Expected: FAIL — módulo não existe.

- [ ] **Step 3: Implementar o cliente**

`lib/teacher-applications/client.ts`: espelhar o formato de `lib/blog/strapi.ts` (factory com `baseUrl`/`fetcher`/`timeoutMs`, `try/catch` devolvendo vazio). Três métodos, nada além disso: `list(accessToken, status?)`, `approve(accessToken, id)`, `reject(accessToken, id, note)`. `approve`/`reject` retornam `{ ok: true }` ou `{ ok: false; error: string }` lendo `error.message` do corpo. Header `Authorization: Bearer <token>` em todas as chamadas.

O aviso do dashboard usa apenas `isPendingTeacher(role)` — não há chamada de API para o próprio professor. Mostrar o motivo da rejeição para ele exigiria um endpoint `GET /api/teacher-applications/mine` que não existe; está listado em "Fora deste plano".

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test -- lib/teacher-applications/client.test.ts`
Expected: PASS.

- [ ] **Step 5: Mostrar o aviso no dashboard**

Em `app/[locale]/dashboard/page.tsx`, após resolver a sessão, quando `isPendingTeacher(session.user.role?.type)`, renderizar um bloco de aviso no topo com `dict.dashboard.teacherPendingTitle` e `dict.dashboard.teacherPendingText`. O resto da página continua idêntico — professor pendente vê o dashboard de estudante.

Acrescentar `teacherPendingTitle` e `teacherPendingText` em `messages/*.json` nos três idiomas.

- [ ] **Step 6: Verificar manualmente**

Run: `npm run dev`; logar com o professor pendente criado na Task 9.
Expected: dashboard normal + aviso de candidatura em análise. Logar como estudante: sem aviso.

- [ ] **Step 7: Rodar tudo e commitar**

Run: `npm test && npm run lint`
Expected: PASS.

```bash
git add lib/teacher-applications app/[locale]/dashboard/page.tsx messages
git commit -m "feat: aviso de candidatura de professor em analise"
```

---

### Task 11: Tela de aprovação de professores (repo `fluent-too`)

**Files:**
- Create: `app/api/teacher-applications/route.ts`
- Create: `app/api/teacher-applications/[id]/[action]/route.ts`
- Create: `app/[locale]/admin/teachers/page.tsx`
- Create: `app/[locale]/admin/teachers/TeacherApplicationsPanel.tsx`
- Modify: `messages/pt-br.json`, `messages/en-us.json`, `messages/fr-fr.json`

**Interfaces:**
- Consumes: `canReviewTeachers` (Task 8), cliente da Task 10, endpoints da Task 6.
- Produces: tela `/[locale]/admin/teachers`.

- [ ] **Step 1: Criar as rotas proxy**

`app/api/teacher-applications/route.ts` — `GET` lê os cookies com `readTokenCookies` (de `app/api/auth/_shared`), recusa sem `accessToken` com 401, e repassa para `client.list(accessToken, status)` usando o `status` da query string.

`app/api/teacher-applications/[id]/[action]/route.ts` — `POST`, valida `action ∈ {approve, reject}` (senão 404), exige origem confiável com `isTrustedOrigin`, lê `reviewNote` do corpo JSON e chama `client.approve` / `client.reject`. Repassa `{ ok: false, error }` com status 409 para `ALREADY_REVIEWED` e 400 para `REVIEW_NOTE_REQUIRED`.

- [ ] **Step 2: Criar a página com guard**

`app/[locale]/admin/teachers/page.tsx` — server component seguindo o padrão de `app/[locale]/dashboard/page.tsx`: lê cookies, `resolveSession`, e:

```ts
if (session.status !== "authenticated" && session.status !== "refreshed") redirect(`/${locale}/login`);
if (!canReviewTeachers(session.user.role?.type)) notFound();
```

Carrega as candidaturas no servidor com o cliente da Task 10 e passa para `TeacherApplicationsPanel`.

`TeacherApplicationsPanel.tsx` — client component: filtro por status (`pending` por padrão), cards com e-mail, idiomas, bio, experiência, link e anexo (link para o arquivo), botões **Aprovar** e **Rejeitar**. Rejeitar abre um campo de nota obrigatório antes de enviar (sem `window.confirm` nem `alert`). Após a ação, `router.refresh()`.

Chaves novas em `messages/*.json` (bloco `admin`), nos três idiomas: `teachersTitle`, `teachersEmpty`, `teachersFilterPending`, `teachersFilterApproved`, `teachersFilterRejected`, `teachersApprove`, `teachersReject`, `teachersRejectNoteLabel`, `teachersRejectNoteRequired`, `teachersAlreadyReviewed`.

- [ ] **Step 3: Verificar ponta a ponta**

Run: `npm run dev` com o Strapi rodando.
Expected:
- logado como `app_admin`: `/pt-br/admin/teachers` lista a candidatura pendente; aprovar muda a role do usuário para **Teacher** no Strapi e some da lista `pending`;
- rejeitar sem nota é bloqueado no front; com nota, grava `reviewNote`;
- aprovar duas vezes (recarregando a lista antiga) mostra a mensagem de `teachersAlreadyReviewed`;
- logado como `student` ou `teacher`: a rota devolve 404;
- deslogado: redireciona para o login.

- [ ] **Step 4: Rodar tudo e commitar**

Run: `npm test && npm run lint && npm run build`
Expected: PASS nos três.

```bash
git add app/api/teacher-applications app/[locale]/admin/teachers messages
git commit -m "feat: tela de aprovacao de professores"
```

---

### Task 12: Verificação final e regressão (dois repos)

**Files:** nenhum arquivo novo; corrigir o que falhar.

- [ ] **Step 1: Suíte da API**

Run (em `fluent-too-api`): `npm test && npx tsc --noEmit && npm run build`
Expected: PASS. `strapi build` compila o admin sem erro.

- [ ] **Step 2: Suíte do front**

Run (em `fluent-too`): `npm test && npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 3: Regressão do fluxo do estudante**

Com os dois rodando:
- registrar um estudante novo em `/pt-br/register` (caminho estudante) → e-mail de confirmação chega, usuário nasce com role **Student**;
- logar, responder um quiz, ver o histórico no dashboard;
- `/pt-br/admin/teachers` retorna 404 para esse usuário.

Expected: tudo igual ao comportamento anterior à mudança, exceto a role nomeada.

- [ ] **Step 4: Regressão do conteúdo público**

Abrir `/pt-br/blog` e `/pt-br/quizzes` deslogado.
Expected: posts e quizzes públicos continuam carregando — confirma que `preserveExisting` manteve as permissões do role `public`.

- [ ] **Step 5: Commit de ajustes, se houver**

```bash
git add -A
git commit -m "fix: ajustes da verificacao final"
```

---

## Fora deste plano

- Telas de criação de quiz e blog para o professor (fatia 2, spec própria).
- Professor ver o motivo da rejeição no próprio dashboard — precisa de um endpoint `GET /api/teacher-applications/mine`; anotado na Task 10.
- Diferença de poderes entre `super_admin` e `app_admin`.
