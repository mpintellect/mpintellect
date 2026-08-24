// functions/api/google/campaigns.ts
// GET /api/google/campaigns?period=today|yesterday|last_7_days|this_week|last_week
// Mirrors functions/api/facebook/campaigns.ts's response shape so the
// frontend can reuse the same CampaignTable component for both platforms.

import {
  getDateRange,
  getComparisonDateRange,
  isWeeklyPeriod,
  parsePeriod,
  verifyAdminAuth,
  classifyCtr,
  classifyRoas,
  classifyCpaFromRoas,
  classifyFrequency,
  computeHealth,
  budgetUsedPct,
} from '../../../backend-lib/ad-shared';
import {
  fetchCampaignRows,
  fetchReachByCampaign,
  fetchDailyReachByCampaign,
  fetchQualityScoreByCampaign,
  fetchAccountCurrency,
  aggregateCampaignRows,
  GoogleAdsApiError,
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
    const comparisonRange = getComparisonDateRange(period);
    const weekly = isWeeklyPeriod(period);

    const [
      mainRows,
      comparisonRows,
      dailyRows,
      reachByCampaign,
      comparisonReachByCampaign,
      dailyReachByCampaign,
      qualityScoreByCampaign,
      currency,
    ] = await Promise.all([
      fetchCampaignRows(env, range, false),
      fetchCampaignRows(env, comparisonRange, false),
      weekly ? fetchCampaignRows(env, range, true) : Promise.resolve([]),
      fetchReachByCampaign(env, range),
      fetchReachByCampaign(env, comparisonRange),
      weekly ? fetchDailyReachByCampaign(env, range) : Promise.resolve(new Map<string, number>()),
      fetchQualityScoreByCampaign(env, range),
      fetchAccountCurrency(env),
    ]);

    const comparisonById = new Map(comparisonRows.map((r) => [r.id, r]));
    const dailyById = new Map<string, typeof dailyRows>();
    for (const row of dailyRows) {
      if (!dailyById.has(row.id)) dailyById.set(row.id, []);
      dailyById.get(row.id)!.push(row);
    }

    const campaigns = mainRows.map((row) => {
      const main = aggregateCampaignRows([row], reachByCampaign);
      const comparisonRow = comparisonById.get(row.id);
      const comparison = comparisonRow
        ? aggregateCampaignRows([comparisonRow], comparisonReachByCampaign)
        : aggregateCampaignRows([], comparisonReachByCampaign);

      const ctrFlag = classifyCtr(main.ctr);
      const roasFlag = classifyRoas(main.roas);
      const cpaFlag = classifyCpaFromRoas(main.roas);
      const frequencyFlag = classifyFrequency(main.frequency, 3);
      const health = computeHealth([ctrFlag, roasFlag, cpaFlag].filter((f) => f !== 'neutral') as any);

      const vsPrevPct = comparison.roas > 0 ? ((main.roas - comparison.roas) / comparison.roas) * 100 : null;

      const used = budgetUsedPct(row.spend, row.dailyBudget ?? undefined, weekly);
      const budgetCapDollars = row.dailyBudget ? (weekly ? row.dailyBudget * 7 : row.dailyBudget) : null;

      const dailyBreakdown = weekly
        ? (dailyById.get(row.id) || [])
            .map((d) => {
              const dReach = dailyReachByCampaign.get(`${d.id}|${d.date}`) || 0;
              const derived = aggregateCampaignRows([d], new Map([[d.id, dReach]]));
              return { date: d.date, ...derived };
            })
            .sort((a, b) => (a.date! < b.date! ? -1 : 1))
        : undefined;

      return {
        id: row.id,
        name: row.name,
        status: row.status,
        effectiveStatus: row.status === 'ENABLED' ? 'ACTIVE' : row.status,
        dailyBudget: row.dailyBudget,
        startDate: row.startDate,
        endDate: row.endDate,
        avgCpc: row.avgCpc,
        avgCpm: row.avgCpm,
        qualityScore: qualityScoreByCampaign.get(row.id) ?? null,
        budgetUsedPct: used,
        budgetRemaining: budgetCapDollars !== null ? budgetCapDollars - row.spend : null,
        metrics: main,
        comparisonMetrics: comparison,
        vsPrevPct,
        flags: { ctr: ctrFlag, roas: roasFlag, cpa: cpaFlag, frequency: frequencyFlag },
        health,
        dailyBreakdown,
      };
    });

    return new Response(
      JSON.stringify({ period, range, comparisonRange, currency, campaigns }),
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
