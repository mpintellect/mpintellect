# Work In Progress — Ads Dashboard (Facebook + Google)

**Status as of 2026-08-24 (session 2):** Both Facebook and Google Ads tabs
are now verified live against real accounts, including real spend data.
Google's blocker from session 1 is resolved. Currency display bug (both
platforms) found and fixed this session.

## Done — Facebook Ads dashboard (verified live)

- `app/admin/facebook-ads/page.tsx` — admin-gated dashboard, platform tab
  switcher (Facebook / Google) sharing one set of components
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
  apply to PAUSED campaigns too, not just ACTIVE
- Campaign status filter (All / Active / Paused / whatever else is present)
- "Last updated" freshness indicator
- Confirmed live account currency: **GBP**, not USD (see currency fix below)

## Done — Google Ads tab (verified live this session)

- `backend-lib/google-ads.ts` + `functions/api/google/{campaigns,insights,
  recommendations}.ts` — OAuth refresh-token flow, GAQL queries for
  campaign metrics, reach/frequency (`metrics.unique_users`, best-effort),
  Quality Score (keyword-level, averaged per campaign, best-effort),
  impression-share-lost (best-effort)
- Recommendations: low CTR, high CPC, low conversion rate, budget
  depleted, zero-conversion tracking gap, high impression-share-lost
- Frontend reuses the exact same components as Facebook — `Campaign` type
  extended with optional `avgCpc`/`avgCpm`/`qualityScore`/`startDate`
- Confirmed live account currency: **MAD**, not USD (see currency fix below)
- Real account: 566 total campaigns historically, 552 `REMOVED`, 14
  `PAUSED`, 0 `ENABLED`. 3 campaigns have real spend (all `DEMAND_GEN`
  type). Server-side query now filters out `REMOVED` (was returning all
  566 rows on every request before the fix below).

### Bugs found and fixed this session (all confirmed against the live account before/after)

1. `GOOGLE_REFRESH_TOKEN` — was `invalid_grant` in session 1; works now
   (regenerated between sessions, outside this conversation).
2. API version hardcoded to `v17` (Google fully sunset it) → defaults to
   `v25` now (`backend-lib/google-ads.ts` `apiVersion()`). **This will need
   bumping again periodically** — check
   https://developers.google.com/google-ads/api/docs/release-notes.
3. `pageSize: 1000` param on every GAQL search → v25 rejects it
   (`PAGE_SIZE_NOT_SUPPORTED`, fixed at 10k/page now) → removed.
4. `campaign.start_date`/`campaign.end_date` → renamed to
   `start_date_time`/`end_date_time` (now return `"YYYY-MM-DD HH:MM:SS"`,
   not date-only) → updated query, added `dateOnly()` trim so the frontend
   still gets a plain date.
5. Quality Score query filtered `ad_group_criterion` by `segments.date`,
   which that resource doesn't support at all
   (`PROHIBITED_SEGMENT_IN_SELECT_OR_WHERE_CLAUSE`) — was silently
   swallowed by the `catch`, so Quality Score always silently failed and
   showed "—". Removed the date filter (Quality Score has no date range in
   the API).
6. `DEVELOPER_TOKEN` in `.dev.vars`/`.env.local` was actually invalid
   (`DEVELOPER_TOKEN_INVALID`) — user regenerated it from Google Ads API
   Center mid-session; confirmed working after.
7. All four campaign-scoped GAQL queries (`campaignQuery`,
   `fetchReachByCampaign`, `fetchDailyReachByCampaign`,
   `fetchImpressionShareLostByCampaign`) plus the Quality Score query now
   filter `campaign.status != 'REMOVED'` server-side — cut the campaigns
   payload from 566 rows to 14 with no change in the real numbers
   (verified before/after).

### 🟡 Currency bug found and fixed (both platforms)

User caught that Google's budget currency looked wrong. Checked both
accounts live:
- Google Ads `customer.currency_code` = **MAD**
- Facebook Ads account `currency` field = **GBP** (also not USD — nobody
  had caught this either, since the Facebook side was "verified" on
  numbers, not currency labeling)

`formatCurrency()` in `app/admin/facebook-ads/lib/format.ts` was hardcoding
a `$` prefix everywhere (12 call sites across `CampaignTable.tsx` /
`OverviewCards.tsx`). Fixed:
- `backend-lib/{facebook,google-ads}.ts` — added `fetchAccountCurrency()`
  to each (Graph API `currency` field / GAQL `customer.currency_code`)
- All 6 API routes (`insights`/`campaigns`/`recommendations` × 2
  platforms) now fetch and return `currency` in their JSON response
- `formatCurrency(value, currency)` now uses `Intl.NumberFormat(..., {
  style: 'currency', currency })` instead of a hardcoded `$`
- `currency` threaded through `page.tsx` → `OverviewCards`/`CampaignTable`
  → `CampaignDetails`
- Two more hardcoded `$` signs found inside recommendation message text
  (`facebook.ts` high-spend-low-clicks message, `google-ads.ts` high-CPC
  message) — display-only fixes wouldn't have caught these. Added a small
  `formatMoney()` helper in each backend file (can't import the frontend's
  Intl-based formatter into backend-lib) and threaded `currency` through
  `generateRecommendations()`/`generateGoogleRecommendations()`.

All verified live: Google insights/campaigns/recommendations now report
`currency: "MAD"`, Facebook reports `currency: "GBP"`, numbers unchanged
from before the fix.

### 🟡 Not yet fixed — currency-unaware recommendation *thresholds*

Flagged to the user, not yet actioned. Env-driven thresholds are compared
directly against raw account-currency numbers with no conversion:
- `GOOGLE_HIGH_CPC_THRESHOLD` (comment says "dollars, default 2") compared
  against `avgCpc` which is actually in MAD
- `FB_HIGH_SPEND_THRESHOLD_DAILY`/`WEEKLY`, `FB_DAILY_BUDGET_CAP`/
  `WEEKLY_BUDGET_CAP`, `GOOGLE_DAILY_BUDGET_CAP`/`WEEKLY_BUDGET_CAP` — same
  issue, all assume USD-scale numbers
- This is a business-logic question (what should "high CPC" mean in
  MAD/GBP terms), not a display bug — needs the user's input on real
  threshold values per currency, not a unilateral fix.

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

## Next steps (pick up here next time)

1. Decide real threshold values for `GOOGLE_HIGH_CPC_THRESHOLD` and the
   spend/budget-cap env vars now that we know the real currencies (MAD for
   Google, GBP for Facebook) — see currency-threshold issue above.
2. Visual/manual browser pass on both tabs (still only verified via
   `curl`/dev-server JSON responses this session and last — never opened
   in an actual browser).
3. Decide whether to commit the `.env`/`.env.local`/`.dev.vars` tracking
   issue fix (they're gitignored but already tracked in git history —
   flagged in session 1, `git rm --cached` offered but not done).
4. Still pending from the earlier dark→white conversion thread (separate,
   already-committed work — see commit `a666f79e`): Dashboard & Admin
   pages were explicitly marked "pending" there and haven't been revisited
   since.
