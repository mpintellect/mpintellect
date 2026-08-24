// functions/api/google/audiences/health.ts
// GET /api/google/audiences/health
//
// Google Audience Overview: every user_list (Remarketing / Customer Match /
// Similar / rule-based / combined) on the account, its size, and whether
// it's currently used by an ENABLED campaign. Not period-scoped - see
// computeGoogleAudienceHealth in backend-lib/google-ads.ts for the
// health-tier logic and fetchUserListDeliveryLast30Days for how "used in the
// last 30 days" is derived (best-effort - Google doesn't expose a literal
// "list last used" timestamp any more than Facebook does).

import { verifyAdminAuth } from '../../../../backend-lib/ad-shared';
import {
  fetchUserLists,
  fetchUserListCriteria,
  fetchUserListDeliveryLast30Days,
  computeGoogleAudienceHealth,
  GoogleAdsApiError,
} from '../../../../backend-lib/google-ads';

const CORS_HEADERS = { 'Content-Type': 'application/json' };

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequestGet(context: any) {
  const { request, env } = context;

  if (!verifyAdminAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS_HEADERS });
  }

  try {
    const [lists, criteria, delivered] = await Promise.all([
      fetchUserLists(env),
      fetchUserListCriteria(env),
      fetchUserListDeliveryLast30Days(env),
    ]);

    const { summary, audiences } = computeGoogleAudienceHealth(lists, criteria, delivered, env);

    return new Response(JSON.stringify({ summary, audiences }), { status: 200, headers: CORS_HEADERS });
  } catch (error: any) {
    const status = error instanceof GoogleAdsApiError ? error.status : 500;
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status,
      headers: CORS_HEADERS,
    });
  }
}
