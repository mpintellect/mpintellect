// mz-ad-scheduler (Processor)
export default {
  async scheduled(_event: any, env: any, ctx: any) {
    ctx.waitUntil(this.processQueue(env));
  },

  async fetch(_request: any, env: any, ctx: any) {
    ctx.waitUntil(this.processQueue(env));
    return new Response("🚀 Processing next image...");
  },

  async processQueue(env: any) {
    const ADMIN_KEY = "MZprimer2026";
    const BASE_URL = "https://mzprimer.com";

    const task: any = await env.DB.prepare(
      "SELECT * FROM ad_queue WHERE status = 'pending' ORDER BY id ASC LIMIT 1"
    ).first();

    if (!task) {
      const { count }: any = await env.DB.prepare("SELECT COUNT(*) as count FROM ad_queue WHERE status = 'completed'").first();
      if (count > 0) {
        await fetch(`${BASE_URL}/api/ads/activate-version?key=${ADMIN_KEY}`);
        await env.DB.prepare("DELETE FROM ad_queue WHERE status = 'completed'").run();
      }
      return;
    }

    const url = `${BASE_URL}/api/ads/render?key=${ADMIN_KEY}&symbol=${task.symbol}&type=${task.type}&style=${task.style}&size=${task.size}`;
    
    try {
      console.log(`🎨 Baking: ${task.symbol}-${task.type}-${task.size}`);
      const res = await fetch(url);
      if (res.ok) {
        await env.DB.prepare("UPDATE ad_queue SET status = 'completed' WHERE id = ?").bind(task.id).run();
      }
    } catch (e: any) {
      console.error(`❌ Failed: ${task.symbol}`, e.message);
    }
  }
};