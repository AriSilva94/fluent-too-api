# Roles de professor e estudante — design

Data: 2026-08-28
Repositórios: `fluent-too-api` (Strapi 5.52) e `fluent-too` (Next 16)
Escopo: fatia 1 de 2 — roles, cadastro de professor, aprovação manual e gating.
A fatia 2 (telas de criação de quiz e blog no front) tem spec própria e ainda não foi desenhada.

## Objetivo

Separar os usuários da plataforma em papéis nomeados e permitir que alguém se cadastre
como professor, ficando sem poderes de professor até um admin aprovar manualmente.

## Modelo de roles

Todas as roles são do plugin `users-permissions` (não são admin users do Strapi).
Um usuário tem exatamente uma role. Nenhuma role é compartilhada entre perfis diferentes:
professor pendente **não** recebe a role de estudante, mesmo tendo as mesmas permissões.

| type | nome | permissões |
|---|---|---|
| `super_admin` | Super Admin | tudo de `app_admin` (gestão de roles fica para trabalho futuro) |
| `app_admin` | Admin | permissões atuais de `app_admin` + revisar candidaturas |
| `teacher` | Teacher | permissões de `student` + criar/editar/apagar os próprios quizzes e blog posts |
| `teacher_pending` | Teacher (pendente) | exatamente as permissões de `student` |
| `student` | Student | permissões que hoje estão em `authenticated` |

`super_admin` e `app_admin` recebem detalhamento em trabalho futuro; nesta fatia `super_admin`
existe e aprova candidaturas, nada além disso.

### Migração

- `student` passa a receber as permissões que hoje `ensureAppAccessControl` aplica em `authenticated`.
- No bootstrap, usuários cuja role é `authenticated` são movidos para `student`. Idempotente:
  roda a cada boot, não faz nada quando não há usuário em `authenticated`.
- `advanced.default_role` continua `authenticated` (o Strapi exige um valor válido), mas nenhum
  registro passa a depender dele: os dois controllers de registro atribuem a role explicitamente.
- Nenhum endpoint aceita role vinda do payload do cliente.

## Content-type `teacher-application`

`kind: collectionType`, sem `draftAndPublish`.

| campo | tipo | notas |
|---|---|---|
| `user` | relation oneToOne → `plugin::users-permissions.user` | obrigatório, único |
| `status` | enumeration `pending\|approved\|rejected` | default `pending` |
| `languages` | json | idiomas que pretende ensinar |
| `bio` | text | obrigatório |
| `experience` | text | obrigatório |
| `credentialUrl` | string | opcional |
| `attachment` | media single | opcional (certificado/CV) |
| `reviewedBy` | relation manyToOne → user | preenchido na decisão |
| `reviewedAt` | datetime | preenchido na decisão |
| `reviewNote` | text | obrigatório quando `status = rejected` |

Um usuário tem no máximo uma candidatura. Segunda tentativa de cadastro como professor com o
mesmo e-mail retorna `TEACHER_APPLICATION_EXISTS`.

## Ownership de conteúdo

- `quiz` e `blog-post` ganham `owner`: relation manyToOne → user.
- No `create`, `owner` é forçado a partir do JWT; qualquer `owner` vindo no body é ignorado.
- `update` e `delete` passam por uma policy `is-owner-or-admin`: passa se o registro é do
  requisitante, ou se a role é `app_admin`/`super_admin`.
- Registros existentes ficam com `owner` nulo — só admin consegue editá-los, o que é o
  comportamento correto (foram criados pelo admin).
- Professor aprovado publica direto: `draftAndPublish` continua ligado, mas não há fila de moderação.

## Endpoints (Strapi)

| método | rota | quem | efeito |
|---|---|---|---|
| POST | `/api/auth/local/register-teacher` | público | cria user com role `teacher_pending` + `teacher-application` `pending`; mesma validação e confirmação de e-mail do registro atual |
| GET | `/api/users/me` | autenticado | passa a devolver `role` (`id`, `name`, `type`) — override do controller `me` com populate |
| GET | `/api/teacher-applications` | `app_admin`, `super_admin` | lista, filtrável por `status` |
| GET | `/api/teacher-applications/:id` | `app_admin`, `super_admin` | detalhe |
| POST | `/api/teacher-applications/:id/approve` | `app_admin`, `super_admin` | role do user → `teacher`; grava `reviewedBy`/`reviewedAt` |
| POST | `/api/teacher-applications/:id/reject` | `app_admin`, `super_admin` | `status = rejected`; exige `reviewNote`; role continua `teacher_pending` |

