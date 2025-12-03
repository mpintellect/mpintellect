import { NextResponse } from "next/server";
import { getAvailableSetupSymbols } from '@/app/lib/fetchSetup'; // Gets your list of symbols
import { getSymbolData } from '@/app/lib/fetchData';             // Gets Google Storage JSON
import { processSeoIndexing } from '@/app/lib/seo-state';        // The file above

// Vercel Settings
export const dynamic = 'force-dynamic'; // Never cache this logic
export const maxDuration = 60; // Allow 1 minute runtime for batching

export async function GET(req: Request) {
  try {
    // 1. Fetch Symbol List
    const symbols = await getAvailableSetupSymbols(); 
    // Example output: ["BTCUSD", "EURUSD", "US30"]

    console.log(`🤖 Starting SEO Cron for ${symbols.length} assets...`);

    const logs = [];

    // 2. Loop symbols (Sequential loop is safer for quotas than Promise.all here)
    for (const sym of symbols) {
        const data = await getSymbolData(sym);
        
        if (data) {
            const result = await processSeoIndexing(sym, data);
            
            // Only log actions/errors to keep response clean
            if (result.status === 'indexed' || result.status === 'error') {
                logs.push(result);
            }
        }
    }

    return NextResponse.json({
        success: true,
        scanned: symbols.length,
        actions: logs.length > 0 ? logs : "No significant market changes detected."
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}