// backend-lib/ad-shared.ts
// Platform-agnostic helpers shared by the Facebook Ads and Google Ads
// monitoring dashboards (functions/api/facebook/*, functions/api/google/*):
// period/date-range math, color-flag scoring thresholds, and admin auth.
// Extracted from backend-lib/facebook.ts so both platforms use the exact
// same (already-tested) date math and scoring conventions rather than
// duplicating it - see WORK_IN_PROGRESS-era notes on the Facebook build.

export type Period = 'today' | 'yesterday' | 'last_7_days' | 'this_week' | 'last_week';

export interface DateRange {
  since: string; // YYYY-MM-DD
  until: string; // YYYY-MM-DD
}

const DAY_MS = 24 * 60 * 60 * 1000;

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * DAY_MS);
}

/**
 * Calendar math is done in UTC. Both Graph API and Google Ads interpret
 * since/until as calendar dates in the ad account's own timezone, so
 * results are correct to the day; only the exact midnight cutoff can be
 * off by a few hours if the ad account timezone is far from UTC.
 * Acceptable for MVP monitoring.
 */
export function getDateRange(period: Period): DateRange {
  const now = new Date();
  const todayStr = toISODate(now);

  switch (period) {
    case 'today':
      return { since: todayStr, until: todayStr };

    case 'yesterday': {
      const y = toISODate(addDays(now, -1));
      return { since: y, until: y };
    }

    case 'last_7_days': {
      const since = toISODate(addDays(now, -6));
      return { since, until: todayStr };
    }

    case 'this_week': {
      // Monday -> today
      const day = now.getUTCDay(); // 0=Sun..6=Sat
      const diffToMonday = day === 0 ? 6 : day - 1;
      const monday = toISODate(addDays(now, -diffToMonday));
      return { since: monday, until: todayStr };
    }

    case 'last_week': {
      const day = now.getUTCDay();
      const diffToMonday = day === 0 ? 6 : day - 1;
      const thisMonday = addDays(now, -diffToMonday);
      const lastMonday = addDays(thisMonday, -7);
      const lastSunday = addDays(thisMonday, -1);
      return { since: toISODate(lastMonday), until: toISODate(lastSunday) };
    }
  }
}

/** The comparison period shown as "vs Yesterday" / "vs Last Week" etc. */
export function getComparisonDateRange(period: Period): DateRange {
  const now = new Date();

  switch (period) {
    case 'today':
      return getDateRange('yesterday');

    case 'yesterday': {
      const d = toISODate(addDays(now, -2));
      return { since: d, until: d };
    }

    case 'last_7_days': {
      const since = toISODate(addDays(now, -13));
      const until = toISODate(addDays(now, -7));
      return { since, until };
    }

    case 'this_week':
      return getDateRange('last_week');

    case 'last_week': {
      const day = now.getUTCDay();
      const diffToMonday = day === 0 ? 6 : day - 1;
      const thisMonday = addDays(now, -diffToMonday);
      const twoWeeksAgoMonday = addDays(thisMonday, -14);
      const twoWeeksAgoSunday = addDays(thisMonday, -8);
      return { since: toISODate(twoWeeksAgoMonday), until: toISODate(twoWeeksAgoSunday) };
    }
  }
}

/** true for the periods the UI treats as "weekly" (day-by-day breakdown available) */
export function isWeeklyPeriod(period: Period): boolean {
  return period === 'last_7_days' || period === 'this_week' || period === 'last_week';
}

export function parsePeriod(value: string | null): Period {
  const allowed: Period[] = ['today', 'yesterday', 'last_7_days', 'this_week', 'last_week'];
  return allowed.includes(value as Period) ? (value as Period) : 'today';
}

// ---------------------------------------------------------------------------
// Color-flag scoring (same thresholds for both platforms). CTR/frequency
// bands per the "what good looks like" spec for accounts without
// conversion tracking set up yet: CTR green >1.5% / yellow 1-1.5% / red <1%.
// ---------------------------------------------------------------------------

export type ColorFlag = 'green' | 'yellow' | 'red' | 'neutral';

export function classifyCtr(ctr: number): ColorFlag {
  if (ctr > 1.5) return 'green';
  if (ctr >= 1) return 'yellow';
  return 'red';
}

export function classifyRoas(roas: number): ColorFlag {
  if (roas > 3) return 'green';
  if (roas >= 1) return 'yellow';
  return 'red';
}

/** "Cost per result" profitability derived from ROAS: green/red only (no yellow), matching the spec's 2-state CPA coloring. */
export function classifyCpaFromRoas(roas: number): ColorFlag {
  if (roas <= 0) return 'neutral';
  return roas >= 1 ? 'green' : 'red';
}

