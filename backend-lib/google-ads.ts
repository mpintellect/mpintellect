// backend-lib/google-ads.ts
// Google Ads API (REST) helpers for the Google Ads monitoring dashboard
// (functions/api/google/*). Read-only: no campaign creation or bid changes
// here. Mirrors backend-lib/facebook.ts's structure and conventions;
// shared period/date-range math and color scoring live in ad-shared.ts.
//
// NOTE: unlike the Facebook build, this was NOT verified against a live
// account - GOOGLE_DEVELOPER_TOKEN is currently rejected by Google as
// DEVELOPER_TOKEN_INVALID (the refresh token itself works fine). Field
// names and GAQL shapes follow Google's documented API behavior, but the
// reach/frequency and quality-score queries in particular are best-effort
// (see comments below) and should be checked against a real account once
// the developer token is fixed.

import {
  type Period,
  type DateRange,
  isWeeklyPeriod,
  computeAverageCpa,
  classifyReachRatio,
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
  GOOGLE_NEGATIVE_KEYWORD_MIN_SPEND_DAILY?: string; // dollars, default 5
  GOOGLE_NEGATIVE_KEYWORD_MIN_SPEND_WEEKLY?: string; // dollars, default 15
  GOOGLE_TARGET_CPA_DAILY?: string; // dollars - if unset, falls back to the account's own blended CPA for the period
  GOOGLE_TARGET_CPA_WEEKLY?: string; // dollars
  GOOGLE_LOW_IMPRESSIONS_THRESHOLD_DAILY?: string; // default 50
  GOOGLE_LOW_IMPRESSIONS_THRESHOLD_WEEKLY?: string; // default 350
  GOOGLE_LOW_REACH_THRESHOLD_DAILY?: string; // default 100 - best-effort, see fetchReachByCampaign
  GOOGLE_LOW_REACH_THRESHOLD_WEEKLY?: string; // default 500
  GOOGLE_MIN_AUDIENCE_SIZE?: string; // default 1000 - see computeGoogleAudienceHealth
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
  // Google sunsets old API versions on a rolling basis (roughly one per
  // quarter) - v17 (this code's original default) 404s at Google's
  // front-end before auth is even checked, which silently masked real
  // auth/token errors during testing. Bump this default periodically;
  // check https://developers.google.com/google-ads/api/docs/release-notes
  // for the current supported range.
  return env.GOOGLE_ADS_API_VERSION || 'v25';
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
    // No pageSize - the API rejects it as of v25 (PAGE_SIZE_NOT_SUPPORTED),
    // fixed page size of 10000 rows regardless.
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, pageToken }),
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

