import { NextRequest, NextResponse } from "next/server";
import { getAvailableSetupSymbols } from '@/app/lib/fetchSetup';
import { getSymbolData } from '@/app/lib/fetchData';
import { processSeoIndexing } from '@/app/lib/seo-state';

// Allow long execution
export const dynamic = 'force-dynamic';
export const maxDuration = 60; 

// The Universal Handler
async function unifiedHandler(req: NextRequest) {
  try {
    let authorized = false;
    let authSource = "None";

    // 1. DEFINE ACCEPTABLE KEYS
    const ENV_SECRET = process.env.CRON_SECRET;
    const ADMIN_KEY = process.env.ADMIN_API_KEY; // Hardcoded backup to ensure it works

    // 2. CHECK QUERY PARAM (Method for GitHub/Vercel Cron)
    const queryKey = req.nextUrl.searchParams.get('key');
    
    if (queryKey && (queryKey === ENV_SECRET || queryKey === ADMIN_KEY)) {
        authorized = true;
        authSource = "Query Param (GitHub)";
    }

    // 3. CHECK POST BODY (Method for Admin Panel)
    if (!authorized && req.method === 'POST') {
        try {
            // Safe JSON parse
            const text = await req.text();
            if (text) {
                const body = JSON.parse(text);
                const receivedKey = body.secretKey;

                // Log logic for debugging (don't log full keys in prod usually, but here helps diagnosis)
                console.log(`Checking Body Key: '${receivedKey?.substring(0,3)}...'`);

                if (receivedKey === ENV_SECRET || receivedKey === ADMIN_KEY) {
                    authorized = true;
                    authSource = "POST Body (Admin UI)";
                }
            }
        } catch(e) {
            console.log("JSON Parse Error:", e);
        }
    }

    // 4. UNAUTHORIZED EXIT
    if (!authorized) {
        console.error(`❌ SEO API: Blocked access attempt.`);
        return NextResponse.json({ error: 'Invalid Credentials' }, { status: 401 });
    }

    console.log(`✅ SEO Engine Authorized via [${authSource}]. Starting...`);

    // --- 5. RUN LOGIC ---
    const symbols = await getAvailableSetupSymbols();
    const logs = [];

    // Safety limit to prevent timeouts
    // (If 60 seconds isn't enough, we only scan 15 assets max per run)
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

    return NextResponse.json({
        success: true,
        source: authSource,
        scanned: symbolsToScan.length,
        actions: logs
    });

  } catch (error: any) {
    console.error("Route Crash:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Export Handlers
export { unifiedHandler as GET, unifiedHandler as POST };