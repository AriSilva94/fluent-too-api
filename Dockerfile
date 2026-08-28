FROM node:22-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-slim AS builder
WORKDIR /app
ENV NODE_ENV=production
# Strapi admin build (Vite) is the single largest memory consumer in this image.
# V8's default old-space sizing scales with the HOST's total RAM, not with what
# is actually free once other containers on this VPS (~4-5GB already used) are
# accounted for. Capping it here (build stage only, never shipped to runtime)
# keeps the build inside a predictable ~1.5GB heap ceiling instead of letting
# it size itself against the full 8GB host and risk starving sibling containers.
ENV NODE_OPTIONS=--max-old-space-size=1536
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-slim AS prod-deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

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
COPY --from=prod-deps --chown=strapi:strapi /app/node_modules ./node_modules
USER strapi
EXPOSE 1337
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 CMD node -e "fetch('http://127.0.0.1:1337/_health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["npm", "run", "start"]
