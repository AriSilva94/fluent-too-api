FROM node:22-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-slim AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && \
    rm -rf node_modules/vite node_modules/@vitejs node_modules/rolldown node_modules/@rolldown \
      node_modules/webpack node_modules/@radix-ui node_modules/@shikijs node_modules/hls.js \
      node_modules/@mux node_modules/@formatjs node_modules/core-js-pure node_modules/rxjs \
      node_modules/@reduxjs node_modules/vitest node_modules/lightningcss* node_modules/@swc

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN groupadd --system --gid 1001 strapi && useradd --system --uid 1001 --gid strapi --create-home --home-dir /home/strapi strapi
COPY --from=builder --chown=strapi:strapi /app/dist/config ./config
COPY --from=builder --chown=strapi:strapi /app/database ./database
COPY --from=builder --chown=strapi:strapi /app/dist ./dist
COPY --from=builder --chown=strapi:strapi /app/public ./public
COPY --from=builder --chown=strapi:strapi /app/favicon.png ./favicon.png
COPY --from=builder --chown=strapi:strapi /app/dist/src ./src
COPY --from=builder --chown=strapi:strapi /app/dist/build ./build
COPY --from=builder --chown=strapi:strapi /app/package.json ./package.json
COPY --from=builder --chown=strapi:strapi /app/package-lock.json ./package-lock.json
COPY --from=builder --chown=strapi:strapi /app/node_modules ./node_modules
USER strapi
EXPOSE 1337
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 CMD node -e "fetch('http://127.0.0.1:1337/_health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["npm", "run", "start"]
