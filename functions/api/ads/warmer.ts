// functions/api/ads/warmup.ts
import { AD_SYMBOLS } from "../../../backend-lib/ad-config";

export async function onRequestGet(context: any) {
  const { env, request } = context;
  if (new URL(request.url).searchParams.get("key") !== env.ADMIN_KEY) return new Response("Unauthorized", { status: 401 });

  try {
    await env.DB.prepare("DELETE FROM ad_queue").run();
    const types = ["test", "update", "chat"];
    const statements = [];

    for (const sym of AD_SYMBOLS) {
      for (const type of types) {
        // chat gets black & cyber, others get black only
        const styles = (type === 'chat') ? ['black', 'cyber'] : ['black'];
        for (const style of styles) {
          // ✅ FIX: We do NOT loop through sizes here. 
          // One row = One Symbol/Type/Style Batch.
          statements.push(
            env.DB.prepare("INSERT INTO ad_queue (symbol, type, style, status) VALUES (?, ?, ?, 'pending')")
              .bind(sym.id, type, style)
          );
        }
      }
    }

    await env.DB.batch(statements);
    return new Response(JSON.stringify({ success: true, batches: statements.length }), { headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}