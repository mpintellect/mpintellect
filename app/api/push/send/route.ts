// app/api/push/send/route.ts - CLOUDFLARE VERSION
import { NextResponse } from "next/server";
import webpush from "web-push";
import { getDb, query, execute } from "@/app/lib/cloudflare/db-simple";
import { sendToTelegram } from "@/app/lib/telegram";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. SETUP & VALIDATE KEYS
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@mzprimer.com";
    
    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error("VAPID Keys missing. Web Push disabled.");
      return NextResponse.json({ 
        error: "Push notifications not configured" 
      }, { status: 500 });
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    const body = await req.json();
    const { 
      title, 
      message, 
      url, 
      sendToAll, 
      targetUserId,
      type = 'trade_signal',
      icon = "/logos/mzlogo.webp",
      badge = "/logos/mzlogo.webp",
      tag = "trade-signal"
    } = body;

    // --- PAYLOAD FORMATTER ---
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
      icon: icon,
      badge: badge,
      vibrate: [200, 100, 200],
      tag: tag,
      
      // Interactive Buttons
      actions: [
        { action: "open", title: "⚡ Execute Trade" },
        { action: "close", title: "Dismiss" }
      ],
      
      // Additional data
      timestamp: Date.now(),
      type: type
    });

    // ===========================================
    // SCENARIO A: SINGLE TARGET (Testing)
    // ===========================================
    if (targetUserId && !sendToAll) {
        console.log(`[TEST] Searching for User: ${targetUserId}`);
        
        // Look for user's push subscriptions
        const subscriptions = await query<{
          endpoint: string;
          subscription_data: string;
          status: string;
        }>(
          'SELECT endpoint, subscription_data, status FROM push_subscriptions WHERE user_id = ? AND status = "active"',
          [targetUserId]
        );

        if (subscriptions.length > 0) {
          const sendPromises = subscriptions.map(async (sub) => {
            try {
              const subscription = JSON.parse(sub.subscription_data);
              await webpush.sendNotification(subscription, pushPayload);
              return { success: true, endpoint: sub.endpoint };
            } catch (error: any) {
              console.error(`Failed to send to ${sub.endpoint}:`, error);
              
              // If subscription is invalid, mark as inactive
              if (error.statusCode === 410 || error.statusCode === 404) {
                await execute(
                  'UPDATE push_subscriptions SET status = "inactive" WHERE endpoint = ?',
                  [sub.endpoint]
                );
              }
              return { success: false, endpoint: sub.endpoint, error: error.message };
            }
          });

          const results = await Promise.all(sendPromises);
          const successful = results.filter(r => r.success).length;
          
          return NextResponse.json({ 
            success: true, 
            count: successful,
            total: subscriptions.length,
            results,
            mode: 'Single User'
          });
        }
        
        return NextResponse.json({ 
          error: "User ID not found or no active subscriptions",
          userId: targetUserId
        }, { status: 404 });
    }

    // ===========================================
    // SCENARIO B: BROADCAST ALL (The Main Event)
    // ===========================================
    if (sendToAll) {
        console.log("📢 STARTING GLOBAL BROADCAST...");

        // 1. TELEGRAM BOT (Parallel Fire)
        const telegramPromise = sendToTelegram(title, enrichedBody, url);

        // 2. DISCORD WEBHOOK (Optional)
        // const discordPromise = sendToDiscord(title, message, url);

        // 3. WEB PUSH BLAST (Iterate All Users)
        const pushPromise = (async () => {
            const subscriptions = await query<{
              id: number;
              endpoint: string;
              subscription_data: string;
              user_id: string;
              email: string;
            }>('SELECT * FROM push_subscriptions WHERE status = "active"');
            
            if (subscriptions.length === 0) {
              console.log("No active push subscriptions found");
              return 0;
            }

            console.log(`Sending to ${subscriptions.length} Push Subscribers...`);

            // Send in parallel
            const sendTasks = subscriptions.map(async (sub) => {
              try {
                const subscription = JSON.parse(sub.subscription_data);
                await webpush.sendNotification(subscription, pushPayload);
                
                // Log the notification
                await execute(`
                  INSERT INTO push_notifications_log 
                  (subscription_id, user_id, email, title, body, sent_at, status)
                  VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                  sub.id,
                  sub.user_id,
                  sub.email,
                  title,
                  enrichedBody,
                  Date.now(),
                  'sent'
                ]);
                
                return { success: true, endpoint: sub.endpoint };
              } catch (error: any) {
                console.error(`Failed to send to ${sub.endpoint}:`, error);
                
                // Mark invalid subscriptions as inactive
                if (error.statusCode === 410 || error.statusCode === 404) {
                  await execute(
                    'UPDATE push_subscriptions SET status = "inactive" WHERE id = ?',
                    [sub.id]
                  );
                }
                
                // Log the failure
                await execute(`
                  INSERT INTO push_notifications_log 
                  (subscription_id, user_id, email, title, body, sent_at, status, error)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                  sub.id,
                  sub.user_id,
                  sub.email,
                  title,
                  enrichedBody,
                  Date.now(),
                  'failed',
                  error.message
                ]);
                
                return { success: false, endpoint: sub.endpoint, error: error.message };
              }
            });

            const results = await Promise.all(sendTasks);
            const successful = results.filter(r => r.success).length;
            
            console.log(`📊 Push Broadcast Complete: ${successful}/${subscriptions.length} successful`);
            
            return successful;
        })();

        // Wait for all channels
        const [telegramResult, pushCount] = await Promise.all([
          telegramPromise,
          pushPromise
        ]);

        return NextResponse.json({ 
          success: true, 
          mode: 'Omni-Channel Broadcast',
          stats: {
            push: {
              sent: pushCount,
              total: 0 // We'll need to query to get total
            },
            telegram: telegramResult,
            timestamp: new Date().toISOString()
          }
        });
    }

    return NextResponse.json({ error: "Bad Request: Specify targetUserId or sendToAll=true" }, { status: 400 });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}