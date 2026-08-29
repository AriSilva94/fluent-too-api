# Escolha de perfil depois do login — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tirar a escolha entre estudante e professor do formulário de cadastro e transformá-la numa etapa de onboarding depois do login, valendo também para quem entra pelo Google.

**Architecture:** Uma role nova `unassigned` passa a ser a `default_role`, então toda conta nova nasce sem perfil. Três endpoints autenticados no Strapi fazem a transição de role e devolvem a própria candidatura; o endpoint público de cadastro de professor é removido. No Next, uma tela `/[locale]/onboarding` consome esses endpoints via rotas proxy, e as páginas que dependem de perfil redirecionam quem está `unassigned`.

**Tech Stack:** Strapi 5.52 (TypeScript, vitest), Next 16 App Router (TypeScript, Tailwind 4, vitest), PostgreSQL.

**Spec:** `fluent-too-api/docs/superpowers/specs/2026-08-29-perfil-pos-login-design.md` (emenda de `2026-08-28-teacher-student-roles-design.md`, que continua valendo no resto)

## Global Constraints

- Dois repositórios git separados, ambos na branch `feat/teacher-student-roles`: `fluent-too-api` e `fluent-too`. Cada task diz em qual repo roda; commits nunca cruzam repos.
- Role `type` values, agora seis: `super_admin`, `app_admin`, `teacher`, `teacher_pending`, `student`, `unassigned`.
- Um usuário nunca troca a própria role fora destas transições: `unassigned` → `student`, `unassigned` → `teacher_pending`, e `teacher_pending` com candidatura `rejected` → `student`. Qualquer outra tentativa é 403.
- Estudante nunca vira professor. Não existe volta para `unassigned`.
- Nenhum endpoint aceita role vinda do payload do cliente.
- Anexo: máximo 5 MB, apenas `application/pdf`, `image/png`, `image/jpeg`, recusado por `content-length` antes de o parser gravar em disco, e o arquivo temporário é removido em todos os caminhos de saída.
- Login (inclusive Google), leitura pública de quizzes e blog posts, ownership de conteúdo e a fila de aprovação em `/[locale]/admin/teachers` não mudam de comportamento.
- Textos de UI em `messages/pt-br.json`, `messages/en-us.json`, `messages/fr-fr.json`, sempre os três juntos, e o tipo `Dictionary` em `lib/getDictionary.ts` acompanha.
- Sem dependências novas. Testes: `npm test` nos dois repos; no front também `npm run lint`. Nomes de teste em português.

---

## Estrutura de arquivos

**`fluent-too-api`:**

| arquivo | responsabilidade |
|---|---|
| `src/auth/access-control.ts` (modificar) | role `unassigned` e suas permissões |
| `src/auth/config.ts` (modificar) | `default_role` passa a `unassigned` |
| `src/auth/profile-transitions.ts` (criar) | função pura que decide se uma transição de role é permitida |
| `src/api/teacher-application/controllers/profile.ts` (criar) | os três endpoints autenticados |
| `src/api/teacher-application/routes/profile.ts` (criar) | rotas `/profile/student`, `/profile/teacher`, `/profile/application` |
| `src/extensions/users-permissions/strapi-server.ts` (modificar) | remove `registerTeacher` e sua rota; mantém o override de `me` |
| `src/middlewares/teacher-attachment-limit.ts` (modificar) | passa a guardar `/api/profile/teacher` |

**`fluent-too`:**

| arquivo | responsabilidade |
|---|---|
| `lib/auth/roles.ts` (modificar) | `hasProfile`, `isUnassigned` |
| `lib/profile/client.ts` (criar) | cliente dos três endpoints |
| `app/api/profile/student/route.ts`, `app/api/profile/teacher/route.ts`, `app/api/profile/application/route.ts` (criar) | rotas proxy |
| `app/[locale]/onboarding/page.tsx` + `OnboardingChooser.tsx` + `TeacherApplicationForm.tsx` (criar) | a tela de escolha |
| `app/[locale]/register/ProfileChooser.tsx`, `TeacherRegisterForm.tsx`, `app/api/auth/register-teacher/` (remover) | o passo de perfil sai do cadastro |
| `app/[locale]/register/page.tsx` (modificar) | volta a renderizar `RegisterForm` |
| `app/[locale]/dashboard/page.tsx` + novo `TeacherApplicationStatus.tsx` (modificar/criar) | estados `pending` e `rejected` |
| `app/[locale]/admin/teachers/page.tsx` (modificar) | guard também manda `unassigned` para o onboarding |

