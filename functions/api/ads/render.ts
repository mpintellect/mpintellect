
// functions/api/ads/render.ts
import puppeteer from "@cloudflare/puppeteer";

const SIZES: any = {
  standard: { width: 1200, height: 628 },  // Google Ads
  square: { width: 1080, height: 1080 },    // Facebook/Instagram Square
  portrait: { width: 1080, height: 1350 },  // Instagram Portrait // Website Leaderboard // Billboard
};

// ==============================================
// STYLE CONFIGURATIONS (Background & Colors)
// ==============================================
const STYLES: any = {
  // Propfirm Style (Professional, Trustworthy)
  black: {
    background: "bg-black",
    secondaryBg: "bg-zinc-900/80",
    border: `border-[#D4AF37]`,
    card: "bg-zinc-900/50 border-zinc-800",
    text: "text-zinc-400",
    accent: "#10B981",
    chatBg: "bg-zinc-800/50",
    chatBorder: `border-[#D4AF37]/30`,
    buyAccent: "#10B981",
    sellAccent: "#EF4444",
  },
  
  // Cyber Style (Neon/Tech)
  cyber: {
    background: "bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950",
    secondaryBg: "bg-slate-900/80 backdrop-blur",
    border: "border-cyan-500",
    card: "bg-slate-900/50 border-cyan-500/30",
    text: "text-cyan-300",
    accent: "#22D3EE",
    chatBg: "bg-slate-800/60",
    chatBorder: "border-cyan-500/30",
    buyAccent: "#22D3EE",
    sellAccent: "#F43F5E",
  },
};

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);

  // 1. Extract Parameters
  const symbol = (searchParams.get("symbol") || "XAUUSD").toUpperCase();
  const style = (searchParams.get("style") || "black").toLowerCase();
  const type = (searchParams.get("type") || "test").toLowerCase();
  const forceKey = searchParams.get("key");
  const isManager = forceKey === env.ADMIN_KEY;
  
  // 2. Validate Size (ONLY DECLARE THIS ONCE)
  const rawSize = searchParams.get("size")?.toLowerCase();
  const sizeKey = (rawSize && SIZES[rawSize]) ? rawSize : "square";

  // 3. Set Config and ID
  const config = SIZES[sizeKey];
  const adId = `ad_${symbol.toLowerCase()}_${style}_${type}_${sizeKey}.png`;

  let browser: any;
  try {
    if (!isManager && env.AD_STORAGE) {
      const cachedFile = await env.AD_STORAGE.get(adId);
      if (cachedFile) return new Response(cachedFile.body, { headers: { "Content-Type": "image/png" } });
    }

    const apiSymbol = symbol.replace(/[-_/]/g, '').toUpperCase();
    const dataRes = await fetch(`${new URL(request.url).origin}/api/symbol-data?symbol=${apiSymbol}`);
    if (!dataRes.ok) throw new Error(`Data API Failure: ${dataRes.status}`);
    const marketData = await dataRes.json();

    // Data Mapping
    const currentPrice = marketData?.trend?.current_price || "----";
    const finalDecision = marketData?.final_decision || "ANALYZING";
    const isBuy = finalDecision.includes("BUY");
    const confidence = marketData?.risk_score?.confidence_score || 85;
    const tpLevel = marketData?.tp_sl?.tp_level || marketData?.pending_orders?.primary_order?.tp_price || "----";
    const slLevel = marketData?.tp_sl?.sl_level || marketData?.pending_orders?.primary_order?.sl_price || "----";
    const entryLevel = marketData?.tp_sl?.entry_price || marketData?.pending_orders?.primary_order?.entry_price || currentPrice;

    // Launch Browser
    browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    await page.setViewport(config);

    // Call HTML Generator
    const html = generateAdHTML(symbol, style, type, marketData, config, currentPrice, finalDecision, isBuy, confidence, tpLevel, slLevel, entryLevel);

    await page.setContent(html);
    await page.waitForNetworkIdle({ timeout: 1500 });
    const screenshot = await page.screenshot();
    
    if (env.AD_STORAGE) {
      await env.AD_STORAGE.put(adId, screenshot, { httpMetadata: { contentType: "image/png" } });
    }
    
    return new Response(screenshot, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" } });

  } catch (e: any) {
    console.error("💥 Render Error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
function generateAdHTML(
  symbol: string,
  style: string,
  type: string,
  data: any,
  cfg: any,
  currentPrice: string,
  finalDecision: string,
  isBuy: boolean,
  confidence: number,
  tpLevel: string,
  slLevel: string,
  entryLevel: string
) {
  // Get the style configuration
  const currentStyle = STYLES[style] || STYLES.black;
  const accent = isBuy ? currentStyle.buyAccent : currentStyle.sellAccent;
  const gold = "#D4AF37";

  // ==============================================
  // Symbol specs for proper decimal formatting
  // ==============================================
  const SYMBOL_SPECS: Record<string, { pip: number; contract: number; decimals: number; fullName: string; category: string }> = {
    // Forex
    "EURUSD": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "Euro / US Dollar", category: "Forex" },
    "GBPUSD": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "British Pound / USD", category: "Forex" },
    "USDJPY": { pip: 0.01, contract: 100000, decimals: 3, fullName: "US Dollar / Yen", category: "Forex" },
    "USDCAD": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "USD / Canadian Dollar", category: "Forex" },
    "AUDUSD": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "Australian Dollar / USD", category: "Forex" },
    "NZDUSD": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "NZ Dollar / USD", category: "Forex" },
    "USDCHF": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "USD / Swiss Franc", category: "Forex" },
    "EURJPY": { pip: 0.01, contract: 100000, decimals: 3, fullName: "Euro / Yen", category: "Forex" },
    "EURGBP": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "Euro / Pound", category: "Forex" },
    "GBPJPY": { pip: 0.01, contract: 100000, decimals: 3, fullName: "Pound / Yen", category: "Forex" },
    "GBPCHF": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "Pound / Swiss Franc", category: "Forex" },
  
    // Metals
    "XAUUSD": { pip: 0.01, contract: 100, decimals: 2, fullName: "Gold / USD", category: "Metals" }, 
    "XAUEUR": { pip: 0.01, contract: 100, decimals: 2, fullName: "Gold / Euro", category: "Metals" },
    "XAGUSD": { pip: 0.001, contract: 5000, decimals: 3, fullName: "Silver / USD", category: "Metals" },
    "PLATINUM": { pip: 0.01, contract: 100, decimals: 2, fullName: "Platinum", category: "Metals" },
  
    // Energy
    "BRENT": { pip: 0.01, contract: 1000, decimals: 2, fullName: "Brent Crude Oil", category: "Energy" },
  
    // Crypto
    "BTCUSD": { pip: 1.0, contract: 1, decimals: 1, fullName: "Bitcoin", category: "Crypto" },      
    "ETHUSD": { pip: 0.1, contract: 1, decimals: 2, fullName: "Ethereum", category: "Crypto" },      
    "XRPUSD": { pip: 0.0001, contract: 1000, decimals: 4, fullName: "Ripple", category: "Crypto" }, 
    "LTCUSD": { pip: 0.01, contract: 10, decimals: 2, fullName: "Litecoin", category: "Crypto" },    
    "DOGEUSD": { pip: 0.0001, contract: 1000, decimals: 4, fullName: "Dogecoin", category: "Crypto" }, 
    "SOLUSD": { pip: 0.01, contract: 1, decimals: 2, fullName: "Solana", category: "Crypto" },
  
    // Indices
    "US500": { pip: 0.1, contract: 1, decimals: 2, fullName: "S&P 500", category: "Indices" },
    "USTEC": { pip: 0.1, contract: 1, decimals: 2, fullName: "Nasdaq 100", category: "Indices" },
    "US30": { pip: 1.0, contract: 1, decimals: 1, fullName: "Dow Jones 30", category: "Indices" },
    "HK50": { pip: 0.1, contract: 1, decimals: 2, fullName: "Hong Kong 50", category: "Indices" },
    "FRANCE40": { pip: 0.1, contract: 1, decimals: 2, fullName: "CAC 40", category: "Indices" },
    "CHINA50": { pip: 0.1, contract: 1, decimals: 1, fullName: "China A50", category: "Indices" },
    "UK100": { pip: 0.1, contract: 1, decimals: 1, fullName: "FTSE 100", category: "Indices" },
  };

  // ==============================================
  // Formatting function
  // ==============================================
  function formatPrice(price: number | string | null | undefined, symbolKey: string): string {
    if (price === null || price === undefined) return "----";
    
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return "----";
    
    // Get decimals for this symbol, default to 2
    const spec = SYMBOL_SPECS[symbolKey];
    const decimals = spec?.decimals ?? 2;
    
    return numPrice.toFixed(decimals);
  }

  // ==============================================
  // Format all price values
  // ==============================================
  const formattedEntry = formatPrice(entryLevel, symbol);
  const formattedSL = formatPrice(slLevel, symbol);
  const formattedTP = formatPrice(tpLevel, symbol);
  const formattedCurrent = formatPrice(currentPrice, symbol);

  // Calculate responsive font sizes based on viewport
  const isMobile = cfg.width < 600;
  const isSmallScreen = cfg.width < 400;
  const isStandard = cfg.width === 1200 && cfg.height === 628; // Standard size detection

  // Standard size specific adjustments
  const standardScale = isStandard ? 0.85 : 1.0; // Scale down content for standard size
  const standardPadding = isStandard ? 4 : (isMobile ? 6 : 8);
  const standardHeaderSize = isStandard ? 'text-4xl' : (isMobile ? 'text-6xl' : 'text-7xl');
  const standardPriceSize = isStandard ? 'text-2xl' : 'text-3xl';
  const standardGap = isStandard ? 2 : (isMobile ? 4 : 6);
  const standardCardPadding = isStandard ? 4 : (isMobile ? 5 : 6);
  
  // Adjust padding based on format
  const mainPadding = cfg.height < 700 ? 4 : (isMobile ? 6 : 8);
  const headerMargin = cfg.height < 700 ? 3 : (isMobile ? 6 : 8);
  const contentGap = cfg.height < 700 ? 2 : (isMobile ? 4 : 6);
  const footerMargin = cfg.height < 700 ? 2 : (cfg.height > 1000 ? 8 : 4);

  // Generate chat messages based on signal
  const chatMessages = [
    { user: "Pro Trader", message: `${symbol} just hit our entry zone at ${formattedEntry}! 🎯`, time: "2m ago" },
    { user: "AI Analyst", message: isBuy ? "Bullish divergence confirmed. Long setup activated." : "Bearish rejection at resistance. Short signal active.", time: "now" },
    { user: "Risk Manager", message: `SL: ${formattedSL} | TP: ${formattedTP} | R:R ${(Math.abs(Number(formattedTP) - Number(formattedEntry)) / Math.abs(Number(formattedEntry) - Number(formattedSL))).toFixed(2)}:1`, time: "1m ago" },
  ];

  // ==============================================
  // TYPE: PROPFIRM (Risk Calculator Style)
  // ==============================================

