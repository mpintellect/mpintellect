import { NextResponse } from "next/server";
import { getAvailableSetupSymbols } from '@/app/lib/fetchSetup'; // Gets your list of symbols
import { getSymbolData } from '@/app/lib/fetchData';             // Gets Google Storage JSON
import { processSeoIndexing } from '@/app/lib/seo-state';        // The file above

export const dynamic = 'force-dynamic';
export const maxDuration = 60; 

export async function GET(req: Request) {
  try {
    // 1. SECURITY CHECK
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('key');
    
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch Symbol List
    const symbols = await getAvailableSetupSymbols(); 
    // Example output: ["BTCUSD", "EURUSD", "US30"]

    console.log(`🤖 Starting SEO Cron for ${symbols.length} assets...`);

    const logs = [];

    // 3. Loop symbols (Sequential loop is safer for quotas than Promise.all here)
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