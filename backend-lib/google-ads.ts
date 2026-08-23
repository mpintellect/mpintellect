// backend-lib/google-ads.ts
// Google Ads API (REST) helpers for the Google Ads monitoring dashboard
// (functions/api/google/*). Read-only: no campaign creation or bid changes
// here. Mirrors backend-lib/facebook.ts's structure and conventions;
// shared period/date-range math and color scoring live in ad-shared.ts.
//
// NOTE: unlike the Facebook build, this was NOT verified against a live
// account - the GOOGLE_REFRESH_TOKEN available during development was
// invalid (invalid_grant). Field names and GAQL shapes follow Google's
// documented API behavior, but the reach/frequency and quality-score
// queries in particular are best-effort (see comments below) and should be
// checked against a real account once credentials are working.

import {
  type Period,
  type DateRange,
  isWeeklyPeriod,
} from './ad-shared';

interface GoogleEnv {
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REFRESH_TOKEN?: string;
  GOOGLE_REDIRECT_URI?: string;
  GOOGLE_DEVELOPER_TOKEN?: string;
  DEVELOPER_TOKEN?: string; // fallback - already present in this project's .dev.vars
  GOOGLE_CUSTOMER_ID?: string;
  CUSTOMER_ID?: string; // fallback
  GOOGLE_LOGIN_CUSTOMER_ID?: string;
  LOGIN_CUSTOMER_ID?: string; // fallback
  GOOGLE_ADS_API_VERSION?: string;
  GOOGLE_DAILY_BUDGET_CAP?: string;
  GOOGLE_WEEKLY_BUDGET_CAP?: string;
  GOOGLE_CONVERSION_TARGET_DAILY?: string;
  GOOGLE_CONVERSION_TARGET_WEEKLY?: string;
  GOOGLE_LOW_CTR_THRESHOLD?: string; // percent, default 1
  GOOGLE_HIGH_CPC_THRESHOLD?: string; // dollars, default 2
  GOOGLE_LOW_CONVERSION_RATE_THRESHOLD?: string; // percent, default 1
  ADMIN_PASSWORD?: string;
  ADMIN_KEY?: string;
}

export class GoogleAdsApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function developerToken(env: GoogleEnv): string | undefined {
  return env.GOOGLE_DEVELOPER_TOKEN || env.DEVELOPER_TOKEN;
}

function customerId(env: GoogleEnv): string | undefined {
  const raw = env.GOOGLE_CUSTOMER_ID || env.CUSTOMER_ID;
  return raw ? raw.replace(/-/g, '') : undefined;
}

function loginCustomerId(env: GoogleEnv): string | undefined {
  const raw = env.GOOGLE_LOGIN_CUSTOMER_ID || env.LOGIN_CUSTOMER_ID;
  return raw ? raw.replace(/-/g, '') : undefined;
}

function apiVersion(env: GoogleEnv): string {
  return env.GOOGLE_ADS_API_VERSION || 'v17';
}

/**
 * Exchanges the long-lived refresh token for a short-lived access token.
 * Fetched fresh on every request rather than cached - Cloudflare Pages
 * Functions don't guarantee isolate reuse between requests, so an
 * in-memory cache would be unreliable. Adds one extra round-trip per
 * dashboard load, which is an acceptable cost for this MVP's traffic.
 */
async function getAccessToken(env: GoogleEnv): Promise<string> {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REFRESH_TOKEN) {
    throw new GoogleAdsApiError(
      'Google OAuth credentials are not configured (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN)',
      500
    );
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }).toString(),
  });

  const json: any = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    const msg = json?.error_description || json?.error || 'Failed to refresh Google OAuth access token';
    throw new GoogleAdsApiError(msg, res.status || 502);
  }

  return json.access_token;
}