if (type === "test") {
  return `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
          body { font-family: 'Inter', sans-serif; margin: 0; }
          .mono { font-family: 'JetBrains Mono', monospace; }
          .glass-card {
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.05);
          }
          /* Universal fix for all sizes */
          * { box-sizing: border-box; max-width: 100%; }
          body { overflow: hidden; display: flex; align-items: center; justify-content: center; }
          .container { width: 100%; height: 100%; display: flex; flex-direction: column; }
          /* Standard size specific scaling */
          ${isStandard ? `
          .standard-scale {
            transform: scale(0.9);
            transform-origin: top center;
          }` : ''}
        </style>
      </head>
      <body class="${currentStyle.background} text-white" style="width:${cfg.width}px; height:${cfg.height}px;">
        <div class="container p-${standardPadding} relative ${isStandard ? 'standard-scale' : ''}">
          <!-- Top Border Accent -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[${gold}] to-transparent"></div>
          
          <!-- LARGER HEADER - Standard optimized -->
          <div class="flex justify-between items-start mb-${isStandard ? 2 : (isMobile ? 6 : 8)}">
            <div class="flex items-center gap-${isStandard ? 2 : 4}">
              <!-- BIGGER LOGO - Smaller for standard -->
              <img src="https://mpintellect.com/logos/mzlogo.webp" class="h-${isStandard ? 10 : (isMobile ? 14 : 16)}" />
              <div class="border-l-2 ${currentStyle.border} h-${isStandard ? 6 : (isMobile ? 10 : 12)}"></div>
              <div>
                <div class="text-${isStandard ? 'xs' : 'sm'} ${currentStyle.text} uppercase tracking-widest">LIVE PRICE</div>
                <div class="${isStandard ? 'text-xl' : 'text-3xl'} md:text-4xl font-bold text-white">${formattedCurrent}</div>
              </div>
            </div>
            <div>
              <h1 class="${isStandard ? 'text-4xl' : 'text-6xl'} font-black tracking-tighter">${symbol}</h1>
              <p class="text-[${gold}] text-${isStandard ? '8' : 'xs'} font-bold tracking-[5px] uppercase mt-1">MPIntellect INTELLIGENCE</p>
            </div>
          </div>

          <!-- SINGLE COLUMN LAYOUT - ALL CONTENT IN ONE COLUMN -->
          <div class="flex-1 flex flex-col gap-${standardGap}">
            
            <!-- Top: Risk Calculator with Symbol -->
            <div class="glass-card rounded-2xl p-${isStandard ? 4 : (isMobile ? 5 : 6)} border ${currentStyle.border}">
              <!-- Symbol in Upper Position -->
              <div class="flex justify-between items-center mb-${isStandard ? 2 : 5}">
                <div class="${isStandard ? 'text-2xl' : 'text-3xl'} md:text-4xl font-black tracking-tighter" style="color:${accent}">${symbol}</div>
                <div class="text-${isStandard ? '8' : 'xs'} ${currentStyle.text} bg-black/30 px-3 py-1 rounded-full border ${currentStyle.border}">
                  ${finalDecision}
                </div>
              </div>
              
              <div class="text-${isStandard ? 'xs' : 'sm'} ${currentStyle.text} font-bold mb-${isStandard ? 2 : 4}">RISK CALCULATOR</div>
              <div class="flex justify-between mb-${isStandard ? 2 : 4} border-b border-white/5 pb-${isStandard ? 2 : 4}">
                <div>
                  <div class="text-${isStandard ? '8' : 'xs'} ${currentStyle.text}">Max Risk</div>
                  <div class="text-${isStandard ? '2xl' : '3xl'} font-bold">0.5%</div>
                </div>
                <div class="text-right">
                  <div class="text-${isStandard ? '8' : 'xs'} ${currentStyle.text}">Status</div>
                  <div class="text-${isStandard ? '2xl' : '3xl'} font-bold text-green-500">PASS</div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-${isStandard ? '8' : 'xs'} ${currentStyle.text} mb-1">OPTIMIZED LOT SIZE</div>
                <div class="text-${isStandard ? '4xl' : '6xl'} font-black" style="color:${accent}">0.10</div>
              </div>
            </div>

            <!-- MIDDLE: SL/TP and Confidence - ALL IN THE MIDDLE -->
            <div class="glass-card rounded-2xl p-${isStandard ? 4 : (isMobile ? 5 : 6)} border ${currentStyle.border}">
              <div class="grid grid-cols-2 gap-${isStandard ? 2 : (isMobile ? 4 : 6)} mb-${isStandard ? 2 : (isMobile ? 4 : 6)}">
                <!-- Stop Loss -->
                <div class="text-center p-${isStandard ? 2 : (isMobile ? 3 : 4)}" style="background: rgba(239,68,68,0.1); border-radius: 16px; border: 1px solid rgba(239,68,68,0.3);">
                  <div class="text-${isStandard ? '8' : 'xs'} text-red-500 font-bold mb-2">STOP LOSS</div>
                  <div class="text-${isStandard ? 'xl' : '2xl'} md:text-3xl font-bold mono text-red-500">${formattedSL}</div>
                </div>
                <!-- Take Profit -->
                <div class="text-center p-${isStandard ? 2 : (isMobile ? 3 : 4)}" style="background: rgba(16,185,129,0.1); border-radius: 16px; border: 1px solid rgba(16,185,129,0.3);">
                  <div class="text-${isStandard ? '8' : 'xs'} text-green-500 font-bold mb-2">TAKE PROFIT</div>
                  <div class="text-${isStandard ? 'xl' : '2xl'} md:text-3xl font-bold mono text-green-500">${formattedTP}</div>
                </div>
              </div>
              
              <!-- Confidence in the middle -->
              <div class="text-center border-t border-white/5 pt-${isStandard ? 2 : (isMobile ? 4 : 5)} mt-${isStandard ? 1 : (isMobile ? 2 : 3)}">
                <span class="text-${isStandard ? 'xs' : 'sm'} ${currentStyle.text}">Confidence Score</span>
                <div class="flex items-center justify-center gap-2 mt-2">
                  <span class="text-${isStandard ? '3xl' : '4xl'} md:text-5xl font-black" style="color:${accent}">${confidence}%</span>
                  <span class="text-${isStandard ? '8' : 'xs'} ${currentStyle.text} px-3 py-1 bg-black/30 rounded-full">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer with CTA - Compact for standard -->
          <div class="mt-${isStandard ? 2 : footerMargin} pt-${cfg.height > 1000 ? 4 : 2} border-t ${currentStyle.border} flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-${isStandard ? 6 : 8} h-${isStandard ? 6 : 8} rounded-full bg-gradient-to-r from-[${gold}] to-amber-700 flex items-center justify-center">
                <span class="text-black font-bold text-${isStandard ? 'xs' : 'sm'}">AI</span>
              </div>
              <p class="${currentStyle.text} text-${isStandard ? 'xs' : 'sm'}">"Institutions are positioning ${isBuy ? 'long' : 'short'}"</p>
            </div>
            <div class="text-right">
              <div class="text-${isStandard ? 'lg' : '2xl'} font-black text-white tracking-tight">mpintellect.com</div>
              <div class="text-${isStandard ? '8' : 'xs'} ${currentStyle.text} uppercase tracking-widest">Access Pro Terminal →</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

  // ==============================================
  // TYPE: CHAT (Messenger Style)
  // ==============================================
if (type === "chat") {
    return `
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; margin: 0; }
            .chat-bubble {
              border-radius: ${isStandard ? 24 : (isMobile ? 32 : 36)}px;
              padding: ${isStandard ? 16 : (isMobile ? 28 : 32)}px ${isStandard ? 20 : (isMobile ? 32 : 36)}px;
              max-width: ${isStandard ? '98%' : '95%'};
              border-left: ${isStandard ? 6 : 8}px solid ${accent};
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            .chat-container {
              display: flex;
              flex-direction: column;
              justify-content: center;
              flex: 1;
              gap: ${isStandard ? 16 : (isMobile ? 28 : 36)}px;
              padding: ${isStandard ? 8 : (isMobile ? 15 : 25)}px 0;
            }
            .bubble-user {
              font-size: ${isStandard ? 18 : (isMobile ? 24 : 28)}px;
              margin-bottom: ${isStandard ? 6 : 12}px;
            }
            .bubble-message {
              font-size: ${isStandard ? 20 : (isMobile ? 28 : 32)}px;
              line-height: 1.4;
              font-weight: 500;
            }
            .bubble-time {
              font-size: ${isStandard ? 14 : (isMobile ? 18 : 20)}px;
            }
            /* Universal fix for all sizes */
            * { box-sizing: border-box; max-width: 100%; }
            body { overflow: hidden; display: flex; align-items: center; justify-content: center; }
            .container { width: 100%; height: 100%; display: flex; flex-direction: column; }
            /* Standard size specific scaling */
            ${isStandard ? `
            .standard-scale {
              transform: scale(0.9);
              transform-origin: top center;
            }` : ''}
          </style>
        </head>
        <body class="${currentStyle.background} text-white" style="width:${cfg.width}px; height:${cfg.height}px;">
          <div class="container p-${standardPadding} ${isStandard ? 'standard-scale' : ''}">
            
            <!-- Header - Standard optimized -->
            <div class="flex justify-between items-end border-b border-zinc-900 pb-${isStandard ? 3 : 6}">
              <div>
                <h1 class="${isStandard ? 'text-5xl' : 'text-7xl'} md:text-8xl font-black tracking-tighter">${symbol}</h1>
                <p class="text-[${gold}] text-${isStandard ? 'xs' : 'sm'} md:text-base font-bold tracking-[5px] uppercase mt-${isStandard ? 1 : 2}">MPIntellect INTELLIGENCE</p>
              </div>
              <div class="text-right">
                <p class="text-zinc-500 text-${isStandard ? '8' : 'xs'} md:text-sm font-bold uppercase mb-1">Algorithmic Bias</p>
                <p class="text-${isStandard ? '3xl' : '4xl'} md:text-5xl font-black" style="color:${accent}">${data.final_decision || 'SCANNING'}</p>
              </div>
            </div>

            <!-- Chat Messages - Centered Vertically with Gaps -->
            <div class="chat-container">
              ${chatMessages.map((msg, i) => `
                <div class="chat-bubble ${currentStyle.chatBg}" 
                     style="margin-left: ${i === 1 ? (isStandard ? 30 : (isMobile ? 50 : 80)) : i === 2 ? (isStandard ? 20 : (isMobile ? 30 : 50)) : 0}px;
                            align-self: ${i === 1 ? 'flex-end' : 'flex-start'};
                            max-width: ${i === 1 ? '90%' : '85%'};">
                  <div class="flex justify-between items-center mb-4">
                    <span class="font-bold bubble-user" style="color:${accent}">${msg.user}</span>
                    <span class="bubble-time ${currentStyle.text}">${msg.time}</span>
                  </div>
                  <p class="bubble-message text-white">${msg.message.replace(entryLevel, formattedEntry).replace(slLevel, formattedSL).replace(tpLevel, formattedTP)}</p>
                </div>
              `).join('')}
            </div>

            <!-- Footer with CTA - Standard optimized -->
            <div class="mt-${isStandard ? 2 : footerMargin} pt-${isStandard ? 1 : (cfg.height > 1000 ? 4 : 2)} border-t ${currentStyle.border} flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="w-${isStandard ? 8 : 10} h-${isStandard ? 8 : 10} rounded-full bg-gradient-to-r from-[${gold}] to-amber-700 flex items-center justify-center">
                  <span class="text-black font-bold text-${isStandard ? 'base' : 'lg'}">AI</span>
                </div>
                <p class="${currentStyle.text} text-${isStandard ? 'xs' : 'base'} md:text-lg">"Institutions are positioning ${isBuy ? 'long' : 'short'}"</p>
              </div>
              <div class="text-right">
                <div class="text-${isStandard ? 'xl' : '2xl'} md:text-3xl font-black text-white tracking-tight">mpintellect.com</div>
                <div class="text-${isStandard ? 'xs' : 'sm'} md:text-base ${currentStyle.text} uppercase tracking-widest">Access Pro Terminal →</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // ==============================================
  // TYPE: update (NEW - Massive Neural Feed Style)
  // ==============================================
  
if (type === "update") {
    const momentum = data.momentum || {};
    const rsi = momentum.rsi_latest || 50;
    const rsiMomentum = momentum.rsi_momentum || "neutral";
    
    const zones = data.zones || {};
    const pricePosition = zones.current_price_position || "unknown";
    const formattedPosition = pricePosition.replace(/_/g, " ").toUpperCase();
    
    // RSI State Logic for specific wording
    let rsiState = "NEUTRAL";
    let rsiColor = "#A78BFA"; 
    
    if (rsi > 70) { rsiState = "OVERBOUGHT"; rsiColor = "#EF4444"; }
    else if (rsi > 60) { rsiState = "BULLISH"; rsiColor = "#10B981"; }
    else if (rsi < 30) { rsiState = "OVERSOLD"; rsiColor = "#F59E0B"; }
    else if (rsi < 40) { rsiState = "BEARISH"; rsiColor = "#EF4444"; }

    return `
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@700&display=swap');
            body { font-family: 'Inter', sans-serif; background: #000; margin: 0; }
            .mono { font-family: 'JetBrains Mono', monospace; }
            .status-glow { text-shadow: 0 0 20px ${rsiColor}60; }
            .glass-card { 
                background: rgba(255, 255, 255, 0.02); 
                border: 1px solid rgba(255, 255, 255, 0.08); 
                backdrop-filter: blur(15px);
            }
            /* Universal fix for all sizes */
            * { box-sizing: border-box; max-width: 100%; }
            body { overflow: hidden; display: flex; align-items: center; justify-content: center; }
            .container { width: 100%; height: 100%; display: flex; flex-direction: column; }
            /* Standard size specific scaling */
            ${isStandard ? `
            .standard-scale {
              transform: scale(0.9);
              transform-origin: top center;
            }` : ''}
          </style>
        </head>
        <body class="text-white" style="width:${cfg.width}px; height:${cfg.height}px;">
          
          <div class="container p-${standardPadding} relative bg-[#020202] ${isStandard ? 'standard-scale' : ''}">
            
            <!-- Background Glow based on buy/sell -->
            <div class="absolute top-0 right-0 w-${isStandard ? 64 : 96} h-${isStandard ? 64 : 96} rounded-full blur-3xl" style="background: ${accent}10;"></div>
            
            <!-- LARGER HEADER - Standard optimized -->
            <div class="flex justify-between items-start mb-${isStandard ? 2 : headerMargin}">
              <div class="flex items-center gap-${isStandard ? 2 : 4}">
                <!-- BIGGER LOGO - Smaller for standard -->
                <img src="https://mpintellect.com/logos/mzlogo.webp" class="h-${isStandard ? 10 : (isMobile ? 14 : 16)}" />
                <div class="border-l-2 ${currentStyle.border} h-${isStandard ? 6 : (isMobile ? 10 : 12)}"></div>
                <div>
                  <div class="text-${isStandard ? 'xs' : 'sm'} ${currentStyle.text} uppercase tracking-widest">LIVE PRICE</div>
                  <div class="text-${isStandard ? '2xl' : '3xl'} md:text-4xl font-bold text-white">${formattedCurrent}</div>
                </div>
              </div>
              <div>
                <h1 class="text-${isStandard ? '4xl' : '6xl'} font-black tracking-tighter">${symbol}</h1>
                <p class="text-[${gold}] text-${isStandard ? '8' : 'xs'} font-bold tracking-[5px] uppercase mt-1">MPIntellect INTELLIGENCE</p>
              </div>
            </div>

            <!-- 2. DATA BAR (UPPER POSITION) - Standard optimized -->
            <div class="grid grid-cols-3 gap-${isStandard ? 2 : contentGap} mb-${isStandard ? 2 : headerMargin}">
                <div class="glass-card p-${isStandard ? 4 : 6} rounded-3xl text-center">
                    <p class="text-zinc-600 text-${isStandard ? '8' : '[10px]'} font-bold uppercase tracking-widest mb-1">Entry</p>
                    <p class="text-${isStandard ? '2xl' : '3xl'} font-bold mono">${formattedEntry}</p>
                </div>
                <div class="glass-card p-${isStandard ? 4 : 6} rounded-3xl text-center">
                    <p class="text-zinc-600 text-${isStandard ? '8' : '[10px]'} font-bold uppercase tracking-widest mb-1">Stop Loss</p>
                    <p class="text-${isStandard ? '2xl' : '3xl'} font-bold mono text-red-500">${formattedSL}</p>
                </div>
                <div class="glass-card p-${isStandard ? 4 : 6} rounded-3xl text-center">
                    <p class="text-zinc-600 text-${isStandard ? '8' : '[10px]'} font-bold uppercase tracking-widest mb-1">Target</p>
                    <p class="text-${isStandard ? '2xl' : '3xl'} font-bold mono text-[#10B981]">${formattedTP}</p>
                </div>
            </div>

            <!-- 3. MAIN DYNAMIC CONTENT (NEW UNIQUE STYLE) - Standard optimized -->
            <div class="flex-1 flex flex-col justify-center p-${isStandard ? 6 : 12} rounded-[${isStandard ? 30 : 50}px] border border-white/5 bg-gradient-to-br from-zinc-900/40 to-black relative">
                <!-- Status Badge -->
                <div class="inline-flex items-center gap-${isStandard ? 2 : 3} px-${isStandard ? 3 : 5} py-${isStandard ? 1 : 2} rounded-full bg-black border border-white/10 w-fit mb-${isStandard ? 4 : 8}">
                    <div class="w-${isStandard ? 1.5 : 2} h-${isStandard ? 1.5 : 2} rounded-full animate-ping" style="background:${rsiColor}"></div>
                    <span class="text-${isStandard ? '8' : 'xs'} font-black tracking-[4px]" style="color:${rsiColor}">${rsiState} DETECTED</span>
                </div>

                <!-- HUGE READABLE TEXT - Standard optimized -->
                <h2 class="text-${isStandard ? '4xl' : '6xl'} font-black leading-[1.1] tracking-tighter mb-${isStandard ? 4 : 10} status-glow">
                    ${symbol} is currently <span style="color:${rsiColor}">${rsiState}</span>. 
                    Structure at <span style="color:${accent}">${formattedPosition}</span> 
                    indicates <span style="color:${accent}">${finalDecision}</span> sequence.
                </h2>

                <div class="flex items-center gap-${isStandard ? 6 : 12}">
                    <div class="flex flex-col">
                        <span class="text-zinc-600 text-${isStandard ? '8' : '[10px]'} font-bold uppercase tracking-widest mb-1">RSI Score</span>
                        <div class="flex items-baseline gap-2">
                            <span class="text-${isStandard ? '4xl' : '5xl'} font-black" style="color:${rsiColor}">${rsi.toFixed(1)}</span>
                            <span class="text-zinc-500 font-bold uppercase text-${isStandard ? '8' : 'xs'}">${rsiMomentum}</span>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-zinc-600 text-${isStandard ? '8' : '[10px]'} font-bold uppercase tracking-widest mb-1">AI Confidence</span>
                        <span class="text-${isStandard ? '4xl' : '5xl'} font-black">${confidence}%</span>
                    </div>
                </div>
            </div>

            <!-- Footer with CTA - Standard optimized -->
            <div class="mt-${isStandard ? 2 : footerMargin} pt-${isStandard ? 1 : (cfg.height > 1000 ? 4 : 2)} border-t ${currentStyle.border} flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="w-${isStandard ? 6 : 8} h-${isStandard ? 6 : 8} rounded-full bg-gradient-to-r from-[${gold}] to-amber-700 flex items-center justify-center">
                  <span class="text-black font-bold text-${isStandard ? 'xs' : 'sm'}">AI</span>
                </div>
                <p class="${currentStyle.text} text-${isStandard ? 'xs' : 'sm'}">"Institutions are positioning ${isBuy ? 'long' : 'short'}"</p>
              </div>
              <div class="text-right">
                <div class="text-${isStandard ? 'lg' : '2xl'} font-black text-white tracking-tight">mpintellect.com</div>
                <div class="text-${isStandard ? '8' : 'xs'} ${currentStyle.text} uppercase tracking-widest">Access Pro Terminal →</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
}
  // Default to test if type not recognized
  }