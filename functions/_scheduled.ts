// functions/_scheduled.ts

export const onScheduled = async (params: any) => {
  const { env, waitUntil } = params;
  
  console.log("⏰ MZ Intelligence: Cron Triggered for Ad Warmup");

  // Logic to calculate current 12h version
  const version = Math.floor(Date.now() / (12 * 3600000));
  
  // Base URL of your production site
  const baseUrl = "https://mzprimer.com";

  // Use the ADMIN_KEY from your Cloudflare Variables
  const authKey = env.ADMIN_KEY;

  // Trigger the warmup process
  const warmupUrl = `${baseUrl}/api/ads/warmup?key=${authKey}&v=${version}`;
  
  console.log(`🔗 Dispatching Warmup request to: ${warmupUrl}`);

  // Use waitUntil to ensure the fetch finishes before the worker goes to sleep
  waitUntil(
    fetch(warmupUrl)
      .then(async (r) => {
        const text = await r.text();
        console.log("✅ Warmup Response:", text);
      })
      .catch((e) => {
        console.error("❌ Warmup Dispatch Failed:", e.message);
      })
  );
};