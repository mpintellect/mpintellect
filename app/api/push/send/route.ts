import { NextResponse } from "next/server";
import webpush from "web-push";
import { adminDb } from "../../../lib/pushAdminSafe";
import { sendToTelegram } from "../../../lib/telegram";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. SECURITY
    if (!process.env.VAPID_PRIVATE_KEY || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      throw new Error("VAPID Keys are missing in Server Environment Variables");
    }

    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || "mailto:contact@mzprimer.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const { targetUserId, title, message, url, sendToAll } = await req.json();
    
    // TRIM WHITESPACE: This is the #1 cause of "User not found" errors
    const trimmedUserId = targetUserId ? targetUserId.trim() : null;

    // --- ENHANCE NOTIFICATION FORMAT FOR AI SIGNALS ---
    let enhancedTitle = title || "Signal";
    let enhancedBody = message || "Update";
    
    // Check if this is an AI Signal (contains "MZPrimer AI Expert" pattern)
    if (title?.includes("MZPrimer AI Expert")) {
      // Extract components from the AI signal format
      const actionMatch = title?.match(/(BUY|SELL)/i);
      const action = actionMatch ? actionMatch[1].toUpperCase() : 'TRADE';
      const actionEmoji = action === 'BUY' ? '🟢' : action === 'SELL' ? '🔴' : '⚡';
      
      // Extract symbol from title (remove "MZPrimer AI Expert:" and action)
      const symbol = title
        ?.replace("MZPrimer AI Expert:", "")
        .replace(/(BUY|SELL)/i, "")
        .replace(/🟢|🔴|⚡/g, "")
        .trim() || 'Unknown Symbol';

      // Parse the message body to extract components
      const entryMatch = message?.match(/Entry: ([\d.]+)/);
      const confidenceMatch = message?.match(/Confidence: ([\d.]+)%/);
      const trendMatch = message?.match(/Trend: ([A-Za-z\s]+)/);
      
      const entry = entryMatch ? entryMatch[1] : '';
      const confidence = confidenceMatch ? confidenceMatch[1] : '';
      const trend = trendMatch ? trendMatch[1] : '';

      // Build enhanced notification format
      enhancedTitle = `🚀 ${symbol} ${action} Signal`;
      
      enhancedBody = `MZPrimer AI Expert:\n\n${actionEmoji} ${action}\n🎯 Entry: ${entry}\n🧠 Confidence: ${confidence}%\n🌊 Trend: ${trend}`;
    } else {
      // For manual/news notifications, use standard formatting
      enhancedTitle = `🚀 ${enhancedTitle}`;
      
      // Enhance manual messages with basic formatting
      enhancedBody = enhancedBody
        .replace(/ \| /g, '\n')
        .replace('Entry:', '🎯 Entry:')
        .replace('Confidence:', '🧠 Confidence:')
        .replace('Trend:', 'Trend:');
    }

    const payload = JSON.stringify({
      title: enhancedTitle,
      body: enhancedBody,
      url: url || "https://mzprimer.com",
      
      // VISUALS
      icon: "/logos/mzlogo.webp",
      vibrate: [200, 100, 200],
      tag: "market-signal",
      
      // ACTION BUTTONS (Chrome/Android only)
      actions: [
        { action: "open", title: "⚡ Execute Trade" },
        { action: "close", title: "Dismiss" }
      ]
    });

    // =========================================
    // SCENARIO A: SINGLE TARGET (Deep Search)
    // =========================================
    if (trimmedUserId) {
        console.log(`🔍 Searching for ID: [${trimmedUserId}]`);

        // ATTEMPT 1: Check 'push_subscriptions' collection (New Method)
        let userDoc = await adminDb.collection("push_subscriptions").doc(trimmedUserId).get();
        let foundCollection = "push_subscriptions";

        // ATTEMPT 2: Check 'users' collection (Old/Legacy Method)
        if (!userDoc.exists) {
            console.log(`❌ Not found in 'push_subscriptions'. Checking 'users'...`);
            userDoc = await adminDb.collection("users").doc(trimmedUserId).get();
            foundCollection = "users";
        }

        // FINAL CHECK
        if (!userDoc.exists) {
            console.log(`❌ CRITICAL: ID [${trimmedUserId}] does not exist in ANY collection.`);
            return NextResponse.json({ 
                error: `ID [${trimmedUserId}] not found in DB. Copy the ID exactly from Firebase > Firestore.` 
            }, { status: 404 });
        }

        console.log(`✅ Found Document in '${foundCollection}'. Checking keys...`);

        const userData = userDoc.data();
        
        // Check all naming variations
        const subscription = userData?.subscriptionData || userData?.pushSubscription || userData?.subscription;

        if (!subscription) {
            console.log("❌ Doc found, but fields are empty. Data:", JSON.stringify(userData));
            return NextResponse.json({ error: `User Found in '${foundCollection}', but 'subscriptionData' field is missing.` }, { status: 404 });
        }

        // Send
        await webpush.sendNotification(subscription, payload);
        console.log(`🚀 Success! Sent to ${trimmedUserId}`);
        
        return NextResponse.json({ success: true, count: 1, mode: `single (${foundCollection})` });
    }

    // =========================================
    // SCENARIO B: BROADCAST
    // =========================================
    if (sendToAll) {
        console.log("📢 STARTING GLOBAL BROADCAST...");

        // 1. FIRE TELEGRAM (Parallel Execution)
        const telegramPromise = sendToTelegram(title, message, url);

        // 2. FIRE WEB PUSH (Your existing loop)
        const snapshot = await adminDb.collection('push_subscriptions').get();
        
        const pushPromise = (async () => {
            if (snapshot.empty) return 0;
            const promises = snapshot.docs.map(async (doc) => {
                const data = doc.data();
                const sub = data.subscriptionData || data.pushSubscription; 
                if (sub) {
                    return webpush.sendNotification(sub, payload)
                       .catch(err => {
                           if (err.statusCode === 410 || err.statusCode === 404) {
                               return doc.ref.delete(); // Clean up
                           }
                           return null;
                       });
                }
            });
            await Promise.all(promises);
            return snapshot.size;
        })();

        // Wait for both
        await Promise.all([telegramPromise, pushPromise]);

        return NextResponse.json({ success: true, count: snapshot.size, mode: 'broadcast_multi_channel' });
    }

    return NextResponse.json({ error: "Invalid Payload" }, { status: 400 });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}