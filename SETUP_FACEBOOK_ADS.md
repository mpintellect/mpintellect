# Facebook Ads Dashboard — Setup Guide

Campaign performance monitoring only. No audience creation, no ad management,
no auto-pause/auto-budget actions — this dashboard reads the Marketing API
and shows you numbers + recommendations. You act on them manually in Ads
Manager.

## 1. Meta App setup

1. Go to https://developers.facebook.com/apps and click **Create App**.
2. Choose type **"Other"** → **"Business"**.
3. Once created, on the app dashboard click **Add Product** → find
   **Marketing API** → **Set Up**.
4. Under **App Settings → Basic**, copy the **App ID** and **App Secret**
   — these become `FB_APP_ID` / `FB_APP_SECRET` (only needed if you use the
   token-exchange helper below; not needed if you use a System User token).
5. Your app starts in **Development Mode**. For an internal monitoring tool
   reading your own ad account, Development Mode is fine — no App Review
   needed, as long as the Facebook user/System User generating the token is
   an admin/employee of the Business that owns the ad account.

## 2. Ad Account ID

1. Go to https://business.facebook.com → **Business Settings** → **Accounts**
   → **Ad Accounts**.
2. Click your ad account — the ID is shown as `act_123456789012345`.
3. Use just the numeric part (without `act_`) as `FB_AD_ACCOUNT_ID`, e.g.
   `123456789012345`. (The dashboard code adds the `act_` prefix itself.)

## 3. Access token — long-lived (recommended path: System User token)

The simplest option for a server-side, no-login dashboard is a **System
User Access Token** — it doesn't expire and requires no OAuth dance:

1. Business Settings → **Users** → **System Users** → **Add**.
2. Create a system user (e.g. "ads-dashboard"), role: Employee is enough.
3. Click **Add Assets** → assign it the ad account with **View Performance**
   (or full analytics) access — read-only is enough for this dashboard.
4. Click **Generate New Token** on that system user.
   - App: your Meta App from step 1.
   - Permissions: `ads_read` (and `business_management` if prompted).
5. Copy the generated token — it does not expire on its own (only if
   revoked, or the app/business is removed). This is your `FB_ACCESS_TOKEN`.

### Alternative: personal user token, exchanged for long-lived (~60 days)

If you'd rather use your own user token instead of a System User:

1. Go to https://developers.facebook.com/tools/explorer
2. Select your app, select your user, request permission `ads_read`.
3. Click **Generate Access Token** — this is a **short-lived** token
   (~1-2 hours).
4. Exchange it for a long-lived token (~60 days) by calling the dashboard's
   built-in helper (admin-gated):

   ```
   GET /api/facebook/auth/exchange-token?short_lived_token=<paste_here>
   Header: x-admin-key: <your admin password>
   ```

   The response's `access_token` is your long-lived `FB_ACCESS_TOKEN`. You'll
   need to repeat this every ~60 days — the System User token above avoids
   that entirely.

## 4. Environment variables

Required:

| Variable | Example | Notes |
|---|---|---|
| `FB_ACCESS_TOKEN` | `EAAxxxxx...` | System User or long-lived user token |
| `FB_AD_ACCOUNT_ID` | `123456789012345` | Numeric only, no `act_` prefix |

Optional (all have sane fallbacks — see `backend-lib/facebook.ts`):

| Variable | Default | Purpose |
|---|---|---|
| `FB_APP_ID` / `FB_APP_SECRET` | — | Only needed for `/api/facebook/auth/exchange-token` |
| `FB_GRAPH_API_VERSION` | `v21.0` | Graph API version pin |
| `FB_CONVERSION_ACTION_TYPES` | purchase/lead action types | Comma-separated Graph API `action_type` values counted as a "conversion" — adjust to match your pixel/CAPI events |
| `FB_DAILY_BUDGET_CAP` | sum of active campaigns' `daily_budget` | Overrides the auto-computed cap used for the Spend card's color |
| `FB_WEEKLY_BUDGET_CAP` | daily cap × 7 | Same, for weekly views |
| `FB_CONVERSION_TARGET_DAILY` / `FB_CONVERSION_TARGET_WEEKLY` | unset (card stays neutral/gray) | Conversions card only turns green once you set a target |
| `FB_LOW_CTR_THRESHOLD` | `1` (percent) | Below this triggers a "Low CTR — consider testing new creative" recommendation |
| `FB_HIGH_FREQUENCY_THRESHOLD` | `3` | Above this triggers an "Ad fatigue detected" recommendation, and colors the Frequency column/card |
| `FB_LOW_REACH_THRESHOLD_DAILY` / `_WEEKLY` | `100` / `500` | Below this triggers a "Low Reach — expand targeting" recommendation |
| `FB_HIGH_SPEND_THRESHOLD_DAILY` / `_WEEKLY` | `10` / `50` (dollars) | Combined with the clicks threshold below to trigger a "Low Relevance" recommendation |
| `FB_LOW_CLICKS_THRESHOLD` | `5` | See above — spend at/above the threshold AND clicks below this |