Aprovar/rejeitar é idempotente por status: reprocessar uma candidatura já decidida retorna 409.

## Front (Next)

### Registro

`/[locale]/register` ganha um passo 1 com dois caminhos.

- **Estudante** — formulário atual, `POST /api/auth/register`, fluxo inalterado.
- **Professor** — formulário atual + campos da candidatura (idiomas, bio, experiência,
  link opcional, anexo opcional) → nova rota proxy `POST /api/auth/register-teacher`.

O anexo torna esse o único fluxo de auth em `multipart/form-data`. A lógica fica isolada em
`lib/auth/teacher-registration.ts`, sem alterar `readLimitedJson` nem `handlers.ts`.
Tipo e tamanho do arquivo são validados no proxy do Next **e** no Strapi.

### Contratos

- `AuthUser` ganha `role: { id: number; name: string; type: AppRole }`.
- `AppRole = 'super_admin' | 'app_admin' | 'teacher' | 'teacher_pending' | 'student'`.
- Novo `TeacherRegisterPayload`.
- Novos `AuthErrorCode`: `TEACHER_APPLICATION_EXISTS`, `FILE_TOO_LARGE`, `INVALID_FILE_TYPE`.

### Gating

`lib/auth/roles.ts`, funções puras (testáveis sem rede):

```ts
canCreateContent(role)   // teacher, app_admin, super_admin
canReviewTeachers(role)  // app_admin, super_admin
isPendingTeacher(role)   // teacher_pending
```

Páginas protegidas seguem o padrão já usado em `app/[locale]/dashboard/page.tsx`
(server component: cookies → `resolveSession` → checa role → `redirect`). Sem middleware novo.

### Estado da candidatura

`teacher_pending` logado usa a plataforma como estudante e vê um aviso de "candidatura em
análise" no dashboard. Rejeitado vê o `reviewNote`. Textos em `messages/pt-br|en-us|fr-fr.json`.

### Tela de aprovação

`/[locale]/admin/teachers`, guard `canReviewTeachers`. Lista com filtro por status, detalhe com
bio/experiência/link/anexo, ações Aprovar e Rejeitar (rejeitar exige nota). Consome as rotas do
Strapi via rotas proxy no Next, como o resto do app.
`/[locale]/admin` continua redirecionando para o admin do Strapi.

## Testes

- `access-control.test.ts`: plano cobre as 5 roles; `teacher_pending` tem exatamente o conjunto de
  `student`; `teacher` acrescenta apenas as ações de criação de conteúdo.
- Migração `authenticated` → `student`: idempotência e não afetar usuários de outras roles.
- Policy de ownership: dono edita, não-dono recebe 403, admin edita qualquer um, `owner` do body é ignorado.
- Registro de professor: role atribuída é `teacher_pending`, candidatura criada, role do payload ignorada, duplicata rejeitada.
- Aprovação: role vira `teacher`, campos de revisão preenchidos, reprocessamento retorna 409.
- Front: `roles.ts` (tabela role × capacidade), validação do registro de professor, validação de anexo.

## Fora de escopo

- Telas de criação de quiz e blog no front (fatia 2). Até lá, conteúdo continua sendo criado por
  admins pelo painel do Strapi — professor aprovado tem a permissão de API, mas ainda não tem UI.
- Detalhamento das diferenças entre `super_admin` e `app_admin`.
- Fila de moderação de conteúdo.

## Riscos

- A migração `authenticated` → `student` escreve em dados de produção. É reversível
  (trocar `role_id` de volta) e roda numa transação por lote.
- `/api/users/me` passa a expor a role; o front já trata `me` como dado do próprio usuário,
  então não há vazamento entre usuários.