/** ISO 4217 currency code the account bills in (e.g. "MAD") - confirmed live that this is not reliably USD, so the dashboard must not assume it. */
export async function fetchAccountCurrency(env: GoogleEnv): Promise<string> {
  const rows = await gaqlSearch(env, 'SELECT customer.currency_code FROM customer');
  return rows[0]?.customer?.currencyCode || 'USD';
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
      campaign.start_date_time,
      campaign.end_date_time,
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
      AND campaign.status != 'REMOVED'
  `;
}

/** campaign.start_date_time/end_date_time return "YYYY-MM-DD HH:MM:SS" (renamed from the old date-only start_date/end_date fields, which v25 rejects as UNRECOGNIZED_FIELD) - trim to the date portion to match the date-only format the frontend expects. */
function dateOnly(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.split(' ')[0];
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
    startDate: dateOnly(c.startDateTime),
    endDate: dateOnly(c.endDateTime),
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
          AND campaign.status != 'REMOVED'
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
          AND campaign.status != 'REMOVED'
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

export interface ImpressionShareLost {
  budgetLostPct: number; // impression share lost specifically to budget constraints - raise budget to recover
  rankLostPct: number; // impression share lost specifically to ad rank - raise bids or improve Quality Score to recover
}

export async function fetchImpressionShareLostByCampaign(env: GoogleEnv, range: DateRange): Promise<Map<string, ImpressionShareLost>> {
  const map = new Map<string, ImpressionShareLost>();
  try {
    const rows = await gaqlSearch(
      env,
      `
        SELECT campaign.id, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share
        FROM campaign
        WHERE segments.date BETWEEN '${range.since}' AND '${range.until}'
          AND campaign.status != 'REMOVED'
      `
    );
    for (const row of rows) {
      const id = String(row.campaign?.id ?? '');
      const budgetLost = Number(row.metrics?.searchBudgetLostImpressionShare || 0);
      const rankLost = Number(row.metrics?.searchRankLostImpressionShare || 0);
      if (id) map.set(id, { budgetLostPct: budgetLost * 100, rankLostPct: rankLost * 100 }); // fractions -> percentage
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

export async function fetchQualityScoreByCampaign(env: GoogleEnv, _range: DateRange): Promise<Map<string, number>> {
  const sums = new Map<string, { total: number; count: number }>();
  try {
    // ad_group_criterion is a resource snapshot, not a time-series metric -
    // segments.date can't be selected or filtered on for this resource
    // (confirmed live: PROHIBITED_SEGMENT_IN_SELECT_OR_WHERE_CLAUSE). Quality
    // Score has no date range in the API at all; it's always "current".
    const rows = await gaqlSearch(
      env,
      `
        SELECT campaign.id, ad_group_criterion.quality_info.quality_score
        FROM ad_group_criterion
        WHERE ad_group_criterion.type = 'KEYWORD'
          AND campaign.status != 'REMOVED'
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
// Search terms - best-effort, Search campaigns only. The #1 source of
// "why is CPA high": actual queries triggering ads, separate from the
// keywords you bid on. High-spend/zero-conversion terms are negative
// keyword candidates.
// ---------------------------------------------------------------------------

export interface SearchTermRow {
  searchTerm: string;
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number; // percentage
}

export async function fetchSearchTerms(env: GoogleEnv, range: DateRange): Promise<SearchTermRow[]> {
  try {
    const rows = await gaqlSearch(
      env,
      `
        SELECT search_term_view.search_term, campaign.id, campaign.name,
          metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
        FROM search_term_view
        WHERE segments.date BETWEEN '${range.since}' AND '${range.until}'
          AND campaign.status != 'REMOVED'
        ORDER BY metrics.cost_micros DESC
        LIMIT 500
      `
    );
    return rows.map((row) => {
      const m = row.metrics || {};
      const impressions = Number(m.impressions || 0);
      const clicks = Number(m.clicks || 0);
      return {
        searchTerm: row.searchTermView?.searchTerm || '(unknown)',
        campaignId: String(row.campaign?.id ?? ''),
        campaignName: row.campaign?.name || 'Unknown campaign',
        impressions,
        clicks,
        spend: microsToDollars(m.costMicros),
        conversions: Number(m.conversions || 0),
        ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
      };
    });
  } catch {
    // Not available for this account (e.g. no Search campaigns) - Display/Video-only accounts get no search terms.
    return [];
  }
}

function negativeKeywordMinSpend(env: GoogleEnv, period: Period): number {
  const weekly = isWeeklyPeriod(period);
  if (weekly) return env.GOOGLE_NEGATIVE_KEYWORD_MIN_SPEND_WEEKLY ? parseFloat(env.GOOGLE_NEGATIVE_KEYWORD_MIN_SPEND_WEEKLY) : 15;
  return env.GOOGLE_NEGATIVE_KEYWORD_MIN_SPEND_DAILY ? parseFloat(env.GOOGLE_NEGATIVE_KEYWORD_MIN_SPEND_DAILY) : 5;
}

/** Search terms that spent real money with zero conversions - the clearest negative-keyword candidates. */
export function findNegativeKeywordCandidates(rows: SearchTermRow[], period: Period, env: GoogleEnv = {}): SearchTermRow[] {
  const minSpend = negativeKeywordMinSpend(env, period);
  return rows
    .filter((r) => r.spend >= minSpend && r.conversions === 0)
    .sort((a, b) => b.spend - a.spend);
}

// ---------------------------------------------------------------------------
// Audiences - Google has no "Custom Audiences" the way Facebook does; the
// closest verifiable equivalent is the user_list resource (covers
// Remarketing, Customer Match ["CRM_BASED"], Similar/lookalike ["SIMILAR"],
// rule-based, and combined/"LOGICAL" lists in one unified type). Confirmed
// live against this account - remarketing_action (an older resource some
// docs still reference) does NOT return usable audience-list data; user_list
// does. Whether a list is used by a campaign is read from campaign_criterion
// / ad_group_criterion where type = 'USER_LIST' (criterion.negative = true
// means it's excluded, not included). Per-list 30-day delivery comes from
// campaign_audience_view / ad_group_audience_view - both best-effort
// (try/catch), matching fetchReachByCampaign's convention above, since
// audience-segmented reporting isn't available for every account/campaign
// mix (e.g. Performance Max's automatic audience signals don't surface here
// the same way).
// ---------------------------------------------------------------------------

export interface GoogleUserList {
  id: string;
  name: string;
  type: string; // REMARKETING | CRM_BASED | SIMILAR | RULE_BASED | LOGICAL | ...
  description: string;
  membershipStatus: string; // OPEN | CLOSED
  membershipLifeSpanDays: number; // how long an individual member stays on the list, in days - NOT a list-level expiration date, see typeLabel's doc comment
  sizeForDisplay: number;
  sizeForSearch: number;
}

/** Human-readable audience type - user_list.type is a real API enum, this is just a friendlier label for it (no separate "App"/"YouTube" type exists at this resource level, so those aren't fabricated here). */
export function googleAudienceTypeLabel(type: string): string {
  switch (type) {
    case 'REMARKETING':
      return 'Website';
    case 'CRM_BASED':
      return 'Customer Match';
    case 'SIMILAR':
      return 'Similar Audience';
    case 'RULE_BASED':
      return 'Website (Rule-Based)';
    case 'LOGICAL':
      return 'Combined List';
    default:
      return type;
  }
}

export async function fetchUserLists(env: GoogleEnv): Promise<GoogleUserList[]> {
  const rows = await gaqlSearch(
    env,
    `
      SELECT user_list.id, user_list.name, user_list.type, user_list.description,
        user_list.membership_status, user_list.membership_life_span,
        user_list.size_for_display, user_list.size_for_search
      FROM user_list
    `
  );
  return rows.map((row) => {
    const u = row.userList || {};
    return {
      id: String(u.id ?? ''),
      name: u.name || 'Unnamed list',
      type: u.type || 'UNKNOWN',
      description: u.description || '',
      membershipStatus: u.membershipStatus || 'UNKNOWN',
      membershipLifeSpanDays: Number(u.membershipLifeSpan || 0),
      sizeForDisplay: Number(u.sizeForDisplay || 0),
      sizeForSearch: Number(u.sizeForSearch || 0),
    };
  });
}

export interface UserListCriterion {
  userListId: string;
  campaignId: string;
  campaignName: string;
  campaignStatus: string; // ENABLED | PAUSED
  negative: boolean; // true = excluded from targeting, false = included
}

/** resourceName looks like "customers/123/userLists/9089462071" - the id is the trailing path segment. */
function userListIdFromResourceName(resourceName: string | undefined): string | null {
  if (!resourceName) return null;
  const parts = resourceName.split('/');
  return parts[parts.length - 1] || null;
}

export async function fetchUserListCriteria(env: GoogleEnv): Promise<UserListCriterion[]> {
  const [campaignRows, adGroupRows] = await Promise.all([
    gaqlSearch(
      env,
      `
        SELECT campaign.id, campaign.name, campaign.status, campaign_criterion.negative, campaign_criterion.user_list.user_list
        FROM campaign_criterion
        WHERE campaign_criterion.type = 'USER_LIST' AND campaign.status != 'REMOVED'
      `
    ),
    gaqlSearch(
      env,
      `
        SELECT campaign.id, campaign.name, campaign.status, ad_group_criterion.negative, ad_group_criterion.user_list.user_list
        FROM ad_group_criterion
        WHERE ad_group_criterion.type = 'USER_LIST' AND campaign.status != 'REMOVED'
      `
    ),
  ]);

  const parse = (row: any, criterion: any): UserListCriterion | null => {
    const userListId = userListIdFromResourceName(criterion?.userList?.userList);
    if (!userListId) return null;
    return {
      userListId,
      campaignId: String(row.campaign?.id ?? ''),
      campaignName: row.campaign?.name || 'Unknown campaign',
      campaignStatus: row.campaign?.status || 'UNKNOWN',
      negative: !!criterion?.negative,
    };
  };

  const results: UserListCriterion[] = [];
  for (const row of campaignRows) {
    const parsed = parse(row, row.campaignCriterion);
    if (parsed) results.push(parsed);
  }
  for (const row of adGroupRows) {
    const parsed = parse(row, row.adGroupCriterion);
    if (parsed) results.push(parsed);
  }
  return results;
}

/** Set of user_list ids that had impressions in the last 30 days, from either campaign- or ad-group-level audience targeting. */
export async function fetchUserListDeliveryLast30Days(env: GoogleEnv): Promise<Set<string>> {
  const delivered = new Set<string>();

  try {
    const rows = await gaqlSearch(
      env,
      `
        SELECT campaign_criterion.user_list.user_list, metrics.impressions
        FROM campaign_audience_view
        WHERE segments.date DURING LAST_30_DAYS AND campaign_criterion.type = 'USER_LIST'
      `
    );
    for (const row of rows) {
      const id = userListIdFromResourceName(row.campaignCriterion?.userList?.userList);
      const impressions = Number(row.metrics?.impressions || 0);
      if (id && impressions > 0) delivered.add(id);
    }
  } catch {
    // Not available for this account/campaign mix.
  }

  try {
    const rows = await gaqlSearch(
      env,
      `
        SELECT ad_group_criterion.user_list.user_list, metrics.impressions
        FROM ad_group_audience_view
        WHERE segments.date DURING LAST_30_DAYS AND ad_group_criterion.type = 'USER_LIST'
      `
    );
    for (const row of rows) {
      const id = userListIdFromResourceName(row.adGroupCriterion?.userList?.userList);
      const impressions = Number(row.metrics?.impressions || 0);
      if (id && impressions > 0) delivered.add(id);
    }
  } catch {
    // Not available for this account/campaign mix.
  }

  return delivered;
}

export interface GoogleAudienceRow {
  id: string;
  name: string;
  type: string; // human-readable, via googleAudienceTypeLabel
  size: number; // max(sizeForDisplay, sizeForSearch) - the two networks have different eligibility minimums (Search ~1000, Display ~100), this is "reach on whichever network is bigger", not a blended total
  membershipLifeSpanDays: number;
  usedInCampaigns: string[]; // names of every non-removed campaign that includes (not excludes) this list, any status
  usedInActiveCampaign: boolean;
  usedInLast30Days: boolean; // best-effort, see fetchUserListDeliveryLast30Days
  status: 'Active' | 'Closed'; // from membership_status (OPEN/CLOSED) - Google has no per-list "Paused" concept, and no list-level "expiring" date (membership_life_span is per-member, not a countdown to closure), so CLOSED is the closest honest analog to "winding down"
  health: 'good' | 'warning' | 'issue';
}

export interface GoogleAudienceSummary {
  totalLists: number;
  activeLists: number; // used in an ENABLED campaign
  listsWithSize: number; // size >= the configured minimum (default 1000)
  listsWithIssues: number; // health 'issue' or 'warning'
}

function minAudienceSize(env: GoogleEnv): number {
  return env.GOOGLE_MIN_AUDIENCE_SIZE ? parseFloat(env.GOOGLE_MIN_AUDIENCE_SIZE) : 1000;
}

export function computeGoogleAudienceHealth(
  lists: GoogleUserList[],
  criteria: UserListCriterion[],
  deliveredLast30Days: Set<string>,
  env: GoogleEnv = {}
): { summary: GoogleAudienceSummary; audiences: GoogleAudienceRow[] } {
  const minSize = minAudienceSize(env);

  const criteriaByList = new Map<string, UserListCriterion[]>();
  for (const c of criteria) {
    const list = criteriaByList.get(c.userListId) || [];
    list.push(c);
    criteriaByList.set(c.userListId, list);
  }

  let activeLists = 0;
  let listsWithSize = 0;
  let listsWithIssues = 0;

  const rows: GoogleAudienceRow[] = lists.map((l) => {
    const size = Math.max(l.sizeForDisplay, l.sizeForSearch);
    const usage = criteriaByList.get(l.id) || [];
    const inclusions = usage.filter((c) => !c.negative);
    const usedInCampaigns = Array.from(new Set(inclusions.map((c) => c.campaignName)));
    const usedInActiveCampaign = inclusions.some((c) => c.campaignStatus === 'ENABLED');
    const usedInLast30Days = deliveredLast30Days.has(l.id);
    const status: GoogleAudienceRow['status'] = l.membershipStatus === 'CLOSED' ? 'Closed' : 'Active';

    let health: GoogleAudienceRow['health'];
    if (size < minSize) {
      health = 'issue';
    } else if (!usedInLast30Days || status === 'Closed') {
      health = 'warning';
    } else {
      health = 'good';
    }

    if (usedInActiveCampaign) activeLists++;
    if (size >= minSize) listsWithSize++;
    if (health === 'issue' || health === 'warning') listsWithIssues++;

    return {
      id: l.id,
      name: l.name,
      type: googleAudienceTypeLabel(l.type),
      size,
      membershipLifeSpanDays: l.membershipLifeSpanDays,
      usedInCampaigns,
      usedInActiveCampaign,
      usedInLast30Days,
      status,
      health,
    };
  });

  return {
    summary: { totalLists: lists.length, activeLists, listsWithSize, listsWithIssues },
    audiences: rows,
  };
}

// ---------------------------------------------------------------------------
// Exclusion gaps (Google) - simpler than the Facebook version: no spend/
// savings estimate was requested, just "which ENABLED campaign is missing
// which exclusion". A list is a "conversion audience" candidate (the thing
// that should be excluded from prospecting) if its name or description
// mentions purchasing/converting - text-matched against real fields, not a
// fixed category enum (Google doesn't have Facebook's CUSTOM/WEBSITE/
// LOOKALIKE subtype split to key off of).
// ---------------------------------------------------------------------------

export interface GoogleCampaignSummary {
  id: string;
  name: string;
  status: string;
}

export async function fetchCampaignSummaries(env: GoogleEnv): Promise<GoogleCampaignSummary[]> {
  const rows = await gaqlSearch(env, `SELECT campaign.id, campaign.name, campaign.status FROM campaign WHERE campaign.status != 'REMOVED'`);
  return rows.map((row) => ({
    id: String(row.campaign?.id ?? ''),
    name: row.campaign?.name || 'Unknown campaign',
    status: row.campaign?.status || 'UNKNOWN',
  }));
}

export interface GoogleExclusionGap {
  campaignId: string;
  campaignName: string;
  status: string;
  missingExclusion: string;
  recommendation: string;
}

export interface GoogleExclusionGapsSummary {
  campaignsChecked: number;
  campaignsWithGaps: number;
}

/** True if this list's own name/description signals it's built from people who already converted (purchased, signed up, etc) - the audience prospecting campaigns should exclude. */
function isConversionAudience(list: GoogleUserList): boolean {
  return /purchas|convert/i.test(`${list.name} ${list.description}`);
}

export function findGoogleExclusionGaps(
  campaigns: GoogleCampaignSummary[],
  lists: GoogleUserList[],
  criteria: UserListCriterion[]
): { summary: GoogleExclusionGapsSummary; gaps: GoogleExclusionGap[] } {
  const conversionAudiences = lists.filter(isConversionAudience);

  const excludedByCampaign = new Map<string, Set<string>>();
  for (const c of criteria) {
    if (!c.negative) continue;
    const set = excludedByCampaign.get(c.campaignId) || new Set<string>();
    set.add(c.userListId);
    excludedByCampaign.set(c.campaignId, set);
  }

  const evaluated = campaigns.filter((c) => c.status === 'ENABLED');
  const gaps: GoogleExclusionGap[] = [];
  const campaignsWithGaps = new Set<string>();

  for (const campaign of evaluated) {
    if (conversionAudiences.length === 0) continue; // nothing to recommend excluding - don't fabricate a gap
    const excluded = excludedByCampaign.get(campaign.id) || new Set<string>();
    for (const audience of conversionAudiences) {
      if (excluded.has(audience.id)) continue;
      campaignsWithGaps.add(campaign.id);
      gaps.push({
        campaignId: campaign.id,
        campaignName: campaign.name,
        status: campaign.status,
        missingExclusion: audience.name,
        recommendation: `Add "${audience.name}" to exclusions so people who already converted aren't targeted again`,
      });
    }
  }

  return {
    summary: { campaignsChecked: evaluated.length, campaignsWithGaps: campaignsWithGaps.size },
    gaps,
  };
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
  /** Equal to `avgCpc` - Google has no separate link-click cost concept, all clicks are link clicks. Kept as its own field for the same reason as linkClicks above. */
  costPerLinkClick: number;
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

  return { ...merged, ctr, cpa, roas, reach, frequency, conversionRate, avgCpc, avgCpm, linkClicks: merged.clicks, costPerLinkClick: avgCpc };
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
  lowImpressions: number;
  lowReach: number;
}

function thresholdsFor(env: GoogleEnv, period: Period): GoogleRecommendationThresholds {
  const weekly = isWeeklyPeriod(period);
  return {
    lowCtr: env.GOOGLE_LOW_CTR_THRESHOLD ? parseFloat(env.GOOGLE_LOW_CTR_THRESHOLD) : 1,
    highCpc: env.GOOGLE_HIGH_CPC_THRESHOLD ? parseFloat(env.GOOGLE_HIGH_CPC_THRESHOLD) : 2,
    lowConversionRate: env.GOOGLE_LOW_CONVERSION_RATE_THRESHOLD ? parseFloat(env.GOOGLE_LOW_CONVERSION_RATE_THRESHOLD) : 1,
    lowImpressions: weekly
      ? env.GOOGLE_LOW_IMPRESSIONS_THRESHOLD_WEEKLY ? parseFloat(env.GOOGLE_LOW_IMPRESSIONS_THRESHOLD_WEEKLY) : 350
      : env.GOOGLE_LOW_IMPRESSIONS_THRESHOLD_DAILY ? parseFloat(env.GOOGLE_LOW_IMPRESSIONS_THRESHOLD_DAILY) : 50,
    lowReach: weekly
      ? env.GOOGLE_LOW_REACH_THRESHOLD_WEEKLY ? parseFloat(env.GOOGLE_LOW_REACH_THRESHOLD_WEEKLY) : 500
      : env.GOOGLE_LOW_REACH_THRESHOLD_DAILY ? parseFloat(env.GOOGLE_LOW_REACH_THRESHOLD_DAILY) : 100,
  };
}

/** Explicit CPA target if configured, else undefined (caller falls back to the account's own blended CPA). */
function cpaTargetFor(env: GoogleEnv, period: Period): number | undefined {
  const weekly = isWeeklyPeriod(period);
  const raw = weekly ? env.GOOGLE_TARGET_CPA_WEEKLY : env.GOOGLE_TARGET_CPA_DAILY;
  return raw ? parseFloat(raw) : undefined;
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
    | 'high_impression_share_lost_budget'
    | 'high_impression_share_lost_rank'
    | 'wasted_search_terms'
    | 'high_cpa'
    | 'efficient_cpa'
    | 'low_impressions'
    | 'low_reach'
    | 'low_budget_utilization'
    | 'low_reach_ratio'
    | 'reach_declining';
  icon: string;
  campaignId: string;
  campaignName: string;
  message: string;
}

export interface GoogleCampaignForRecommendation {
  row: GoogleCampaignRow;
  conversionRate: number;
  budgetUsedPct: number | null;
  impressionShareLost: ImpressionShareLost | null;
  reach: number; // best-effort, see fetchReachByCampaign - 0 if unavailable for this account/campaign mix
  /** Reach per day, oldest first - weekly periods only, used for the reach_declining trend check. Omit/empty for daily periods. */
  dailyReach?: number[];
}

/** True if the second half of the period averaged reach.dropPct% or more below the first half - a simple two-bucket trend, not a full regression (7 data points don't warrant one). */
function isReachDeclining(dailyReach: number[] | undefined, dropPct: number): boolean {
  if (!dailyReach || dailyReach.length < 4) return false;
  const mid = Math.ceil(dailyReach.length / 2);
  const firstHalf = dailyReach.slice(0, mid);
  const secondHalf = dailyReach.slice(mid);
  const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;
  const firstAvg = avg(firstHalf);
  const secondAvg = avg(secondHalf);
  if (firstAvg <= 0) return false;
  return (firstAvg - secondAvg) / firstAvg >= dropPct / 100;
}

/** Minimal money formatting for recommendation message text - the frontend's formatCurrency (Intl-based) isn't reachable from backend-lib, and this only needs to avoid a hardcoded "$" for non-USD accounts. */
function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function generateGoogleRecommendations(
  campaigns: GoogleCampaignForRecommendation[],
  period: Period,
  env: GoogleEnv = {},
  currency: string = 'USD',
  searchTerms: SearchTermRow[] = []
): GoogleRecommendation[] {
  const weekly = isWeeklyPeriod(period);
  const scopeWord = weekly ? 'this week' : 'today';
  const thresholds = thresholdsFor(env, period);
  const recs: GoogleRecommendation[] = [];

  const negativeCandidatesByCampaign = new Map<string, SearchTermRow[]>();
  for (const term of findNegativeKeywordCandidates(searchTerms, period, env)) {
    const list = negativeCandidatesByCampaign.get(term.campaignId) || [];
    list.push(term);
    negativeCandidatesByCampaign.set(term.campaignId, list);
  }

  // Self-calibrating CPA baseline - see computeAverageCpa's doc comment.
  const cpaTarget = cpaTargetFor(env, period) || computeAverageCpa(campaigns.map((c) => c.row));

  for (const c of campaigns) {
    const { row, conversionRate, budgetUsedPct: used, impressionShareLost, reach } = c;
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
        message: `${row.name} has an average CPC of ${formatMoney(row.avgCpc, currency)} ${scopeWord} - optimize Quality Score or lower bids`,
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

    // CPA vs. the account's own blended CPA (or an explicit env target) -
    // the most direct "is this campaign worth the spend" signal.
    if (row.status === 'ENABLED' && row.conversions > 0 && cpaTarget > 0) {
      const cpa = row.spend / row.conversions;
      if (cpa > cpaTarget * 1.3) {
        const pctAbove = ((cpa - cpaTarget) / cpaTarget) * 100;
        recs.push({
          type: 'high_cpa',
          icon: '🧯',
          campaignId: row.id,
          campaignName: row.name,
          message: `${row.name} has a CPA of ${formatMoney(cpa, currency)} ${scopeWord} - ${pctAbove.toFixed(0)}% above the account average, review keywords or bids`,
        });
      } else if (cpa < cpaTarget * 0.7) {
        recs.push({
          type: 'efficient_cpa',
          icon: '🎯',
          campaignId: row.id,
          campaignName: row.name,
          message: `${row.name} has a CPA of ${formatMoney(cpa, currency)} ${scopeWord} - well below the account average, a good candidate to scale`,
        });
      }
    }

    // Active-only: a paused campaign having few/no impressions is expected, not a delivery problem.
    if (row.status === 'ENABLED' && row.spend > 0 && row.impressions < thresholds.lowImpressions) {
      recs.push({
        type: 'low_impressions',
        icon: '📡',
        campaignId: row.id,
        campaignName: row.name,
        message: `${row.name} only got ${Math.round(row.impressions).toLocaleString('en-US')} impressions ${scopeWord} despite active spend - check for a disapproval, low Quality Score, or a bid too low to compete`,
      });
    }

    let lowReachFlagged = false;
    if (row.status === 'ENABLED' && row.impressions > 0 && reach > 0 && reach < thresholds.lowReach) {
      lowReachFlagged = true;
      recs.push({
        type: 'low_reach',
        icon: '📉',
        campaignId: row.id,
        campaignName: row.name,
        message: `${row.name} only reached ${Math.round(reach).toLocaleString('en-US')} people ${scopeWord} - audience may be too narrow, broaden keywords or targeting`,
      });
    }

    // Same underlying issue as low_reach (too few unique people) viewed from the
    // impressions-vs-reach ratio - skip if already flagged above to avoid duplicate noise.
    if (!lowReachFlagged && row.status === 'ENABLED' && classifyReachRatio(reach, row.impressions) === 'red') {
      const reachPct = (reach / row.impressions) * 100;
      recs.push({
        type: 'low_reach_ratio',
        icon: '🔁',
        campaignId: row.id,
        campaignName: row.name,
        message: `${row.name}: only ${reachPct.toFixed(0)}% of impressions ${scopeWord} reached new people - the same audience is seeing this ad repeatedly`,
      });
    }

    if (weekly && isReachDeclining(c.dailyReach, 20)) {
      recs.push({
        type: 'reach_declining',
        icon: '📉',
        campaignId: row.id,
        campaignName: row.name,
        message: `${row.name}: reach has been dropping through the week - audience may be exhausted, expand targeting`,
      });
    }

    if (row.status === 'ENABLED' && used !== null) {
      if (used >= 95) {
        recs.push({
          type: 'budget_depleted',
          icon: '💳',
          campaignId: row.id,
          campaignName: row.name,
          message: `${row.name} is at ${used.toFixed(0)}% of its budget ${scopeWord} - campaign hitting daily budget limit`,
        });
      } else if (!weekly && used < 50) {
        recs.push({
          type: 'low_budget_utilization',
          icon: '🐌',
          campaignId: row.id,
          campaignName: row.name,
          message: `${row.name} has only spent ${used.toFixed(0)}% of today's budget - if this is late in the day, the bid may be too low to compete; consider raising it`,
        });
      }
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

    if (row.status === 'ENABLED' && impressionShareLost !== null) {
      if (impressionShareLost.budgetLostPct >= 20) {
        recs.push({
          type: 'high_impression_share_lost_budget',
          icon: '📈',
          campaignId: row.id,
          campaignName: row.name,
          message: `${row.name} is losing ${impressionShareLost.budgetLostPct.toFixed(0)}% impression share ${scopeWord} to budget limits - increase budget to show up more often`,
        });
      }
      if (impressionShareLost.rankLostPct >= 20) {
        recs.push({
          type: 'high_impression_share_lost_rank',
          icon: '🏅',
          campaignId: row.id,
          campaignName: row.name,
          message: `${row.name} is losing ${impressionShareLost.rankLostPct.toFixed(0)}% impression share ${scopeWord} to ad rank - raise bids or improve Quality Score`,
        });
      }
    }

    const negatives = negativeCandidatesByCampaign.get(row.id);
    if (negatives && negatives.length > 0) {
      const totalWasted = negatives.reduce((sum, t) => sum + t.spend, 0);
      const topTerms = negatives.slice(0, 3).map((t) => `"${t.searchTerm}"`).join(', ');
      recs.push({
        type: 'wasted_search_terms',
        icon: '🧹',
        campaignId: row.id,
        campaignName: row.name,
        message: `${row.name}: ${negatives.length} search term${negatives.length > 1 ? 's' : ''} spent ${formatMoney(totalWasted, currency)} ${scopeWord} with 0 conversions (e.g. ${topTerms}) - add as negative keywords`,
      });
    }
  }

  return recs;
}
