// functions/api/ads/warmup.ts
export async function onRequestGet(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  // 1. Security Check
  if (url.searchParams.get("key") !== env.ADMIN_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const symbol = url.searchParams.get("symbol");
  const style = url.searchParams.get("style");
  const type = url.searchParams.get("type");
  const size = url.searchParams.get("size");

  if (!symbol || !style || !type || !size) {
    return new Response("Missing parameters", { status: 400 });
  }

  // 2. Calculate current version locally
  const version = Math.floor(Date.now() / (12 * 3600000));

  // 3. Construct the Render URL
  const renderUrl = `${url.origin}/api/ads/render?symbol=${symbol}&style=${style}&type=${type}&size=${size}&v=${version}`;
  
  console.log(`🎬 Requesting bake: ${symbol}-${type}-${size}`);

  try {
    // ⚠️ CRITICAL: We AWAIT the fetch. 
    // This worker will stay "Busy" until render.ts finishes Puppeteer and R2.
    const res = await fetch(renderUrl);
    const resultText = await res.text();

    if (!res.ok) throw new Error(`Render failed: ${resultText}`);

    return new Response(`SUCCESS: ${symbol}-${type}-${size} baked for v${version}`);
  } catch (e: any) {
    console.error(`❌ Warmup Error: ${e.message}`);
    return new Response(`ERROR: ${e.message}`, { status: 500 });
  }
}