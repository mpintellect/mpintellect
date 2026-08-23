# Work In Progress — Dark→White Conversion

**Status as of 2026-08-23:** Public pages complete. Pending: Dashboard & Admin.

This is a checkpoint commit of an in-flight, uncommitted change set. Nothing here has
been through `npm run build` verification or manual browser testing — treat the "complete"
label as "changes written," not "verified."

## Done — public-facing pages/components (dark → white theme)

- `app/globals.css` — large rewrite (theme tokens/colors)
- `app/AIChat/page.tsx`, `app/ai-robot/page.tsx`, `app/broker-invite/page.tsx`,
  `app/markets/page.tsx`, `app/prop-firm/page.tsx`, `app/thank-you/page.tsx`,
  `app/unsubscribe/page.tsx`, `app/layout.tsx`
- `components/Navbar.tsx`, `components/Footer.tsx`, `components/Hero.tsx`,
  `components/ContactSection.tsx`, `components/AiToolsSection.tsx`,
  `components/AIRobotCards.tsx`, `components/InstantChart.tsx`,
  `components/LatestInsights.tsx`, `components/NotificationButton.tsx`,
  `components/PropFirmChatSection.tsx`, `components/ToolNavigation.tsx`,
  `components/TradeChart.tsx`, `components/UnifiedFetcher.tsx`
- Tool client views: `components/analysis/AnalysisClientView.tsx`,
  `components/calculator/CalculatorClientView.tsx`,
  `components/forecast/ForecastClientView.tsx`,
  `components/indicator/IndicatorClientView.tsx`,
  `components/momentum/MomentumClientView.tsx`,
  `components/trade/TradeClientView.tsx`,
  `components/trend/TrendClientView.tsx`,
  `components/volatility/VolatilityClientView.tsx`,
  `components/zones/ZonesClientView.tsx`
- `chart-generayion.ts`, `app/lib/seo/forecastGenerator.ts`
- New (untracked): `components/AnimatedBackground.tsx` — currently a 3-line stub, not yet built out

## Pending — Dashboard & Admin (not yet converted)

- `app/client/dashboard/billing/page.tsx`
- `app/client/dashboard/components/UserSetups.tsx`
- `app/client/dashboard/refer/page.tsx`
- `components/BillingHistory.tsx`
- New (untracked): `functions/api/admin/validate.ts` — admin auth endpoint.
  ⚠️ Per CLAUDE.md, this file type has a known pattern of falling back to a hardcoded
  admin password if `ADMIN_PASSWORD`/`ADMIN_KEY` env vars are unset — verify this
  instance doesn't replicate that before shipping.

## Other in-flight changes (not part of the theme conversion)

- **URL/SEO normalization** — `middleware.ts` and `functions/_middleware.ts` now
  301-redirect `/tool/symbol` → `/en/tool/symbol/` and lowercase-canonicalize
  locale/tool/symbol path segments.
- **Auth/hooks** — `app/hooks/useUser.ts`, `app/hooks/useOneSetup.ts`,
  `functions/api/auth/me.ts`, `functions/api/referral/redeem.ts`
- `app/lib/cloudflare/push-client.ts`, `app/lib/cloudflare/trials.ts`, `env.d.ts`,
  `next.config.ts`
- `schema.sql` — 247-line diff, **not yet applied to the D1 database** (schema.sql
  changes are manual per CLAUDE.md — no migration runner)
- `tsconfig.tsbuildinfo` — build artifact, diff is incidental

## Next steps

1. Convert Dashboard pages/components to the white theme.
2. Convert/verify `functions/api/admin/validate.ts` (and check the hardcoded-password
   fallback concern above).
3. Flesh out `components/AnimatedBackground.tsx` (currently a stub) if it's meant to
   be used somewhere.
4. Run `npm run build` and manually test in browser (build errors are ignored by
   `next.config.ts`, so a passing build isn't proof of correctness).
5. Apply the `schema.sql` diff to the D1 database if the schema changes are ready.
6. Decide whether the SEO/middleware redirect work and schema changes are meant to
   ship in the same pass as the theme conversion, or split out separately.
