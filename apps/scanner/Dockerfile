FROM node:24-slim

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages
COPY apps/scanner ./apps/scanner

RUN corepack pnpm install --filter @faro/scanner... --frozen-lockfile

EXPOSE 8787
CMD ["corepack", "pnpm", "--filter", "@faro/scanner", "start"]
