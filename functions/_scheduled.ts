export default {
  async scheduled(_event: any, env: any, ctx: any) {
    ctx.waitUntil(this.handleCycle(env));
  },

  async fetch(_request: any, env: any, ctx: any) {
    ctx.waitUntil(this.handleCycle(env));
    return new Response("🚀 Autonomous Engine Check Started...");
  },

  async handleCycle(env: any) {
    const ADMIN_KEY = "MZprimer2026";
    const BASE_URL = "https://mzprimer.com";

    // 1. Check if there is an image waiting to be baked
    const task: any = await env.DB.prepare(
      "SELECT * FROM ad_queue WHERE status = 'pending' ORDER BY id ASC LIMIT 1"
    ).first();

    // 2. IF QUEUE IS EMPTY: Decide if we need to start a new 12h cycle
    if (!task) {
      const lastRun: any = await env.DB.prepare("SELECT value FROM app_settings WHERE key = 'last_refill_time'").first();
      const now = Date.now();
      const twelveHours = 12 * 60 * 60 * 1000;

      // If never run, or run > 12 hours ago
      if (!lastRun || (now - parseInt(lastRun.value)) > twelveHours) {
        console.log("⏰ 12 Hours passed. Boss is refilling the queue...");
        
        // THE BOSS CALLS THE WEBSITE TO FILL THE LIST
        await fetch(`${BASE_URL}/api/ads/create-tasks?key=${ADMIN_KEY}`);
        
        // Record the time so we don't refill again for 12 hours
        await env.DB.prepare("INSERT OR REPLACE INTO app_settings (key, value) VALUES ('last_refill_time', ?)")
          .bind(now.toString()).run();
      }
      return; // Stop here and wait for the next minute
    }

    // 3. IF QUEUE HAS WORK: Bake ONE image
    console.log(`🎨 Worker is baking: ${task.symbol}-${task.size}`);
    const url = `${BASE_URL}/api/ads/render?key=${ADMIN_KEY}&symbol=${task.symbol}&type=${task.type}&style=${task.style}&size=${task.size}`;
    
    try {
      const res = await fetch(url);
      if (res.ok) {
        // Mark as finished
        await env.DB.prepare("UPDATE ad_queue SET status = 'completed' WHERE id = ?").bind(task.id).run();
        
        // 4. CHECK IF THAT WAS THE LAST ONE
        const remaining: any = await env.DB.prepare("SELECT COUNT(*) as count FROM ad_queue WHERE status = 'pending'").first();
        if (remaining.count === 0) {
          console.log("🎊 Project Finished. Flipping the Safety Switch.");
          await fetch(`${BASE_URL}/api/ads/activate-version?key=${ADMIN_KEY}`);
          // Clear completed tasks to keep DB small
          await env.DB.prepare("DELETE FROM ad_queue WHERE status = 'completed'").run();
        }
      }
    } catch (e: any) {
      console.error("Bake failed", e.message);
    }
  }
};