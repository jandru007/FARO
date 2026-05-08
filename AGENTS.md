# FARO Agent Guide

This repository is the public source of truth for FARO Website v1.0.

FARO is CAPFICO's public website-operability standard, scanner, and audit system for AI Operators. The core product question is:

> Can AI Operators use your website?

## Product Boundaries

Build and maintain the public FARO ladder:

1. Free FARO Scan
2. Full FARO Audit
3. Ready Kit
4. Monitoring

For v1.0, the shipped product is the public website, docs, updates, Supabase-backed scan storage, and a background Free Scan worker.

Do not build these until explicitly requested:

- User accounts
- Admin panels
- Certification registry
- Monitoring dashboard
- Multi-tenant app
- Full FARO Audit automation
- Customer portal
- Stripe webhooks
- Make.com scanner workflows
- Private client report publishing

The Free Scan is an automated estimate. Never describe it as an official score, certification, verified audit, or exhaustive Trial Agent run.

Preferred language:

- Free FARO Scan
- FARO Readiness Estimate
- Free Scan Estimate
- Full FARO Audit
- Ready Kit
- Monitoring
- AI Operators

Avoid:

- Official FARO Score for Free Scan
- FARO Certified for Free Scan results
- Guaranteed AI compatibility claims
- "Lighthouse for AI" as the main homepage positioning

## Architecture

The repo is a pnpm monorepo:

```text
apps/web       Next.js App Router public website and API routes
apps/scanner   Node TypeScript background scanner worker
packages/shared shared types, constants, score bands, URL safety
supabase/migrations database schema
docs           public methodology/docs source
```

Production architecture:

```text
Visitor submits URL
Next.js API validates URL and creates scan_run in Supabase
Railway scanner worker claims queued scan
Worker runs deterministic checks and bounded OpenRouter preview
Worker stores scan_events and scan_results
Frontend polls same-page result panel
CTA routes user to Full FARO Audit
```

Current live services:

- Web: Vercel
- Database: Supabase Postgres
- Scanner worker: Railway
- LLM gateway: OpenRouter

## Security Rules

This is a public repo. Never commit:

- `.env`, `.env.local`, or environment-specific secrets
- Supabase service-role keys
- OpenRouter keys
- Stripe or booking secrets
- Customer scan logs with private data
- Paid audit reports
- Trial Agent local artifacts
- Private client implementation files

All database writes must go through server routes or the scanner worker. Service-role keys must remain server-only.

URL scanning is an SSRF-sensitive surface. Preserve these rules:

- Accept only `http://` and `https://`
- Normalize bare domains to `https://`
- Block localhost and private IP ranges
- Block `.local`, `.internal`, and obvious private hostnames
- Resolve DNS and reject private resolutions
- Limit redirects, pages, request timeouts, content size, runtime, and LLM calls
- Do not submit forms, create accounts, make purchases, or perform irreversible actions

Supabase tables should keep RLS enabled. FARO uses service-role access from trusted server contexts.

## Scanner Rules

The scanner runs outside the browser.

Free Scan scope:

- Deterministic reachability, operator-surface, structured-data, extractability, actionability, and trust-signal checks
- 1-2 lightweight OpenRouter AI preview calls
- Estimated score range, likely band, confidence, issues, layers, evidence

Do not add:

- Full 31-task Trial Agent
- Payment/checkout execution
- Account creation
- Form submission
- Private crawling
- Official certification logic

The full Trial Agent/orchestrator with separate agent and judge models is a paid Full FARO Audit workflow, run manually by the founder for now. It is not part of the public Free Scan worker.

## Frontend Rules

The homepage is an app-like dashboard, not a marketing splash page.

Use:

- Full-width header
- Exact PNG logo at `apps/web/public/faro-logo-colour.png`
- Version badge `v0.6.1`
- Left fixed scan/update panel
- Right scrollable PageSpeed-like report panel
- Restrained white/gray/near-black UI
- FARO blue `#3152F4` sparingly

Avoid:

- Confetti SaaS styling
- Neon/cyber effects
- Heavy gradients
- Nested card clutter
- Oversized marketing-only hero sections
- Claims that Free Scan is verified or exhaustive

Keep accessibility intact: semantic HTML, labels, keyboard access, visible focus states, aria-live scan status, and text labels for status colors.

## Docs And Public Content

Docs should explain:

- What FARO is
- Free Scan vs Full Audit
- FARO Score v0.6.1
- Score bands
- Layer model
- Operator surfaces: `/llms.txt`, `/agent.json`, `/.well-known/ucp`
- Why AI Operators matter
- What Full Audit includes
- What Ready Kit fixes

Updates are static in `apps/web/content/updates.ts`. Do not build an updates admin panel for v1.0.

## Development Commands

Use pnpm through Corepack:

```bash
corepack pnpm install
corepack pnpm dev:web
corepack pnpm dev:scanner
corepack pnpm typecheck
corepack pnpm test
corepack pnpm lint
corepack pnpm build
```

When changing the scanner:

```bash
corepack pnpm --filter @faro/scanner typecheck
corepack pnpm --filter @faro/scanner test
```

When changing the web app:

```bash
corepack pnpm --filter @faro/web typecheck
corepack pnpm --filter @faro/web test
corepack pnpm --filter @faro/web build
```

## Ruflo Usage

Ruflo is installed locally for this workspace through a Node 22 wrapper because Node 24 caused native dependency install failures on Windows.

Available commands:

```bash
claude-flow --version
ruflo --version
claude-flow --help
ruflo --help
```

Generated skills live in `.agents/skills`:

- `swarm-orchestration`
- `memory-management`
- `sparc-methodology`
- `security-audit`

Use Ruflo for larger, multi-step work such as:

- Scanner architecture changes
- Security reviews
- FARO methodology changes
- Ready Kit planning
- Monitoring architecture
- Multi-file refactors

Skip Ruflo for simple edits, typo fixes, small docs updates, or single-file bug fixes.

## Code Quality

Prefer existing local patterns over new abstractions. Keep changes scoped.

Use TypeScript strictness, Zod at API boundaries, shared types from `packages/shared`, and server-only access for secrets.

Add tests when changing URL safety, API contracts, scoring, scanner persistence, or public result rendering.

Do not make unrelated refactors while shipping product changes.

## Deployment Notes

Vercel serves `apps/web`.

Railway serves `apps/scanner` using `railway.toml` and `apps/scanner/Dockerfile`.

Supabase migrations live in `supabase/migrations`.

After deployment-related env changes, verify:

- `/api/scans` creates a queued scan
- Railway `/health` returns `{ "ok": true }`
- Railway authenticated `/diagnostics` is healthy
- Supabase scan moves from `queued` to `running` to `completed`
- Public GET `/api/scans/[scanId]` returns sanitized result JSON

## Final Product Standard

FARO should feel like a serious public standard and audit system: clear, restrained, operational, and trustworthy. Build foundations that make the business ladder possible without overbuilding v1.0.
