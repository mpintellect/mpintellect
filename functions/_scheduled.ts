/**
 * MZ AD SCHEDULER (Batch Processor)
 * Fixed Version: No more 'undefined' size.
 */

export default {
  async scheduled(_event: any, env: any, ctx: any) {
    ctx.waitUntil(this.processQueue(env));
  },

  async fetch(_request: any, env: any, ctx: any) {
    ctx.waitUntil(this.processQueue(env));
    return new Response("🚀 Batch processing 1 symbol...");
  },

  async processQueue(env: any) {
    const ADMIN_KEY = "MZprimer2026";
    const BASE_URL = "https://mzprimer.com";

    // 1. Get ONE symbol batch
    const task: any = await env.DB.prepare(
      "SELECT * FROM ad_queue WHERE status = 'pending' ORDER BY id ASC LIMIT 1"
    ).first();

    if (!task) {
      console.log("💤 Queue empty.");
      return;
    }

    // 2. The List of sizes we want to create for this symbol
    const targetSizes = ["standard", "square", "portrait"];
    
    console.log(`🔥 Starting Batch: ${task.symbol} (${task.type})`);

    for (const currentSize of targetSizes) {
      // ✅ THE FIX: Use 'currentSize' (from our list), NOT 'task.size'
      const url = `${BASE_URL}/api/ads/render?key=${ADMIN_KEY}&symbol=${task.symbol}&type=${task.type}&style=${task.style}&size=${currentSize}`;
      
      try {
        console.log(`🎨 Requesting: ${task.symbol}-${task.type}-${currentSize}`);
        
        // We await so we only open ONE browser at a time
        const res = await fetch(url);
        
        if (res.ok) {
          console.log(`✅ Success: ${currentSize}`);
        } else {
          const errText = await res.text();
          console.error(`❌ Error (${res.status}): ${errText}`);
        }
      } catch (e: any) {
        console.error(`💥 Connection failure: ${e.message}`);
      }
    }

    // 3. Mark the batch as done
    await env.DB.prepare("UPDATE ad_queue SET status = 'completed' WHERE id = ?")
      .bind(task.id)
      .run();

    // 4. Check for project completion
    const remaining: any = await env.DB.prepare("SELECT COUNT(*) as count FROM ad_queue WHERE status = 'pending'").first();
    if (remaining.count === 0) {
      console.log("🎊 Project Finished.");
      await fetch(`${BASE_URL}/api/ads/activate-version?key=${ADMIN_KEY}`);
      await env.DB.prepare("DELETE FROM ad_queue WHERE status = 'completed'").run();
    }
  }
};