/** Runs a GAQL search query against the configured customer account, following pagination. */
async function gaqlSearch(env: GoogleEnv, query: string): Promise<any[]> {
  const devToken = developerToken(env);
  const custId = customerId(env);
  if (!devToken) throw new GoogleAdsApiError('GOOGLE_DEVELOPER_TOKEN is not configured', 500);
  if (!custId) throw new GoogleAdsApiError('GOOGLE_CUSTOMER_ID is not configured', 500);

  const accessToken = await getAccessToken(env);
  const url = `https://googleads.googleapis.com/${apiVersion(env)}/customers/${custId}/googleAds:search`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'developer-token': devToken,
    'Content-Type': 'application/json',
  };
  const login = loginCustomerId(env);
  if (login) headers['login-customer-id'] = login;

  const results: any[] = [];
  let pageToken: string | undefined;
  let pageCount = 0;

  do {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, pageToken, pageSize: 1000 }),
    });
    const json: any = await res.json().catch(() => ({}));

    if (!res.ok || json.error) {
      const msg = json?.error?.message || `Google Ads API request failed (${res.status})`;
      throw new GoogleAdsApiError(msg, res.status || 502);
    }

    results.push(...(json.results || []));
    pageToken = json.nextPageToken;
    pageCount++;
  } while (pageToken && pageCount < 10);

  return results;
}

// ---------------------------------------------------------------------------
// Campaign + metrics
// ---------------------------------------------------------------------------

export interface GoogleCampaignRow {
  id: string;
  name: string;
  status: string; // ENABLED | PAUSED | REMOVED
  startDate: string | null;
  endDate: string | null;
  dailyBudget: number | null; // dollars
  date?: string; // present only in the daily-breakdown query
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number; // percentage, e.g. 2.15 == 2.15%
  conversions: number;
  revenue: number; // metrics.conversions_value
  avgCpc: number; // dollars
  avgCpm: number; // dollars
}

function microsToDollars(v: unknown): number {
  const n = Number(v || 0);
  return n / 1_000_000;
}

/**
 * GAQL aggregates automatically over the WHERE segments.date range when
 * segments.date is NOT in the SELECT list (one row per campaign for the
 * whole range). Selecting segments.date instead breaks results into one
 * row per campaign per day - used for the weekly day-by-day breakdown.
 */
function campaignQuery(range: DateRange, daily: boolean): string {
  return `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.start_date,
      campaign.end_date,
      campaign_budget.amount_micros,
      metrics.cost_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.ctr,
      metrics.conversions,
      metrics.conversions_value,
      metrics.average_cpc,
      metrics.average_cpm
      ${daily ? ', segments.date' : ''}
    FROM campaign
    WHERE segments.date BETWEEN '${range.since}' AND '${range.until}'
  `;
}

function parseCampaignRow(row: any): GoogleCampaignRow {
  const c = row.campaign || {};
  const budget = row.campaignBudget || {};
  const m = row.metrics || {};
  const spend = microsToDollars(m.costMicros);
  const impressions = Number(m.impressions || 0);
  const clicks = Number(m.clicks || 0);
  const conversions = Number(m.conversions || 0);
  const revenue = Number(m.conversionsValue || 0);

  return {
    id: String(c.id ?? ''),
    name: c.name || 'Unknown campaign',
    status: c.status || 'UNKNOWN',
    startDate: c.startDate || null,
    endDate: c.endDate || null,
    dailyBudget: budget.amountMicros ? microsToDollars(budget.amountMicros) : null,
    date: row.segments?.date,
    spend,
    impressions,
    clicks,
    ctr: Number(m.ctr || 0) * 100, // Google returns ctr as a 0-1 fraction, unlike Facebook's already-percentage field
    conversions,
    revenue,
    avgCpc: microsToDollars(m.averageCpc),
    avgCpm: microsToDollars(m.averageCpm),
  };
}

export async function fetchCampaignRows(env: GoogleEnv, range: DateRange, daily = false): Promise<GoogleCampaignRow[]> {
  const rows = await gaqlSearch(env, campaignQuery(range, daily));
  return rows.map(parseCampaignRow);
}

