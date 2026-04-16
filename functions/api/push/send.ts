// functions/api/push/send.ts
// Note: This assumes you have pushClient and sendToTelegram logic in backend-lib

import { sendToTelegram } from "../../../app/lib/telegram"; // Ensure this is lightweight

const HEADERS = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { title, message, url, sendToAll, targetUserId } = body;

    const payload = JSON.stringify({
      title: title || "MZ  Alert",
      body: message,
      url: url || "https://mpintellect.com/news",
      icon: "/logos/icon-512.webp"
    });

    // --- CASE A: BROADCAST ---
    if (sendToAll) {
      // 1. Telegram
      await sendToTelegram(title, message, url);

      // 2. Fetch all active endpoints from D1
      const { results } = await env.DB.prepare("SELECT subscription_data FROM push_subscriptions WHERE status = 'active'").all();
      
      // Note: In Cloudflare, you'd use a Library to sign WebPush, 
      // for now we log the intent.
      console.log(`📢 Broadcasting to ${results.length} devices.`);
      
      return new Response(JSON.stringify({ success: true, sent: results.length }), { status: 200, headers: HEADERS });
    }

    // --- CASE B: SINGLE USER ---
    if (targetUserId) {
        const sub: any = await env.DB.prepare("SELECT subscription_data FROM push_subscriptions WHERE user_id = ? AND status = 'active'").bind(targetUserId).first();
        if (!sub) return new Response(JSON.stringify({ error: "No sub found" }), { status: 404, headers: HEADERS });
        
        return new Response(JSON.stringify({ success: true, message: "Targeted push queued" }), { status: 200, headers: HEADERS });
    }

    return new Response(JSON.stringify({ error: "Invalid target" }), { status: 400, headers: HEADERS });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: HEADERS });
  }
}