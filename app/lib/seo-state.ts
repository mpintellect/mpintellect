// app/lib/seoIndexing.ts - CLOUDFLARE VERSION
import { getDb, queryOne, execute } from "@/backend-lib/db-simple";
import { requestIndexingForSymbol, requestIndexingForUrl } from "@/app/lib/indexing";
import { createNewsEvent } from "@/app/lib/newsStore";

// --- QUOTA SAFETY CONFIGURATION ---
const URGENT_COOLDOWN = 15;   // Minutes (For Signal Flips)
const ROUTINE_COOLDOWN = 240; // 4 Hours (For Volatility checks)
const PRICE_THRESHOLD = 0.35; // 0.35% move required to trigger routine check

export async function processSeoIndexing(symbol: string, currentData: any) {
  try {
    const sym = symbol.toUpperCase();
    
    // 1. WEEKEND CHECK (Sleep Sat/Sun)
    const nowObj = new Date();
    const day = nowObj.getDay(); 
    if (day === 0 || day === 6) {
      return { status: 'skipped', symbol: sym, reason: 'Weekend Mode' };
    }

    // 2. GET HISTORY
    const prevData = await queryOne<{
      lastIndexedAt: number;
      decision: string;
      trend: string;
      price: number;
    }>(
      'SELECT lastIndexedAt, decision, trend, price FROM seo_logs WHERE symbol = ?',
      [sym]
    );

    // Init state if new
    const lastIndexedAt = prevData?.lastIndexedAt || 0;
    const prevDecision = prevData?.decision || '';
    const prevTrend = prevData?.trend || '';
    const prevPrice = prevData?.price || 0;

    // --- 3. ANALYZE CHANGE & SET TYPE ---
    let changeType = "NONE";
    const curDecision = currentData.final_decision || "HOLD";
    const curTrend = currentData.trend?.trend || "neutral";
    const curPrice = currentData.trend?.current_price || 0;

    // LOGIC CHECK
    if (!prevData) {
      changeType = "INIT";
    }
    // MAJOR / URGENT (Signal Flip)
    else if (curDecision !== prevDecision) {
      changeType = "URGENT_CHANGE";
    }
    // MINOR / ROUTINE (Price Movement)
    else if (curPrice > 0 && prevPrice > 0) {
      const pctChange = Math.abs((curPrice - prevPrice) / prevPrice) * 100;
      if (pctChange >= PRICE_THRESHOLD) {
        changeType = "ROUTINE_VOLATILITY";
      }
    }

    if (changeType === "NONE") {
      return { status: 'skipped', symbol: sym, reason: 'Stable' };
    }

    // --- 4. COOLDOWN LOGIC ---
    let diffMins = 9999;
    if (lastIndexedAt > 0) {
      diffMins = (nowObj.getTime() - lastIndexedAt) / 60000;
    }

    // Different wait times based on Priority
    let requiredWait = ROUTINE_COOLDOWN; // 240 mins default
    if (changeType.includes("URGENT") || changeType === "INIT") {
      requiredWait = URGENT_COOLDOWN;  // 15 mins for signals
    }

    // --- 5. EXECUTION ---
    if (diffMins >= requiredWait) {
      let pagesToPing = [];
      let newsSlug = null;

      if (changeType.includes("URGENT") || changeType === "INIT") {
        // MAJOR EVENT: Index the whole Cluster
        console.log(`📡 [pSEO] ${sym} SIGNAL FLIP! Generating News...`);
        
        // 1. GENERATE THE NEWS PAGE
        if (changeType === "URGENT_CHANGE") {
          try {
            newsSlug = await createNewsEvent(sym, currentData);
          } catch (newsError) {
            console.error(`Failed to create news event for ${sym}:`, newsError);
          }
        }
        
        // 2. Ping the standard cluster pages
        pagesToPing = ['trade', 'analysis', 'forecast'];
      } else {
        // MINOR EVENT (Volatility): Index just the Forecast page
        console.log(`📡 [pSEO] ${sym} Routine Update. Pinging Forecast page only...`);
        pagesToPing = ['forecast'];
      }

      // Fire the API for standard pages
      await requestIndexingForSymbol(sym, pagesToPing);

      // Fire API for the NEW News Page (if created)
      if (newsSlug) {
        try {
          const newsUrl = `https://mzprimer.com/news/${newsSlug}`;
          await requestIndexingForUrl(newsUrl);
          console.log(`✅ Indexed news page: ${newsUrl}`);
        } catch (urlError) {
          console.error(`Failed to index news URL for ${sym}:`, urlError);
        }
      }

      // Update database
      const now = Date.now();
      if (prevData) {
        await execute(
          `UPDATE seo_logs 
           SET lastIndexedAt = ?, decision = ?, trend = ?, price = ?, lastTrigger = ?
           WHERE symbol = ?`,
          [now, curDecision, curTrend, curPrice, changeType, sym]
        );
      } else {
        await execute(
          `INSERT INTO seo_logs 
           (symbol, lastIndexedAt, decision, trend, price, lastTrigger, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [sym, now, curDecision, curTrend, curPrice, changeType, now]
        );
      }

      return { 
        status: 'indexed', 
        symbol: sym, 
        pages: pagesToPing.length, 
        reason: changeType,
        newsSlug
      };
    } else {
      return { 
        status: 'skipped', 
        symbol: sym, 
        reason: `Cooldown (${Math.round(diffMins)}/${requiredWait}m)` 
      };
    }

  } catch (error: any) {
    console.error(`pSEO Error ${symbol}:`, error);
    return { status: 'error', symbol: symbol, error: error.message };
  }
}