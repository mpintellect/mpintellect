import { NextResponse } from "next/server";
import webpush from "web-push";
import { adminDb } from "../../../lib/pushAdminSafe"; 
import { sendToTelegram } from "../../../lib/telegram"; 
// import { sendToDiscord } from "@/lib/discord"; // Optional: Uncomment if you added Discord logic

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. SETUP & VALIDATE KEYS
    if (process.env.VAPID_PRIVATE_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        webpush.setVapidDetails(
            process.env.VAPID_SUBJECT || "mailto:admin@mzprimer.com",
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        );
    } else {
        console.error("VAPID Keys missing. Web Push disabled.");
    }

    const body = await req.json();
    const { title, message, url, sendToAll } = body;
    const targetUserId = body.targetUserId ? body.targetUserId.trim() : null;

    // --- PAYLOAD FORMATTER ---
    // Make the phone notification look structured (vertical list)
    // Turns "Entry: 100 | Conf: 90" -> 
    // 🎯 Entry: 100
    // 🧠 Conf: 90%
    let enrichedBody = message || "";
    
    // Check if it's an AI Signal format or generic update
    if (enrichedBody.includes("Entry:")) {
       enrichedBody = enrichedBody
        .replace(/ \| /g, '\n') // Newlines for stacking
        .replace('Entry:', '🎯 Entry:')
        .replace('Confidence:', '🧠 Conf:')
        .replace('Trend:', '🌊 Trend:')
        .replace('Conf:', '🧠 Conf:');
    }

    const pushPayload = JSON.stringify({
      title: title?.startsWith("🚀") ? title : `🚀 ${title || "Market Update"}`,
      body: enrichedBody,
      url: url || "https://mzprimer.com",
      
      // Visuals
      icon: "/logos/mzlogo.webp",
      badge: "/logos/mzlogo.webp", // Small monochome icon for Android status bar
      vibrate: [200, 100, 200], // Haptic buzz
      tag: "trade-signal", // Replaces older notifications to reduce spam pileup
      
      // Interactive Buttons
      actions: [
        { action: "open", title: "⚡ Execute Trade" },
        { action: "close", title: "Dismiss" }
      ]
    });

    // ===========================================
    // SCENARIO A: SINGLE TARGET (Testing)
    // ===========================================
    if (targetUserId) {
        console.log(`[TEST] Searching for User: ${targetUserId}`);
        
        let docSnap = await adminDb.collection("push_subscriptions").doc(targetUserId).get();
        let sourceColl = "push_subscriptions";

        // Fallback search
        if (!docSnap.exists) {
            docSnap = await adminDb.collection("users").doc(targetUserId).get();
            sourceColl = "users";
        }

        if (docSnap.exists) {
            const data = docSnap.data();
            const sub = data?.subscriptionData || data?.pushSubscription;
            
            if (sub) {
                await webpush.sendNotification(sub, pushPayload);
                return NextResponse.json({ success: true, count: 1, mode: `Single (${sourceColl})` });
            } else {
                return NextResponse.json({ error: "User found but no Push Token saved." }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "User ID not found in database." }, { status: 404 });
    }

    // ===========================================
    // SCENARIO B: BROADCAST ALL (The Main Event)
    // ===========================================
    if (sendToAll) {
        console.log("📢 STARTING GLOBAL BROADCAST...");

        // 1. TELEGRAM BOT (Parallel Fire)
        const telegramPromise = sendToTelegram(title, message, url);

        // 2. DISCORD WEBHOOK (Optional - uncomment if enabled)
        // const discordPromise = sendToDiscord(title, message, url);

        // 3. WEB PUSH BLAST (Iterate All Users)
        const pushPromise = (async () => {
            const snapshot = await adminDb.collection('push_subscriptions').get();
            if (snapshot.empty) return 0;

            console.log(`Sending to ${snapshot.size} Push Subscribers...`);

            // Send in parallel (Map -> Promise.all)
            const sendTasks = snapshot.docs.map(async (doc) => {
                const sub = doc.data().subscriptionData || doc.data().pushSubscription; 
                if (sub) {
                    // Try to send. If 410 Gone/404, clean up database
                    return webpush.sendNotification(sub, pushPayload)
                       .catch(err => {
                           if (err.statusCode === 410 || err.statusCode === 404) {
                               console.log(`Cleanup dead user: ${doc.id}`);
                               return doc.ref.delete(); 
                           }
                           return null;
                       });
                }
            });

            await Promise.all(sendTasks);
            return snapshot.size;
        })();

        // Wait for all channels
        // await Promise.all([telegramPromise, discordPromise, pushPromise]); // Use this line if Discord enabled
        await Promise.all([telegramPromise, pushPromise]);
        
        return NextResponse.json({ success: true, mode: 'Omni-Channel Broadcast' });
    }

    return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}