# Google Ads Dashboard — Setup Guide

Campaign performance monitoring only, mirroring the Facebook Ads dashboard
(see `SETUP_FACEBOOK_ADS.md`). No campaign creation, no bid/budget changes
— reads the Google Ads API and shows numbers + recommendations. You act on
them manually in Google Ads.

## Status: credentials in this repo's `.dev.vars` are currently invalid

While building this, I tried to verify the integration against your account
the same way I did for Facebook, and the OAuth token exchange failed with
`invalid_grant` using the existing `GOOGLE_REFRESH_TOKEN`. That token is
either expired, revoked, or was issued for a different Client ID/Secret
pair. **The Google Ads code in this dashboard has not been verified against
a live account** - it follows Google's documented API behavior, but you
should treat it as needing a real test pass once you have a working
refresh token, especially the reach/frequency and Quality Score fields
(see "Known limitations" below).

## 1. Google Cloud project + OAuth client

1. Go to https://console.cloud.google.com → create or select a project.
2. **APIs & Services → Library** → search "Google Ads API" → **Enable**.
3. **APIs & Services → OAuth consent screen** → configure it (External is
   fine for a single-account internal tool; add yourself as a test user if
   it stays in "Testing" mode).
4. **APIs & Services → Credentials** → **Create Credentials → OAuth client
   ID** → type **Web application** (or "Desktop app" if you'll generate the
   refresh token via a local script rather than a redirect URI).
   - If Web application: add a redirect URI you control, e.g.
     `http://localhost:3000/oauth/callback` for local generation.
   - Copy the **Client ID** and **Client Secret** → these are
     `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

## 2. Developer Token

1. Go to https://ads.google.com and sign in to (or create) a **Google Ads
   Manager (MCC) account** - the developer token is issued to a manager
   account, not a regular ad account.
2. **Tools & Settings → API Center** → apply for a developer token.
3. New tokens start in **Test account access** (works immediately, but only
   against test accounts) or **Basic access** (works against real accounts,
   requires Google's review - **takes 24-48 hours**, sometimes longer).
   You need Basic (or Standard) access to read your real account's data.
4. Copy the token → `GOOGLE_DEVELOPER_TOKEN` (or the existing unprefixed
   `DEVELOPER_TOKEN` var name already in `.dev.vars` - the code checks both,
   see step 4 below).

## 3. Customer ID (and Login Customer ID, if using a manager account)

1. In Google Ads, the account ID shown top-right (format `123-456-7890`) is
   your **Customer ID** → strip the dashes → `GOOGLE_CUSTOMER_ID`.
2. If you're calling the API through a manager account on behalf of a
   client account (common setup), you also need **Login Customer ID** - the
   *manager* account's ID (dashes stripped) → `GOOGLE_LOGIN_CUSTOMER_ID`.
   If you're querying the manager account's own data directly, you can
   leave this unset.

## 4. Refresh Token

This is the long-lived credential; access tokens (short-lived, ~1 hour) are
minted from it automatically on every dashboard load - see
`backend-lib/google-ads.ts`'s `getAccessToken()`.

Easiest path - Google's **OAuth 2.0 Playground**:

1. Go to https://developers.google.com/oauthplayground
2. Click the gear icon (top-right) → check **"Use your own OAuth
   credentials"** → paste your Client ID and Client Secret from step 1.
3. In the left panel, scroll to find **Google Ads API** (or manually enter
   the scope `https://www.googleapis.com/auth/adwords`) → **Authorize
   APIs** → sign in with the account that has access to your Google Ads
   account.
4. Click **Exchange authorization code for tokens** → copy the
   **Refresh token** shown → this is `GOOGLE_REFRESH_TOKEN`.

Refresh tokens don't expire from time alone, but Google invalidates them if:
the user revokes access, the token goes unused for 6 months, or (for
"Testing" mode OAuth consent screens) after 7 days - if you hit
`invalid_grant` like I did, regenerate via the Playground and swap in the
new value.

## 5. Environment variables

Required (prefixed names shown; the project's existing unprefixed names
from `.dev.vars` — `DEVELOPER_TOKEN`, `CUSTOMER_ID`, `LOGIN_CUSTOMER_ID` —
work too, as a fallback, so nothing needs renaming if you already have
those set):

