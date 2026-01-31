// functions/api/indexing/cron.ts (Move from app/api/indexing/cron/route.ts)

/**
 * CLOUDFLARE NOTE:
 * Path A imports need to point to the correct folder relative to /functions.
 * '@/app/...' works in Next.js, but here we use relative paths.
 */
import { getAvailableSetupSymbols } from '../../../app/lib/fetchSetup';
import { getSymbolData } from '../../../app/lib/fetchData';
import { processSeoIndexing } from '../../../app/lib/seo-state';

/**
 * The Universal Handler for Cloudflare
 * Handles both GET and POST requests
 */
export async function onRequest(context: any) {
  const { request, env } = context;
  
  try {
    let authorized = false;
    let authSource = "None";

    // 1. DEFINE ACCEPTABLE KEYS (Pull from Cloudflare env)
    const ENV_SECRET = env.CRON_SECRET;
    const ADMIN_KEY = env.ADMIN_API_KEY;

    // 2. CHECK QUERY PARAM (Standard Web URL API)
    const url = new URL(request.url);
    const queryKey = url.searchParams.get('key');
    
    if (queryKey && (queryKey === ENV_SECRET || queryKey === ADMIN_KEY)) {
        authorized = true;
        authSource = "Query Param (GitHub)";
    }

    // 3. CHECK POST BODY (Method for Admin Panel)
    if (!authorized && request.method === 'POST') {
        try {
            // We clone the request so we can read the text without breaking it
            const clonedReq = request.clone();
            const body = await clonedReq.json();
            const receivedKey = body.secretKey;

            if (receivedKey === ENV_SECRET || receivedKey === ADMIN_KEY) {
                authorized = true;
                authSource = "POST Body (Admin UI)";
            }
        } catch(e) {
            console.log("JSON Parse Error:", e);
        }
    }

    // 4. UNAUTHORIZED EXIT
    if (!authorized) {
        console.error(`❌ SEO API: Blocked access attempt.`);
        return Response.json({ error: 'Invalid Credentials' }, { status: 401 });
    }

    console.log(`✅ SEO Engine Authorized via [${authSource}]. Starting...`);

    // --- 5. RUN LOGIC ---
    const symbols = await getAvailableSetupSymbols();
    const logs = [];

    // Cloudflare Workers have a time limit. 
    // We scan 28 assets max, but if it times out, reduce this to 15.
    const symbolsToScan = symbols.slice(0, 28);

    for (const sym of symbolsToScan) {
        try {
            const data = await getSymbolData(sym);
            if (data) {
                const result = await processSeoIndexing(sym, data);
                if (result.status === 'indexed' || result.status === 'error') {
                    logs.push(result);
                }
            }
        } catch (symErr) { console.error(symErr); }
    }

    return Response.json({
        success: true,
        source: authSource,
        scanned: symbolsToScan.length,
        actions: logs
    });

  } catch (error: any) {
    console.error("Route Crash:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}