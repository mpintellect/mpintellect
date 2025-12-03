import { NextRequest, NextResponse } from "next/server"; // Use NextRequest!
import { getAvailableSetupSymbols } from '@/app/lib/fetchSetup';
import { getSymbolData } from '@/app/lib/fetchData';
import { processSeoIndexing } from '@/app/lib/seo-state';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; 

// We handle both GET (GitHub Cron) and POST (Admin Panel) in one flow
async function unifiedHandler(req: NextRequest) {
  try {
    let authorized = false;
    let authSource = "None";

    const ENV_CRON_SECRET = process.env.CRON_SECRET;
    // Hardcoded backup for admin panel just in case Env var fails
    const ADMIN_BACKUP_PASS = "MZ_Admin_2025!"; 

    // --- DEBUGGING LOGS (Check Vercel Logs for these!) ---
    // console.log(`Configured Env Secret Exists? ${!!ENV_CRON_SECRET}`);

    // 1. CHECK QUERY PARAM (Method for GitHub/Vercel Cron)
    const queryKey = req.nextUrl.searchParams.get('key');
    
    if (queryKey && (queryKey === ENV_CRON_SECRET || queryKey === ADMIN_BACKUP_PASS)) {
        authorized = true;
        authSource = "Query Param";
    }

    // 2. CHECK JSON BODY (Method for Admin Panel)
    if (!authorized && req.method === 'POST') {
        try {
            // Clone request to avoid "Body already read" errors
            const body = await req.clone().json();
            const bodyKey = body.secretKey;
            
            // console.log(`Received Body Key: ${bodyKey ? '***' : 'undefined'}`);

            if (bodyKey && (bodyKey === ENV_CRON_SECRET || bodyKey === ADMIN_BACKUP_PASS)) {
                authorized = true;
                authSource = "JSON Body";
            }
        } catch(e) {
            console.log("JSON Parse ignored (Request might have empty body)");
        }
    }

    // 3. UNAUTHORIZED EXIT
    if (!authorized) {
        console.error(`❌ Authorization Failed. Source: ${authSource}.`);
        // We log what we got vs what we expected (First 3 chars only for security)
        console.log(`Debug Info -> EnvKeyStart: ${ENV_CRON_SECRET?.slice(0,3)} | QueryGot: ${queryKey}`);
        
        return NextResponse.json({ error: 'Unauthorized Key' }, { status: 401 });
    }

    console.log(`✅ SEO Engine Authorized via ${authSource}. Starting scan...`);

    // --- 4. EXECUTE SEO LOGIC ---
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
        } catch (symErr) { 
            console.error(`Skipping ${sym}:`, symErr);
        }
    }

    return NextResponse.json({
        success: true,
        source: authSource,
        scanned: symbols.length,
        actions: logs
    });

  } catch (error: any) {
    console.error("Critical Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Export both methods pointing to the same handler
export { unifiedHandler as GET, unifiedHandler as POST };