// functions/api/ads/render-chart.ts

import puppeteer from "@cloudflare/puppeteer";

interface R2Object {
  key: string;
  uploaded: Date;
}

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);

  const symbol = searchParams.get("symbol") || "XAUUSD";
  const refresh = searchParams.get("refresh") === "true";

  if (!symbol) return new Response("Missing Symbol", { status: 400 });

  let browser: any;
  let generatedImageUrl = "";

  try {
    // Fetch chart data
    const chartDataUrl = `https://data.mpintellect.com/D1_output_${symbol}.json`;
    console.log(`📊 Fetching chart data for ${symbol}`);
    
    const chartDataRes = await fetch(chartDataUrl);
    if (!chartDataRes.ok) {
      throw new Error(`Failed to fetch chart data: ${chartDataRes.status}`);
    }
    const chartData = await chartDataRes.json();

    // Generate clean HTML (chart only)
    const html = generateChartOnlyHTML(chartData, symbol);

    // Render PNG
    browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 700 });
    await page.setContent(html);
    await page.waitForNetworkIdle({ timeout: 3000 });
    
    const screenshot = await page.screenshot({ type: 'png' });
    await browser.close();
    browser = null;
    
    // ============================================
    // SAVE WITH TIMESTAMP + CLEANUP OLD IMAGES
    // ============================================
    const timestamp = Date.now();
    const filename = `${symbol}_${timestamp}.png`;
    generatedImageUrl = `https://news.mpintellect.com/${filename}`;

    console.log(`🔍 Saving new image: ${filename}`);

    if (env.ASSETS_STORAGE) {
      // Save new image with timestamp
      await env.ASSETS_STORAGE.put(filename, screenshot, { 
        httpMetadata: { contentType: "image/png" } 
      });
      console.log(`✅ Saved: ${filename}`);
      
      // ============================================
      // CLEANUP: Delete old images (keep only last 2)
      // ============================================
      const list = await env.ASSETS_STORAGE.list({ prefix: `${symbol}_` });
      const files = list.objects
        .filter((obj: R2Object) => obj.key !== filename)
        .sort((a: R2Object, b: R2Object) => {
          const dateA = new Date(a.uploaded).getTime();
          const dateB = new Date(b.uploaded).getTime();
          return dateB - dateA;
        });
      
      // Keep only the 2 most recent, delete the rest
      const toDelete = files.slice(2);
      for (const file of toDelete) {
        await env.ASSETS_STORAGE.delete(file.key);
        console.log(`🗑️ Deleted old image: ${file.key}`);
      }
      
      console.log(`📊 ${symbol}: ${Math.min(files.length, 2)} images kept, ${toDelete.length} deleted`);
    } else {
      console.error(`❌ ASSETS_STORAGE binding is NOT available!`);
    }

    // Return the image with the new URL in headers
    return new Response(screenshot, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Image-Url": generatedImageUrl,
      }
    });

  } catch (e: any) {
    console.error("Render Error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (err) {
        // Ignore
      }
    }
  }
}

