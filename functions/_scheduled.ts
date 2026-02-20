export async function onScheduled(event: any, env: any, ctx: any) {
  console.log("⏰ MZ Intelligence: Starting Scheduled Ad Warmup...");
  
  // This triggers the warmup script we talked about
  // It ensures all images are "baked" and ready in R2 1 hour before Google/FB arrive
  const warmupUrl = "https://mzprimer.com/api/ads/warmup";
  
  ctx.waitUntil(
    fetch(warmupUrl)
      .then(res => console.log("✅ Warmup triggered successfully"))
      .catch(err => console.error("❌ Warmup trigger failed:", err))
  );
}