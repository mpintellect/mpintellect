import { adminDb } from "../lib/pushAdminSafe"; 
import { requestIndexingForSymbol, requestIndexingForUrl } from "@/app/lib/indexing"; 
import { createNewsEvent } from "../lib/newsStore"; // Import the news creation function
import * as admin from 'firebase-admin';

// --- QUOTA SAFETY CONFIGURATION ---
const URGENT_COOLDOWN = 15;   // Minutes (For Signal Flips)
const ROUTINE_COOLDOWN = 240; // 4 Hours (For Volatility checks)
const PRICE_THRESHOLD = 0.35; // 0.35% move required to trigger routine check (Increased to save quota)

export async function processSeoIndexing(symbol: string, currentData: any) {
  try {
    const sym = symbol.toUpperCase();
    const docId = `state_${sym}`; 
    
    // 1. WEEKEND CHECK (Sleep Sat/Sun)
    const nowObj = new Date();
    const day = nowObj.getDay(); 
    if (day === 0 || day === 6) {
        return { status: 'skipped', symbol: sym, reason: 'Weekend Mode' };
    }

    // 2. GET HISTORY
    const docRef = adminDb.collection("seo_logs").doc(docId);
    const docSnap = await docRef.get();
    
    // Init state if new
    let prevData = { lastIndexedAt: null, decision: '', trend: '', price: 0 };
    if (docSnap.exists) {
        // @ts-ignore
        prevData = docSnap.data();
    }

    // --- 3. ANALYZE CHANGE & SET TYPE ---
    let changeType = "NONE";
    const curDecision = currentData.final_decision || "HOLD";
    const curTrend = currentData.trend?.trend || "neutral";
    const curPrice = currentData.trend?.current_price || 0;

    // LOGIC CHECK
    if (!docSnap.exists) {
        changeType = "INIT";
    }
    // MAJOR / URGENT (Signal Flip) - STRICTER: Only trigger news if the decision actually FLIPS
    else if (curDecision !== prevData.decision) {
        changeType = "URGENT_CHANGE"; // Signal flip detected
    }
    // MINOR / ROUTINE (Price Movement)
    else if (curPrice > 0 && prevData.price > 0) {
        const pctChange = Math.abs((curPrice - prevData.price) / prevData.price) * 100;
        if (pctChange >= PRICE_THRESHOLD) {
            changeType = "ROUTINE_VOLATILITY";
        }
    }

    if (changeType === "NONE") {
        return { status: 'skipped', symbol: sym, reason: 'Stable' };
    }

    // --- 4. COOLDOWN LOGIC ---
    let diffMins = 9999;
    if (prevData.lastIndexedAt) {
        // @ts-ignore
        const lastTime = prevData.lastIndexedAt.toDate().getTime();
        diffMins = (nowObj.getTime() - lastTime) / 60000;
    }

    // Different wait times based on Priority
    let requiredWait = ROUTINE_COOLDOWN; // 240 mins default
    if (changeType.includes("URGENT") || changeType === "INIT") {
        requiredWait = URGENT_COOLDOWN;  // 15 mins for signals
    }

    // --- 5. EXECUTION ---
    if (diffMins >= requiredWait) {
        
        let pagesToPing = [];
        let newsSlug = null; // Variable to store the news page slug if created

        if (changeType.includes("URGENT") || changeType === "INIT") {
            // MAJOR EVENT: Index the whole Cluster
            console.log(`📡 [pSEO] ${sym} SIGNAL FLIP! Generating News...`);
            
            // 1. GENERATE THE NEWS PAGE (only for urgent changes/signal flips)
            if (changeType === "URGENT_CHANGE") {
                try {
                    newsSlug = await createNewsEvent(sym, currentData);
                } catch (newsError) {
                    console.error(`Failed to create news event for ${sym}:`, newsError);
                    // Continue with indexing even if news creation fails
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

        // Update DB
        await docRef.set({
            symbol: sym,
            lastIndexedAt: admin.firestore.Timestamp.now(),
            decision: curDecision,
            trend: curTrend,
            price: curPrice,
            lastTrigger: changeType
        });

        return { 
            status: 'indexed', 
            symbol: sym, 
            pages: pagesToPing.length, 
            reason: changeType,
            newsSlug: newsSlug // Return news slug if created
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