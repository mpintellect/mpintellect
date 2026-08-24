// functions/api/facebook/placements.ts
// GET /api/facebook/placements?period=today|yesterday|last_7_days|this_week|last_week
// Account-wide spend breakdown by placement (publisher_platform x
// platform_position) and by device - surfaces where spend is going that the
// campaign-level table can't show. Read-only.

import {
  getDateRange,
  parsePeriod,
  verifyAdminAuth,
  fetchPlacementBreakdown,
  fetchDeviceBreakdown,
  fetchAccountCurrency,
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

    const [placements, devices, currency] = await Promise.all([
      fetchPlacementBreakdown(env, range),
      fetchDeviceBreakdown(env, range),
      fetchAccountCurrency(env),
    ]);

    const sortBySpend = <T extends { spend: number }>(rows: T[]) => [...rows].sort((a, b) => b.spend - a.spend);

    return new Response(
      JSON.stringify({
        period,
        range,
        currency,
        placements: sortBySpend(placements),
        devices: sortBySpend(devices),
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