| Variable | Fallback name | Example |
|---|---|---|
| `GOOGLE_CLIENT_ID` | — | `123...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | — | `GOCSPX-...` |
| `GOOGLE_REFRESH_TOKEN` | — | `1//0g...` |
| `GOOGLE_DEVELOPER_TOKEN` | `DEVELOPER_TOKEN` | 22-char token |
| `GOOGLE_CUSTOMER_ID` | `CUSTOMER_ID` | `1234567890` (no dashes) |
| `GOOGLE_LOGIN_CUSTOMER_ID` | `LOGIN_CUSTOMER_ID` | manager account ID, if applicable |

Optional (see `backend-lib/google-ads.ts`):

| Variable | Default | Purpose |
|---|---|---|
| `GOOGLE_ADS_API_VERSION` | `v17` | API version pin |
| `GOOGLE_DAILY_BUDGET_CAP` / `_WEEKLY_BUDGET_CAP` | sum of enabled campaigns' daily budgets | Spend card color threshold |
| `GOOGLE_CONVERSION_TARGET_DAILY` / `_WEEKLY` | unset (neutral) | Conversions card only turns green with a target set |
| `GOOGLE_LOW_CTR_THRESHOLD` | `1` (percent) | "Consider testing new ad copy or keywords" |
| `GOOGLE_HIGH_CPC_THRESHOLD` | `2` (dollars) | "Optimize Quality Score or lower bids" |
| `GOOGLE_LOW_CONVERSION_RATE_THRESHOLD` | `1` (percent) | "Review landing page experience" |

Admin auth reuses the same `ADMIN_PASSWORD`/`ADMIN_KEY` convention as
Facebook and the rest of the admin panel.

### Local development

Add the vars to `.dev.vars`, then run both:

```
LOCAL_API=true npm run dev
npm run dev:ads
```

(`dev:ads` replaced `dev:facebook` - it now serves both platforms' routes,
since Wrangler can't run locally in this environment; see
`SETUP_FACEBOOK_ADS.md` for why.)

### Production

```
npx wrangler pages secret put GOOGLE_CLIENT_ID --project-name=<mpintellect|mzprimer>
npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name=<mpintellect|mzprimer>
npx wrangler pages secret put GOOGLE_REFRESH_TOKEN --project-name=<mpintellect|mzprimer>
npx wrangler pages secret put GOOGLE_DEVELOPER_TOKEN --project-name=<mpintellect|mzprimer>
npx wrangler pages secret put GOOGLE_CUSTOMER_ID --project-name=<mpintellect|mzprimer>
```

## 6. Testing instructions

Once you have a working refresh token:

1. Visit `/admin/facebook-ads/` (same route as Facebook - it's a tab within
   one dashboard now) and click the **Google Ads** tab.
2. Check the executive summary cards load without an error banner.
3. Cross-check Spend/Conversions for "Today" against the Google Ads UI for
   the same date range.
4. Click a column header to sort; click a campaign row to expand - for
   weekly views, confirm the day-by-day table renders.
5. Check the Campaign Detail expand section for **Quality Score** - if it
   shows "—" for every campaign, either your account has no keyword-based
   Search campaigns, or the query needs adjusting (see limitation below).
6. Check **Reach**/**Frequency** on a Display or Video campaign if you have
   one - Search-only accounts will likely show 0/neutral for these (see
   below).

## Known limitations (be aware before trusting the numbers)

- **Unverified**: this integration has not run against a real account (see
  the note at the top). Treat the first real test as the actual validation
  pass, not this document.
- **Reach/Frequency**: fetched via `metrics.unique_users`, which is
  primarily meant for Display/Video/Discovery reach reporting. For
  Search-only accounts this may return 0 for every campaign - that shows as
  a neutral "0" rather than an error, which could look like a bug when it's
  actually "not applicable to this campaign type."
- **Quality Score**: only exists at the keyword level, not per-campaign.
  This dashboard averages keyword-level scores across each campaign's
  keywords client-side. Accounts with only Display/Video/Performance Max
  campaigns (no keywords) will show "—" for every campaign, correctly.
- **Impression Share Lost**: only meaningful for Search campaigns; other
  types will show 0/no recommendation, not an error.
- **No D1 caching**: every dashboard load calls the Google Ads API
  directly, including a fresh OAuth token exchange each time (Cloudflare
  Pages Functions don't guarantee isolate reuse between requests, so
  caching the access token in memory wouldn't be reliable).
- Audience creation, ad-level detail, and automatic bid/budget changes are
  explicitly out of scope, per the task brief.
