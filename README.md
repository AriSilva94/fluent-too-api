# Fluent Too API

Back-end Strapi 5 com PostgreSQL, Users & Permissions, confirmação de e-mail, recuperação de senha, sessão renovável e Google OAuth.

## Desenvolvimento

```powershell
npm install
npm run develop
```

Admin local: `http://localhost:1337/admin`.

## Variáveis

Veja `.env.example`.

Principais grupos:

- Strapi: `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY`
- Banco: `DATABASE_CLIENT`, `DATABASE_URL`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_SSL`
- URLs: `FRONTEND_PUBLIC_URL`, `STRAPI_PUBLIC_URL`, `CORS_ORIGINS`
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `EMAIL_REPLY_TO`
- Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

## Bootstrap

Ao iniciar, `src/index.ts` aplica de forma idempotente:

- cadastro público habilitado;
- e-mail único;
- confirmação obrigatória;
- URLs de recuperação e confirmação apontando para o front-end;
- provider Google habilitado somente com credenciais completas;
- templates de e-mail baseados nas variáveis públicas.

## Docker

```powershell
docker build -t fluent-too-api:test .
```

O container escuta na porta `1337` e mantém uploads em `/app/public/uploads`.

## Compose local

O arquivo `compose.yaml` fica neste projeto e sobe Postgres, Mailpit, API e front-end:

```powershell
docker compose up --build -d
```

Para rodar o Strapi local com `npm run dev`, mantenha o Postgres do Compose ativo e use `DATABASE_HOST=127.0.0.1`, `DATABASE_PORT=5435` e `DATABASE_SSL=false`.
