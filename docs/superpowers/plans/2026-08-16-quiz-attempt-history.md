# Quiz Attempt History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persistir o histórico de resultados dos quizzes por aluno autenticado.

**Architecture:** O Strapi armazena cada conclusão como `Quiz Attempt`, vinculado ao usuário e opcionalmente ao quiz. O controller restringe consultas ao próprio usuário, com exceção do role `app_admin`.

**Tech Stack:** Strapi 5, TypeScript, Vitest, PostgreSQL.

---

### Task 1: Modelo e permissões

**Files:**
- Create: `src/api/quiz-attempt/content-types/quiz-attempt/schema.json`
- Modify: `src/auth/access-control.ts`
- Test: `src/auth/access-control.test.ts`

- [x] **Step 1: Write failing permission test**

Run: `npm test -- src/auth/access-control.test.ts`

Expected: FAIL until `quiz-attempt` permissions exist.

- [x] **Step 2: Add permissions**

`authenticated` can `find`, `findOne`, and `create` quiz attempts. `app_admin` can manage all quiz attempts.

- [x] **Step 3: Create content-type**

Create `Quiz Attempt` with user, quiz, quiz metadata, score, counts, answers, details, and completed date.

### Task 2: Owner-scoped access

**Files:**
- Create: `src/api/quiz-attempt/services/access.ts`
- Create: `src/api/quiz-attempt/services/access.test.ts`
- Create: `src/api/quiz-attempt/controllers/quiz-attempt.ts`
- Create: `src/api/quiz-attempt/routes/quiz-attempt.ts`
- Create: `src/api/quiz-attempt/services/quiz-attempt.ts`

- [x] **Step 1: Write failing access test**

Run: `npm test -- src/api/quiz-attempt/services/access.test.ts`

Expected: FAIL until access helpers exist.

- [x] **Step 2: Implement access helpers**

Create helper functions to build attempt data and owner-scoped filters.

- [x] **Step 3: Implement controller**

Create attempts for authenticated users and list only own attempts unless role is `app_admin`.

### Task 3: Verification

- [x] **Step 1: Regenerate Strapi types**

Run: `npx strapi ts:generate-types`

- [x] **Step 2: Run backend tests**

Run: `npm test`

Expected: 3 files and 12 tests pass.

- [x] **Step 3: Build backend**

Run: `npm run build`

Expected: Strapi TypeScript and admin build pass.
