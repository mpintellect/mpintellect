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
// Color-flag scoring (same thresholds for both platforms, per the original
// Facebook dashboard spec: CTR/ROAS green >3 / yellow 1-3 / red <1)
// ---------------------------------------------------------------------------

export type ColorFlag = 'green' | 'yellow' | 'red' | 'neutral';

export function classifyCtr(ctr: number): ColorFlag {
  if (ctr > 3) return 'green';
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

export function classifyFrequency(frequency: number, threshold: number): ColorFlag {
  if (frequency <= 0) return 'neutral';
  if (frequency > threshold) return 'red';
  if (frequency > threshold * 0.7) return 'yellow';
  return 'green';
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
