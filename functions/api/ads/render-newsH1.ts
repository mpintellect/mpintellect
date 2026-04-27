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
          <div class="glass-header" style="
            display: flex; 
            align-items: center; 
            justify-content: space-between;
            margin: 0 auto 50px auto; 
            padding: 12px 40px; 
            width: 900px;
          ">
            <div style="display: flex; align-items: center; gap: 8px;">
              <img src="${mzLogo}" style="height: 50px;" />
              <span style="font-size: 18px; font-weight: 300; letter-spacing: 2px;">MPINTELLECT.COM</span>
            </div>
            <div style="width: 1px; height: 35px; background: rgba(255,255,255,0.2);"></div>
            <div>
              ${partnerLogo ? 
                `<img src="${partnerLogo}" style="height: 50px; border-radius: 10px;" />` : 
                `<span style="color: rgba(255,255,255,0.4); font-size: 14px;">PARTNER</span>`
              }
            </div>
          </div>

          <!-- SUBTITLE -->
          <div style="text-align: center; margin-bottom: 40px;">
            <p style="font-size: 14px; letter-spacing: 4px; color: ${dim};">CONTEXT CHANGES EVERYTHING</p>
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
  // CHART DIMENSIONS
  // ============================================================
  const chartWidth = 980;
  const chartHeight = 480;
  const chartBoxX = 30;
  const chartBoxY = 75;
  const chartBoxWidth = chartWidth - 60;
  const chartBoxHeight = chartHeight;
  
  // Show last 35 candles
  const visibleCandles = candles.slice(-35);
  const candleWidth = Math.max(6, Math.min(12, (chartBoxWidth - 70) / visibleCandles.length - 2));
  const spacing = candleWidth + 3;
  const chartLeft = chartBoxX + 55;
  const chartRight = chartBoxX + chartBoxWidth - 20;
  
  // Get TP level and Pivot level
  const pendingOrder = chart.pending_order || {};
  const takeProfit = pendingOrder.take_profit;
  const pivotLevel = pivot.level;
  const isShort = prediction.direction === 'DOWN' || pendingOrder.type === 'SELL_LIMIT';
  const boxColor = "#10B981";
  
  // Calculate levels for range
  let allLevels: number[] = [];
  for (const c of visibleCandles) {
    allLevels.push(c.high, c.low);
  }
  allLevels.push(chart.current_price);
  if (pivot.level) allLevels.push(pivot.level);
  if (pivot.support_1) allLevels.push(pivot.support_1);
  if (pivot.resistance_1) allLevels.push(pivot.resistance_1);
  if (takeProfit) allLevels.push(takeProfit);
  if (pendingOrder.stop_loss) allLevels.push(pendingOrder.stop_loss);
  
  let minPrice = Math.min(...allLevels);
  let maxPrice = Math.max(...allLevels);
  const centerPrice = (minPrice + maxPrice) / 2;
  const range = maxPrice - minPrice;
  const zoomedRange = range * 0.85;
  minPrice = centerPrice - (zoomedRange / 2);
  maxPrice = centerPrice + (zoomedRange / 2);
  const priceRange = maxPrice - minPrice;
  
  function getY(price: number): number {
    return chartBoxY + chartBoxHeight - ((price - minPrice) / priceRange) * chartBoxHeight;
  }
  
  // ============================================================
  // FORECAST BOX (from PIVOT level to TP level)
  // ============================================================
  const lastCandleIndex = visibleCandles.length - 1;
  const lastCandleX = chartLeft + (lastCandleIndex * spacing);
  const forecastBoxWidth = spacing * 10;
  const forecastBoxX = lastCandleX + candleWidth + 8;
  const forecastBoxRight = forecastBoxX + forecastBoxWidth;
  
  // Get Y positions for PIVOT and TP
  const pivotY = pivotLevel ? getY(pivotLevel) : null;
  const tpY = takeProfit ? getY(takeProfit) : null;
  
  // Get SL level from pending order
  const stopLoss = pendingOrder.stop_loss;
  const slY = stopLoss ? getY(stopLoss) : null;
  
  // SL Box boundaries (from PIVOT to SL) - OPPOSITE direction of TP
  let slBoxTop: number | null = null;
  let slBoxBottom: number | null = null;
  let slBoxHeight = 0;
  
  if (slY !== null && pivotY !== null) {
    if (isShort) {
      // SHORT: SL is ABOVE PIVOT (opposite direction)
      slBoxTop = pivotY;
      slBoxBottom = slY;
    } else {
      // LONG: SL is BELOW PIVOT (opposite direction)
      slBoxTop = slY;
      slBoxBottom = pivotY;
    }
    slBoxHeight = Math.abs(slBoxBottom - slBoxTop);
  }
  
  // Box boundaries (from PIVOT to TP)
  let boxTop: number | null = null;
  let boxBottom: number | null = null;
  let boxHeight = 0;
  
  if (pivotY !== null && tpY !== null) {
    if (isShort) {
      boxTop = pivotY;
      boxBottom = tpY;
    } else {
      boxTop = tpY;
      boxBottom = pivotY;
    }
    boxHeight = Math.abs(boxBottom - boxTop);
  } else {
    const currentPriceY = getY(chart.current_price);
    if (isShort) {
      boxTop = currentPriceY;
      boxBottom = tpY || currentPriceY + 70;
    } else {
      boxTop = tpY || currentPriceY - 70;
      boxBottom = currentPriceY;
    }
    boxHeight = Math.abs(boxBottom - boxTop);
  }
  
  // SL ZONE (Red zone from PIVOT to SL)
  
  // Forecast box with direction symbol
  let forecastSVG = '';
  if (takeProfit && pivotLevel && forecastBoxWidth > 0 && boxHeight > 5 && boxTop !== null && boxBottom !== null) {
    const centerX = forecastBoxX + forecastBoxWidth / 2;
    const centerY = (boxTop + boxBottom) / 2;
    const directionSymbol = isShort ? '▼' : '▲';
    
    forecastSVG = `
      <!-- Forecast Box (from PIVOT to TP) -->
      <rect x="${forecastBoxX}" y="${Math.min(boxTop, boxBottom)}" 
            width="${forecastBoxWidth}" height="${boxHeight}" 
            fill="${boxColor}" opacity="0.12" rx="6"/>
      
      <!-- Forecast Box Border -->
      <rect x="${forecastBoxX}" y="${Math.min(boxTop, boxBottom)}" 
            width="${forecastBoxWidth}" height="${boxHeight}" 
            fill="none" stroke="${boxColor}" stroke-width="2" 
            stroke-dasharray="6,4" rx="6" opacity="0.7"/>
      
      <!-- Top border line (PIVOT level) -->
      <line x1="${forecastBoxX}" y1="${boxTop}" x2="${forecastBoxRight}" y2="${boxTop}" 
            stroke="${boxColor}" stroke-width="2" opacity="0.8"/>
      
      <!-- Bottom border line (TP level) -->
      <line x1="${forecastBoxX}" y1="${boxBottom}" x2="${forecastBoxRight}" y2="${boxBottom}" 
            stroke="${boxColor}" stroke-width="2" opacity="0.8"/>
      
      <!-- Direction Indicator in the middle -->
      <g transform="translate(${centerX}, ${centerY})">
        <circle cx="0" cy="0" r="22" fill="${isShort ? '#EF4444' : '#10B981'}" opacity="0.15" stroke="${isShort ? '#EF4444' : '#10B981'}" stroke-width="2"/>
        <text x="0" y="8" text-anchor="middle" fill="${isShort ? '#EF4444' : '#10B981'}" font-size="28" font-weight="900">${directionSymbol}</text>
      </g>
    `;
  }
  
  // ============================================================
  // GENERATE CANDLES
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
      <line x1="${x + candleWidth/2}" y1="${high}" x2="${x + candleWidth/2}" y2="${low}" stroke="${color}" stroke-width="1.5"/>
      <rect x="${x}" y="${bodyTop}" width="${candleWidth}" height="${bodyHeight}" fill="${color}" opacity="0.95" rx="1.5"/>
    `;
  }
  
  // ============================================================
  // GRID LINES (MT5 Style with vertical price axis)
  // ============================================================
  let gridSVG = '';
  const gridLines = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const axisX = chartRight + 15;
  
  gridSVG += `
    <!-- Vertical Price Axis Line -->
    <line x1="${axisX}" y1="${chartBoxY}" x2="${axisX}" y2="${chartBoxY + chartBoxHeight}" stroke="#1f3a4a" stroke-width="1" opacity="0.6"/>
  `;
  
  for (const percent of gridLines) {
    const y = chartBoxY + (percent / 100) * chartBoxHeight;
    const price = maxPrice - (percent / 100) * priceRange;
    
    gridSVG += `
      <line x1="${chartLeft}" y1="${y}" x2="${chartRight}" y2="${y}" stroke="#1f3a4a" stroke-width="0.5" stroke-dasharray="3,3"/>
      <line x1="${axisX - 5}" y1="${y}" x2="${axisX}" y2="${y}" stroke="#94a3b8" stroke-width="1" opacity="0.8"/>
      <text x="${axisX + 6}" y="${y + 4}" text-anchor="start" fill="#94a3b8" font-size="10" class="mono" font-weight="500">${formatYAxisPrice(price)}</text>
    `;
  }
  
  // ============================================================
  // LEVELS (Small pill boxes)
  // ============================================================
  let levelsHTML = '';
  
  if (pivot.resistance_1) {
    levelsHTML += `
      <div style="background: rgba(239,68,68,0.15); border-radius: 20px; padding: 4px 12px; border-left: 3px solid #EF4444;">
        <span style="color: #EF4444; font-size: 11px; font-weight: 600;">RESISTANCE</span>
        <span style="color: white; font-size: 13px; font-weight: 700; margin-left: 8px;">R1: ${formatPrice(pivot.resistance_1)}</span>
      </div>
    `;
  }
  
  if (pivot.resistance_2) {
    levelsHTML += `
      <div style="background: rgba(239,68,68,0.08); border-radius: 20px; padding: 4px 12px; border-left: 3px solid rgba(239,68,68,0.5);">
        <span style="color: #EF4444; font-size: 10px; font-weight: 500;">RESISTANCE</span>
        <span style="color: rgba(255,255,255,0.7); font-size: 12px; margin-left: 8px;">R2: ${formatPrice(pivot.resistance_2)}</span>
      </div>
    `;
  }
  
  if (pivot.support_1) {
    levelsHTML += `
      <div style="background: rgba(16,185,129,0.15); border-radius: 20px; padding: 4px 12px; border-left: 3px solid #10B981;">
        <span style="color: #10B981; font-size: 11px; font-weight: 600;">SUPPORT</span>
        <span style="color: white; font-size: 13px; font-weight: 700; margin-left: 8px;">S1: ${formatPrice(pivot.support_1)}</span>
      </div>
    `;
  }
  
  if (pivot.support_2) {
    levelsHTML += `
      <div style="background: rgba(16,185,129,0.08); border-radius: 20px; padding: 4px 12px; border-left: 3px solid rgba(16,185,129,0.5);">
        <span style="color: #10B981; font-size: 10px; font-weight: 500;">SUPPORT</span>
        <span style="color: rgba(255,255,255,0.7); font-size: 12px; margin-left: 8px;">S2: ${formatPrice(pivot.support_2)}</span>
      </div>
    `;
  }
  
  return `
    <div style="background: #0a0a15; border-radius: 25px; padding: 15px; margin-top: 15px; border: 1px solid rgba(212, 175, 55, 0.2);">
      
                      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 0 10px;">
        <div>
          <span style="color: ${gold}; font-size: 10px; letter-spacing: 2px;">H1 TECHNICAL ANALYSIS (DAY-TRADER)</span>
          
        </div>
    
      </div>
    
      
                   <!-- ============================================================ -->
      <!-- TWO SCENARIO CARDS (Scenario 1: TP / Scenario 2: SL) -->
      <!-- RTL Layout - Text Right, Percentage Left - WITH PIVOT -->
      <!-- ============================================================ -->
      <div style="display: flex; gap: 12px; margin-bottom: 15px; padding: 0 5px; direction: rtl;">
        
        <!-- Scenario 1 Card (السيناريو المفضل) - Color matches direction -->
        <div style="flex: 1; background: ${isShort ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'}; border-radius: 16px; padding: 12px 15px; border: 1px solid ${isShort ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}; display: flex; justify-content: space-between; align-items: center;">
          
          <!-- Right Side - Text Content -->
          <div style="text-align: right;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="background: ${isShort ? '#EF4444' : '#10B981'}; width: 10px; height: 10px; border-radius: 50%; display: inline-block;"></span>
              <span style="color: ${isShort ? '#EF4444' : '#10B981'}; font-size: 12px; font-weight: 700; letter-spacing: 1px;">السيناريو المفضل</span>
            </div>
            <div style="font-size: 13px; color: ${dim}; margin-bottom: 4px;">
              ${isShort ? 
                `يتحرك السعر أسفل نقطة المحور ${pivotLevel ? formatPrice(pivotLevel) : 'N/A'} نحو ${takeProfit ? formatPrice(takeProfit) : 'N/A'}` : 
                `يتحرك السعر أعلى نقطة المحور ${pivotLevel ? formatPrice(pivotLevel) : 'N/A'} نحو ${takeProfit ? formatPrice(takeProfit) : 'N/A'}`}
            </div>
            <div style="display: flex; align-items: baseline; gap: 6px; margin-top: 5px;">
              <span style="color: white; font-size: 18px; font-weight: 800;">${takeProfit ? formatPrice(takeProfit) : 'N/A'}</span>
              <span style="color: ${isShort ? '#EF4444' : '#10B981'}; font-size: 14px;">${isShort ? '▼' : '▲'}</span>
            </div>
          </div>
          
          <!-- Left Side - Percentage (Bigger, Centered) -->
          <div style="min-width: 70px; text-align: center;">
            <span style="background: ${isShort ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}; border-radius: 30px; padding: 8px 12px; font-size: 22px; font-weight: 800; color: ${isShort ? '#EF4444' : '#10B981'}; display: inline-block;">${prediction.confidence}%</span>
          </div>
          
        </div>
        
        <!-- Scenario 2 Card (السيناريو البديل) - Opposite color -->
        <div style="flex: 1; background: ${isShort ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; border-radius: 16px; padding: 12px 15px; border: 1px solid ${isShort ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}; display: flex; justify-content: space-between; align-items: center;">
          
          <!-- Right Side - Text Content -->
          <div style="text-align: right;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="background: ${isShort ? '#10B981' : '#EF4444'}; width: 10px; height: 10px; border-radius: 50%; display: inline-block;"></span>
              <span style="color: ${isShort ? '#10B981' : '#EF4444'}; font-size: 12px; font-weight: 700; letter-spacing: 1px;">السيناريو البديل</span>
            </div>
            <div style="font-size: 13px; color: ${dim}; margin-bottom: 4px;">
              ${isShort ? 
                `يرتد السعر أعلى نقطة المحور ${pivotLevel ? formatPrice(pivotLevel) : 'N/A'} نحو ${stopLoss ? formatPrice(stopLoss) : 'N/A'}` : 
                `يرتد السعر أسفل نقطة المحور ${pivotLevel ? formatPrice(pivotLevel) : 'N/A'} نحو ${stopLoss ? formatPrice(stopLoss) : 'N/A'}`}
            </div>
            <div style="display: flex; align-items: baseline; gap: 6px; margin-top: 5px;">
              <span style="color: white; font-size: 18px; font-weight: 800;">${stopLoss ? formatPrice(stopLoss) : 'N/A'}</span>
              <span style="color: ${isShort ? '#10B981' : '#EF4444'}; font-size: 14px;">${isShort ? '▲' : '▼'}</span>
            </div>
          </div>
          
          <!-- Left Side - Percentage (Bigger, Centered) -->
          <div style="min-width: 70px; text-align: center;">
            <span style="background: ${isShort ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}; border-radius: 30px; padding: 8px 12px; font-size: 22px; font-weight: 800; color: ${isShort ? '#10B981' : '#EF4444'}; display: inline-block;">${100 - (prediction.confidence || 84)}%</span>
          </div>
          
        </div>
        
      </div>
      <!-- Chart Container Box -->
      <div style="background: #050505; border-radius: 12px; border: 1px solid #1f3a4a; overflow: hidden;">
        
        <!-- SVG Chart -->
        <svg width="${chartWidth}" height="${chartBoxY + chartBoxHeight + 50}" viewBox="0 0 ${chartWidth} ${chartBoxY + chartBoxHeight + 50}" xmlns="http://www.w3.org/2000/svg" style="display: block; width: 100%; height: auto;">
          
          <!-- Chart Background -->
          <rect x="${chartBoxX}" y="${chartBoxY}" width="${chartBoxWidth}" height="${chartBoxHeight}" fill="#0a0a15" rx="6"/>
          
          ${gridSVG}
          ${candlesSVG}
          
          
          
          <!-- FORECAST BOX (Green) -->
          ${forecastSVG}
          
          <!-- Current Price Line -->
          <line x1="${chartLeft}" y1="${getY(chart.current_price)}" x2="${chartRight}" y2="${getY(chart.current_price)}" stroke="${gold}" stroke-width="2" stroke-dasharray="6,4"/>
          
          <!-- Pivot Line (Yellow) with Label OUTSIDE -->
          ${pivot.level ? `
            <line x1="${chartLeft}" y1="${getY(pivot.level)}" x2="${chartRight}" y2="${getY(pivot.level)}" stroke="${gold}" stroke-width="2" stroke-dasharray="8,5"/>
            <rect x="${chartRight - 65}" y="${getY(pivot.level) - 10}" width="55" height="16" rx="4" fill="${gold}" opacity="0.9"/>
            <text x="${chartRight - 37}" y="${getY(pivot.level) + 1}" text-anchor="middle" fill="#000" font-size="9" font-weight="800">PIVOT</text>
          ` : ''}
          
          <!-- Resistance 1 Line -->
          ${pivot.resistance_1 ? `
            <line x1="${chartLeft}" y1="${getY(pivot.resistance_1)}" x2="${chartRight}" y2="${getY(pivot.resistance_1)}" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="6,4"/>
            <rect x="${chartRight - 55}" y="${getY(pivot.resistance_1) - 9}" width="45" height="14" rx="3" fill="#EF4444" opacity="0.8"/>
            <text x="${chartRight - 32}" y="${getY(pivot.resistance_1) + 1}" text-anchor="middle" fill="#000" font-size="8" font-weight="700">R1</text>
          ` : ''}
          
          <!-- Support 1 Line -->
          ${pivot.support_1 ? `
            <line x1="${chartLeft}" y1="${getY(pivot.support_1)}" x2="${chartRight}" y2="${getY(pivot.support_1)}" stroke="#10B981" stroke-width="1.5" stroke-dasharray="6,4"/>
            <rect x="${chartRight - 55}" y="${getY(pivot.support_1) - 9}" width="45" height="14" rx="3" fill="#10B981" opacity="0.8"/>
            <text x="${chartRight - 32}" y="${getY(pivot.support_1) + 1}" text-anchor="middle" fill="#000" font-size="8" font-weight="700">S1</text>
          ` : ''}
          
          <!-- TP Line -->
          ${takeProfit ? `
            <line x1="${chartLeft}" y1="${getY(takeProfit)}" x2="${chartRight}" y2="${getY(takeProfit)}" stroke="${boxColor}" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.5"/>
          ` : ''}
          
          <!-- SL Line -->
          ${stopLoss ? `
            <line x1="${chartLeft}" y1="${getY(stopLoss)}" x2="${chartRight}" y2="${getY(stopLoss)}" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.5"/>
          ` : ''}
          
        </svg>
      </div>
      
      <!-- Levels & Indicators Section -->
      <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; margin-top: 15px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 16px;">
        
        <!-- Key Levels (Small pill boxes) -->
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${levelsHTML}
          <div style="background: rgba(212, 175, 55, 0.12); border-radius: 20px; padding: 4px 12px; border-left: 3px solid ${gold};">
            <span style="color: ${gold}; font-size: 11px; font-weight: 600;">PIVOT</span>
            <span style="color: white; font-size: 13px; font-weight: 700; margin-left: 8px;">${formatPrice(pivot.level)}</span>
          </div>
          <div style="background: rgba(212, 175, 55, 0.08); border-radius: 20px; padding: 4px 12px; border-left: 3px solid ${gold};">
            <span style="color: ${gold}; font-size: 11px; font-weight: 600;">CURRENT</span>
            <span style="color: white; font-size: 13px; font-weight: 700; margin-left: 8px;">${formatPrice(chart.current_price)}</span>
          </div>
        </div>
        
        <!-- Technical Indicators -->
        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
          <div><span style="color: ${dim}; font-size: 9px;">EMA20</span><br><span style="color: white; font-size: 13px; font-weight: 600;">${formatPrice(chart.indicators.ema_20)}</span></div>
          <div><span style="color: ${dim}; font-size: 9px;">EMA50</span><br><span style="color: white; font-size: 13px; font-weight: 600;">${formatPrice(chart.indicators.ema_50)}</span></div>
          <div><span style="color: ${dim}; font-size: 9px;">RSI</span><br><span style="color: ${chart.indicators.rsi > 70 ? '#EF4444' : chart.indicators.rsi < 30 ? '#10B981' : '#FFFFFF'}; font-size: 14px; font-weight: 700;">${chart.indicators.rsi?.toFixed(1) || 'N/A'}</span></div>
          <div><span style="color: ${dim}; font-size: 9px;">ATR</span><br><span style="color: white; font-size: 13px; font-weight: 600;">${formatPrice(chart.indicators.atr)}</span></div>
        </div>
        
      </div>
      
    </div>
  `;
}