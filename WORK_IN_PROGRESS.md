# Work In Progress — Ads Dashboard (Facebook + Google)

**Status as of 2026-08-24:** Facebook Ads dashboard complete and verified live.
Google Ads tab built but **not verified** — see blocker below.

This is a checkpoint commit of an in-flight, uncommitted change set. The
Facebook side has been exercised against the real Graph API multiple times
this session (real campaign data confirmed rendering correctly). The Google
side has not — treat its "built" status as "written per documented API
behavior," not "tested."

## Done — Facebook Ads dashboard (verified live)

- `app/admin/facebook-ads/page.tsx` — admin-gated dashboard, now with a
  platform tab switcher (Facebook / Google) sharing one set of components
- `app/admin/facebook-ads/components/{DateFilter,OverviewCards,CampaignTable,
  Recommendations,StatusBadge}.tsx`, `lib/{types,format}.ts`
- `backend-lib/facebook.ts` + `functions/api/facebook/{campaigns,insights,
  recommendations}.ts`, `functions/api/facebook/auth/exchange-token.ts`
- Metrics: spend, impressions, clicks, CTR, conversions, reach, frequency,
  link clicks, conversion rate, CPA/"Cost Per Result", ROAS, budget used %/
  remaining, end date, day-by-day breakdown for weekly views
- Recommendations: ROAS-based (increase budget / pause / monitor / good
  performance) + diagnostic (low CTR, high frequency/ad fatigue, low reach,
  high-spend-low-clicks, zero-conversion tracking gap) — diagnostic rules
  apply to PAUSED campaigns too, not just ACTIVE (this account's campaigns
  are all currently paused; gating to ACTIVE only would've kept
  recommendations empty)
- Campaign status filter (All / Active / Paused / whatever else is present)
- "Last updated" freshness indicator

## Done, unverified — Google Ads tab

- `backend-lib/google-ads.ts` + `functions/api/google/{campaigns,insights,
  recommendations}.ts` — OAuth refresh-token flow, GAQL queries for
  campaign metrics, reach/frequency (`metrics.unique_users`, best-effort),
  Quality Score (keyword-level, averaged per campaign, best-effort),
  impression-share-lost (best-effort)
- Recommendations: low CTR, high CPC, low conversion rate, budget
  depleted, zero-conversion tracking gap, high impression-share-lost
- Frontend reuses the exact same components as Facebook (shapes matched
  closely enough that no separate Google component tree was needed) —
  `Campaign` type extended with optional `avgCpc`/`avgCpm`/`qualityScore`/
  `startDate` for the Detail expand section

### 🔴 Blocker: `GOOGLE_REFRESH_TOKEN` in `.dev.vars` is invalid

Token exchange fails with `invalid_grant`. This means **none of the Google
Ads code has been exercised against a live account** — the error handling
path was confirmed (fails cleanly as a 400 JSON error, no crash), but the
actual GAQL queries, field names, and especially the best-effort
reach/frequency and Quality Score queries are unverified. Regenerate via
OAuth Playground — full steps in `SETUP_GOOGLE_ADS.md` §4.

## Infrastructure fixes made along the way (apply to the whole site, not just this feature)

- `postcass.config.js` → `postcss.config.js` (typo meant PostCSS/Tailwind
  never compiled anywhere, dev or prod — see git history for the full
  diagnosis)
- `app/globals.css` — legacy `@tailwind base/components/utilities;` →
  `@import "tailwindcss";` (v4 syntax; the old shim doesn't support v4
  features like `@source`), removed a duplicated copy of those directives,
  added `@source "./admin/facebook-ads";` (Tailwind's auto content
  detection was silently missing that one new directory)
- `dev.sh` — now sets `LOCAL_API=true` so `npm run dev` proxies `/api/*`
  locally instead of to production
- `scripts/dev-ads-server.ts` (replaces the deleted `dev-facebook-server.ts`)
  — standalone Node server bypassing Wrangler entirely, since `wrangler
  pages dev` fails to start in this environment (tries to open a remote
  preview session against Cloudflare even with `--local`). Run via
  `npm run dev:ads`.
- `backend-lib/ad-shared.ts` (new) — period/date-range math, color-flag
  scoring, admin auth extracted out of `facebook.ts` so Google reuses the
  same tested logic instead of duplicating it. `facebook.ts` re-exports
  everything, so its route files needed zero changes.

## Known limitations (already documented in the setup guides, repeated here for visibility)

- No D1 caching on either platform — every dashboard load hits the live
  API directly, including a fresh Google OAuth token exchange each time.
- Facebook's reach is summed across campaigns/days without cross-row
  dedup — an approximation, not true unique reach.
- Google's reach/frequency and Quality Score are best-effort and may
  return 0/"—" for Search-only or Display/Video-only accounts respectively
  — not a bug, a field-availability limitation.

## Next steps (pick up here tomorrow)

1. Regenerate `GOOGLE_REFRESH_TOKEN` (OAuth Playground — see
   `SETUP_GOOGLE_ADS.md` §4) and actually run the Google tab against real
   data for the first time.
2. Once real data flows, check: does `metrics.unique_users` return
   non-zero for this account's campaign types? Does the Quality Score
   query error or return real scores? Does impression-share-lost work for
   Search campaigns? Adjust `backend-lib/google-ads.ts` based on what
   actually comes back — the current code is a best guess from documented
   API behavior, not from having seen a real response shape.
3. Visual/manual browser pass on both tabs (this session only verified via
   `curl`/compiled-CSS inspection, never an actual browser).
4. Decide whether to commit the `.env`/`.env.local`/`.dev.vars` tracking
   issue fix (they're gitignored but already tracked in git history —
   flagged earlier this session, `git rm --cached` offered but not done).
5. Still pending from the earlier dark→white conversion thread (separate,
   already-committed work — see commit `a666f79e`): Dashboard & Admin
   pages were explicitly marked "pending" there and haven't been revisited
   since.
