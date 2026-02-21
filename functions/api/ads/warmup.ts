// functions/api/ads/warmup.ts
import { AD_SYMBOLS } from "../../../backend-lib/ad-config";

export async function onRequestGet(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  const key = url.searchParams.get("key");
  if (key !== env.ADMIN_KEY) return new Response("Unauthorized", { status: 401 });

  const targetSymbol = url.searchParams.get("symbol")?.toUpperCase();
  if (!targetSymbol) return new Response("Missing symbol", { status: 400 });

  const version = Math.floor(Date.now() / (12 * 3600000));
  const types = ['test', 'chat', 'update', 'volatility'];
  const sizes = ['square', 'standard', 'portrait'];

  console.log(`🚀 Warmup: Baking 18 variants for ${targetSymbol}`);

  context.waitUntil((async () => {
    for (const type of types) {
      // ✅ LOGIC: Propfirm & Chat get both Black & Cyber. Others get Black only.
      const stylesForType = (type === 'test' || type === 'chat') ? ['black', 'cyber'] : ['black'];
      
      for (const style of stylesForType) {
        for (const size of sizes) {
          const renderUrl = `${url.origin}/api/ads/render?symbol=${targetSymbol}&style=${style}&type=${type}&size=${size}&v=${version}`;
          try {
            const res = await fetch(renderUrl);
            console.log(`✅ ${targetSymbol}-${style}-${type}-${size}: ${res.status}`);
            await new Promise(r => setTimeout(r, 800)); // Maintain stability
          } catch (e) { console.error(e); }
        }
      }
    }
    console.log(`🏁 Finished Symbol: ${targetSymbol}`);
  })());

  return new Response(`Baking started for ${targetSymbol}`);
}