// functions/api/facebook/auth/exchange-token.ts
// GET /api/facebook/auth/exchange-token?short_lived_token=...
// One-time setup helper: exchanges a short-lived user access token (copied
// from Graph API Explorer) for a long-lived token (~60 days). Admin-gated.
// The returned token is meant to be copied into FB_ACCESS_TOKEN manually
// (wrangler secret / .dev.vars) - this endpoint does not persist it anywhere.
//
// If you're using a System User token from Business Manager instead, you
// don't need this endpoint at all - system user tokens don't expire and can
// be pasted straight into FB_ACCESS_TOKEN. See SETUP_FACEBOOK_ADS.md.

import { verifyAdminAuth } from '../../../../backend-lib/facebook';

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
  const shortLivedToken = url.searchParams.get('short_lived_token');

  if (!shortLivedToken) {
    return new Response(JSON.stringify({ error: 'short_lived_token query param required' }), {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  if (!env.FB_APP_ID || !env.FB_APP_SECRET) {
    return new Response(JSON.stringify({ error: 'FB_APP_ID / FB_APP_SECRET not configured' }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }

  const version = env.FB_GRAPH_API_VERSION || 'v21.0';
  const exchangeUrl = new URL(`https://graph.facebook.com/${version}/oauth/access_token`);
  exchangeUrl.searchParams.set('grant_type', 'fb_exchange_token');
  exchangeUrl.searchParams.set('client_id', env.FB_APP_ID);
  exchangeUrl.searchParams.set('client_secret', env.FB_APP_SECRET);
  exchangeUrl.searchParams.set('fb_exchange_token', shortLivedToken);

  try {
    const res = await fetch(exchangeUrl.toString());
    const json: any = await res.json().catch(() => ({}));

    if (!res.ok || json?.error) {
      return new Response(
        JSON.stringify({ error: json?.error?.message || 'Token exchange failed' }),
        { status: res.status || 502, headers: CORS_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({
        access_token: json.access_token,
        expires_in_seconds: json.expires_in,
        note: 'Copy access_token into FB_ACCESS_TOKEN (wrangler secret / .dev.vars). This response is not stored anywhere.',
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}
