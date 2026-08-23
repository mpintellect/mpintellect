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
  fetchImpressionShareLostByCampaign,
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

    const [mainRows, reachByCampaign, impressionShareLostByCampaign] = await Promise.all([
      fetchCampaignRows(env, range, false),
      fetchReachByCampaign(env, range),
      fetchImpressionShareLostByCampaign(env, range),
    ]);

    const campaigns: GoogleCampaignForRecommendation[] = mainRows.map((row) => {
      const derived = aggregateCampaignRows([row], reachByCampaign);
      return {
        row,
        conversionRate: derived.conversionRate,
        budgetUsedPct: budgetUsedPct(row.spend, row.dailyBudget ?? undefined, weekly),
        impressionShareLostPct: impressionShareLostByCampaign.get(row.id) ?? null,
      };
    });

    const recommendations = generateGoogleRecommendations(campaigns, period, env);

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
