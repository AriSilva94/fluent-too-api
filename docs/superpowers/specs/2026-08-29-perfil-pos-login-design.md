# Escolha de perfil depois do login — design

Data: 2026-08-29
Emenda de `2026-08-28-teacher-student-roles-design.md`, que continua valendo no que não é contrariado aqui.
Repositórios: `fluent-too-api` (Strapi 5.52) e `fluent-too` (Next 16).

## Problema

A escolha entre estudante e professor vive num passo do formulário de cadastro. Quem entra pelo
login do Google nunca passa por esse formulário: a conta é criada direto com a `default_role`, ou
seja, todo usuário do Google vira estudante silenciosamente e não tem como se candidatar a professor.

## Decisão

A escolha sai do cadastro e vira uma etapa de onboarding depois do primeiro login, igual para quem
entra por e-mail/senha e por Google.

Ganho colateral: o endpoint público de cadastro de professor deixa de existir. A candidatura passa
a exigir usuário autenticado, o que elimina a superfície anônima de abuso (criação em massa, upload
de anexo sem dono, arquivo temporário).

## Roles

Nasce uma sexta role, `unassigned`, com permissão apenas sobre a própria conta
(`plugin::users-permissions.user.me`, `auth.logout`, `auth.changePassword`).
`advanced.default_role` passa a apontar para ela, então e-mail/senha e Google caem no mesmo estado.

As cinco roles atuais não mudam. Usuários que já têm role não são tocados: `unassigned` só recebe
conta nova.

## Transições de role

Um usuário nunca troca a própria role, com exatamente duas exceções, ambas a partir de `unassigned`:

| de | para | como |
|---|---|---|
| `unassigned` | `student` | escolha no onboarding, imediata |
| `unassigned` | `teacher_pending` | escolha no onboarding + dados da candidatura |
| `teacher_pending` com candidatura `rejected` | `student` | botão "continuar como estudante" no dashboard |

Estudante **não** vira professor. Não há caminho de volta de `student` para `unassigned`.
`teacher_pending` com candidatura `pending` não pode escolher nada — está esperando revisão.

## Endpoints (Strapi)

Todos autenticados. Substituem o público `POST /api/auth/local/register-teacher`, que é removido.

| método | rota | quem | efeito |
|---|---|---|---|
| POST | `/api/profile/student` | `unassigned`, ou `teacher_pending` cuja candidatura está `rejected` | role vira `student` |
| POST | `/api/profile/teacher` | `unassigned` | cria a `teacher-application` em `pending` (bio, experiência, idiomas, link opcional, anexo opcional) e a role vira `teacher_pending` |
| GET | `/api/profile/application` | autenticado | devolve a própria candidatura: `status`, `reviewNote`, `createdAt`. Nada de outro usuário, nada além disso |

Qualquer transição fora da tabela acima retorna 403. Aceita `multipart/form-data` no
`/api/profile/teacher` para o anexo, com as mesmas regras de hoje (máx. 5 MB; `application/pdf`,
`image/png`, `image/jpeg`), validadas antes da escrita em disco e com remoção do arquivo temporário.

A aprovação/rejeição continua exatamente como está: `GET /api/teacher-applications`,
`POST /api/teacher-applications/:id/approve|reject`, restritas a `app_admin` e `super_admin`.

## Front

### Cadastro

`/[locale]/register` volta a ser o formulário simples (e-mail, senha, confirmação).
`ProfileChooser` e a rota proxy `/api/auth/register-teacher` são removidos.
`TeacherRegisterForm` não é descartado: seus campos migram para o onboarding, sem os campos de conta.

### Onboarding

Nova tela `/[locale]/onboarding` com os dois cards. Estudante confirma e segue; professor preenche
bio, experiência, idiomas, link opcional e anexo opcional. Rotas proxy correspondentes em
`app/api/profile/*`, no mesmo padrão das demais (cookies httpOnly, `isTrustedOrigin`, refresh de sessão).

### Bloqueio

Um usuário `unassigned` é redirecionado para `/[locale]/onboarding` ao tentar abrir o dashboard, a
área de admin ou qualquer rota que dependa de perfil, e não consegue salvar tentativas de quiz.

O que ele **continua** podendo fazer, igual a um visitante deslogado: ler o blog e ver os quizzes
públicos. Bloquear isso não protegeria nada, já que essas páginas são públicas.

### Estados da candidatura no dashboard

O aviso atual, único, vira dois estados, alimentados por `GET /api/profile/application`:

- candidatura `pending`: "candidatura em análise", como hoje;
- candidatura `rejected`: motivo da recusa (`reviewNote`) e botão "continuar como estudante", que
  chama `POST /api/profile/student` e libera o uso normal da plataforma.

## O que sai

- `POST /api/auth/local/register-teacher` (Strapi) e o proxy `app/api/auth/register-teacher` (Next).
- `ProfileChooser` e o passo de perfil no cadastro.
- O limite de tamanho por `content-length` deixa de guardar a rota pública e passa a guardar
  `/api/profile/teacher`.

## O que não muda

Ownership de quiz e blog-post, fila de aprovação, tela `/[locale]/admin/teachers`, migração
`authenticated` → `student`, login (inclusive Google) e leitura pública de conteúdo.

## Riscos

- Uma conta criada e abandonada no meio do onboarding fica em `unassigned` sem nenhum uso possível
  além de escolher o perfil. É o comportamento desejado, mas gera contas inertes.
- O redirecionamento para o onboarding precisa cobrir toda rota que dependa de perfil; uma rota
  esquecida aparece como página quebrada para quem ainda não escolheu, não como brecha de permissão.