Admin auth reuses the existing convention: `ADMIN_PASSWORD` or `ADMIN_KEY`
(same as `/api/admin/validate`). If neither is set, the dashboard's API
routes deny all requests (fail closed — no hardcoded fallback password).

### Local development

Add these to `.dev.vars` (already gitignored):

```
FB_ACCESS_TOKEN=EAAxxxxx...
FB_AD_ACCOUNT_ID=123456789012345
ADMIN_PASSWORD=your-local-admin-password
```

Run both of these together:

```
LOCAL_API=true npm run dev
npm run dev:ads
```

`dev:ads` (`scripts/dev-ads-server.ts`) runs the Facebook and Google Ads API
handlers directly under Node, bypassing Wrangler entirely — `wrangler pages
dev` fails to start in this environment (it tries to open a remote preview
session against Cloudflare even with `--local`, which errors out; see
`dev.sh`'s comments). Plain `npm run dev` alone proxies `/api/*` to
**production**, so it won't pick up your local `.dev.vars` credentials at
all — `LOCAL_API=true` routes it to `dev:ads` on port 8788 instead.

### Production (Cloudflare Pages)

```
npx wrangler pages secret put FB_ACCESS_TOKEN --project-name=<mpintellect|mzprimer>
npx wrangler pages secret put FB_AD_ACCOUNT_ID --project-name=<mpintellect|mzprimer>
```

This task note said "no git/deploy — testing only," so don't run
`deploy:main` / `deploy:intel` for this until you're ready; test locally
first.

## 5. Testing instructions

1. **Admin gate**: visit `/admin/facebook-ads/`. You should see a password
   prompt. Enter the wrong password → "Incorrect password". Enter
   `ADMIN_PASSWORD` (or `ADMIN_KEY`) → dashboard loads.
2. **Date filter**: default view is "Today". Click each of the 5 filters —
   the URL doesn't change (client-side state) but the cards/table/
   recommendations should reload each time (watch the Refresh spinner).
3. **Executive Summary cards**: confirm Spend/Conversions/CTR/CPA/ROAS
   render with a background color and a "vs Yesterday"/"vs Last Week" delta.
   Cross-check one number (e.g. Spend) against Ads Manager for the same
   date range to sanity-check the Graph API call.
4. **Campaign table**: click column headers (Spend/CTR/CPA/ROAS) to sort;
   click again to reverse. Click a campaign row to expand — for "Last 7
   Days"/"This Week"/"Last Week" you should see a day-by-day breakdown
   table; for "Today"/"Yesterday" there's no breakdown (single-day period).
5. **Recommendations**: check that a campaign with ROAS > 3 gets a 💰
   Increase Budget suggestion, one with ROAS < 1 gets a 🔴 Pause suggestion,
   and a big ROAS drop vs. the comparison period gets a ⚠️ Monitor Closely
   suggestion. If your account has few/no conversions yet, you'll mostly
   see this as an empty or sparse list — that's expected, not a bug.
6. **Auth failure**: temporarily clear `FB_ACCESS_TOKEN` and reload — the
   dashboard should show the red error banner with the Graph API's error
   message, not crash silently.
7. **Token exchange helper** (only if not using a System User token): call
   `/api/facebook/auth/exchange-token` per step 3 above and confirm you get
   back a token starting with `EAA`.

## Known simplifications (MVP scope)

- Date-range math runs in UTC on the server; the Graph API resolves
  `since`/`until` in the ad account's own timezone, so results are correct
  to the calendar day but the exact midnight cutoff can be off by a few
  hours for accounts far from UTC.
- No D1 caching — every dashboard load calls the Graph API directly. Fine
  for a single admin checking in periodically; add caching if this gets
  hit frequently or you approach Graph API rate limits.
- "Conversions" = configurable action types you sum yourself
  (`FB_CONVERSION_ACTION_TYPES`), not a single canonical Graph API field —
  Meta doesn't provide one, so match this to whatever event you actually
  optimize for.
- Audience creation, ad-level detail, and Telegram alerts are explicitly
  out of scope for this pass, per the task brief.
