// scripts/dev-ads-server.ts
//
// Standalone local server for testing the Ads dashboard's API routes
// (Facebook Ads + Google Ads) WITHOUT Wrangler. Wrangler's `pages dev`
// needs to open a remote "preview session" against your Cloudflare account
// even with --local, and that call is failing in this environment
// (account/auth issue, not a code issue). Since these routes only use
// fetch/Request/Response (no D1, KV, R2, or Browser bindings), we can run
// the exact same handler functions directly under Node - no Cloudflare
// dependency at all.
//
// Run with: npm run dev:ads
// (in parallel with `LOCAL_API=true npm run dev` for the Next.js frontend)

import { config as loadDotenv } from 'dotenv';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import path from 'node:path';

loadDotenv({ path: path.resolve(process.cwd(), '.dev.vars') });

import { onRequestGet as fbInsightsGet } from '../functions/api/facebook/insights';
import { onRequestGet as fbCampaignsGet } from '../functions/api/facebook/campaigns';
import { onRequestGet as fbRecommendationsGet } from '../functions/api/facebook/recommendations';
import { onRequestGet as fbExchangeTokenGet } from '../functions/api/facebook/auth/exchange-token';
import { onRequestGet as googleInsightsGet } from '../functions/api/google/insights';
import { onRequestGet as googleCampaignsGet } from '../functions/api/google/campaigns';
import { onRequestGet as googleRecommendationsGet } from '../functions/api/google/recommendations';
import { onRequestPost as adminValidatePost } from '../functions/api/admin/validate';

const PORT = Number(process.env.ADS_DEV_SERVER_PORT || process.env.FACEBOOK_DEV_SERVER_PORT || 8788);

type Handler = (context: { request: Request; env: NodeJS.ProcessEnv }) => Promise<Response>;

const GET_ROUTES: Record<string, Handler> = {
  '/api/facebook/insights': fbInsightsGet,
  '/api/facebook/campaigns': fbCampaignsGet,
  '/api/facebook/recommendations': fbRecommendationsGet,
  '/api/facebook/auth/exchange-token': fbExchangeTokenGet,
  '/api/google/insights': googleInsightsGet,
  '/api/google/campaigns': googleCampaignsGet,
  '/api/google/recommendations': googleRecommendationsGet,
};

const POST_ROUTES: Record<string, Handler> = {
  '/api/admin/validate': adminValidatePost,
};

function nodeHeadersToFetchHeaders(nodeHeaders: IncomingMessage['headers']): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (!value) continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, value);
    }
  }
  return headers;
}

async function readBody(req: IncomingMessage): Promise<Buffer | undefined> {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

async function writeResponse(res: ServerResponse, response: Response) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  if (!res.getHeader('Access-Control-Allow-Origin')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  const body = Buffer.from(await response.arrayBuffer());
  res.end(body);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://localhost:${PORT}`);

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
      res.end();
      return;
    }

    const routes = req.method === 'POST' ? POST_ROUTES : GET_ROUTES;
    const handler = routes[url.pathname];

    if (!handler) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: `No local handler for ${req.method} ${url.pathname}` }));
      return;
    }

    const body = await readBody(req);
    const request = new Request(url.toString(), {
      method: req.method,
      headers: nodeHeadersToFetchHeaders(req.headers),
      // Buffer is a Uint8Array at runtime (valid BodyInit for undici's Request),
      // just not structurally typed as one.
      body: body as BodyInit | undefined,
    });

    const response = await handler({ request, env: process.env });
    await writeResponse(res, response);
  } catch (error: any) {
    console.error('[dev-ads-server] error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message || 'Internal server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`Ads dashboard local API server running at http://localhost:${PORT}`);
  console.log('Routes:');
  for (const p of Object.keys(GET_ROUTES)) console.log(`  GET  ${p}`);
  for (const p of Object.keys(POST_ROUTES)) console.log(`  POST ${p}`);
  console.log('\nRun `LOCAL_API=true npm run dev` in another terminal, then visit /admin/monitoring/');
});