---

### Task 1: Role `unassigned` (repo `fluent-too-api`)

**Files:**
- Modify: `src/auth/access-control.ts`, `src/auth/access-control.test.ts`
- Modify: `src/auth/config.ts`, `src/auth/config.test.ts`

**Interfaces:**
- Produces: `AppRoleType` com `'unassigned'`; `plan.permissions.unassigned`; `default_role: 'unassigned'`.

- [ ] **Step 1: Escrever os testes que falham**

Em `src/auth/access-control.test.ts`, no teste que lista as roles, incluir `'unassigned'` ao final da lista esperada, e acrescentar:

```ts
it('dá ao usuário sem perfil apenas acesso à própria conta', () => {
  const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

  expect(plan.permissions.unassigned).toEqual([
    'plugin::users-permissions.user.me',
    'plugin::users-permissions.auth.logout',
    'plugin::users-permissions.auth.changePassword',
  ]);
});

it('não deixa o usuário sem perfil tocar em quiz nem em candidatura', () => {
  const plan = buildAccessControlPlan('ariovaldo.bsjunior@gmail.com');

  expect(plan.permissions.unassigned.some((action) => action.startsWith('api::'))).toBe(false);
});
```

Em `src/auth/config.test.ts`, trocar o `default_role` esperado de `'student'` para `'unassigned'`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- src/auth`
Expected: FAIL — `plan.permissions.unassigned` é `undefined` e o `default_role` ainda é `'student'`.

- [ ] **Step 3: Implementar**

Em `src/auth/access-control.ts`: acrescentar `'unassigned'` ao `AppRoleType`, acrescentar ao final de `plan.roles`

```ts
      { name: 'Unassigned', type: 'unassigned', description: 'Signed up but has not chosen a profile yet' },
```

e em `permissions` a chave `unassigned: [...authenticatedUserActions]`.

Em `src/auth/config.ts`, `default_role: 'unassigned'`.

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/auth
git commit -m "feat: role unassigned para conta sem perfil escolhido"
```

---

### Task 2: Transições de perfil no Strapi (repo `fluent-too-api`)

**Files:**
- Create: `src/auth/profile-transitions.ts`, `src/auth/profile-transitions.test.ts`
- Create: `src/api/teacher-application/controllers/profile.ts`, `src/api/teacher-application/routes/profile.ts`
- Modify: `src/extensions/users-permissions/strapi-server.ts`
- Modify: `src/middlewares/teacher-attachment-limit.ts` (e seu teste)
- Modify: `src/auth/access-control.ts` e seu teste (permissões das novas ações)

**Interfaces:**
- Consumes: role `unassigned` da Task 1; content-type `teacher-application`; `validateTeacherRegistration`/`validateAttachmentFile` em `src/api/teacher-application/services/registration.ts`.
- Produces: `canBecomeStudent(roleType, applicationStatus?)` e `canBecomeTeacher(roleType)`; endpoints `POST /api/profile/student`, `POST /api/profile/teacher`, `GET /api/profile/application`.

- [ ] **Step 1: Escrever os testes que falham**

`src/auth/profile-transitions.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { canBecomeStudent, canBecomeTeacher } from './profile-transitions';

describe('transições de perfil', () => {
  it('deixa quem não escolheu virar estudante', () => {
    expect(canBecomeStudent('unassigned')).toBe(true);
  });

  it('deixa o professor rejeitado virar estudante', () => {
    expect(canBecomeStudent('teacher_pending', 'rejected')).toBe(true);
  });

  it('não deixa o professor em análise virar estudante', () => {
    expect(canBecomeStudent('teacher_pending', 'pending')).toBe(false);
  });

  it('não deixa quem já escolheu trocar de perfil', () => {
    expect(canBecomeStudent('student')).toBe(false);
    expect(canBecomeStudent('teacher')).toBe(false);
    expect(canBecomeTeacher('student')).toBe(false);
    expect(canBecomeTeacher('teacher')).toBe(false);
    expect(canBecomeTeacher('teacher_pending')).toBe(false);
  });

  it('só deixa quem não escolheu se candidatar a professor', () => {
    expect(canBecomeTeacher('unassigned')).toBe(true);
  });

  it('trata role ausente como proibida', () => {
    expect(canBecomeStudent(undefined)).toBe(false);
    expect(canBecomeTeacher(undefined)).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- src/auth/profile-transitions.test.ts`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar as funções puras**

