'use strict';

const { posts, COVER_IMAGES, BLOG_OWNER_EMAIL } = require('./seed-blog-posts');

const BASE_URL = (process.env.SEED_API_URL || '').replace(/\/+$/, '');
const EMAIL = process.env.SEED_EMAIL || BLOG_OWNER_EMAIL;
const PASSWORD = process.env.SEED_PASSWORD || '';
const UPLOAD_TOKEN = process.env.SEED_UPLOAD_TOKEN || '';

function exigirConfiguracao() {
  const faltando = [];
  if (!BASE_URL) faltando.push('SEED_API_URL');
  if (!PASSWORD) faltando.push('SEED_PASSWORD');

  if (faltando.length) {
    console.error(`Defina ${faltando.join(' e ')} no ambiente antes de rodar.`);
    console.error('Exemplo: SEED_API_URL=https://api-dev.fluent-too.com SEED_PASSWORD=... node scripts/seed-blog-posts-remote.js');
    process.exit(1);
  }
}

async function autenticar() {
  const resposta = await fetch(`${BASE_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: EMAIL, password: PASSWORD }),
  });

  if (!resposta.ok) {
    throw new Error(`Login falhou para ${EMAIL}: ${resposta.status}`);
  }

  const corpo = await resposta.json();
  return corpo.jwt;
}

async function buscar(caminho, jwt, init = {}) {
  return fetch(`${BASE_URL}${caminho}`, {
    ...init,
    headers: { Authorization: `Bearer ${jwt}`, ...(init.headers || {}) },
  });
}

async function enviarCapa(slug, jwt) {
  const origem = COVER_IMAGES[slug];
  if (!origem) return null;

  const imagem = await fetch(origem);
  if (!imagem.ok) return null;

  const formulario = new FormData();
  formulario.append('files', await imagem.blob(), `blog-cover-${slug}.jpg`);

  const resposta = await buscar('/api/upload', UPLOAD_TOKEN || jwt, { method: 'POST', body: formulario });
  if (!resposta.ok) {
    console.warn(`  capa de ${slug} nao enviada (${resposta.status})`);
    return null;
  }

  const arquivos = await resposta.json();
  return Array.isArray(arquivos) ? arquivos[0]?.id ?? null : null;
}

async function encontrarExistente(post, jwt) {
  const busca = new URLSearchParams({
    'filters[slug][$eq]': post.slug,
    'filters[targetLanguage][$eq]': post.targetLanguage,
  });

  const resposta = await buscar(`/api/blog-posts?${busca}`, jwt);
  if (!resposta.ok) {
    throw new Error(`Nao foi possivel checar duplicata de ${post.slug} [${post.targetLanguage}]: ${resposta.status}`);
  }

  const corpo = await resposta.json();
  return corpo.data?.[0]?.documentId ?? null;
}

async function main() {
  exigirConfiguracao();

  const jwt = await autenticar();
  console.log(`Autenticado como ${EMAIL} em ${BASE_URL}`);

  const capaPorSlug = {};
  for (const slug of Object.keys(COVER_IMAGES)) {
    capaPorSlug[slug] = await enviarCapa(slug, jwt);
  }

  const contagem = { criados: 0, atualizados: 0, falhas: 0 };

  for (const post of posts) {
    const data = { ...post, author: EMAIL.split('@')[0], coverImage: capaPorSlug[post.slug] };
    const existente = await encontrarExistente(post, jwt);

    const resposta = existente
      ? await buscar(`/api/blog-posts/${existente}`, jwt, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data }),
        })
      : await buscar('/api/blog-posts', jwt, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data }),
        });

    if (!resposta.ok) {
      console.error(`  falhou ${post.slug} [${post.targetLanguage}]: ${resposta.status}`);
      contagem.falhas += 1;
      continue;
    }

    contagem[existente ? 'atualizados' : 'criados'] += 1;
  }

  console.log(`Criados: ${contagem.criados}, atualizados: ${contagem.atualizados}, falhas: ${contagem.falhas}`);
  if (contagem.falhas > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
