// functions/api/google/search-terms.ts
// GET /api/google/search-terms?period=today|yesterday|last_7_days|this_week|last_week
// Actual search queries triggering ads (Search campaigns only) plus the
// negative-keyword candidates derived from them (high spend, 0 conversions).
// Read-only - suggests, does not add negative keywords itself.

import { getDateRange, parsePeriod, verifyAdminAuth } from '../../../backend-lib/ad-shared';
import {
  fetchSearchTerms,
  findNegativeKeywordCandidates,
  fetchAccountCurrency,
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

    const [searchTerms, currency] = await Promise.all([
      fetchSearchTerms(env, range),
      fetchAccountCurrency(env),
    ]);

    const negativeCandidates = findNegativeKeywordCandidates(searchTerms, period, env);

    return new Response(
      JSON.stringify({
        period,
        range,
        currency,
        searchTerms: searchTerms.slice(0, 100),
        negativeCandidates,
      }),
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