`src/auth/profile-transitions.ts`:

```ts
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export function canBecomeStudent(roleType?: string | null, applicationStatus?: ApplicationStatus) {
  if (roleType === 'unassigned') return true;
  return roleType === 'teacher_pending' && applicationStatus === 'rejected';
}

export function canBecomeTeacher(roleType?: string | null) {
  return roleType === 'unassigned';
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test -- src/auth/profile-transitions.test.ts`
Expected: PASS.

- [ ] **Step 5: Implementar os endpoints**

`src/api/teacher-application/controllers/profile.ts` — um controller simples (não precisa de factory de content-type) com três handlers, todos lendo o usuário autenticado com a role populada, no mesmo padrão de `getReviewer` em `controllers/teacher-application.ts`:

- `becomeStudent`: carrega o usuário e, se ele for `teacher_pending`, a própria candidatura; chama `canBecomeStudent`; em caso negativo `ctx.forbidden('PROFILE_ALREADY_SET')`; caso positivo troca a role para a de `type: 'student'` e responde `{ data: { role: 'student' } }`.
- `becomeTeacher`: chama `canBecomeTeacher`; em caso negativo `ctx.forbidden('PROFILE_ALREADY_SET')`. Reaproveita **exatamente** a validação e o fluxo de anexo que hoje vivem em `registerTeacher` (`validateTeacherRegistration` sem os campos de conta, `validateAttachmentFile`, upload via `strapi.plugin('upload').service('upload').upload`, remoção do arquivo temporário no `finally`, limpeza do arquivo enviado se a criação da candidatura falhar). Cria a `teacher-application` em `pending` ligada ao usuário autenticado, troca a role para `teacher_pending` e responde `{ data: { role: 'teacher_pending' } }`. Se o usuário já tiver candidatura, `ctx.badRequest('TEACHER_APPLICATION_EXISTS')`.
- `myApplication`: devolve `{ data: { status, reviewNote, createdAt } }` da candidatura do próprio usuário, ou `{ data: null }` se não houver. Nunca devolve dados de outro usuário nem qualquer campo do `user`.

Como a validação de conta (e-mail/senha) sai daqui, ajuste `validateTeacherRegistration` para validar apenas os campos da candidatura (bio, experiência, idiomas, link opcional), mantendo os testes existentes que ainda fizerem sentido e removendo os que testavam e-mail e senha. Renomeie-a para `validateTeacherApplication` e atualize o arquivo de teste.

`src/api/teacher-application/routes/profile.ts`:

```ts
export default {
  routes: [
    { method: 'POST', path: '/profile/student', handler: 'profile.becomeStudent' },
    { method: 'POST', path: '/profile/teacher', handler: 'profile.becomeTeacher' },
    { method: 'GET', path: '/profile/application', handler: 'profile.myApplication' },
  ],
};
```

Em `src/auth/access-control.ts`, as três ações
(`api::teacher-application.teacher-application.becomeStudent`, `.becomeTeacher`, `.myApplication`)
precisam ser concedidas às roles que podem chamá-las: `unassigned` recebe as três,
`teacher_pending` recebe `becomeStudent` e `myApplication`, `student` e `teacher` recebem
`myApplication`. Atualize `access-control.test.ts` junto.

Em `src/extensions/users-permissions/strapi-server.ts`, remova o handler `registerTeacher` e o
`plugin.routes['content-api'].routes.push(...)` correspondente. O override de `me` fica.

Em `src/middlewares/teacher-attachment-limit.ts`, troque o caminho guardado de
`/api/auth/local/register-teacher` para `/api/profile/teacher`, e ajuste o teste.

