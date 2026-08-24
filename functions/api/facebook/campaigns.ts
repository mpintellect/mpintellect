// functions/api/facebook/campaigns.ts
// GET /api/facebook/campaigns?period=today|yesterday|last_7_days|this_week|last_week
// Returns every campaign for the selected period with computed color flags,
// health, and a comparison to the previous equivalent period. Monitoring
// only - no create/update/pause actions here.

import {
  getDateRange,
  getComparisonDateRange,
  isWeeklyPeriod,
  parsePeriod,
  verifyAdminAuth,
  fetchInsights,
  fetchCampaignStatuses,
  fetchAccountCurrency,
  normalizeRow,
  aggregateRows,
  classifyCtr,
  classifyRoas,
  classifyCpa,
  classifyFrequency,
  budgetUsedPct,
  computeHealth,
  FacebookApiError,
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
    const weekly = isWeeklyPeriod(period);

    const [statuses, mainRows, comparisonRows, dailyRows, currency] = await Promise.all([
      fetchCampaignStatuses(env),
      fetchInsights(env, { level: 'campaign', range }),
      fetchInsights(env, { level: 'campaign', range: comparisonRange }),
      weekly ? fetchInsights(env, { level: 'campaign', range, timeIncrement: 1 }) : Promise.resolve([]),
      fetchAccountCurrency(env),
    ]);

    const statusById = new Map(statuses.map((s) => [s.id, s]));
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
    const dailyById = new Map<string, typeof dailyRows>();
    for (const row of dailyRows) {
      const id = row.campaign_id || 'unknown';
      if (!dailyById.has(id)) dailyById.set(id, []);
      dailyById.get(id)!.push(row);
    }

    // Campaigns with spend in the period, even if not currently active, are included.
    const campaignIds = new Set<string>([...mainById.keys(), ...statusById.keys()]);

    const campaigns = Array.from(campaignIds)
      .filter((id) => id !== 'unknown')
      .map((id) => {
        const status = statusById.get(id);
        const mainMetrics = aggregateRows(mainById.get(id) || [], env);
        const comparisonMetrics = aggregateRows(comparisonById.get(id) || [], env);

        if (mainMetrics.spend === 0 && mainMetrics.impressions === 0 && !status) return null;

        const ctrFlag = classifyCtr(mainMetrics.ctr);
        const roasFlag = classifyRoas(mainMetrics.roas);
        const cpaFlag = classifyCpa(mainMetrics.roas);
        const frequencyFlag = classifyFrequency(mainMetrics.frequency, 3);
        const health = computeHealth([ctrFlag, roasFlag, cpaFlag].filter((f) => f !== 'neutral') as any);

        const vsPrevPct = comparisonMetrics.roas > 0
          ? ((mainMetrics.roas - comparisonMetrics.roas) / comparisonMetrics.roas) * 100
          : null;

        const dailyBreakdown = weekly
          ? (dailyById.get(id) || [])
              .map((row) => ({ date: row.date_start, ...normalizeRow(row, env) }))
              .sort((a, b) => (a.date! < b.date! ? -1 : 1))
          : undefined;

        const budgetUsed = budgetUsedPct(mainMetrics.spend, status?.daily_budget, weekly);
        const budgetCapDollars = status?.daily_budget ? (weekly ? status.daily_budget * 7 : status.daily_budget) : null;

        return {
          id,
          name: status?.name || mainById.get(id)?.[0]?.campaign_name || 'Unknown campaign',
          status: status?.status || 'UNKNOWN',
          effectiveStatus: status?.effective_status || 'UNKNOWN',
          dailyBudget: status?.daily_budget ?? null,
          endDate: status?.stop_time ?? null,
          budgetUsedPct: budgetUsed,
          budgetRemaining: budgetCapDollars !== null ? budgetCapDollars - mainMetrics.spend : null,
          metrics: mainMetrics,
          comparisonMetrics,
          vsPrevPct,
          flags: { ctr: ctrFlag, roas: roasFlag, cpa: cpaFlag, frequency: frequencyFlag },
          health,
          dailyBreakdown,
        };
      })
      .filter(Boolean);

    return new Response(
      JSON.stringify({
        period,
        range,
        comparisonRange,
        currency,
        campaigns,
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
