// functions/api/ads/warmup.ts
import { AD_SYMBOLS } from "../../../backend-lib/ad-config";

export async function onRequestGet(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  // 1. Check Security Key
  const key = url.searchParams.get("key");
  if (key !== env.ADMIN_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Versioning (12h cycle)
  const version = Math.floor(Date.now() / (12 * 3600000));
  const styles = ['black', 'cyber'];
  const sizes = ['square', 'standard', 'portrait'];
  const types = ['propfirm', 'chat', 'update', 'volatility'];

  console.log(`🚀 GitHub Trigger: Starting Warmup for v${version}`);

  // 3. Background Loop
  context.waitUntil((async () => {
    for (const sym of AD_SYMBOLS) {
      for (const style of styles) {
        for (const type of types) {
          for (const size of sizes) {
            const renderUrl = `${url.origin}/api/ads/render?symbol=${sym.id}&style=${style}&type=${type}&size=${size}&v=${version}`;
            try {
              // This triggers the save-to-R2 logic in render.ts
              await fetch(renderUrl);
              // Wait 800ms between each to keep browser rendering stable
              await new Promise(r => setTimeout(r, 800)); 
            } catch (e) {
              console.error(`Error warming ${sym.id}:`, e);
            }
          }
        }
      }
    }
    console.log("🏁 Warmup Complete: All images are in R2.");
  })());

  return new Response("Warmup Initiated");
}