- [ ] **Step 6: Rodar a suíte**

Run: `npm test && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: endpoints autenticados de escolha de perfil"
```

---

### Task 3: Cliente e rotas proxy de perfil (repo `fluent-too`)

**Files:**
- Modify: `lib/auth/roles.ts`, `lib/auth/roles.test.ts`, `lib/auth/contracts.ts`
- Create: `lib/profile/client.ts`, `lib/profile/client.test.ts`
- Create: `app/api/profile/student/route.ts`, `app/api/profile/teacher/route.ts`, `app/api/profile/application/route.ts`
- Remove: `app/api/auth/register-teacher/` (rota e testes)
- Modify: `lib/auth/teacher-registration.ts` e seu teste (fica só a validação da candidatura e do anexo)

**Interfaces:**
- Consumes: endpoints da Task 2.
- Produces: `isUnassigned(role?)`, `hasProfile(role?)`; `createProfileClient({ baseUrl?, fetcher? })` com `becomeStudent(accessToken)`, `becomeTeacher(accessToken, formData)`, `myApplication(accessToken)`.

- [ ] **Step 1: Escrever os testes que falham**

Em `lib/auth/roles.test.ts`:

```ts
it('identifica quem ainda não escolheu perfil', () => {
  expect(isUnassigned("unassigned")).toBe(true);
  expect(isUnassigned("student")).toBe(false);
  expect(isUnassigned(undefined)).toBe(false);
});

it('reconhece perfil definido apenas para as roles de uso da plataforma', () => {
  expect(hasProfile("student")).toBe(true);
  expect(hasProfile("teacher")).toBe(true);
  expect(hasProfile("teacher_pending")).toBe(true);
  expect(hasProfile("app_admin")).toBe(true);
  expect(hasProfile("super_admin")).toBe(true);
  expect(hasProfile("unassigned")).toBe(false);
  expect(hasProfile(undefined)).toBe(false);
});
```

Em `lib/profile/client.test.ts`, no estilo de `lib/teacher-applications/client.test.ts` (fetcher
injetado, `Response` montada à mão): `becomeStudent` manda `POST /api/profile/student` com o header
`Authorization`; um 403 vira `{ ok: false, error: 'PROFILE_ALREADY_SET' }`; `myApplication` devolve
`{ status, reviewNote }` e devolve `null` quando a API responde `{ data: null }`; uma falha de rede
vira `{ ok: false, error: 'UNKNOWN_ERROR' }`, nunca uma exceção.

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- lib/auth/roles.test.ts lib/profile/client.test.ts`
Expected: FAIL — `isUnassigned` e o módulo do cliente não existem.

- [ ] **Step 3: Implementar**

Em `lib/auth/contracts.ts`, acrescentar `'unassigned'` ao `AppRole` e `'PROFILE_ALREADY_SET'` ao `AuthErrorCode`.

Em `lib/auth/roles.ts`:

```ts
export function isUnassigned(role?: AppRole) {
  return role === "unassigned";
}

export function hasProfile(role?: AppRole) {
  return Boolean(role) && !isUnassigned(role);
}
```

`lib/profile/client.ts` espelha `lib/teacher-applications/client.ts` (factory com `baseUrl`,
`fetcher`, `timeoutMs`, resultado discriminado `{ ok }`, nunca lança). `becomeTeacher` repassa um
`FormData` como corpo, sem definir `Content-Type` à mão.

As três rotas proxy seguem o padrão já usado em `app/api/teacher-applications/route.ts`: resolvem a
sessão pelos cookies, renovam o token quando preciso e reaplicam os cookies na resposta, exigem
origem confiável nos POSTs, e devolvem 401 sem token. A rota de professor valida `content-length`
antes de ler o corpo, como a rota removida fazia, reaproveitando `validateAttachment`.

Apagar `app/api/auth/register-teacher/`. Em `lib/auth/teacher-registration.ts`, remover a validação
de e-mail/senha (que era do cadastro) e manter a dos campos da candidatura e do anexo, ajustando o teste.

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test && npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib app/api
git commit -m "feat: cliente e rotas proxy de escolha de perfil"
```

---

