// functions/api/telegram/preview.ts
// Same pipeline as publish.ts (chart generation, data fetch, caption/button
// building via the shared backend-lib/telegram-post.ts) but stops before the
// Telegram send - returns what WOULD be posted instead of posting it. Used
// by app/test/page.tsx to preview a signal post without touching the live
// channel. No ADMIN auth gate (matches render-chart.ts, which this calls and
// which is itself unauthenticated) and no write side effects of its own -
// render-chart.ts does still write a fresh chart image to R2 as a normal
// part of chart generation, same as a real publish would.

import { generateCaptionFromData, buildSignalButtons, extractSignalFields } from '../../../backend-lib/telegram-post';

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'XAUUSD';

  try {
    const chartApiUrl = `https://mpintellect.com/api/ads/render-chart?symbol=${symbol}&refresh=true`;
    const chartRes = await fetch(chartApiUrl);
    if (!chartRes.ok) {
      throw new Error(`Chart generation failed: ${chartRes.status}`);
    }
    const imageUrl = chartRes.headers.get('X-Image-Url') || `https://news.mpintellect.com/${symbol}.png`;

    const dataUrl = `https://data.mpintellect.com/D1_output_${symbol}.json`;
    const dataRes = await fetch(dataUrl);
    const data = await dataRes.json();

    const caption = generateCaptionFromData(data, symbol);
    const buttons = buildSignalButtons(symbol);
    const fields = extractSignalFields(data, symbol);

    return new Response(JSON.stringify({
      success: true,
      preview: true, // never sent to Telegram
      symbol,
      imageUrl,
      caption,
      buttons,
      fields, // raw values behind the caption, for building alternative style mockups client-side
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
