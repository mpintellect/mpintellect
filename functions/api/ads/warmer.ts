import { AD_SYMBOLS } from "../../../backend-lib/ad-config";

/**
 * MZ AD WARMUP (The Task Creator)
 * Triggered by: _scheduled.ts (Cloudflare Cron)
 * Function: Fills the D1 'ad_queue' table with 72 specific tasks.
 */
export async function onRequestGet(context: any) {
  const { env, request } = context;
  const { searchParams } = new URL(request.url);

  // 1. Security Check: Matches ADMIN_KEY in your Dashboard
  const key = searchParams.get("key");
  if (key !== env.ADMIN_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    console.log("🧹 MZ Intelligence: Clearing old queue...");
    // Clear old tasks to ensure we start a fresh 12-hour cycle
    await env.DB.prepare("DELETE FROM ad_queue").run();

    const types = ["test", "update", "chat"];
    const sizes = ["standard", "square", "portrait"];
    const statements = [];

    console.log("📝 Generating Lean 72 Task List...");

    // 2. Loop through your 6 Institutional Symbols
    for (const sym of AD_SYMBOLS) {
      for (const type of types) {
        
        // STYLE LOGIC: chat gets black & cyber. Others get black only.
        const styles = (type === 'chat') ? ['black', 'cyber'] : ['black'];
        
        for (const style of styles) {
          for (const size of sizes) {
            // Add task to the batch
            statements.push(
              env.DB.prepare(
                "INSERT INTO ad_queue (symbol, type, style, size, status) VALUES (?, ?, ?, ?, 'pending')"
              ).bind(sym.id, type, style, size)
            );
          }
        }
      }
    }

    // 3. Batch execute all 72 inserts into D1
    await env.DB.batch(statements);

    console.log("✅ Queue successfully filled with 72 tasks.");

    return new Response(JSON.stringify({
      success: true,
      tasks_created: statements.length,
      message: "Ad Factory queue is ready. Scheduler will now begin processing."
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("💥 Warmup Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}