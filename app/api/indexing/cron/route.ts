import { NextRequest, NextResponse } from "next/server";
import { getAvailableSetupSymbols } from '@/app/lib/fetchSetup';
import { getSymbolData } from '@/app/lib/fetchData';
import { processSeoIndexing } from '@/app/lib/seo-state';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; 

// We handle both GET (for GitHub Automation) and POST (for Admin Panel)
async function unifiedHandler(req: NextRequest) {
  try {
    let authorized = false;
    const SECURE_SECRET = process.env.CRON_SECRET; // Pulled safely from Vercel

    if (!SECURE_SECRET) {
        console.error("SERVER ERROR: CRON_SECRET not set in Vercel.");
        return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // --- SECURITY GATE ---

    // 1. CHECK QUERY PARAM (Used by GitHub Actions "curl")
    // GitHub sends keys in URL (GET), which is acceptable for Cron jobs.
    const queryKey = req.nextUrl.searchParams.get('key');
    if (queryKey === SECURE_SECRET) {
        authorized = true;
    }

    // 2. CHECK POST BODY (Used by Your Admin Panel)
    // Admin sends keys securely inside the Body, invisible to URL logs.
    if (!authorized && req.method === 'POST') {
        try {
            const body = await req.clone().json(); // Clone to prevent read-once errors
            if (body.secretKey === SECURE_SECRET) {
                authorized = true;
            }
        } catch(e) {
            // No body found, unauthorized
        }
    }

    // 3. REJECT IF INVALID
    if (!authorized) {
        console.log("❌ Unauthorized access attempt.");
        return NextResponse.json({ error: 'Invalid Credentials' }, { status: 401 });
    }

    console.log("✅ pSEO Authorized. Starting scan...");

    // --- BUSINESS LOGIC ---
    const symbols = await getAvailableSetupSymbols();
    const logs = [];

    for (const sym of symbols) {
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
        scanned: symbols.length,
        actions: logs
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export { unifiedHandler as GET, unifiedHandler as POST };