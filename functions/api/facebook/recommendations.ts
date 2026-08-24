// functions/api/facebook/recommendations.ts
// GET /api/facebook/recommendations?period=today|yesterday|last_7_days|this_week|last_week
// Auto-generated suggestions derived from campaign performance. Read-only -
// nothing here pauses campaigns or changes budgets automatically.

import {
  getDateRange,
  getComparisonDateRange,
  isWeeklyPeriod,
  parsePeriod,
  verifyAdminAuth,
  fetchInsights,
  fetchCampaignStatuses,
  fetchAccountCurrency,
  aggregateRows,
  generateRecommendations,
  FacebookApiError,
  type CampaignForRecommendation,
} from '../../../backend-lib/facebook';

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
    const comparisonRange = getComparisonDateRange(period);

    const [statuses, mainRows, comparisonRows, currency] = await Promise.all([
      fetchCampaignStatuses(env),
      fetchInsights(env, { level: 'campaign', range }),
      fetchInsights(env, { level: 'campaign', range: comparisonRange }),
      fetchAccountCurrency(env),
    ]);

    const mainById = new Map<string, typeof mainRows>();
    for (const row of mainRows) {
      const id = row.campaign_id || 'unknown';
      if (!mainById.has(id)) mainById.set(id, []);
      mainById.get(id)!.push(row);
    }
    const comparisonById = new Map<string, typeof comparisonRows>();
    for (const row of comparisonRows) {
      const id = row.campaign_id || 'unknown';
      if (!comparisonById.has(id)) comparisonById.set(id, []);
      comparisonById.get(id)!.push(row);
    }

    const campaigns: CampaignForRecommendation[] = statuses
      .filter((s) => mainById.has(s.id))
      .map((s) => ({
        id: s.id,
        name: s.name,
        status: s,
        metrics: aggregateRows(mainById.get(s.id) || [], env),
        comparisonMetrics: aggregateRows(comparisonById.get(s.id) || [], env),
      }));

    const recommendations = generateRecommendations(campaigns, period, env, currency);

    return new Response(
      JSON.stringify({
        period,
        scope: isWeeklyPeriod(period) ? 'weekly' : 'daily',
        range,
        comparisonRange,
        recommendations,
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    const status = error instanceof FacebookApiError ? error.status : 500;
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status,
      headers: CORS_HEADERS,
    });
  }
}