### Task 4: Tela de onboarding e cadastro simples (repo `fluent-too`)

**Files:**
- Create: `app/[locale]/onboarding/page.tsx`, `app/[locale]/onboarding/OnboardingChooser.tsx`, `app/[locale]/onboarding/TeacherApplicationForm.tsx`
- Modify: `app/[locale]/register/page.tsx`
- Remove: `app/[locale]/register/ProfileChooser.tsx`, `app/[locale]/register/TeacherRegisterForm.tsx`
- Modify: `messages/pt-br.json`, `messages/en-us.json`, `messages/fr-fr.json`, `lib/getDictionary.ts`

**Interfaces:**
- Consumes: cliente e rotas proxy da Task 3; `AuthFormHeader` (usado hoje pelo `ProfileChooser`).
- Produces: rota `/[locale]/onboarding`.

- [ ] **Step 1: Reverter o cadastro**

`app/[locale]/register/page.tsx` volta a renderizar `RegisterForm` diretamente, como antes do
`ProfileChooser`. Apagar `ProfileChooser.tsx` e `TeacherRegisterForm.tsx`. Se o seam
`AuthFormHeader` deixar de ter qualquer consumidor, remova-o também; se ainda for usado, mantenha.

- [ ] **Step 2: Criar a tela de onboarding**

`page.tsx` é server component: resolve a sessão como `app/[locale]/dashboard/page.tsx` faz; manda
anônimo para `/${locale}/login`; se o usuário **já tem perfil**, manda para `/${locale}/dashboard`
(a tela só existe para quem está `unassigned`).

`OnboardingChooser.tsx` (client) mostra os dois cards, reaproveitando os textos e o visual que
estavam no `ProfileChooser`. "Sou estudante" chama `POST /api/profile/student` e, no sucesso,
`router.replace('/${locale}/dashboard')`. "Sou professor" revela o `TeacherApplicationForm`.

`TeacherApplicationForm.tsx` (client) é o antigo `TeacherRegisterForm` **sem** e-mail, senha e
confirmação: bio, experiência, idiomas, link opcional, anexo opcional. Submete `FormData` para
`POST /api/profile/teacher` e, no sucesso, vai para o dashboard, onde o aviso de análise aparece.
Preservar a acessibilidade que o formulário já tinha (`aria-describedby` nos erros, labels ligadas).

Chaves de mensagem novas nos três idiomas (bloco `onboarding`): `title`, `subtitle`, `studentCta`,
`teacherCta`, e os erros `PROFILE_ALREADY_SET` e `TEACHER_APPLICATION_EXISTS`. As chaves de campo do
formulário de professor já existem em `auth.*` — reaproveite em vez de duplicar.

- [ ] **Step 3: Verificar**

Run: `npm test && npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app messages lib/getDictionary.ts
git commit -m "feat: tela de escolha de perfil apos o login"
```

---

### Task 5: Bloqueio de quem não escolheu (repo `fluent-too`)

**Files:**
- Modify: `app/[locale]/dashboard/page.tsx`, `app/[locale]/dashboard/security/page.tsx`, `app/[locale]/admin/teachers/page.tsx`
- Modify: `app/api/quiz-attempts/route.ts`

**Interfaces:**
- Consumes: `isUnassigned` da Task 3.

- [ ] **Step 1: Redirecionar as páginas que dependem de perfil**

Nas três páginas, depois de resolver a sessão e antes de buscar qualquer dado, redirecionar para
`/${locale}/onboarding` quando `isUnassigned(session.user.role?.type)`. O guard de admin continua
valendo depois disso (um `unassigned` nunca é admin, mas a ordem importa para não vazar 404 antes do
redirecionamento).

- [ ] **Step 2: Bloquear a gravação de tentativa de quiz**

Em `app/api/quiz-attempts/route.ts`, um usuário `unassigned` recebe 403 `PROFILE_REQUIRED` ao tentar
salvar uma tentativa. A leitura pública de quizzes e do blog continua intocada.

- [ ] **Step 3: Verificar**

Run: `npm test && npm run lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app
git commit -m "feat: bloqueia uso da plataforma ate a escolha de perfil"
```

---