// ============================================================
// CHART-ONLY HTML GENERATOR
// ============================================================
function generateChartOnlyHTML(chartData: any, symbol: string): string {
  const chartHTML = generatePureChartHTML(chartData, symbol);
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      background: #0a0a15; 
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  ${chartHTML}
</body>
</html>`;
}

// ============================================================
// PURE CHART HTML (Candles, grid, levels, forecast zone)
// ============================================================
function generatePureChartHTML(chartData: any, symbol: string): string {
  if (!chartData?.candles?.data?.length) {
    return `<div style="background: #0a0a15; border-radius: 16px; padding: 40px; text-align: center; color: #666;">📊 Chart data unavailable</div>`;
  }

  const candles = chartData.candles.data;
  const chart = chartData.chart;
  const pivot = chartData.pivot || {};
  const prediction = chartData.prediction;
  
  // Symbol decimal config
  const decimals = symbol === "XAUUSD" ? 2 : symbol === "BTCUSD" ? 1 : symbol === "USDJPY" ? 3 : 5;
  
  function formatPrice(price: number): string {
    return price?.toFixed(decimals) || 'N/A';
  }
  
  // Chart dimensions
  const width = 860;
  const height = 520;
  const paddingLeft = 60;
  const paddingRight = 80;
  const paddingTop = 20;
  const paddingBottom = 40;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const visibleCandles = candles.slice(-45);
  const candleWidth = Math.max(4, Math.min(8, chartWidth / visibleCandles.length - 2));
  const spacing = candleWidth + 2;
  const chartStartX = paddingLeft;
  
  // Calculate price range
  let minPrice = Infinity, maxPrice = -Infinity;
  for (const c of visibleCandles) {
    minPrice = Math.min(minPrice, c.low);
    maxPrice = Math.max(maxPrice, c.high);
  }
  minPrice = Math.min(minPrice, chart.current_price);
  maxPrice = Math.max(maxPrice, chart.current_price);
  if (pivot.level) {
    if (pivot.level < minPrice) minPrice = pivot.level;
    if (pivot.level > maxPrice) maxPrice = pivot.level;
  }
  
  // Also include take profit in range if needed
  const takeProfitFromData = chartData.tp_sl?.tp_level || chartData.pending_orders?.primary_order?.tp_price;
  if (takeProfitFromData) {
    if (takeProfitFromData < minPrice) minPrice = takeProfitFromData;
    if (takeProfitFromData > maxPrice) maxPrice = takeProfitFromData;
  }
  
  const range = maxPrice - minPrice;
  const padding = range * 0.1;
  minPrice -= padding;
  maxPrice += padding;
  const priceRange = maxPrice - minPrice;
  
  function getY(price: number): number {
    if (price === undefined || price === null) return paddingTop + chartHeight / 2;
    return paddingTop + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  }
  
  // Generate candles
  let candlesSVG = '';
  for (let i = 0; i < visibleCandles.length; i++) {
    const candle = visibleCandles[i];
    const x = chartStartX + (i * spacing);
    const open = getY(candle.open);
    const close = getY(candle.close);
    const high = getY(candle.high);
    const low = getY(candle.low);
    const isBullish = candle.close > candle.open;
    const color = isBullish ? '#10B981' : '#EF4444';
    const bodyTop = Math.min(open, close);
    const bodyHeight = Math.max(1, Math.abs(close - open));
    
    candlesSVG += `
      <line x1="${x + candleWidth/2}" y1="${high}" x2="${x + candleWidth/2}" y2="${low}" stroke="${color}" stroke-width="1.5"/>
      <rect x="${x}" y="${bodyTop}" width="${candleWidth}" height="${bodyHeight}" fill="${color}" opacity="0.9" rx="1"/>
    `;
  }
  
  // Generate grid lines
  let gridSVG = '';
  const gridLines = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const axisX = width - paddingRight + 10;
  
  for (const percent of gridLines) {
    const y = paddingTop + (percent / 100) * chartHeight;
    const price = maxPrice - (percent / 100) * priceRange;
    gridSVG += `
      <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="#1f3a4a" stroke-width="0.5" stroke-dasharray="3,3"/>
      <text x="${axisX}" y="${y + 4}" fill="#94a3b8" font-size="10" font-family="monospace">${price.toFixed(decimals)}</text>
    `;
  }
  
  // Current price line
  const currentPriceY = getY(chart.current_price);
  gridSVG += `
    <line x1="${paddingLeft}" y1="${currentPriceY}" x2="${width - paddingRight}" y2="${currentPriceY}" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="4,4"/>
    <rect x="${axisX}" y="${currentPriceY - 8}" width="55" height="16" rx="3" fill="#D4AF37"/>
    <text x="${axisX + 27}" y="${currentPriceY + 3}" fill="#000" font-size="9" font-weight="bold" text-anchor="middle">${formatPrice(chart.current_price)}</text>
  `;
  
  // Pivot line
  if (pivot.level) {
    const pivotY = getY(pivot.level);
    if (pivotY >= paddingTop && pivotY <= paddingTop + chartHeight) {
      gridSVG += `
        <line x1="${paddingLeft}" y1="${pivotY}" x2="${width - paddingRight}" y2="${pivotY}" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="6,4"/>
        <rect x="${axisX}" y="${pivotY - 8}" width="45" height="16" rx="3" fill="#D4AF37"/>
        <text x="${axisX + 22}" y="${pivotY + 3}" fill="#000" font-size="9" font-weight="bold" text-anchor="middle">PIVOT</text>
      `;
    }
  }
  
  // Support/Resistance lines
  if (pivot.resistance_1) {
    const r1Y = getY(pivot.resistance_1);
    if (r1Y >= paddingTop && r1Y <= paddingTop + chartHeight) {
      gridSVG += `
        <line x1="${paddingLeft}" y1="${r1Y}" x2="${width - paddingRight}" y2="${r1Y}" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="4,4"/>
        <rect x="${axisX}" y="${r1Y - 8}" width="40" height="16" rx="3" fill="#EF4444" opacity="0.8"/>
        <text x="${axisX + 20}" y="${r1Y + 3}" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">R1</text>
      `;
    }
  }
  
  if (pivot.support_1) {
    const s1Y = getY(pivot.support_1);
    if (s1Y >= paddingTop && s1Y <= paddingTop + chartHeight) {
      gridSVG += `
        <line x1="${paddingLeft}" y1="${s1Y}" x2="${width - paddingRight}" y2="${s1Y}" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4,4"/>
        <rect x="${axisX}" y="${s1Y - 8}" width="40" height="16" rx="3" fill="#10B981" opacity="0.8"/>
        <text x="${axisX + 20}" y="${s1Y + 3}" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">S1</text>
      `;
    }
  }
  
  // ============================================================
  // FORECAST ZONE (Pivot to TP)
  // ============================================================
  const tpSl = chartData.tp_sl || {};
  const pendingOrders = chartData.pending_orders || {};
  const primaryOrder = pendingOrders.primary_order || {};
  
  const takeProfit = tpSl.tp_level || primaryOrder.tp_price || null;
  const startPrice = pivot.level;
  const endPrice = takeProfit;
  
  const finalDecision = chartData.final_decision || 'HOLD';
  const orderType = primaryOrder.type || '';
  
  let forecastBoxHTML = '';
  
  if (startPrice && endPrice && startPrice !== endPrice) {
    const startY = getY(startPrice);
    const endY = getY(endPrice);
    
    const isStartVisible = startY >= paddingTop - 20 && startY <= paddingTop + chartHeight + 20;
    const isEndVisible = endY >= paddingTop - 20 && endY <= paddingTop + chartHeight + 20;
    
    if (isStartVisible && isEndVisible) {
      const boxTop = Math.min(startY, endY);
      const boxBottom = Math.max(startY, endY);
      const boxHeight = boxBottom - boxTop;
      const boxColor = '#10B981';
      const isUp = endPrice > startPrice;
      const arrowSymbol = isUp ? '▲' : '▼';
      
      const lastCandleIndex = visibleCandles.length - 1;
      const lastCandleRight = chartStartX + (lastCandleIndex * spacing) + candleWidth;
      const candleSpanWidth = (spacing * 9) + candleWidth;
      const forecastBoxWidth = candleSpanWidth;
      const forecastBoxX = lastCandleRight + 5;
      
      if (boxHeight > 5 && forecastBoxX + forecastBoxWidth <= width) {
        forecastBoxHTML = `
          <rect x="${forecastBoxX}" y="${boxTop}" width="${forecastBoxWidth}" height="${boxHeight}" fill="${boxColor}" opacity="0.15" rx="4"/>
          <rect x="${forecastBoxX}" y="${boxTop}" width="${forecastBoxWidth}" height="${boxHeight}" fill="none" stroke="${boxColor}" stroke-width="1.5" stroke-dasharray="4,3" rx="4"/>
          <line x1="${forecastBoxX}" y1="${boxTop}" x2="${forecastBoxX + forecastBoxWidth}" y2="${boxTop}" stroke="${boxColor}" stroke-width="1.5" opacity="0.7"/>
          <line x1="${forecastBoxX}" y1="${boxBottom}" x2="${forecastBoxX + forecastBoxWidth}" y2="${boxBottom}" stroke="${boxColor}" stroke-width="1.5" opacity="0.7"/>
          <line x1="${forecastBoxX}" y1="${startY}" x2="${forecastBoxX + forecastBoxWidth}" y2="${startY}" stroke="${boxColor}" stroke-width="2" opacity="0.9"/>
          <line x1="${forecastBoxX}" y1="${endY}" x2="${forecastBoxX + forecastBoxWidth}" y2="${endY}" stroke="${boxColor}" stroke-width="1.5" opacity="0.7"/>
          <text x="${forecastBoxX + forecastBoxWidth/2}" y="${(startY + endY) / 2 + 5}" fill="${boxColor}" font-size="20" font-weight="bold" text-anchor="middle">${arrowSymbol}</text>
          <line x1="${lastCandleRight}" y1="${(startY + endY) / 2}" x2="${forecastBoxX}" y2="${(startY + endY) / 2}" stroke="${boxColor}" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
        `;
      }
    }
  }

  // Chart border
  gridSVG += forecastBoxHTML;
  gridSVG += `
    <rect x="${paddingLeft - 3}" y="${paddingTop - 3}" width="${chartWidth + 6}" height="${chartHeight + 6}" fill="none" stroke="#1f3a4a" stroke-width="1" rx="4"/>
  `;
  
  // Final SVG
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#0a0a15" rx="8"/>
      ${gridSVG}
      ${candlesSVG}
    </svg>
  `;
}