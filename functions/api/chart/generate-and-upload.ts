// functions/api/chart/generate-and-upload.ts

import puppeteer from "@cloudflare/puppeteer";

// ============================================================
// HELPER: Fetch image from URL and return as Base64
// ============================================================
async function fetchImageAsBase64(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const buffer = await res.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const type = url.endsWith('.png') ? 'image/png' : url.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
    return `data:${type};base64,${base64}`;
  } catch (error) {
    console.error(`❌ Asset Fetch Failed [${url}]:`, error);
    return null;
  }
}

// ============================================================
// MAIN HANDLER
// ============================================================
export async function onRequestPost(context: any): Promise<Response> {
  const { request, env } = context;
  
  try {
    const { symbol } = await request.json();
    
    if (!symbol) {
      return new Response(JSON.stringify({ error: 'Symbol is required' }), { status: 400 });
    }
    
    console.log(`🎨 Starting chart generation for ${symbol}`);
    
    // STEP 1: Fetch chart data
    const chartDataUrl = `https://data.mpintellect.com/D1_output_${symbol}.json`;
    console.log(`📡 Fetching chart data: ${chartDataUrl}`);
    
    const chartDataRes = await fetch(chartDataUrl);
    if (!chartDataRes.ok) {
      throw new Error(`Failed to fetch chart data: ${chartDataRes.status}`);
    }
    const chartData = await chartDataRes.json();
    console.log(`✅ Chart data loaded`);
    
    // STEP 2: Fetch story data
    const storyDataUrl = "https://data.mpintellect.com/Story-newsH1.json";
    const storyDataRes = await fetch(storyDataUrl);
    const allStories = await storyDataRes.json();
    const storiesArray = Array.isArray(allStories) ? allStories : [allStories];
    const story = storiesArray.find((s: any) => s.symbol === symbol);
    
    // STEP 3: Fetch brand assets
    const mzLogoUrl = "https://news.mpintellect.com/mzlogo.webp";
    const partnerLogoUrl = "https://news.mpintellect.com/lfmo1.webp";
    const filename = story?.image ? (story.image.includes('.') ? story.image : `${story.image}.webp`) : "default.webp";
    const backgroundImageUrl = `https://news.mpintellect.com/${filename}`;
    
    const [mzLogo, partnerLogo, backgroundImage] = await Promise.all([
      fetchImageAsBase64(mzLogoUrl),
      fetchImageAsBase64(partnerLogoUrl),
      fetchImageAsBase64(backgroundImageUrl)
    ]);
    
    // STEP 4: Generate HTML
    const html = generateCompleteHTML(story, chartData, mzLogo, partnerLogo, backgroundImage);
    console.log(`📄 HTML generated (length: ${html.length})`);
    
    // STEP 5: Render PNG using Puppeteer
    console.log(`🖼️ Rendering PNG with Puppeteer...`);
    const browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    await page.waitForNetworkIdle({ timeout: 5000 });
    const screenshot = await page.screenshot({ type: 'png' });
    await browser.close();
    console.log(`✅ PNG rendered (size: ${screenshot.byteLength} bytes)`);
    
    // STEP 6: Upload to R2 bucket (mpintellect-data-engine)
    const timestamp = Date.now();
    const date = new Date().toISOString().split('T')[0];
    const filename_r2 = `charts/${symbol}/${date}/${symbol}_${timestamp}.png`;
    const latestFilename = `charts/${symbol}/latest.png`;
    
    console.log(`📤 Uploading to mpintellect-data-engine bucket...`);
    
    // Use DATA_ENGINE_BUCKET binding (points to mpintellect-data-engine)
    await env.DATA_ENGINE_BUCKET.put(filename_r2, screenshot, {
      httpMetadata: { contentType: 'image/png' },
    });
    await env.DATA_ENGINE_BUCKET.put(latestFilename, screenshot, {
      httpMetadata: { contentType: 'image/png' },
    });
    
    console.log(`✅ Uploaded: ${filename_r2}`);
    
    // STEP 7: Generate public URL using news.mpintellect.com
    const publicUrl = `https://news.mpintellect.com/${filename_r2}`;
    const latestUrl = `https://news.mpintellect.com/${latestFilename}`;
    
    console.log(`🔗 Public URL: ${publicUrl}`);
    
    // STEP 8: Return response
    return new Response(JSON.stringify({
      success: true,
      symbol: symbol,
      imageUrl: publicUrl,
      latestUrl: latestUrl,
      filename: filename_r2,
      timestamp: timestamp,
      size: screenshot.byteLength,
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('💥 Error in generate-and-upload:', error.message);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ============================================================
// COMPLETE HTML GENERATOR
// ============================================================
function generateCompleteHTML(story: any, chartData: any, mzLogo: string | null, partnerLogo: string | null, backgroundImage: string | null) {
  const gold = "#D4AF37";
  const dim = "#94a3b8";
  
  const symbol = chartData?.symbol || story?.symbol || "XAUUSD";
  const trend = story?.trend || (chartData?.prediction?.direction === "DOWN" ? "DOWN" : "UP");
  const isDown = trend === "DOWN" || trend === "SELL";
  
  const backgroundStyle = backgroundImage 
    ? `background: linear-gradient(0deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.6) 100%), url('${backgroundImage}'); background-size: cover; background-position: center;`
    : `background: linear-gradient(145deg, #050505 0%, #121212 100%);`;

  const chartHTML = chartData ? generateChartHTML(chartData, gold, dim) : '<div style="background: #0a0a15; border-radius: 30px; padding: 40px; text-align: center;">Chart data unavailable</div>';

  return `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;900&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Inter', 'Noto Sans Arabic', sans-serif; 
            color: white; 
            margin: 0; 
            padding: 0;
            width: 1080px;
            min-height: 1920px;
            ${backgroundStyle} 
          }
          
          .container {
            padding: 60px 50px 80px 50px;
            width: 100%;
            min-height: 1920px;
            display: flex;
            flex-direction: column;
            background: rgba(0,0,0,0.3);
          }
          
          .symbol-pill {
            background: linear-gradient(90deg, ${gold}20, transparent);
            border-left: 3px solid ${gold};
            padding: 8px 30px;
            border-radius: 4px 40px 40px 4px;
            display: inline-block;
          }
          
          .rtl-text {
            direction: rtl;
            text-align: right;
            font-family: 'Noto Sans Arabic', sans-serif;
            line-height: 1.4;
          }
          
          .headline-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 35px;
            padding: 35px;
          }
          
          .mono { font-family: 'JetBrains Mono', monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          
          <!-- HEADER -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin: 0 auto 50px auto; padding: 12px 40px; width: 900px; background: #000000; border-radius: 100px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.6px; padding-right: 30px;">
              <img src="${mzLogo}" style="height: 66px;" />
              <span style="font-size: 22px; font-weight: 300; letter-spacing: 2px; color: white;">MPINTELLECT.COM</span>
            </div>
            <div style="width: 1px; height: 45px; background: rgba(255,255,255,0.25);"></div>
            <div style="display: flex; align-items: center; justify-content: flex-start; padding-left: 40px;">
              ${partnerLogo ? 
                `<img src="${partnerLogo}" style="height: 66px; border-radius: 12px;" />` : 
                `<span style="color: rgba(255,255,255,0.4); font-size: 18px; font-weight: 300; letter-spacing: 2px;">OFFICIAL PARTNER</span>`
              }
            </div>
          </div>

          <!-- SUBTITLE -->
          <div style="text-align: center; margin-bottom: 60px;">
            <p style="font-size: 18px; font-weight: 400; text-transform: uppercase; letter-spacing: 6px; color: #94a3b8; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              Context changes everything. What you need to know before you trade.
            </p>
          </div>
                    
          <!-- IDENTITY SECTION -->
          <div style="margin-bottom: 40px; display: flex; align-items: center; justify-content: space-between;">
            <div class="symbol-pill" style="display: flex; flex-direction: column; align-items: flex-start; gap: 5px;">
              <span style="font-size: 48px; font-weight: 900;">${chartData?.symbol || symbol}</span>
              <span style="font-size: 14px; color: ${dim}; font-weight: 500;">${(() => {
                const sym = chartData?.symbol || "XAUUSD";
                const symbolNames: Record<string, string> = {
                  "XAUUSD": "Gold / US Dollar",
                  "BTCUSD": "Bitcoin / US Dollar",
                  "EURUSD": "Euro / US Dollar",
                  "GBPUSD": "British Pound / US Dollar",
                };
                return symbolNames[sym] || sym;
              })()}</span>
            </div>
            <div style="background: rgba(0,0,0,0.4); border-radius: 40px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.1);">
              <div style="color: white; font-size: 14px; font-weight: 600; font-family: 'JetBrains Mono', monospace;">
                ${chartData?.generated_at ? (() => {
                  const dateObj = new Date(chartData.generated_at);
                  const day = dateObj.getUTCDate();
                  const month = dateObj.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
                  const year = dateObj.getUTCFullYear();
                  const hours = dateObj.getUTCHours().toString().padStart(2, '0');
                  const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
                  return `${day} ${month} ${year} | ${hours}:${minutes} UTC`;
                })() : 'N/A'}
              </div>
            </div>
          </div>

          <!-- HEADLINE -->
          <div class="headline-card" style="margin-bottom: 40px;">
            <h2 class="rtl-text" style="font-size: 58px; font-weight: 700; line-height: 1.3;">
              ${(() => {
                const isShort = chartData?.prediction?.direction === 'DOWN';
                const directionText = isShort ? 'هبوط متوقع' : 'صعود متوقع';
                return `تحليل يومي لـ ${symbol}: قراءة المؤشرات - ${directionText}`;
              })()}
            </h2>
          </div>

          <!-- CHART SECTION -->
          ${chartHTML}

          <!-- FOOTER -->
          <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 30px; margin-top: 40px;">
            <div class="mono" style="color: #475569; font-size: 14px; letter-spacing: 6px;">Institutional Analysis Feed</div>
            <div style="font-size: 10px; color: #334155; margin-top: 10px;">MPINTELLECT SYSTEM • © 2026 GLOBAL DATA RESEARCH</div>
          </div>

        </div>
      </body>
    </html>
  `;
}

// ============================================================
// CHART HTML GENERATOR
// ============================================================
function generateChartHTML(chartData: any, gold: string, dim: string) {
  if (!chartData || !chartData.candles || !chartData.candles.data || chartData.candles.data.length === 0) {
    return `<div style="background: #0a0a15; border-radius: 30px; padding: 40px; text-align: center; color: #666;">📊 Chart data unavailable</div>`;
  }

  const candles = chartData.candles.data;
  const prediction = chartData.prediction;
  const chart = chartData.chart;
  const pivot = chartData.pivot || {};
  const symbol = chartData.symbol || "XAUUSD";
  
  const SYMBOL_SPECS: Record<string, { decimals: number }> = {
    "XAUUSD": { decimals: 2 },
    "BTCUSD": { decimals: 1 },
    "EURUSD": { decimals: 5 },
    "GBPUSD": { decimals: 5 },
    "USDJPY": { decimals: 3 },
  };
  
  const symbolSpec = SYMBOL_SPECS[symbol] || { decimals: 2 };
  const decimals = symbolSpec.decimals;
  
  function formatPrice(price: number): string {
    if (price === undefined || price === null) return 'N/A';
    return price.toFixed(decimals);
  }
  
  const chartWidth = 1400;
  const chartHeight = 580;
  const chartBoxX = -30;
  const chartBoxY = 85;
  const chartBoxWidth = chartWidth - 60;
  const chartBoxHeight = chartHeight;
  
  const visibleCandles = candles.slice(-35);
  const candleWidth = Math.max(8, Math.min(15, (chartBoxWidth - 80) / visibleCandles.length - 2));
  const spacing = candleWidth + 4;
  const chartLeft = chartBoxX + 60;
  const chartRight = chartBoxX + chartBoxWidth - 20;
  
  const pendingOrder = chart.pending_order || {};
  const takeProfit = pendingOrder.take_profit;
  const stopLoss = pendingOrder.stop_loss;
  const pivotLevel = pivot.level;
  const isShort = prediction?.direction === 'DOWN' || pendingOrder.type === 'SELL_LIMIT';
  
  let candleMin = Infinity;
  let candleMax = -Infinity;
  for (const c of visibleCandles) {
    candleMin = Math.min(candleMin, c.low);
    candleMax = Math.max(candleMax, c.high);
  }
  candleMin = Math.min(candleMin, chart.current_price);
  candleMax = Math.max(candleMax, chart.current_price);
  
  if (pivotLevel) {
    if (pivotLevel < candleMin) candleMin = pivotLevel;
    if (pivotLevel > candleMax) candleMax = pivotLevel;
  }
  
  const candleRange = candleMax - candleMin;
  const padding = candleRange * 0.15;
  let minPrice = candleMin - padding;
  let maxPrice = candleMax + padding;
  const priceRange = maxPrice - minPrice;
  
  function getY(price: number): number {
    if (price <= minPrice) return chartBoxY + chartBoxHeight - 2;
    if (price >= maxPrice) return chartBoxY + 2;
    return chartBoxY + chartBoxHeight - ((price - minPrice) / priceRange) * chartBoxHeight;
  }
  
  let candlesSVG = '';
  for (let i = 0; i < visibleCandles.length; i++) {
    const candle = visibleCandles[i];
    const x = chartLeft + (i * spacing);
    const open = getY(candle.open);
    const close = getY(candle.close);
    const high = getY(candle.high);
    const low = getY(candle.low);
    const isBullish = candle.close > candle.open;
    const color = isBullish ? '#10B981' : '#EF4444';
    const bodyTop = Math.min(open, close);
    const bodyHeight = Math.max(2, Math.abs(close - open));
    
    candlesSVG += `
      <line x1="${x + candleWidth/2}" y1="${high}" x2="${x + candleWidth/2}" y2="${low}" stroke="${color}" stroke-width="2"/>
      <rect x="${x}" y="${bodyTop}" width="${candleWidth}" height="${bodyHeight}" fill="${color}" opacity="0.95" rx="2"/>
    `;
  }
  
  let gridSVG = '';
  const gridLines = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const axisX = chartRight + 30;
  
  gridSVG += `
    <rect x="${chartLeft - 5}" y="${chartBoxY - 3}" width="${axisX - chartLeft + 10}" height="${chartBoxHeight + 6}" 
          fill="none" stroke="#1f3a4a" stroke-width="2" rx="6" opacity="0.8"/>
    <line x1="${axisX}" y1="${chartBoxY}" x2="${axisX}" y2="${chartBoxY + chartBoxHeight}" stroke="#1f3a4a" stroke-width="2" opacity="0.8"/>
  `;
  
  for (const percent of gridLines) {
    const y = chartBoxY + (percent / 100) * chartBoxHeight;
    const price = maxPrice - (percent / 100) * priceRange;
    
    gridSVG += `
      <line x1="${chartLeft}" y1="${y}" x2="${axisX}" y2="${y}" stroke="#1f3a4a" stroke-width="0.7" stroke-dasharray="4,4"/>
      <line x1="${axisX}" y1="${y}" x2="${axisX + 10}" y2="${y}" stroke="#94a3b8" stroke-width="2" opacity="0.9"/>
      <text x="${axisX + 18}" y="${y + 6}" text-anchor="start" fill="#94a3b8" font-size="14" class="mono" font-weight="700">${price.toFixed(decimals)}</text>
    `;
  }
  
  // Current Price Line
  const currentPriceY = getY(chart.current_price);
  gridSVG += `
    <line x1="${chartLeft}" y1="${currentPriceY}" x2="${chartRight}" y2="${currentPriceY}" stroke="${gold}" stroke-width="2.5" stroke-dasharray="8,5"/>
  `;
  
  // Pivot Line
  if (pivot.level) {
    const pivotY = getY(pivot.level);
    gridSVG += `
      <line x1="${chartLeft}" y1="${pivotY}" x2="${chartRight}" y2="${pivotY}" stroke="${gold}" stroke-width="2.5" stroke-dasharray="10,6"/>
      <rect x="${chartRight - 75}" y="${pivotY - 12}" width="65" height="18" rx="5" fill="${gold}" opacity="0.95"/>
      <text x="${chartRight - 42}" y="${pivotY + 1}" text-anchor="middle" fill="#000" font-size="11" font-weight="800">PIVOT</text>
    `;
  }
  
  return `
    <div style="background: #0a0a15; border-radius: 30px; padding: 30px; margin-top: 20px; border: 1px solid rgba(212, 175, 55, 0.25); width: 1080px;">
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 15px;">
        <div>
          <span style="color: ${gold}; font-size: 13px; letter-spacing: 3px; font-weight: 600;">H1 TECHNICAL ANALYSIS</span>
        </div>
        <div>
          <span style="color: ${dim}; font-size: 24px; font-weight: 800;">${symbol}</span>
        </div>
      </div>
      
      <div style="background: #050505; border-radius: 16px; border: 1px solid #1f3a4a; overflow: hidden;">
        <svg width="${chartWidth}" height="${chartBoxY + chartBoxHeight + 80}" viewBox="0 0 ${chartWidth} ${chartBoxY + chartBoxHeight + 80}" xmlns="http://www.w3.org/2000/svg" style="display: block; width: 100%; height: auto;">
          <rect x="${chartBoxX}" y="${chartBoxY}" width="${chartBoxWidth}" height="${chartBoxHeight}" fill="#0a0a15" rx="8"/>
          ${gridSVG}
          ${candlesSVG}
        </svg>
      </div>
      
      <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between; margin-top: 25px; padding: 18px 20px; background: rgba(0,0,0,0.4); border-radius: 20px;">
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          ${pivot.resistance_1 ? `
            <div style="background: rgba(239,68,68,0.15); border-radius: 25px; padding: 6px 16px; border-left: 4px solid #EF4444;">
              <span style="color: #EF4444; font-size: 13px; font-weight: 700;">RESISTANCE</span>
              <span style="color: white; font-size: 15px; font-weight: 800; margin-left: 10px;">R1: ${formatPrice(pivot.resistance_1)}</span>
            </div>
          ` : ''}
          ${pivot.support_1 ? `
            <div style="background: rgba(16,185,129,0.15); border-radius: 25px; padding: 6px 16px; border-left: 4px solid #10B981;">
              <span style="color: #10B981; font-size: 13px; font-weight: 700;">SUPPORT</span>
              <span style="color: white; font-size: 15px; font-weight: 800; margin-left: 10px;">S1: ${formatPrice(pivot.support_1)}</span>
            </div>
          ` : ''}
          <div style="background: rgba(212, 175, 55, 0.12); border-radius: 25px; padding: 6px 16px; border-left: 4px solid ${gold};">
            <span style="color: ${gold}; font-size: 13px; font-weight: 700;">CURRENT</span>
            <span style="color: white; font-size: 15px; font-weight: 800; margin-left: 10px;">${formatPrice(chart.current_price)}</span>
          </div>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; gap: 25px;">
          <div><span style="color: ${dim}; font-size: 11px;">RSI</span><br><span style="color: white; font-size: 16px; font-weight: 700;">${chart.indicators.rsi?.toFixed(1) || 'N/A'}</span></div>
          <div><span style="color: ${dim}; font-size: 11px;">ATR</span><br><span style="color: white; font-size: 16px; font-weight: 700;">${formatPrice(chart.indicators.atr)}</span></div>
          <div><span style="color: ${dim}; font-size: 11px;">CONFIDENCE</span><br><span style="color: ${gold}; font-size: 16px; font-weight: 800;">${chartData.risk_score?.confidence_score || 0}%</span></div>
          <div><span style="color: ${dim}; font-size: 11px;">DECISION</span><br><span style="color: ${isShort ? '#EF4444' : '#10B981'}; font-size: 16px; font-weight: 800;">${chartData.final_decision || 'HOLD'}</span></div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
        <span style="color: #475569; font-size: 11px;">MPIntellect.com - AI Institutional Analysis</span>
      </div>
      
    </div>
  `;
}