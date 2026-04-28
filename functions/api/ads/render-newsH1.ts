import puppeteer from "@cloudflare/puppeteer";

// Helper: Fetch image from URL and return as Base64
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

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);

  // 1. Extract Parameters 
  const symbol = searchParams.get("symbol") || "XAUUSD";
  const refresh = searchParams.get("refresh") === "true";
  const imageType = searchParams.get("type") || "story";

  if (!symbol) return new Response("Missing Symbol", { status: 400 });

  let browser: any;

  try {
    // 🛡️ STEP 1: FETCH CHART DATA (Candles, Indicators, Prediction)
    const chartDataUrl = `https://data.mpintellect.com/D1_output_${symbol}.json`;
    console.log(`📊 Fetching chart data from: ${chartDataUrl}`);
    
    const chartDataRes = await fetch(chartDataUrl);
    
    if (!chartDataRes.ok) {
      throw new Error(`Failed to fetch chart data: ${chartDataRes.status}`);
    }
    
    const chartData = await chartDataRes.json();
    console.log(`✅ Loaded chart data for ${symbol}`);

    // 🛡️ STEP 2: FETCH STORY DATA (Text Analysis)
    const storyDataUrl = "https://data.mpintellect.com/Story-newsH1.json";
    console.log(`📰 Fetching story data from: ${storyDataUrl}`);
    
    const storyDataRes = await fetch(storyDataUrl);
    
    if (!storyDataRes.ok) {
      throw new Error(`Failed to fetch story data: ${storyDataRes.status}`);
    }
    
    const allStories = await storyDataRes.json();
    const storiesArray = Array.isArray(allStories) ? allStories : [allStories];
    const story = storiesArray.find((s: any) => s.symbol === symbol);
    
    if (!story) {
      console.log(`⚠️ No story found for ${symbol}, using default`);
    }

    // 🛡️ STEP 3: FETCH BRAND ASSETS
    const mzLogoUrl = "https://news.mpintellect.com/mzlogo.webp";
    const partnerLogoUrl = `https://news.mpintellect.com/lfmo1.webp`;
    
    const filename = story?.image ? (story.image.includes('.') ? story.image : `${story.image}.webp`) : "default.webp";
    const backgroundImageUrl = `https://news.mpintellect.com/${filename}`;

    const [mzLogo, partnerLogo, backgroundImage] = await Promise.all([
      fetchImageAsBase64(mzLogoUrl),
      fetchImageAsBase64(partnerLogoUrl),
      fetchImageAsBase64(backgroundImageUrl)
    ]);

    // 🛡️ STEP 4: RENDER ENGINE (Puppeteer)
    console.log(`🎨 Generating ${imageType} Image for ${symbol}`);
    browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });

    const html = generateCompleteHTML(story, chartData, mzLogo, partnerLogo, backgroundImage);

    await page.setContent(html);
    await page.waitForNetworkIdle({ timeout: 3000 });
    const screenshot = await page.screenshot();

    await browser.close();
    
    return new Response(screenshot, { 
      headers: { 
        "Content-Type": "image/png",
        "Cache-Control": refresh ? "no-cache, no-store, must-revalidate" : "public, max-age=300",
        "Pragma": refresh ? "no-cache" : "",
        "Expires": refresh ? "0" : ""
      } 
    });

  } catch (e: any) {
    console.error("💥 Render Error:", e.message);
    return new Response(JSON.stringify({ error: e.message, symbol: symbol }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  } finally {
    if (browser) await browser.close();
  }
}

// ==================== COMPLETE HTML GENERATOR ====================
function generateCompleteHTML(story: any, chartData: any, mzLogo: string | null, partnerLogo: string | null, backgroundImage: string | null) {
  const gold = "#D4AF37";
  const dim = "#94a3b8";
  
  const symbol = chartData?.symbol || story?.symbol || "XAUUSD";
  const trend = story?.trend || (chartData?.prediction?.direction === "DOWN" ? "DOWN" : "UP");
  const isDown = trend === "DOWN" || trend === "SELL";
  const trendColor = isDown ? "#EF4444" : "#10B981";
  const trendArrow = isDown ? "▼" : "▲";
  const trendLabel = isDown ? "SHORT" : "LONG";
  
  const headline = story?.headline || `${symbol} - Institutional Analysis`;
  const aiContext = story?.aiContext || chartData?.summary || "Analysis based on H1 institutional data";
  const category = story?.category || "Technical Analysis";
  const date = story?.date || new Date().toISOString().split('T')[0];
  const impact = story?.impact || "HIGH";
  const session = story?.session || chartData?.sessions?.session_name || "New York";
  
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
          
          .glass-header { 
            background: rgba(0,0,0,0.6); 
            backdrop-filter: blur(15px);
            border-radius: 100px; 
            border: 1px solid rgba(255,255,255,0.08);
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
          
          .label-light {
            color: ${gold};
            font-size: 18px;
            letter-spacing: 5px;
            text-transform: uppercase;
            font-weight: 500;
          }
          
          .mono { font-family: 'JetBrains Mono', monospace; }
          
          .metric-box {
            border-left: 1px solid rgba(255,255,255,0.1);
            padding-left: 25px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          
          <!-- HEADER -->
<div style="
  display: flex; 
  align-items: center; 
  justify-content: space-between;
  margin: 0 auto 50px auto; 
  padding: 12px 40px; 
  width: 900px;
  background: #000000;
  border-radius: 100px; 
  border: 1px solid rgba(255,255,255,0.1);
">
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

        <!-- INSTITUTIONAL SUBTITLE -->
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
                const symbol = chartData?.symbol || "XAUUSD";
                const symbolNames: Record<string, string> = {
                  "EURUSD": "Euro / US Dollar",
                  "GBPUSD": "British Pound / US Dollar",
                  "USDJPY": "US Dollar / Japanese Yen",
                  "USDCAD": "US Dollar / Canadian Dollar",
                  "AUDUSD": "Australian Dollar / US Dollar",
                  "NZDUSD": "New Zealand Dollar / US Dollar",
                  "USDCHF": "US Dollar / Swiss Franc",
                  "EURJPY": "Euro / Japanese Yen",
                  "EURGBP": "Euro / British Pound",
                  "GBPJPY": "British Pound / Japanese Yen",
                  "GBPCHF": "British Pound / Swiss Franc",
                  "XAUUSD": "Gold / US Dollar",
                  "XAUEUR": "Gold / Euro",
                  "XAGUSD": "Silver / US Dollar",
                  "PLATINUM": "Platinum / US Dollar",
                  "BRENT": "Brent Crude Oil",
                  "BTCUSD": "Bitcoin / US Dollar",
                  "ETHUSD": "Ethereum / US Dollar",
                  "XRPUSD": "Ripple / US Dollar",
                  "LTCUSD": "Litecoin / US Dollar",
                  "DOGEUSD": "Dogecoin / US Dollar",
                  "US500": "S&P 500",
                  "USTEC": "Nasdaq 100",
                  "US30": "Dow Jones 30",
                  "HK50": "Hong Kong 50",
                  "FRANCE40": "France 40",
                  "CHINA50": "China 50",
                  "UK100": "FTSE 100"
                };
                return symbolNames[symbol] || symbol;
              })()}</span>
            </div>
            <div style="background: rgba(0,0,0,0.4); border-radius: 40px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.1);">
              <div style="color: white; font-size: 14px; font-weight: 600; font-family: 'JetBrains Mono', monospace;">
                ${chartData?.generated_at ? (() => {
                  const date = new Date(chartData.generated_at);
                  const day = date.getUTCDate();
                  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
                  const year = date.getUTCFullYear();
                  const hours = date.getUTCHours().toString().padStart(2, '0');
                  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
                  return `${day} ${month} ${year} | ${hours}:${minutes} UTC`;
                })() : 'N/A'}
              </div>
            </div>
          </div>
            

        

          <!-- HEADLINE (Dynamically generated from chart data) -->
<div class="headline-card" style="margin-bottom: 40px;">
  <h2 class="rtl-text" style="font-size: 58px; font-weight: 700; line-height: 1.3;">
    ${(() => {
      const symbol = chartData?.symbol || "XAUUSD";
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

// ==================== CHART HTML GENERATOR ====================
function generateChartHTML(chartData: any, gold: string, dim: string) {
  if (!chartData || !chartData.candles || !chartData.candles.data || chartData.candles.data.length === 0) {
    return `<div style="background: #0a0a15; border-radius: 30px; padding: 40px; text-align: center; color: #666;">📊 Chart data unavailable</div>`;
  }

  const candles = chartData.candles.data;
  const prediction = chartData.prediction;
  const chart = chartData.chart;
  const pivot = chartData.pivot || {};
  const symbol = chartData.symbol || "XAUUSD";
  
  // ============================================================
  // SYMBOL DECIMAL CONFIGURATION
  // ============================================================
  const SYMBOL_SPECS: Record<string, { pip: number; contract: number; decimals: number }> = {
    "EURUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
    "GBPUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
    "USDJPY": { pip: 0.01, contract: 100000, decimals: 3 },
    "USDCAD": { pip: 0.0001, contract: 100000, decimals: 5 },
    "AUDUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
    "NZDUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
    "USDCHF": { pip: 0.0001, contract: 100000, decimals: 5 },
    "EURJPY": { pip: 0.01, contract: 100000, decimals: 3 },
    "EURGBP": { pip: 0.0001, contract: 100000, decimals: 5 },
    "GBPJPY": { pip: 0.01, contract: 100000, decimals: 3 },
    "GBPCHF": { pip: 0.0001, contract: 100000, decimals: 5 },
    "XAUUSD": { pip: 0.01, contract: 100, decimals: 2 },
    "XAUEUR": { pip: 0.01, contract: 100, decimals: 2 },
    "XAGUSD": { pip: 0.001, contract: 5000, decimals: 3 },
    "PLATINUM": { pip: 0.01, contract: 100, decimals: 2 },
    "BRENT": { pip: 0.01, contract: 1000, decimals: 2 },
    "BTCUSD": { pip: 1.0, contract: 1, decimals: 1 },
    "ETHUSD": { pip: 0.1, contract: 1, decimals: 2 },
    "XRPUSD": { pip: 0.0001, contract: 1000, decimals: 4 },
    "LTCUSD": { pip: 0.01, contract: 10, decimals: 2 },
    "DOGEUSD": { pip: 0.0001, contract: 1000, decimals: 4 },
    "US500": { pip: 0.1, contract: 1, decimals: 2 },
    "USTEC": { pip: 0.1, contract: 1, decimals: 2 },
    "US30": { pip: 1.0, contract: 1, decimals: 1 },
    "HK50": { pip: 0.1, contract: 1, decimals: 2 },
    "FRANCE40": { pip: 0.1, contract: 1, decimals: 2 },
    "CHINA50": { pip: 0.1, contract: 1, decimals: 1 },
    "UK100": { pip: 0.1, contract: 1, decimals: 1 },
  };
  
  const symbolSpec = SYMBOL_SPECS[symbol] || { decimals: 2, pip: 0.01, contract: 1 };
  const decimals = symbolSpec.decimals;
  const pipSize = symbolSpec.pip;
  
  function formatPrice(price: number): string {
    if (price === undefined || price === null) return 'N/A';
    return price.toFixed(decimals);
  }
  
  function formatYAxisPrice(price: number): string {
    if (price === undefined || price === null) return 'N/A';
    if (price >= 10000) return price.toFixed(0);
    if (price >= 1000) return price.toFixed(decimals);
    if (price >= 100) return price.toFixed(decimals);
    if (price >= 1) return price.toFixed(Math.min(decimals, 3));
    return price.toFixed(decimals);
  }
  
  // ============================================================
  // CHART DIMENSIONS - ENLARGED
  // ============================================================
  const chartWidth = 1400;      // BIGGER (was 980)
  const chartHeight = 580;      // BIGGER (was 480)
  const chartBoxX = -30;        // Shift left for price space
  const chartBoxY = 85;         // Slightly lower
  const chartBoxWidth = chartWidth - 60;
  const chartBoxHeight = chartHeight;
  
  // Show last 35 candles
  const visibleCandles = candles.slice(-35);
  const candleWidth = Math.max(8, Math.min(15, (chartBoxWidth - 80) / visibleCandles.length - 2));  // BIGGER candles
  const spacing = candleWidth + 4;  // More spacing
  const chartLeft = chartBoxX + 60;
  const chartRight = chartBoxX + chartBoxWidth - 20;
  
  // Get TP, SL, and Pivot levels
  const pendingOrder = chart.pending_order || {};
  const takeProfit = pendingOrder.take_profit;
  const stopLoss = pendingOrder.stop_loss;
  const pivotLevel = pivot.level;
  const isShort = prediction.direction === 'DOWN' || pendingOrder.type === 'SELL_LIMIT';
  const boxColor = "#10B981";
  
  // ============================================================
  // STEP 1: CALCULATE CHART RANGE FROM CANDLES ONLY
  // ============================================================
  
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
  
  function getClampedY(price: number): number {
    let y = getY(price);
    return Math.min(chartBoxY + chartBoxHeight - 2, Math.max(chartBoxY + 2, y));
  }
  
  // ============================================================
  // STEP 2: FORECAST BOX
  // ============================================================
  const lastCandleIndex = visibleCandles.length - 1;
  const lastCandleX = chartLeft + (lastCandleIndex * spacing);
  const forecastBoxWidth = spacing * 12;  // WIDER
  const forecastBoxX = lastCandleX + candleWidth + 10;
  const forecastBoxRight = forecastBoxX + forecastBoxWidth;
  
  const pivotY = pivotLevel ? getY(pivotLevel) : null;
  const tpPrice = takeProfit;
  const tpY = tpPrice ? getY(tpPrice) : null;
  
  let boxTop: number | null = null;
  let boxBottom: number | null = null;
  let boxHeight = 0;
  
  if (pivotY !== null && tpY !== null) {
    if (isShort) {
      boxTop = Math.min(pivotY, tpY);
      boxBottom = Math.max(pivotY, tpY);
    } else {
      boxTop = Math.min(pivotY, tpY);
      boxBottom = Math.max(pivotY, tpY);
    }
    boxTop = Math.max(chartBoxY, Math.min(chartBoxY + chartBoxHeight, boxTop));
    boxBottom = Math.max(chartBoxY, Math.min(chartBoxY + chartBoxHeight, boxBottom));
    boxHeight = Math.abs(boxBottom - boxTop);
  }
  
  let forecastSVG = '';
  if (takeProfit && pivotLevel && forecastBoxWidth > 0 && boxHeight > 5 && boxTop !== null && boxBottom !== null) {
    const centerX = forecastBoxX + forecastBoxWidth / 2;
    const centerY = (boxTop + boxBottom) / 2;
    const directionSymbol = isShort ? '▼' : '▲';
    
    forecastSVG = `
      <rect x="${forecastBoxX}" y="${boxTop}" 
            width="${forecastBoxWidth}" height="${boxHeight}" 
            fill="${boxColor}" opacity="0.12" rx="8"/>
      <rect x="${forecastBoxX}" y="${boxTop}" 
            width="${forecastBoxWidth}" height="${boxHeight}" 
            fill="none" stroke="${boxColor}" stroke-width="2.5" 
            stroke-dasharray="8,5" rx="8" opacity="0.7"/>
      <line x1="${forecastBoxX}" y1="${boxTop}" x2="${forecastBoxRight}" y2="${boxTop}" 
            stroke="${boxColor}" stroke-width="2.5" opacity="0.8"/>
      <line x1="${forecastBoxX}" y1="${boxBottom}" x2="${forecastBoxRight}" y2="${boxBottom}" 
            stroke="${boxColor}" stroke-width="2.5" opacity="0.8"/>
      <g transform="translate(${centerX}, ${centerY})">
        <circle cx="0" cy="0" r="28" fill="${isShort ? '#EF4444' : '#10B981'}" opacity="0.15" stroke="${isShort ? '#EF4444' : '#10B981'}" stroke-width="2.5"/>
        <text x="0" y="10" text-anchor="middle" fill="${isShort ? '#EF4444' : '#10B981'}" font-size="34" font-weight="900">${directionSymbol}</text>
      </g>
    `;
    
    if (tpPrice && (tpPrice < minPrice || tpPrice > maxPrice)) {
      const edgeY = tpPrice < minPrice ? chartBoxY + chartBoxHeight - 5 : chartBoxY + 5;
      forecastSVG += `
        <line x1="${forecastBoxRight - 25}" y1="${boxBottom}" x2="${forecastBoxRight}" y2="${edgeY}" 
              stroke="${boxColor}" stroke-width="2" stroke-dasharray="4,4" opacity="0.6"/>
        <line x1="${forecastBoxRight}" y1="${boxBottom}" x2="${forecastBoxRight + 40}" y2="${edgeY}" 
              stroke="${boxColor}" stroke-width="2" stroke-dasharray="4,4" opacity="0.6"/>
      `;
    }
  }
  
  // ============================================================
  // STEP 3: GENERATE CANDLES
  // ============================================================
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
  
  // ============================================================
  // GRID LINES
  // ============================================================
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
  
  gridSVG += `
    <line x1="${axisX}" y1="${chartBoxY - 3}" x2="${axisX}" y2="${chartBoxY + chartBoxHeight + 3}" stroke="#1f3a4a" stroke-width="2" rx="6" opacity="0.8"/>
  `;
  
  // ============================================================
  // LEVELS
  // ============================================================
  const r1Price = pivot.resistance_1;
  const r1Y = r1Price ? getClampedY(r1Price) : null;
  const isR1Far = r1Price && (r1Price > maxPrice);
  
  const s1Price = pivot.support_1;
  const s1Y = s1Price ? getClampedY(s1Price) : null;
  const isS1Far = s1Price && (s1Price < minPrice);
  
  const tpY_clamped = takeProfit ? getClampedY(takeProfit) : null;
  const isTPFar = takeProfit && (takeProfit < minPrice || takeProfit > maxPrice);
  
  const slY_clamped = stopLoss ? getClampedY(stopLoss) : null;
  const isSLFar = stopLoss && (stopLoss < minPrice || stopLoss > maxPrice);
  
  // ============================================================
  // LEVELS HTML (LARGER)
  // ============================================================
  let levelsHTML = '';
  
  if (pivot.resistance_1) {
    levelsHTML += `
      <div style="background: rgba(239,68,68,0.15); border-radius: 25px; padding: 6px 16px; border-left: 4px solid #EF4444;">
        <span style="color: #EF4444; font-size: 13px; font-weight: 700;">RESISTANCE</span>
        <span style="color: white; font-size: 15px; font-weight: 800; margin-left: 10px;">R1: ${formatPrice(pivot.resistance_1)}</span>
      </div>
    `;
  }
  
  if (pivot.resistance_2) {
    levelsHTML += `
      <div style="background: rgba(239,68,68,0.08); border-radius: 25px; padding: 5px 14px; border-left: 4px solid rgba(239,68,68,0.5);">
        <span style="color: #EF4444; font-size: 12px; font-weight: 600;">RESISTANCE</span>
        <span style="color: rgba(255,255,255,0.7); font-size: 14px; margin-left: 10px;">R2: ${formatPrice(pivot.resistance_2)}</span>
      </div>
    `;
  }
  
  if (pivot.support_1) {
    levelsHTML += `
      <div style="background: rgba(16,185,129,0.15); border-radius: 25px; padding: 6px 16px; border-left: 4px solid #10B981;">
        <span style="color: #10B981; font-size: 13px; font-weight: 700;">SUPPORT</span>
        <span style="color: white; font-size: 15px; font-weight: 800; margin-left: 10px;">S1: ${formatPrice(pivot.support_1)}</span>
      </div>
    `;
  }
  
  if (pivot.support_2) {
    levelsHTML += `
      <div style="background: rgba(16,185,129,0.08); border-radius: 25px; padding: 5px 14px; border-left: 4px solid rgba(16,185,129,0.5);">
        <span style="color: #10B981; font-size: 12px; font-weight: 600;">SUPPORT</span>
        <span style="color: rgba(255,255,255,0.7); font-size: 14px; margin-left: 10px;">S2: ${formatPrice(pivot.support_2)}</span>
      </div>
    `;
  }
  
  return `
    <div style="background: #0a0a15; border-radius: 30px; padding: 30px; margin-top: 20px; border: 1px solid rgba(212, 175, 55, 0.25);">
      
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 15px;">
        <div>
          <span style="color: ${gold}; font-size: 13px; letter-spacing: 3px; font-weight: 600;">H1 TECHNICAL ANALYSIS (DAY-TRADER)</span>
        </div>
      </div>
    
      <!-- TWO SCENARIO CARDS - LARGER -->
      <div style="display: flex; gap: 18px; margin-bottom: 25px; padding: 0 10px; direction: rtl;">
        
        <!-- Scenario 1 Card -->
        <div style="flex: 1; background: ${isShort ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'}; border-radius: 20px; padding: 16px 20px; border: 1.5px solid ${isShort ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}; display: flex; justify-content: space-between; align-items: center;">
          <div style="text-align: right;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span style="background: ${isShort ? '#EF4444' : '#10B981'}; width: 12px; height: 12px; border-radius: 50%; display: inline-block;"></span>
              <span style="color: ${isShort ? '#EF4444' : '#10B981'}; font-size: 14px; font-weight: 800;">السيناريو المفضل</span>
            </div>
            <div style="font-size: 15px; color: ${dim}; margin-bottom: 6px;">
              ${isShort ? 
                `يتحرك السعر أسفل نقطة المحور ${pivotLevel ? formatPrice(pivotLevel) : 'N/A'} نحو ${takeProfit ? formatPrice(takeProfit) : 'N/A'}` : 
                `يتحرك السعر أعلى نقطة المحور ${pivotLevel ? formatPrice(pivotLevel) : 'N/A'} نحو ${takeProfit ? formatPrice(takeProfit) : 'N/A'}`}
            </div>
            <div style="display: flex; align-items: baseline; gap: 10px; margin-top: 8px;">
              <span style="color: white; font-size: 22px; font-weight: 800;">${takeProfit ? formatPrice(takeProfit) : 'N/A'}</span>
              <span style="color: ${isShort ? '#EF4444' : '#10B981'}; font-size: 16px;">${isShort ? '▼' : '▲'}</span>
            </div>
          </div>
          <div style="min-width: 85px; text-align: center;">
            <span style="background: ${isShort ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}; border-radius: 40px; padding: 10px 16px; font-size: 26px; font-weight: 800; color: ${isShort ? '#EF4444' : '#10B981'}; display: inline-block;">${prediction.confidence}%</span>
          </div>
        </div>
        
        <!-- Scenario 2 Card -->
        <div style="flex: 1; background: ${isShort ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; border-radius: 20px; padding: 16px 20px; border: 1.5px solid ${isShort ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}; display: flex; justify-content: space-between; align-items: center;">
          <div style="text-align: right;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span style="background: ${isShort ? '#10B981' : '#EF4444'}; width: 12px; height: 12px; border-radius: 50%; display: inline-block;"></span>
              <span style="color: ${isShort ? '#10B981' : '#EF4444'}; font-size: 14px; font-weight: 800;">السيناريو البديل</span>
            </div>
            <div style="font-size: 15px; color: ${dim}; margin-bottom: 6px;">
              ${isShort ? 
                `يرتد السعر أعلى نقطة المحور ${pivotLevel ? formatPrice(pivotLevel) : 'N/A'} نحو ${stopLoss ? formatPrice(stopLoss) : 'N/A'}` : 
                `يرتد السعر أسفل نقطة المحور ${pivotLevel ? formatPrice(pivotLevel) : 'N/A'} نحو ${stopLoss ? formatPrice(stopLoss) : 'N/A'}`}
            </div>
            <div style="display: flex; align-items: baseline; gap: 10px; margin-top: 8px;">
              <span style="color: white; font-size: 22px; font-weight: 800;">${stopLoss ? formatPrice(stopLoss) : 'N/A'}</span>
              <span style="color: ${isShort ? '#10B981' : '#EF4444'}; font-size: 16px;">${isShort ? '▲' : '▼'}</span>
            </div>
          </div>
          <div style="min-width: 85px; text-align: center;">
            <span style="background: ${isShort ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}; border-radius: 40px; padding: 10px 16px; font-size: 26px; font-weight: 800; color: ${isShort ? '#10B981' : '#EF4444'}; display: inline-block;">${100 - (prediction.confidence || 84)}%</span>
          </div>
        </div>
        
      </div>
      
      <!-- Chart Container Box -->
      <div style="background: #050505; border-radius: 16px; border: 1px solid #1f3a4a; overflow: hidden;">
        
        <svg width="${chartWidth}" height="${chartBoxY + chartBoxHeight + 80}" viewBox="0 0 ${chartWidth} ${chartBoxY + chartBoxHeight + 80}" xmlns="http://www.w3.org/2000/svg" style="display: block; width: 100%; height: auto;">
          
          <rect x="${chartBoxX}" y="${chartBoxY}" width="${chartBoxWidth}" height="${chartBoxHeight}" fill="#0a0a15" rx="8"/>
          
          ${gridSVG}
          ${candlesSVG}
          
          ${forecastSVG}
          
          <!-- Current Price Line -->
          <line x1="${chartLeft}" y1="${getY(chart.current_price)}" x2="${chartRight}" y2="${getY(chart.current_price)}" stroke="${gold}" stroke-width="2.5" stroke-dasharray="8,5"/>
          
          <!-- Pivot Line -->
          ${pivot.level && getY(pivot.level) >= chartBoxY && getY(pivot.level) <= chartBoxY + chartBoxHeight ? `
            <line x1="${chartLeft}" y1="${getY(pivot.level)}" x2="${chartRight}" y2="${getY(pivot.level)}" stroke="${gold}" stroke-width="2.5" stroke-dasharray="10,6"/>
            <rect x="${chartRight - 75}" y="${getY(pivot.level) - 12}" width="65" height="18" rx="5" fill="${gold}" opacity="0.95"/>
            <text x="${chartRight - 42}" y="${getY(pivot.level) + 1}" text-anchor="middle" fill="#000" font-size="11" font-weight="800">PIVOT</text>
          ` : ''}
          
          <!-- Resistance 1 Line -->
          ${r1Y ? `
            <line x1="${chartLeft}" y1="${r1Y}" x2="${chartRight}" y2="${r1Y}" stroke="#EF4444" stroke-width="2" stroke-dasharray="${isR1Far ? '3,8' : '8,5'}" ${isR1Far ? 'opacity="0.6"' : ''}/>
            ${!isR1Far ? `
              <rect x="${chartRight - 65}" y="${r1Y - 10}" width="55" height="16" rx="4" fill="#EF4444" opacity="0.85"/>
              <text x="${chartRight - 37}" y="${r1Y + 1}" text-anchor="middle" fill="#000" font-size="9" font-weight="800">R1</text>
            ` : `
              <text x="${chartRight - 15}" y="${r1Y + 5}" text-anchor="end" fill="#EF4444" font-size="10" font-weight="700" opacity="0.8">R1 ${formatPrice(r1Price)}</text>
            `}
          ` : ''}
          
          <!-- Support 1 Line -->
          ${s1Y ? `
            <line x1="${chartLeft}" y1="${s1Y}" x2="${chartRight}" y2="${s1Y}" stroke="#10B981" stroke-width="2" stroke-dasharray="${isS1Far ? '3,8' : '8,5'}" ${isS1Far ? 'opacity="0.6"' : ''}/>
            ${!isS1Far ? `
              <rect x="${chartRight - 65}" y="${s1Y - 10}" width="55" height="16" rx="4" fill="#10B981" opacity="0.85"/>
              <text x="${chartRight - 37}" y="${s1Y + 1}" text-anchor="middle" fill="#000" font-size="9" font-weight="800">S1</text>
            ` : `
              <text x="${chartRight - 15}" y="${s1Y + 5}" text-anchor="end" fill="#10B981" font-size="10" font-weight="700" opacity="0.8">S1 ${formatPrice(s1Price)}</text>
            `}
          ` : ''}
          
          <!-- TP Line -->
          ${tpY_clamped ? `
            <line x1="${chartLeft}" y1="${tpY_clamped}" x2="${chartRight}" y2="${tpY_clamped}" stroke="${boxColor}" stroke-width="2" stroke-dasharray="5,5" opacity="0.5"/>
            ${!isTPFar ? `
              <rect x="${chartRight - 55}" y="${tpY_clamped - 10}" width="45" height="16" rx="4" fill="${boxColor}" opacity="0.75"/>
              <text x="${chartRight - 32}" y="${tpY_clamped + 1}" text-anchor="middle" fill="#000" font-size="9" font-weight="800"></text>
            ` : ''}
          ` : ''}
          
          <!-- SL Line -->
          ${slY_clamped ? `
            <line x1="${chartLeft}" y1="${slY_clamped}" x2="${chartRight}" y2="${slY_clamped}" stroke="#EF4444" stroke-width="2" stroke-dasharray="5,5" opacity="0.5"/>
            ${!isSLFar ? `
              <rect x="${chartRight - 55}" y="${slY_clamped - 10}" width="45" height="16" rx="4" fill="#EF4444" opacity="0.75"/>
              <text x="${chartRight - 32}" y="${slY_clamped + 1}" text-anchor="middle" fill="#000" font-size="9" font-weight="800"></text>
            ` : ''}
          ` : ''}
          
        </svg>
      </div>
      
      <!-- Levels & Indicators Section - LARGER -->
      <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between; margin-top: 25px; padding: 18px 20px; background: rgba(0,0,0,0.4); border-radius: 20px;">
        
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          ${levelsHTML}
          <div style="background: rgba(212, 175, 55, 0.12); border-radius: 25px; padding: 6px 16px; border-left: 4px solid ${gold};">
            <span style="color: ${gold}; font-size: 13px; font-weight: 700;">PIVOT</span>
            <span style="color: white; font-size: 15px; font-weight: 800; margin-left: 10px;">${formatPrice(pivot.level)}</span>
          </div>
          <div style="background: rgba(212, 175, 55, 0.08); border-radius: 25px; padding: 6px 16px; border-left: 4px solid ${gold};">
            <span style="color: ${gold}; font-size: 13px; font-weight: 700;">CURRENT</span>
            <span style="color: white; font-size: 15px; font-weight: 800; margin-left: 10px;">${formatPrice(chart.current_price)}</span>
          </div>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; gap: 25px;">
          <div><span style="color: ${dim}; font-size: 11px;">EMA20</span><br><span style="color: white; font-size: 16px; font-weight: 700;">${formatPrice(chart.indicators.ema_20)}</span></div>
          <div><span style="color: ${dim}; font-size: 11px;">EMA50</span><br><span style="color: white; font-size: 16px; font-weight: 700;">${formatPrice(chart.indicators.ema_50)}</span></div>
          <div><span style="color: ${dim}; font-size: 11px;">RSI</span><br><span style="color: ${chart.indicators.rsi > 70 ? '#EF4444' : chart.indicators.rsi < 30 ? '#10B981' : '#FFFFFF'}; font-size: 18px; font-weight: 800;">${chart.indicators.rsi?.toFixed(1) || 'N/A'}</span></div>
          <div><span style="color: ${dim}; font-size: 11px;">ATR</span><br><span style="color: white; font-size: 16px; font-weight: 700;">${formatPrice(chart.indicators.atr)}</span></div>
        </div>
        
      </div>
      
    </div>
  `;
}