# Fluent Too API

Back-end em Strapi 5 para autenticacao, gerenciamento de usuarios, roles de acesso, quizzes, historico de resultados e uploads de midia.

## Ambientes

O projeto trabalha com tres ambientes:

| Ambiente | API Strapi | Front-end | CDN de midia |
|---|---|---|---|
| Local | `http://localhost:1337` | `http://localhost:3000` | `https://cdn-dev.fluent-too.com` |
| Dev | `https://api-dev.fluent-too.com` | `https://dev.fluent-too.com` | `https://cdn-dev.fluent-too.com` |
| Prd | `https://api.fluent-too.com` | `https://fluent-too.com` | `https://cdn.fluent-too.com` |

No ambiente local, as variaveis de R2 apontam para o CDN de dev. O bucket e o caminho dos objetos sao os mesmos em todos os ambientes: `fluent-too/assets/images`. O que muda entre dev e producao e apenas o dominio publico usado para servir a midia.

Os arquivos reais de ambiente nao devem ser commitados. Use os exemplos versionados como base:

| Ambiente | Exemplo versionado | Arquivo real |
|---|---|---|
| Local | `.env.local.example` | `.env.local` ou `.env` |
| Dev | `.env.dev.example` | `.env.dev` ou variaveis do Dokploy |
| Prd | `.env.prd.example` | `.env.prd` ou variaveis do Dokploy |

Para rodar localmente com Node:

```powershell
Copy-Item .env.local.example .env
npm install
npm run dev
```

Admin local: `http://localhost:1337/admin`.

## Variaveis de ambiente

| Grupo | Variaveis |
|---|---|
| Strapi | `HOST`, `PORT`, `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` |
| Banco | `DATABASE_CLIENT`, `DATABASE_URL`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_SSL` |
| URLs | `FRONTEND_PUBLIC_URL`, `STRAPI_PUBLIC_URL`, `CORS_ORIGINS` |
| E-mail | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `EMAIL_REPLY_TO` |
| Google OAuth | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| R2/CDN | `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_ACCESS_SECRET`, `S3_PUBLIC_URL`, `S3_ROOT_PATH`, `S3_FORCE_PATH_STYLE`, `S3_ACL`, `S3_SIGNED_URL_EXPIRES` |
| Compose local | `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT`, `MAILPIT_SMTP_PORT`, `MAILPIT_WEB_PORT`, `FRONTEND_PORT`, `STRAPI_PORT` |

Papel de admin nao vem de configuracao: atribua `app_admin` ou `super_admin` ao usuario pelo painel do Strapi (Content Manager > User), que exige login administrativo e deixa rastro. Variavel de ambiente concederia o papel a cada boot, a quem editasse o deploy, sem como revogar pela aplicacao.

Valores reais de `APP_KEYS`, salts, JWT secrets, senhas, SMTP, Google OAuth e R2 devem ficar apenas no ambiente local privado, no Dokploy ou em um gerenciador de segredos.

## R2 e CDN

Para usar Cloudflare R2, configure as credenciais S3 e o `S3_PUBLIC_URL` do ambiente. Em dev e local, use `https://cdn-dev.fluent-too.com`. Em producao, use `https://cdn.fluent-too.com`.

Os arquivos devem ser gravados no caminho `assets/images/<arquivo>`. Imagens raster enviadas pelo Strapi sao convertidas para WebP antes do upload. SVGs e arquivos nao raster permanecem no formato original. A mesma imagem fica disponivel pelos dois dominios:

| Ambiente | Exemplo |
|---|---|
| Dev | `https://cdn-dev.fluent-too.com/assets/images/example.webp` |
| Prd | `https://cdn.fluent-too.com/assets/images/example.webp` |

O callback do Google OAuth deve ser configurado no Google Cloud conforme o ambiente:

| Ambiente | Callback |
|---|---|
| Dev | `https://api-dev.fluent-too.com/api/connect/google/callback` |
| Prd | `https://api.fluent-too.com/api/connect/google/callback` |

## Docker e Dokploy

Build local:

```powershell
docker build -t fluent-too-api:test .
```

Compose local:

```powershell
Copy-Item .env.local.example .env
docker compose up --build -d
```

Em Dokploy, configure as variaveis diretamente no painel do servico. Para dev e producao, cada app deve usar o arquivo de exemplo correspondente apenas como referencia.

## Comandos

| Comando | Descricao |
|---|---|
| `npm run dev` | Inicia o Strapi em modo desenvolvimento. |
| `npm run build` | Gera build do Strapi. |
| `npm run start` | Inicia o Strapi em modo producao. |
| `npm test` | Executa os testes. |

## Seguranca

Arquivos `.env`, `.env.local`, `.env.dev`, `.env.prd` e variacoes locais estao protegidos pelo `.gitignore`. Somente exemplos sem segredos devem entrar no Git.
