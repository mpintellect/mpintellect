# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Next.js 16 App Router app, statically exported (`output: 'export'`) and deployed to Cloudflare Pages, with a Cloudflare Pages Functions backend in `functions/api/`. Two Cloudflare Pages projects build from this one repo — "main" (mpintellect.com) and "intel" (mzprimer) — selected via `NEXT_PUBLIC_BUILD_TARGET`; both are actively used, neither is more "default" than the other. A separate standalone Cloudflare Worker for push notifications lives in `workers/push-worker/`.

## Local development

- Use `./dev.sh` to run Next dev + `wrangler pages dev ./functions --local` together (it kills anything already on ports 8788/3000 first). This is the standard local dev workflow.
- Plain `npm run dev` proxies `/api/*` to **production** (`https://mpintellect.com/api/*`) unless `LOCAL_API=true` is set — don't assume `npm run dev` alone is talking to a local backend.
- `npm run dev:d1` is currently broken (`dev-with-d1.sh` is empty).

## Build & deploy

- `npm run build:intel` / `build:main` set `NEXT_PUBLIC_BUILD_TARGET` for the two build variants; deploy with `npm run deploy:intel` / `deploy:main` (`wrangler pages deploy`).
- Do not run the root `deploy.sh` or `vercel --prod` — `deploy.sh` auto-commits (`git add -A`), pushes to `main`, and deploys to Vercel, which conflicts with the Cloudflare Pages flow used everywhere else. Use the `deploy:*` npm scripts instead (or the `/deploy` skill).
- `next.config.ts` sets `typescript: { ignoreBuildErrors: true }` — a passing `npm run build` does not mean the code type-checks.
- `functions/` (Cloudflare Pages Functions) is excluded from the main `tsconfig.json` and is not type-checked by `next build`/`next dev` — it has its own type surface via `@cloudflare/workers-types`.

## Auth

Two auth-header conventions coexist with no single global standard: `Authorization: Bearer <token>` (token read from `mz_token` in localStorage via `app/lib/auth-client.ts`) and a custom `x-mz-token` header (used in `functions/_middleware.ts`, `functions/api/setups.ts`, and some components). Match whichever convention the file you're editing already uses — don't unify them unless asked.

## Database

- Cloudflare D1 (SQLite). Schema lives in `schema.sql` (idempotent `CREATE TABLE IF NOT EXISTS` statements) — there is no migrations directory, so schema changes are made by editing `schema.sql` directly and applying manually.
- `full_migration.sql` is a one-time data dump/export, not a migration chain.
- `npm run db:pull` exports a remote backup of the `mpintellect-db` D1 database.

## Testing & linting

- No test framework is configured (no jest/vitest/playwright, no test files anywhere) — don't assume `npm test` exists.
- No ESLint config exists despite `eslint`/`eslint-config-next` being installed, and there's no `lint` script — don't assume `npm run lint` works.

## Security notes

- Root `wrangler.toml` (config for an unrelated "mpintellect-telegram" worker) has plaintext secrets committed to git. Never add further secrets to a tracked wrangler config file — flag it to the user instead of treating it as a pattern to follow.
- `functions/api/admin/validate.ts` falls back to a hardcoded admin password if `ADMIN_PASSWORD`/`ADMIN_KEY` env vars are unset — don't replicate hardcoded-secret fallbacks elsewhere.

## Git

Write real, descriptive commit messages. Existing history is mostly non-descriptive single-word commits — that is not a convention to follow.

## Misc

Root contains some stray, likely-accidental tracked files (`-H`, `-d`, `FETCH_HEAD`, `postcass.config.js` — a typo of `postcss.config.js`, `chart-generayion.ts`) — leave them alone unless the user asks about them specifically.