export function classifySpend(spend: number, cap: number | undefined): ColorFlag {
  if (!cap || cap <= 0) return 'neutral';
  const pct = spend / cap;
  if (pct <= 1) return 'green';
  if (pct <= 1.1) return 'yellow';
  return 'red';
}

export function classifyConversions(conversions: number, target: number | undefined): ColorFlag {
  if (!target || target <= 0) return 'neutral';
  return conversions >= target ? 'green' : 'yellow';
}

/** green <= threshold-1, yellow (threshold-1, threshold], red > threshold - with the default threshold of 3 that's green <=2x / yellow 2-3x / red >3x. */
export function classifyFrequency(frequency: number, threshold: number): ColorFlag {
  if (frequency <= 0) return 'neutral';
  if (frequency > threshold) return 'red';
  if (frequency > threshold - 1) return 'yellow';
  return 'green';
}

/** Cost-per-click-style value (dollars) - green <= goodMax, red > badMin, yellow in between. Defaults (0.05/0.10) are just numbers in whatever currency the account bills in, same convention as the other dollar-denominated thresholds in this file - override per-account via env if not GBP/USD-scale. */
export function classifyCostPerClick(value: number, goodMax: number = 0.05, badMin: number = 0.1): ColorFlag {
  if (value <= 0) return 'neutral';
  if (value <= goodMax) return 'green';
  if (value <= badMin) return 'yellow';
  return 'red';
}

/** Reach as a percentage of impressions - low values mean the same people are seeing the ad repeatedly rather than reaching new people (closely related to, but a distinct lens from, classifyFrequency). green >=50%, yellow 30-50%, red <30%. */
export function classifyReachRatio(reach: number, impressions: number): ColorFlag {
  if (impressions <= 0 || reach <= 0) return 'neutral';
  const pct = (reach / impressions) * 100;
  if (pct >= 50) return 'green';
  if (pct >= 30) return 'yellow';
  return 'red';
}

/**
 * Budget utilization where LOW is the bad direction (opposite of
 * classifySpend, which flags overspend) - a campaign not spending its
 * budget usually means the bid is too low to compete, not that it's
 * "under control". green >=70%, yellow 50-70%, red <50%. Like
 * budgetUsedPct itself, only meaningful for the "today" view - checked
 * mid-day this will read low even for a perfectly healthy campaign that
 * simply hasn't finished spending yet.
 */
export function classifyBudgetUtilizationLow(pct: number | null): ColorFlag {
  if (pct === null) return 'neutral';
  if (pct >= 70) return 'green';
  if (pct >= 50) return 'yellow';
  return 'red';
}

export function computeHealth(flags: ColorFlag[]): 'good' | 'warning' | 'bad' {
  if (flags.includes('red')) return 'bad';
  if (flags.includes('yellow')) return 'warning';
  return 'good';
}

/** Budget used this period against a daily cap (x7 for weekly views). null if no daily budget is set. */
export function budgetUsedPct(spend: number, dailyBudget: number | undefined, weekly: boolean): number | null {
  if (!dailyBudget || dailyBudget <= 0) return null;
  const cap = weekly ? dailyBudget * 7 : dailyBudget;
  return (spend / cap) * 100;
}

/**
 * Spend-weighted average CPA across campaigns that got at least one
 * conversion in the period - a self-calibrating baseline for "high/low CPA"
 * recommendations. Unlike CTR (roughly universal ~1%+) a sane CPA target
 * varies wildly by vertical, so rather than a hardcoded default this is
 * compared against the account's own blended CPA (an explicit env target,
 * where configured, always takes precedence - see cpaTargetFor in each
 * platform's backend-lib file). Returns 0 if no campaign converted.
 */
export function computeAverageCpa(entries: Array<{ spend: number; conversions: number }>): number {
  const totals = entries.reduce(
    (acc, e) => {
      if (e.conversions > 0) {
        acc.spend += e.spend;
        acc.conversions += e.conversions;
      }
      return acc;
    },
    { spend: 0, conversions: 0 }
  );
  return totals.conversions > 0 ? totals.spend / totals.conversions : 0;
}

// ---------------------------------------------------------------------------
// Admin auth - identical convention for every platform's routes under
// functions/api/<platform>/*: a shared secret in the x-admin-key header,
// checked against ADMIN_PASSWORD/ADMIN_KEY. Fails closed if neither is
// configured, rather than falling back to a guessable default (see
// CLAUDE.md note on functions/api/admin/validate.ts - that hardcoded
// fallback is a known issue there, not a convention to repeat).
// ---------------------------------------------------------------------------

export function verifyAdminAuth(request: Request, env: { ADMIN_PASSWORD?: string; ADMIN_KEY?: string }): boolean {
  const provided = request.headers.get('x-admin-key') || '';
  const expected = env.ADMIN_PASSWORD || env.ADMIN_KEY;
  if (!expected || !provided) return false;
  return provided === expected;
}
