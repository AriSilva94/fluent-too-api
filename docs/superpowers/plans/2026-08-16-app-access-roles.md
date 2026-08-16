# App Access Roles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar perfis de acesso do aplicativo no Strapi para admin e professor, com o usuário `ariovaldo.bsjunior@gmail.com` como admin.

**Architecture:** O backend usa o plugin `users-permissions` do Strapi para usuários do app. A configuração é idempotente no bootstrap, cria roles e permissões quando a aplicação sobe e reaplica o vínculo do usuário admin.

**Tech Stack:** Strapi 5, TypeScript, Vitest, PostgreSQL.

---

### Task 1: Plano de acesso

**Files:**
- Create: `src/auth/access-control.ts`
- Test: `src/auth/access-control.test.ts`

- [x] **Step 1: Write the failing test**

```ts
expect(buildAccessControlPlan('ariovaldo.bsjunior@gmail.com').roles).toEqual([
  { name: 'Admin', type: 'app_admin', description: 'Can view every app resource and manage quizzes' },
  { name: 'Teacher', type: 'teacher', description: 'Can create quizzes' },
]);
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -- src/auth/access-control.test.ts`

Expected: FAIL because `src/auth/access-control.ts` does not exist.

- [x] **Step 3: Write minimal implementation**

Create `buildAccessControlPlan` with roles `Admin` and `Teacher`, normalized admin e-mail, admin read permissions for current content-types, admin quiz management permissions, and teacher quiz create permission.

- [x] **Step 4: Run test to verify it passes**

Run: `npm test -- src/auth/access-control.test.ts`

Expected: PASS.

### Task 2: Bootstrap synchronization

**Files:**
- Modify: `src/index.ts`
- Modify: `src/auth/access-control.ts`

- [x] **Step 1: Add bootstrap integration**

Call `ensureAppAccessControl(strapi, process.env.APP_ADMIN_EMAIL ?? 'ariovaldo.bsjunior@gmail.com')` after auth plugin store synchronization.

- [x] **Step 2: Add idempotent database sync**

Ensure role creation/update, exact permission synchronization, and assignment of `ariovaldo.bsjunior@gmail.com` to role `Admin`.

- [x] **Step 3: Execute bootstrap against local database**

Run a Strapi load script with `compileStrapi` and `createStrapi`.

Expected: roles and permissions are created without opening a persistent HTTP server.

### Task 3: Quiz content-type

**Files:**
- Create: `src/api/quiz/content-types/quiz/schema.json`
- Create: `src/api/quiz/controllers/quiz.ts`
- Create: `src/api/quiz/routes/quiz.ts`
- Create: `src/api/quiz/services/quiz.ts`
- Modify: `types/generated/contentTypes.d.ts`
- Modify: `types/generated/components.d.ts`

- [x] **Step 1: Create content-type**

Create `Quiz` with title, slug, description, target language, level, type, questions JSON, estimated minutes, and draft/publish support.

- [x] **Step 2: Create Strapi core files**

Create controller, router, and service using Strapi factories.

- [x] **Step 3: Regenerate Strapi types**

Run: `npx strapi ts:generate-types`

Expected: `api::quiz.quiz` becomes a known content type.

### Task 4: Verification

**Files:**
- Validate backend project.

- [x] **Step 1: Run tests**

Run: `npm test`

Expected: 2 test files and 7 tests pass.

- [x] **Step 2: Build backend**

Run: `npm run build`

Expected: TypeScript compile and Strapi admin build pass.

- [x] **Step 3: Query local PostgreSQL**

Expected: `Admin` and `Teacher` roles exist, admin has read permissions for current content-types and quiz management, teacher has only quiz create, and `ariovaldo.bsjunior@gmail.com` is assigned to `Admin`.
