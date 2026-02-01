// app/api/push/send/route.ts - UPDATED FOR WORKER
import { NextResponse } from "next/server";
import { getDB, query } from "../../../../landing/backend-lib/db-simple";
import { sendToTelegram } from "../../../../landing/app/lib/telegram";
import { pushClient } from "../../../../landing/app/lib/cloudflare/push-client";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
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

    const notification = {
      title: title?.startsWith("🚀") ? title : `🚀 ${title || "Market Update"}`,
      body: enrichedBody,
      url: url || "https://mzprimer.com",
      icon: icon,
      badge: badge,
      tag: tag,
      data: {
        type: type,
        timestamp: Date.now(),
      },
      actions: [
        { action: "open", title: "⚡ Execute Trade" },
        { action: "close", title: "Dismiss" }
      ],
    };

    // ===========================================
    // SCENARIO A: SINGLE TARGET (Testing)
    // ===========================================
    if (targetUserId && !sendToAll) {
        console.log(`[TEST] Searching for User: ${targetUserId}`);
        
        // Get user's subscription
        const subscriptions = await query<{
          endpoint: string;
          subscription_data: string;
          status: string;
        }>(
          'SELECT endpoint, subscription_data, status FROM push_subscriptions WHERE user_id = ? AND status = "active"',
          [targetUserId]
        );

        if (subscriptions.length > 0) {
          const results = await Promise.all(
            subscriptions.map(async (sub) => {
              try {
                const subscription = JSON.parse(sub.subscription_data);
                const success = await pushClient.sendNotification(subscription, notification);
                return { success, endpoint: sub.endpoint };
              } catch (error: any) {
                console.error(`Failed to send to ${sub.endpoint}:`, error);
                return { success: false, endpoint: sub.endpoint, error: error.message };
              }
            })
          );

          const successful = results.filter(r => r.success).length;
          
          return Response.json({ 
            success: true, 
            count: successful,
            total: subscriptions.length,
            results,
            mode: 'Single User'
          });
        }
        
        return Response.json({ 
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

        // 2. WEB PUSH BROADCAST via Cloudflare Worker
        const pushPromise = pushClient.broadcast(notification);

        // Wait for all channels
        const [telegramResult, pushResult] = await Promise.all([
          telegramPromise,
          pushPromise
        ]);

        return Response.json({ 
          success: pushResult.success,
          mode: 'Omni-Channel Broadcast',
          stats: {
            push: pushResult.stats,
            telegram: telegramResult,
            timestamp: new Date().toISOString()
          },
          ...(pushResult.error && { error: pushResult.error })
        });
    }

    return Response.json({ error: "Bad Request: Specify targetUserId or sendToAll=true" }, { status: 400 });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return Response.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}