### Task 6: Candidatura rejeitada com saída (repo `fluent-too`)

**Files:**
- Create: `app/[locale]/dashboard/TeacherApplicationStatus.tsx`
- Modify: `app/[locale]/dashboard/page.tsx`
- Modify: `messages/pt-br.json`, `messages/en-us.json`, `messages/fr-fr.json`, `lib/getDictionary.ts`

**Interfaces:**
- Consumes: `GET /api/profile/application` (Task 2/3), `POST /api/profile/student`.

- [ ] **Step 1: Buscar a candidatura no dashboard**

Quando a role for `teacher_pending`, o server component busca a própria candidatura e passa
`status` e `reviewNote` para o novo componente. Para as outras roles não há chamada extra.

- [ ] **Step 2: Dois estados**

`TeacherApplicationStatus.tsx` renderiza:
- `pending`: o aviso de análise que já existe hoje, com o mesmo visual;
- `rejected`: o motivo (`reviewNote`) e um botão "continuar como estudante" que chama
  `POST /api/profile/student` e, no sucesso, `router.refresh()`.

Se a busca da candidatura falhar, mostrar o aviso de análise sem o motivo — nunca a tela de recusa,
que seria pior errar.

Chaves novas nos três idiomas: `dashboard.teacherRejectedTitle`, `teacherRejectedText`,
`teacherRejectedCta`.

- [ ] **Step 3: Verificar**

Run: `npm test && npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app messages lib/getDictionary.ts
git commit -m "feat: professor rejeitado ve o motivo e pode seguir como estudante"
```

---

### Task 7: Verificação viva (dois repos)

Sem arquivos novos; corrigir o que falhar, com a menor mudança possível.

- [ ] **Step 1: Subir o ambiente**

Parar os containers `fluent-too-project-api-1` e `fluent-too-project-frontend-1`, deixando postgres
(5435) e mailpit (1025/8025) de pé. API: `DATABASE_HOST=127.0.0.1 SMTP_HOST=127.0.0.1 SMTP_PORT=1025 npm run develop`.
Front: `npm run dev`. Esperar `/_health` com laço limitado. Usar `localhost`, nunca `127.0.0.1`, no
front (a verificação de origem recusa a outra forma).

- [ ] **Step 2: Verificar, com saída real de cada comando**

1. Boot limpo; `up_roles` tem as seis roles; `default_role` no store é `unassigned`.
2. Conta nova por e-mail/senha nasce `unassigned` e o e-mail de confirmação chega no mailpit.
3. `unassigned` logado que abre `/pt-br/dashboard` é redirecionado para `/pt-br/onboarding`; `/pt-br/blog` e `/pt-br/quizzes` continuam abrindo para ele.
4. Escolher estudante troca a role para `student` e libera o dashboard.
5. Escolher professor com anexo válido cria a candidatura `pending`, deixa a role `teacher_pending` e mostra o aviso de análise; anexo acima de 5 MB é recusado antes de gravar arquivo temporário; mimetype proibido é recusado.
6. Um `student` chamando `POST /api/profile/teacher` recebe 403; um `teacher` também; um `teacher_pending` com candidatura `pending` chamando `POST /api/profile/student` recebe 403.
7. Admin rejeita a candidatura com nota; o professor rejeitado vê o motivo no dashboard e o botão "continuar como estudante" o torna `student`.
8. Admin aprova outra candidatura; o usuário vira `teacher` e continua criando quiz e blog post só como dono.
9. `POST /api/auth/local/register-teacher` agora responde 404/405 — o endpoint público sumiu.
10. Leitura pública de `/api/quizzes` e `/api/blog-posts` continua funcionando sem token, sem expor `owner`.

- [ ] **Step 3: Suítes**

Run: api `npm test && npx tsc --noEmit && npm run build`; front `npm test && npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 4: Restaurar o ambiente**

Parar os servidores de desenvolvimento e subir de novo os dois containers do compose.

---

## Fora deste plano

- Telas de criação de quiz e blog para o professor (a fatia 2 do trabalho anterior).
- Estudante poder se candidatar a professor depois (decisão explícita: não pode).
- Limite por IP no cadastro — a candidatura agora exige login, o que já reduz muito a superfície.
