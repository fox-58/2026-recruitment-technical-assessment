FROM node:24-bookworm-slim AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src

RUN pnpm run build

RUN pnpm prune --prod

FROM node:24-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

RUN groupadd -r appgroup && useradd -r -g appgroup appuser
USER appuser

EXPOSE 3000

CMD ["node", "dist/server.js"]