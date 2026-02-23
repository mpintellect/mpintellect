export default {
  // 1. Fixed 'ctx' name here
  async scheduled(_event: any, env: any, ctx: any) {
    // Now 'ctx' matches the name above
    ctx.waitUntil(this.processQueue(env));
  },

  // 2. Fixed 'ctx' name here as well
  async fetch(_request: any, env: any, ctx: any) {
    // Using ctx.waitUntil is safer for background tasks in fetch too
    ctx.waitUntil(this.processQueue(env));
    
    return new Response("🚀 MZ Queue Processor: Batch started...", {
      headers: { "Content-Type": "text/plain" }
    });
  },

  async processQueue(env: any) {
    const ADMIN_KEY = "MZprimer2026";
    const BASE_URL = "https://mzprimer.com";

    // 1. Get ONE symbol batch from the database
    const task: any = await env.DB.prepare(
      "SELECT * FROM ad_queue WHERE status = 'pending' ORDER BY id ASC LIMIT 1"
    ).first();

    if (!task) {
      console.log("💤 Queue empty. No tasks to process.");
      return;
    }

    // 2. Loop through the 3 sizes for this symbol
    const sizes = ["standard", "square", "portrait"];
    
    // ✅ LOGIC FIX: We use 'size' from the array below
    for (const size of sizes) {
      console.log(`🎨 Baking: ${task.symbol}-${task.type}-${size}`); // Using 'size', not 'task.size'

      const url = `${BASE_URL}/api/ads/render?key=${ADMIN_KEY}&symbol=${task.symbol}&type=${task.type}&style=${task.style}&size=${size}`;
      
      try {
        const res = await fetch(url);
        if (res.ok) {
          console.log(`✅ Success: ${task.symbol}-${size}`);
        } else {
          // If the website returns 500, we see it here
          const errorText = await res.text();
          console.error(`❌ Website Error for ${size}: ${res.status} - ${errorText}`);
        }
      } catch (e: any) {
        console.error(`💥 Connection failure: ${e.message}`);
      }
    }

    // 3. Mark the Symbol as finished
    await env.DB.prepare("UPDATE ad_queue SET status = 'completed' WHERE id = ?")
      .bind(task.id)
      .run();

    // 4. Check if we are finished
    const remaining: any = await env.DB.prepare("SELECT COUNT(*) as count FROM ad_queue WHERE status = 'pending'").first();
    if (remaining.count === 0) {
      console.log("🎊 Project Finished. Activating version.");
      await fetch(`${BASE_URL}/api/ads/activate-version?key=${ADMIN_KEY}`);
      await env.DB.prepare("DELETE FROM ad_queue WHERE status = 'completed'").run();
    }
  }
};