import { NextResponse } from "next/server";
import { getAvailableSetupSymbols } from '@/app/lib/fetchSetup';
import { getSymbolData } from '@/app/lib/fetchData';
import { processSeoIndexing } from '@/app/lib/seo-state';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds allowed

export async function GET(req: Request) {
  return handleRequest(req, 'GET');
}

export async function POST(req: Request) {
  return handleRequest(req, 'POST');
}

// Unified Logic Handler
async function handleRequest(req: Request, method: string) {
  try {
    let authorized = false;

    // 1. CHECK SECURITY FOR GITHUB (Query Param)
    const { searchParams } = new URL(req.url);
    const queryKey = searchParams.get('key');
    if (queryKey === process.env.CRON_SECRET) {
        authorized = true;
    }

    // 2. CHECK SECURITY FOR ADMIN PANEL (JSON Body)
    // Only verify if GET failed (because GET has no body)
    if (!authorized && method === 'POST') {
        try {
            const body = await req.json();
            // Accept the Admin Pass OR the Cron Secret
            if (body.secretKey === "MZ_Admin_2025!" || body.secretKey === process.env.CRON_SECRET) {
                authorized = true;
            }
        } catch(e) {
            // Body parse fail (normal if no body sent)
        }
    }

    // 3. FINAL GATE
    if (!authorized) {
        console.error("SEO API Blocked: Wrong Key.");
        return NextResponse.json({ error: 'Unauthorized Key' }, { status: 401 });
    }

    // --- MAIN LOGIC STARTS ---
    const symbols = await getAvailableSetupSymbols();
    console.log(`🤖 pSEO Running. Scanning ${symbols.length} assets...`);

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
        method: method,
        scanned: symbols.length,
        actions: logs
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}