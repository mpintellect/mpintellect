/**
 * MZ AD SCHEDULER (Batch Processor)
 * TypeScript Clean Version
 */

export default {
  // We use _ to tell TypeScript 'event' is intentionally ignored
  async scheduled(_event: any, env: any, ctx: any) {
    // We pass 'env' to the logic function
    ctx.waitUntil(this.processQueue(env));
  },

  // Added types to parameters to fix ts(7006)
  async fetch(_request: any, env: any, _ctx: any) {
    await this.processQueue(env);
    return new Response("🚀 MZ Queue: Processing 1 symbol batch (3 sizes)...", {
      headers: { "Content-Type": "text/plain" }
    });
  },

  async processQueue(env: any) {
    const ADMIN_KEY = "MZprimer2026";
    const BASE_URL = "https://mzprimer.com";

    // 1. Get the next Symbol/Type batch from the queue
    const task: any = await env.DB.prepare(
      "SELECT * FROM ad_queue WHERE status = 'pending' ORDER BY id ASC LIMIT 1"
    ).first();

    if (!task) {
      console.log("💤 No pending tasks found.");
      return;
    }

    // 2. We loop through all 3 sizes for this one symbol
    // This is the most efficient way to use your 10-minute daily limit
    const sizes = ["standard", "square", "portrait"];
    
    console.log(`🔥 Starting Batch for: ${task.symbol} (${task.type})`);

    for (const size of sizes) {
      const url = `${BASE_URL}/api/ads/render?key=${ADMIN_KEY}&symbol=${task.symbol}&type=${task.type}&style=${task.style}&size=${size}`;
      
      try {
        // We await each size so they don't overlap
        const res = await fetch(url);
        console.log(`✅ ${task.symbol}-${size}: ${res.status}`);
      } catch (e: any) {
        console.error(`❌ Render failed for ${size}:`, e.message);
      }
    }

    // 3. Mark the Symbol/Type batch as finished
    await env.DB.prepare("UPDATE ad_queue SET status = 'completed' WHERE id = ?")
      .bind(task.id)
      .run();

    // 4. Check if the whole project is finished
    const remaining: any = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM ad_queue WHERE status = 'pending'"
    ).first();

    if (remaining && remaining.count === 0) {
      console.log("🎊 QUEUE COMPLETE. Activating live version.");
      await fetch(`${BASE_URL}/api/ads/activate-version?key=${ADMIN_KEY}`);
      // Clean up the queue for the next 12-hour cycle
      await env.DB.prepare("DELETE FROM ad_queue WHERE status = 'completed'").run();
    } else {
      console.log(`⏳ ${remaining?.count || 0} batches remaining in queue.`);
    }
  }
};