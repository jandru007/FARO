# FARO

FARO is CAPFICO's public website-operability standard, scanner, and audit system for AI Operators.

Core question:

> Can AI Operators use your website?

This repo contains FARO Website v1.0:

- Next.js public website and dashboard
- Free FARO Scan API
- Background scanner worker
- Supabase schema
- Public docs and updates
- Shared TypeScript contracts

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres
- Node.js scanner worker
- OpenRouter for optional lightweight AI preview
- Playwright dependency for future browser inspection
- Vercel-ready web app

## Local Setup

```powershell
corepack pnpm install
copy .env.example .env
corepack pnpm dev:web
corepack pnpm dev:scanner
```

Create a Supabase project, run `supabase/migrations/0001_faro_v1_schema.sql`, and fill the Supabase env vars.

If Supabase env vars are missing, the website still renders. Live scan submission returns a clear configuration error.

## Environment

See `.env.example` for the complete list.

Never commit `.env`, service role keys, scan logs with real client data, paid audit reports, or private implementation files.

## Scripts

```powershell
corepack pnpm test
corepack pnpm typecheck
corepack pnpm build
corepack pnpm dev:web
corepack pnpm dev:scanner
```

## Product Scope

Built in v1.0:

- Public website/dashboard
- Automated Free FARO Scan
- Same-page result rendering
- Docs
- Build-in-public updates
- CTA to Full FARO Audit
- Supabase persistence
- Background scanner worker

Not built in v1.0:

- Full audit automation
- Certification registry
- Monitoring dashboard
- User accounts
- Admin panel
- Multi-tenant app

## Future TODOs

- Stripe webhook
- Full audit automation
- Ready Kit product page
- Monitoring
- Supabase Realtime or SSE
- Richer Playwright browser inspection
