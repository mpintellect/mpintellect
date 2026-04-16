import puppeteer from "@cloudflare/puppeteer";

// Helper: Fetch image from URL and return as Base64 for Puppeteer stability
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
  const storyId = searchParams.get("id");
  const partnerId = (searchParams.get("partner") || "default").toLowerCase();
  const imageType = searchParams.get("type") || "story"; // 'story' or 'cover'

  if (!storyId) return new Response("Missing Story ID", { status: 400 });

  let browser: any;

  try {
    // 🛡️ STEP 1: FETCH LIVE STORY DATA
    const dataRes = await fetch("https://data.mpintellect.com/Story-news.json");
    if (!dataRes.ok) throw new Error("Failed to fetch Story-news.json");
    const allStories = await dataRes.json();
    const story = allStories.find((s: any) => s.id === storyId);
    if (!story) throw new Error(`Story ID '${storyId}' not found in JSON`);

    // 🛡️ STEP 2: FETCH BRAND ASSETS (Logos & Background)
    const mzLogoUrl = "https://news.mpintellect.com/mzlogo.webp";
    const partnerLogoUrl = `https://news.mpintellect.com/lfmo1.webp`;

    // Get background image from story.image field (from JSON)
    const filename = story.image.includes('.') ? story.image : `${story.image}.webp`;
    const backgroundImageUrl = `https://news.mpintellect.com/${filename}`;

    const [mzLogo, partnerLogo, backgroundImage] = await Promise.all([
      fetchImageAsBase64(mzLogoUrl),
      fetchImageAsBase64(partnerLogoUrl),
      fetchImageAsBase64(backgroundImageUrl)
    ]);

    // 🛡️ STEP 3: RENDER ENGINE (Puppeteer)
    console.log(`🎨 Generating fresh ${imageType} Image for story: ${storyId}`);
    browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });

    // Choose HTML generator based on type
    const html = imageType === 'cover' 
      ? generateCoverHTML(story, mzLogo, partnerLogo)
      : generateStoryHTML(story, mzLogo, partnerLogo, backgroundImage);

    await page.setContent(html);
    await page.waitForNetworkIdle({ timeout: 2000 });
    const screenshot = await page.screenshot();

    await browser.close();
    
    // 🛡️ STEP 4: RETURN FRESH IMAGE (NO CACHE)
    return new Response(screenshot, { 
      headers: { 
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      } 
    });

  } catch (e: any) {
    console.error("💥 News Render Error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}

// ==================== STORY HTML ====================
function generateStoryHTML(story: any, mzLogo: string | null, partnerLogo: string | null, backgroundImage: string | null) {
  const gold = "#D4AF37";
  const white = "#FFFFFF";
  const dim = "#94a3b8";
  const electricBlue = "#1E3A6F";
  
  // Trend Variables
  const trend = story.trend || "NEUTRAL";
  const isLong = trend === "LONG" || trend === "BUY" || trend === "UP";
  const trendColor = isLong ? "#10B981" : "#EF4444";
  const trendArrow = isLong ? "▲" : "▼";
  const trendLabel = isLong ? "LONG" : "SHORT";
  
  // Volume Profile Variables (from story JSON or defaults)
  const volume = story.volume || {};
  const valueAreaLow = volume.value_area_low || "97.06";
  const valueAreaHigh = volume.value_area_high || "107.97";
  const pocPrice = volume.poc_price || "102.24";
  const pricePosition = volume.position_vs_poc || "above_poc";
  const volumeBias = volume.volume_bias || "bullish_accumulation";
  
  // Support/Resistance Variables
  const zones = story.zones || {};
  const supportZone = zones.support_zone || "107.22";
  const resistanceZone = zones.resistance_zone || "107.56";
  const zoneStrength = zones.zone_strength || "strong";
  const supportQuality = zones.support_quality || 1.0;
  const resistanceQuality = zones.resistance_quality || 1.1;
  const zoneWidth = zones.zone_width_pips || "34.3";
  const pricePositionZone = zones.current_price_position || "near_support";
  
  // Calculate percentage position for current price within value area
  const valueAreaLowNum = parseFloat(valueAreaLow) || 0;
  const valueAreaHighNum = parseFloat(valueAreaHigh) || 0;
  const currentPriceNum = parseFloat(story.current_price) || 107.22;
  let pricePercent = 50;

  if (valueAreaHighNum > valueAreaLowNum && currentPriceNum >= valueAreaLowNum && currentPriceNum <= valueAreaHighNum) {
    pricePercent = ((currentPriceNum - valueAreaLowNum) / (valueAreaHighNum - valueAreaLowNum)) * 100;
  } else if (currentPriceNum < valueAreaLowNum) {
    pricePercent = 0;
  } else if (currentPriceNum > valueAreaHighNum) {
    pricePercent = 100;
  }
  
  const backgroundStyle = backgroundImage 
    ? `background: linear-gradient(0deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.6) 100%), url('${backgroundImage}');`
    : `background: linear-gradient(145deg, #050505 0%, #121212 100%);`;

  return `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;900&display=swap');
          
          body { 
            font-family: 'Inter', 'Noto Sans Arabic', sans-serif; 
            color: white; 
            margin: 0; 
            overflow: hidden; 
            ${backgroundStyle} 
            background-size: cover; 
            background-position: center;
          }

          .glass-header { 
            background: rgba(0,0,0,0.5); 
            backdrop-filter: blur(15px);
            border-radius: 100px; 
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
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
            line-height: 1.3;
          }

          .headline-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 35px;
            padding: 40px;
            position: relative;
            box-shadow: inset 0 0 20px rgba(212, 175, 55, 0.05);
          }

          .headline-card::after {
            content: '';
            position: absolute;
            bottom: 0; right: 40px; left: 40px;
            height: 1px;
            background: linear-gradient(90deg, transparent, ${gold}, transparent);
            opacity: 0.3;
          }

          .mono { font-family: 'JetBrains Mono', monospace; }
          
          .label-light {
            color: ${gold};
            font-size: 20px;
            letter-spacing: 5px;
            text-transform: uppercase;
            font-weight: 500;
          }

          .metric-box {
            border-left: 1px solid rgba(255,255,255,0.1);
            padding-left: 25px;
          }
        </style>
      </head>
      <body style="width: 1080px; height: 1920px; padding: 140px 60px 80px 60px; display: flex; flex-direction: column;">
        
        <!-- HEADER -->
        <div class="header-container" style="
          display: grid; 
          grid-template-columns: 1fr auto 1fr;
          align-items: center; 
          margin: 0 auto 60px auto; 
          padding: 15px 50px; 
          background: rgba(0, 0, 0, 0.71); 
          backdrop-filter: blur(15px); 
          border-radius: 100px; 
          border: 1px solid rgba(255,255,255,0.1); 
          width: 800px;
        ">
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.6px; padding-right: 30px;">
            <img src="${mzLogo}" style="height: 66px;" />
            <span style="font-size: 22px; font-weight: 300; letter-spacing: 2px; color: white;">MPIntellect.COM</span>
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
        <div style="margin-bottom: 60px; display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <div class="symbol-pill" style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 56px; font-weight: 900; letter-spacing: -1px; color: white;">${story.symbol}</span>
            <div style="display: inline-flex; align-items: center; gap: 4px; background: ${trendColor}20; border: 1px solid ${trendColor}; border-radius: 40px; padding: 6px 14px;">
              <span style="color: ${trendColor}; font-size: 24px; font-weight: 900;">${trendArrow}</span>
              <span style="color: ${trendColor}; font-size: 18px; font-weight: 600; text-transform: uppercase;">${trendLabel}</span>
            </div>
          </div>
          <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 40px; padding: 8px 20px 8px 15px; backdrop-filter: blur(5px);">
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 600; color: #EF4444; letter-spacing: 1px; text-transform: uppercase;">
              Trading Session: ${story.session}
            </span>
          </div>
        </div>

        <!-- Date -->
        <div class="mono" style="color: ${dim}; font-size: 24px; margin-top: 10px; letter-spacing: 2px;">
          RELEASED: ${story.date}
        </div>

        <!-- CATEGORY BADGE -->
        <div class="label-light" style="margin-bottom: 30px;">
          ⚡ ${story.category} Briefing
        </div>

        <!-- MAIN HEADLINE BLOCK -->
        <div class="headline-card" style="margin-bottom: 60px;">
          <h2 class="headline-text rtl-text" style="font-size: 76px; font-weight: 700; color: white;">
            ${story.headline}
          </h2>
        </div>

        <!-- CONTEXT AREA -->
        <div style="flex: 1;">
          <div style="border-right: 4px solid ${gold}; padding-right: 30px; margin-bottom: 60px;">
            <p class="rtl-text" style="font-size: 44px; font-weight: 300; color: #e2e8f0; line-height: 1.6;">
              "${story.aiContext}"
            </p>
          </div>

          <!-- DATA GRID -->
          <div style="display: flex; gap: 80px; margin-top: 20px;">
            <div class="metric-box" style="border-color: ${gold}40;">
              <span style="color: ${dim}; font-size: 18px; text-transform: uppercase; letter-spacing: 3px; display: block; margin-bottom: 10px;">Market Impact</span>
              <span style="font-size: 52px; font-weight: 700; color: ${gold};">${story.impact}</span>
            </div>
          </div>
        </div>

        <!-- INSTITUTIONAL FOOTER -->
        <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.1px;">
          <div class="mono" style="color: #475569; font-size: 18px; letter-spacing: 8px; text-transform: uppercase; margin-bottom: 1px;">
            Institutional Analysis Feed
          </div>
          <div style="font-size: 12px; color: #334155; letter-spacing: 2px;">
            MPIntellect  SYSTEM • © 2026 GLOBAL DATA RESEARCH
          </div>
        </div>

      </body>
    </html>
  `;
}
function generateCoverHTML(story: any, mzLogo: string | null, partnerLogo: string | null) {}