// ---------------------------------------------------------------------------
// Reach / frequency - best-effort. Google's unique_users/frequency metrics
// are meant for reach reporting (Display/Video/Discovery) and may return 0
// or be unavailable for pure Search accounts. Fetched as a separate query
// so a failure here never breaks the main spend/clicks/conversions data.
// ---------------------------------------------------------------------------

export interface ReachRow {
  campaignId: string;
  reach: number;
}

export async function fetchReachByCampaign(env: GoogleEnv, range: DateRange): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  try {
    const rows = await gaqlSearch(
      env,
      `
        SELECT campaign.id, metrics.unique_users
        FROM campaign
        WHERE segments.date BETWEEN '${range.since}' AND '${range.until}'
      `
    );
    for (const row of rows) {
      const id = String(row.campaign?.id ?? '');
      const reach = Number(row.metrics?.uniqueUsers || 0);
      if (id) map.set(id, (map.get(id) || 0) + reach);
    }
  } catch {
    // Not available for this account/campaign mix - reach/frequency will show as 0/neutral.
  }
  return map;
}

/** Same as fetchReachByCampaign but keyed by `${campaignId}|${date}` - for the weekly day-by-day breakdown, where using the whole period's total reach for every individual day would overstate each day's reach. */
export async function fetchDailyReachByCampaign(env: GoogleEnv, range: DateRange): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  try {
    const rows = await gaqlSearch(
      env,
      `
        SELECT campaign.id, metrics.unique_users, segments.date
        FROM campaign
        WHERE segments.date BETWEEN '${range.since}' AND '${range.until}'
      `
    );
    for (const row of rows) {
      const id = String(row.campaign?.id ?? '');
      const date = row.segments?.date;
      const reach = Number(row.metrics?.uniqueUsers || 0);
      if (id && date) map.set(`${id}|${date}`, reach);
    }
  } catch {
    // Not available for this account/campaign mix.
  }
  return map;
}

// ---------------------------------------------------------------------------
// Impression share lost - best-effort, Search campaigns only (Google
// returns 0/omits these for other channel types rather than erroring, but
// wrapped in try/catch regardless in case an account rejects the fields
// entirely).
// ---------------------------------------------------------------------------

export async function fetchImpressionShareLostByCampaign(env: GoogleEnv, range: DateRange): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  try {
    const rows = await gaqlSearch(
      env,
      `
        SELECT campaign.id, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share
        FROM campaign
        WHERE segments.date BETWEEN '${range.since}' AND '${range.until}'
      `
    );
    for (const row of rows) {
      const id = String(row.campaign?.id ?? '');
      const budgetLost = Number(row.metrics?.searchBudgetLostImpressionShare || 0);
      const rankLost = Number(row.metrics?.searchRankLostImpressionShare || 0);
      if (id) map.set(id, Math.max(budgetLost, rankLost) * 100); // fractions -> percentage
    }
  } catch {
    // Not available for this account/campaign mix (e.g. no Search campaigns).
  }
  return map;
}

// ---------------------------------------------------------------------------
// Quality Score - best-effort, keyword-level only (Search campaigns).
// Averaged per campaign client-side; accounts with no keyword-based
// campaigns (Display/Video-only) will simply get no scores back.
// ---------------------------------------------------------------------------

