// functions/api/google/recommendations.ts
// GET /api/google/recommendations?period=today|yesterday|last_7_days|this_week|last_week

import {
  getDateRange,
  getComparisonDateRange,
  isWeeklyPeriod,
  parsePeriod,
  verifyAdminAuth,
  budgetUsedPct,
} from '../../../backend-lib/ad-shared';
import {
  fetchCampaignRows,
  fetchReachByCampaign,
  fetchDailyReachByCampaign,
  fetchImpressionShareLostByCampaign,
  fetchSearchTerms,
  fetchAccountCurrency,
  aggregateCampaignRows,
  generateGoogleRecommendations,
  GoogleAdsApiError,
  type GoogleCampaignForRecommendation,
} from '../../../backend-lib/google-ads';

const CORS_HEADERS = { 'Content-Type': 'application/json' };

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequestGet(context: any) {
  const { request, env } = context;

  if (!verifyAdminAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const period = parsePeriod(url.searchParams.get('period'));

  try {
    const range = getDateRange(period);
    const weekly = isWeeklyPeriod(period);

    const [mainRows, reachByCampaign, impressionShareLostByCampaign, searchTerms, currency, dailyRows, dailyReachByCampaign] =
      await Promise.all([
        fetchCampaignRows(env, range, false),
        fetchReachByCampaign(env, range),
        fetchImpressionShareLostByCampaign(env, range),
        fetchSearchTerms(env, range),
        fetchAccountCurrency(env),
        weekly ? fetchCampaignRows(env, range, true) : Promise.resolve([]),
        weekly ? fetchDailyReachByCampaign(env, range) : Promise.resolve(new Map<string, number>()),
      ]);

    // Reach per day, oldest first, for the reach_declining trend check.
    const dailyReachSeriesByCampaign = new Map<string, number[]>();
    for (const row of [...dailyRows].sort((a, b) => (a.date! < b.date! ? -1 : 1))) {
      const list = dailyReachSeriesByCampaign.get(row.id) || [];
      list.push(dailyReachByCampaign.get(`${row.id}|${row.date}`) || 0);
      dailyReachSeriesByCampaign.set(row.id, list);
    }

    const campaigns: GoogleCampaignForRecommendation[] = mainRows.map((row) => {
      const derived = aggregateCampaignRows([row], reachByCampaign);
      return {
        row,
        conversionRate: derived.conversionRate,
        budgetUsedPct: budgetUsedPct(row.spend, row.dailyBudget ?? undefined, weekly),
        impressionShareLost: impressionShareLostByCampaign.get(row.id) ?? null,
        reach: derived.reach,
        dailyReach: dailyReachSeriesByCampaign.get(row.id),
      };
    });

    const recommendations = generateGoogleRecommendations(campaigns, period, env, currency, searchTerms);

    return new Response(
      JSON.stringify({ period, scope: weekly ? 'weekly' : 'daily', range, recommendations }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    const status = error instanceof GoogleAdsApiError ? error.status : 500;
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status,
      headers: CORS_HEADERS,
    });
  }
}
