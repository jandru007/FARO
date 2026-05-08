FROM mcr.microsoft.com/playwright:v1.59.0-noble

WORKDIR /app
RUN corepack enable
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages
COPY apps/scanner ./apps/scanner

RUN corepack pnpm install --filter @faro/scanner... --frozen-lockfile

EXPOSE 8787
CMD ["corepack", "pnpm", "--filter", "@faro/scanner", "start"]