export async function fetchQualityScoreByCampaign(env: GoogleEnv, range: DateRange): Promise<Map<string, number>> {
  const sums = new Map<string, { total: number; count: number }>();
  try {
    const rows = await gaqlSearch(
      env,
      `
        SELECT campaign.id, ad_group_criterion.quality_info.quality_score
        FROM ad_group_criterion
        WHERE ad_group_criterion.type = 'KEYWORD'
          AND segments.date BETWEEN '${range.since}' AND '${range.until}'
      `
    );
    for (const row of rows) {
      const id = String(row.campaign?.id ?? '');
      const score = row.adGroupCriterion?.qualityInfo?.qualityScore;
      if (!id || !score) continue; // 0/absent means "not enough data yet", not an actual score of 0
      const entry = sums.get(id) || { total: 0, count: 0 };
      entry.total += Number(score);
      entry.count += 1;
      sums.set(id, entry);
    }
  } catch {
    // Not available for this account (e.g. no Search/keyword campaigns) - quality score will show as "-".
  }

  const result = new Map<string, number>();
  for (const [id, { total, count }] of sums) {
    if (count > 0) result.set(id, total / count);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Aggregation (account-level rollup for the executive summary)
// ---------------------------------------------------------------------------

export interface GoogleAggregateMetrics {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  revenue: number;
  cpa: number;
  roas: number;
  reach: number;
  frequency: number;
  conversionRate: number;
  avgCpc: number;
  avgCpm: number;
  /** Equal to `clicks` - Google has no separate "engagement click" concept the way Facebook does, so all clicks are link clicks. Kept as its own field only so the frontend's shared Metrics shape (built for Facebook) doesn't need a Google-specific branch. */
  linkClicks: number;
}

export function aggregateCampaignRows(rows: GoogleCampaignRow[], reachByCampaign?: Map<string, number>): GoogleAggregateMetrics {
  const merged = rows.reduce(
    (acc, row) => {
      acc.spend += row.spend;
      acc.impressions += row.impressions;
      acc.clicks += row.clicks;
      acc.conversions += row.conversions;
      acc.revenue += row.revenue;
      return acc;
    },
    { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
  );

  const reach = reachByCampaign
    ? rows.reduce((sum, row) => sum + (reachByCampaign.get(row.id) || 0), 0)
    : 0;

  const ctr = merged.impressions > 0 ? (merged.clicks / merged.impressions) * 100 : 0;
  const cpa = merged.conversions > 0 ? merged.spend / merged.conversions : 0;
  const roas = merged.spend > 0 ? merged.revenue / merged.spend : 0;
  const frequency = reach > 0 ? merged.impressions / reach : 0;
  const conversionRate = merged.clicks > 0 ? (merged.conversions / merged.clicks) * 100 : 0;
  const avgCpc = merged.clicks > 0 ? merged.spend / merged.clicks : 0;
  const avgCpm = merged.impressions > 0 ? (merged.spend / merged.impressions) * 1000 : 0;

  return { ...merged, ctr, cpa, roas, reach, frequency, conversionRate, avgCpc, avgCpm, linkClicks: merged.clicks };
}

// ---------------------------------------------------------------------------
// Config helpers (env-driven, same shape as the Facebook build)
// ---------------------------------------------------------------------------

export function budgetCapFor(env: GoogleEnv, period: Period, campaignDailyBudgetSum: number): number | undefined {
  const weekly = isWeeklyPeriod(period);
  if (weekly) {
    if (env.GOOGLE_WEEKLY_BUDGET_CAP) return parseFloat(env.GOOGLE_WEEKLY_BUDGET_CAP);
    return campaignDailyBudgetSum > 0 ? campaignDailyBudgetSum * 7 : undefined;
  }
  if (env.GOOGLE_DAILY_BUDGET_CAP) return parseFloat(env.GOOGLE_DAILY_BUDGET_CAP);
  return campaignDailyBudgetSum > 0 ? campaignDailyBudgetSum : undefined;
}

export function conversionTargetFor(env: GoogleEnv, period: Period): number | undefined {
  const weekly = isWeeklyPeriod(period);
  const raw = weekly ? env.GOOGLE_CONVERSION_TARGET_WEEKLY : env.GOOGLE_CONVERSION_TARGET_DAILY;
  return raw ? parseFloat(raw) : undefined;
}

interface GoogleRecommendationThresholds {
  lowCtr: number;
  highCpc: number;
  lowConversionRate: number;
}

function thresholdsFor(env: GoogleEnv): GoogleRecommendationThresholds {
  return {
    lowCtr: env.GOOGLE_LOW_CTR_THRESHOLD ? parseFloat(env.GOOGLE_LOW_CTR_THRESHOLD) : 1,
    highCpc: env.GOOGLE_HIGH_CPC_THRESHOLD ? parseFloat(env.GOOGLE_HIGH_CPC_THRESHOLD) : 2,
    lowConversionRate: env.GOOGLE_LOW_CONVERSION_RATE_THRESHOLD ? parseFloat(env.GOOGLE_LOW_CONVERSION_RATE_THRESHOLD) : 1,
  };
}

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------

export interface GoogleRecommendation {
  type:
    | 'low_ctr'
    | 'high_cpc'
    | 'low_conversion_rate'
    | 'budget_depleted'
    | 'no_conversion_tracking'
    | 'high_impression_share_lost';
  icon: string;
  campaignId: string;
  campaignName: string;
  message: string;
}

export interface GoogleCampaignForRecommendation {
  row: GoogleCampaignRow;
  conversionRate: number;
  budgetUsedPct: number | null;
  impressionShareLostPct: number | null;
}

export function generateGoogleRecommendations(
  campaigns: GoogleCampaignForRecommendation[],
  period: Period,
  env: GoogleEnv = {}
): GoogleRecommendation[] {
  const weekly = isWeeklyPeriod(period);
  const scopeWord = weekly ? 'this week' : 'today';
  const thresholds = thresholdsFor(env);
  const recs: GoogleRecommendation[] = [];

  for (const c of campaigns) {
    const { row, conversionRate, budgetUsedPct: used, impressionShareLostPct } = c;
    if (row.status !== 'ENABLED' && row.status !== 'PAUSED') continue;
    if (row.spend <= 0 && row.impressions <= 0) continue;

    if (row.impressions > 0 && row.ctr > 0 && row.ctr < thresholds.lowCtr) {
      recs.push({
        type: 'low_ctr',
        icon: '🎨',
        campaignId: row.id,
        campaignName: row.name,
        message: `${row.name} has ${row.ctr.toFixed(2)}% CTR ${scopeWord} - consider testing new ad copy or keywords`,
      });
    }

    if (row.clicks > 0 && row.avgCpc > thresholds.highCpc) {
      recs.push({
        type: 'high_cpc',
        icon: '💸',
        campaignId: row.id,
        campaignName: row.name,
        message: `${row.name} has an average CPC of $${row.avgCpc.toFixed(2)} ${scopeWord} - optimize Quality Score or lower bids`,
      });
    }

    if (row.clicks > 0 && conversionRate < thresholds.lowConversionRate) {
      recs.push({
        type: 'low_conversion_rate',
        icon: '🔎',
        campaignId: row.id,
        campaignName: row.name,
        message: `${row.name} has a ${conversionRate.toFixed(2)}% conversion rate ${scopeWord} - review landing page experience`,
      });
    }

    if (row.status === 'ENABLED' && used !== null && used >= 95) {
      recs.push({
        type: 'budget_depleted',
        icon: '💳',
        campaignId: row.id,
        campaignName: row.name,
        message: `${row.name} is at ${used.toFixed(0)}% of its budget ${scopeWord} - campaign hitting daily budget limit`,
      });
    }

    if (row.spend > 0 && row.conversions === 0) {
      recs.push({
        type: 'no_conversion_tracking',
        icon: '📊',
        campaignId: row.id,
        campaignName: row.name,
        message: `${row.name} has spend but 0 recorded conversions ${scopeWord} - check conversion tracking setup`,
      });
    }

    if (row.status === 'ENABLED' && impressionShareLostPct !== null && impressionShareLostPct >= 20) {
      recs.push({
        type: 'high_impression_share_lost',
        icon: '📈',
        campaignId: row.id,
        campaignName: row.name,
        message: `${row.name} is losing ${impressionShareLostPct.toFixed(0)}% impression share ${scopeWord} - increase budget or bid`,
      });
    }
  }

  return recs;
}
