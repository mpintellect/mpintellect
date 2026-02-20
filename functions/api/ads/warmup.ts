import { AD_SYMBOLS } from "../../../backend-lib/ad-config";

export async function onRequestGet(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  // 1. Setup the same parameters as the catalog
  const version = Math.floor(Date.now() / (12 * 3600000));
  const styles = ['black', 'cyber'];
  const sizes = ['standard', 'square', 'portrait'];
  const types = ['propfirm', 'chat', 'update', 'volatility'];

  console.log(`🔥 Starting Warmup for Version: ${version}`);

  // 2. We use a background task so the request doesn't timeout
  context.waitUntil((async () => {
    for (const sym of AD_SYMBOLS) {
      for (const style of styles) {
        for (const type of types) {
          for (const size of sizes) {
            const renderUrl = `https://mzprimer.com/api/ads/render?symbol=${sym.id}&style=${style}&type=${type}&size=${size}&v=${version}`;
            
            try {
              // We call our own API. 
              // If image exists in R2, it returns in 50ms.
              // If not, it triggers Puppeteer and saves it.
              await fetch(renderUrl); 
              console.log(`✅ Warmed: ${sym.id}-${style}-${type}-${size}`);
              
              // ⏱️ Crucial: Pause for 500ms between renders 
              // to avoid hitting Puppeteer concurrency limits
              await new Promise(r => setTimeout(r, 500)); 
            } catch (e) {
              console.error(`❌ Failed to warm: ${renderUrl}`);
            }
          }
        }
      }
    }
    console.log("🏁 Warmup Sequence Complete");
  })());

  return new Response(JSON.stringify({ message: "Warmup initiated in background" }), {
    headers: { "Content-Type": "application/json" }
  });
}