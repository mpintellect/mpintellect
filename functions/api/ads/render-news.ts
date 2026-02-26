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

// Fetch symbol-specific background image
async function fetchSymbolBackground(symbol: string) {
  const symbolMap: Record<string, string> = {
    'XAUUSD': 'xauusd',
    'BTCUSD': 'btcusd6',
    'EURUSD': 'EURUSD8',
    'GLOBAL': 'global3',
    'NASDAQ': 'nasdaq',
    'US30': 'us30',
    'BRENT': 'BRENT6',
    'EURJPY': 'eurjpy3',
  };
  const filename = symbolMap[symbol.toUpperCase()] || 'global';
  const url = `https://news.mzprimer.com/${filename}.webp`;
  return await fetchImageAsBase64(url);
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
    const dataRes = await fetch("https://data.mzprimer.com/Story-news.json");
    if (!dataRes.ok) throw new Error("Failed to fetch Story-news.json");
    const allStories = await dataRes.json();
    const story = allStories.find((s: any) => s.id === storyId);
    if (!story) throw new Error(`Story ID '${storyId}' not found in JSON`);

    // 🛡️ STEP 2: FETCH BRAND ASSETS (Logos & Background)
    const mzLogoUrl = "https://news.mzprimer.com/mzlogo.webp";
    const partnerLogoUrl = `https://news.mzprimer.com/lfmo1.webp`;

    const [mzLogo, partnerLogo, backgroundImage] = await Promise.all([
      fetchImageAsBase64(mzLogoUrl),
      fetchImageAsBase64(partnerLogoUrl),
      fetchSymbolBackground(story.symbol)
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
        "Cache-Control": "no-cache, no-store, must-revalidate", // Prevents caching
        "Pragma": "no-cache",
        "Expires": "0"
      } 
    });

  } catch (e: any) {
    console.error("💥 News Render Error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  } finally {
    // ✅ CRITICAL: Clean up browser session
    if (browser) await browser.close();
  }
}

// ==================== STORY HTML (Original - No Changes) ====================
function generateStoryHTML(story: any, mzLogo: string | null, partnerLogo: string | null, backgroundImage: string | null) {
  const gold = "#D4AF37";
  const white = "#FFFFFF";
  const dim = "#94a3b8";
  const electricBlue = "#1E3A6F"; 
  
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
        
   <!-- HEADER (EXACTLY THE SAME) -->
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
          <!-- Left Column: MZ Logo -->
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.6px; padding-right: 30px;">
  <img src="${mzLogo}" style="height: 66px;" />
  <span style="font-size: 22px; font-weight: 300; letter-spacing: 2px; color: white;">MZPRIMER.COM</span>
</div>
          <!-- Middle Column: The Divider -->
          <div style="width: 1px; height: 45px; background: rgba(255,255,255,0.25);"></div>
          <!-- Right Column: Partner Logo -->
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
        <div style="margin-bottom: 60px;">
          <div class="symbol-pill">
            <span style="font-size: 56px; font-weight: 900; letter-spacing: -1px; color: white;">${story.symbol}</span>
          </div>
          <div class="mono" style="color: ${dim}; font-size: 24px; margin-top: 20px; letter-spacing: 2px;">
            RELEASED: ${story.date}
          </div>
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
              <span style="font-size: 52px; font-weight: 700; color: ${gold};">HIGH</span>
            </div>
          </div>
        </div>

        <!-- INSTITUTIONAL FOOTER -->
        <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.1px;">
          <div class="mono" style="color: #475569; font-size: 18px; letter-spacing: 8px; text-transform: uppercase; margin-bottom: 1px;">
            Institutional Analysis Feed
          </div>
          <div style="font-size: 12px; color: #334155; letter-spacing: 2px;">
            MZPRIMER INTELLIGENCE SYSTEM • © 2026 GLOBAL DATA RESEARCH
          </div>
        </div>

      </body>
    </html>
  `;
}

function generateCoverHTML(story: any, mzLogo: string | null, partnerLogo: string | null) {
  const gold = "#D4AF37";
  const deepBlue = "#0A1929";
  const electricBlue = "#1E3A6F"; 
  const emerald = "#10B981"; 
  const black = "#050505";
  const white = "#FFFFFF";
  const sunsetPurple = "#8B5CF6";


const sapphire = "#3B82F6";

const deepBlack = "#030712";
const charcoal = "#111827";
const steelBlue = "#1E40AF";
const forest = "#047857";

const backgroundStyle = `
  background-color: ${deepBlack};
  background-image: 
    /* 1. Black on black texture - carbon fiber vibe */
    repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 8px),
    
    /* 2. GOLD VEINS (Top) - like precious metal */
    radial-gradient(circle at 70% 20%, ${gold}35 0%, transparent 60%),
    radial-gradient(circle at 30% 10%, ${gold}25 0%, transparent 50%),
    
    /* 3. SAPPHIRE DEPTHS (Bottom Right) */
    radial-gradient(circle at 85% 80%, ${sapphire}30 0%, transparent 60%),
    
    /* 4. EMERALD SHADOWS (Bottom Left) */
    radial-gradient(circle at 15% 85%, ${emerald}28 0%, transparent 60%),
    
    /* 5. STEEL BLUE ACCENTS (Mid) */
    radial-gradient(circle at 40% 40%, ${steelBlue}20 0%, transparent 50%),
    
    /* 6. FOREST DEPTH (Center) */
    radial-gradient(circle at 60% 60%, ${forest}18 0%, transparent 50%),
    
    /* 7. CHARCOAL BASE with black core */
    linear-gradient(145deg, ${deepBlack} 0%, ${charcoal} 40%, ${deepBlack} 100%);
    
  background-size: 30px 30px, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%;
  background-blend-mode: overlay, screen, screen, screen, screen, screen, screen, normal;
`;

  return `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;400;500;700;900&family=JetBrains+Mono:wght@300;800&display=swap" rel="stylesheet">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;700;900&display=swap');
          
          body { 
            font-family: 'Tajawal', 'Inter', sans-serif; 
            color: white; margin: 0; overflow: hidden; 
            ${backgroundStyle}
            background-size: cover; 
            background-position: center;
            height: 1920px; width: 1080px;
            display: flex; flex-direction: column; align-items: center;
            position: relative;
          }

          /* PREMIUM OVERLAY FOR DEPTH */
          body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 80% 20%, ${gold}10 0%, transparent 40%),
                        radial-gradient(circle at 10% 90%, ${emerald}10 0%, transparent 40%),
                        radial-gradient(circle at 50% 50%, ${electricBlue}15 0%, transparent 60%);
            pointer-events: none;
            z-index: 1;
          }

          .mono { font-family: 'JetBrains Mono', monospace; }

          /* HEADER FROM CODE 2 - EXECUTIVE HEADER */
          .executive-header {
            background: rgba(0, 0, 0, 0.91);
            backdrop-filter: blur(30px);
            border-radius: 180px;
            border: 1px solid rgba(212, 175, 55, 0.2);
            box-shadow: 0 30px 60px rgba(0,0,0,0.9);
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            padding: 30px 70px;
            width: 920px;
            margin: 120px auto 50px auto;
            position: relative;
            z-index: 10;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            cursor: pointer;
          }

          .executive-header:hover {
            background: rgba(15, 15, 15, 0.9);
            border-color: ${gold}80;
            box-shadow: 0 30px 60px ${gold}30;
            transform: translateY(-2px);
          }

          .executive-header:hover .header-logo {
            filter: drop-shadow(0 0 20px ${gold}80);
          }

          .executive-header:hover .header-text {
            color: ${gold};
          }

          .executive-header:hover .partner-logo {
            filter: drop-shadow(0 0 20px ${gold}80);
            transform: scale(1.02);
          }

          .header-logo {
            height: 90px;
            filter: drop-shadow(0 5px 15px rgba(0,0,0,0.5));
            transition: all 0.3s ease;
          }

          .header-text {
            font-size: 30px;
            font-weight: 400;
            letter-spacing: 4px;
            font-family: 'Inter';
            color: white;
            transition: color 0.3s ease;
          }

          .partner-logo {
            height: 80px;
            border-radius: 18px;
            filter: drop-shadow(0 5px 15px rgba(0,0,0,0.5));
            transition: all 0.3s ease;
          }

          .partner-text {
            color: ${gold};
            font-size: 28px;
            font-weight: 800;
            font-family: 'Inter';
            letter-spacing: 3px;
            text-shadow: 0 0 15px ${emerald}60;
            transition: all 0.3s ease;
          }

          /* 2. SUBTITLE - TOP POSITION */
          .authority-subtitle {
            direction: rtl;
            text-align: center;
            margin-top: 40px;
            max-width: 900px;
            z-index: 10;
            position: relative;
          }

          /* 3. CENTER APERTURE (THE HOOK) */
          .aperture-stage {
            flex: 2;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            z-index: 10;
            padding-bottom: 300px;
          }

          /* Corner Brackets */
          .corner {
            position: absolute;
            width: 80px; height: 80px;
            border: 2px solid ${gold};
            opacity: 0.4;
            z-index: 5;
          }
          .tl { top: 25%; left: 100px; border-right: 0; border-bottom: 0; }
          .tr { top: 25%; right: 100px; border-left: 0; border-bottom: 0; }
          .bl { bottom: 25%; left: 100px; border-right: 0; border-top: 0; }
          .br { bottom: 25%; right: 100px; border-left: 0; border-top: 0; }

          .hook-text-ar {
            direction: rtl;
            text-align: center;
            z-index: 10;
          }

          .label-thin {
            font-size: 80px;
            font-weight: 200;
            letter-spacing: 20px;
            color: ${gold};
            text-transform: uppercase;
            margin-bottom: -20px;
          }

          .label-bold {
            font-size: 280px;
            font-weight: 900;
            line-height: 0.9;
            background: linear-gradient(180deg, #fff 40%, rgba(255,255,255,0.7) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 20px 50px rgba(0,0,0,0.5);
          }
            /* FULL IMAGE BORDER CADRE */
body::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  border: 2px solid ${gold};
  opacity: 0.3;
  pointer-events: none;
  z-index: 20;
  border-radius: 40px;
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.2);
}

        </style>
      </head>
      <body>
        
        <!-- APERTURE FRAME ELEMENTS -->
        <div class="corner tl"></div><div class="corner tr"></div>
        <div class="corner bl"></div><div class="corner br"></div>

        <!-- 1. HEADER FROM CODE 2 -->
        <div class="executive-header">
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 20px; padding-right: 30px;">
            <img src="${mzLogo}" class="header-logo" />
            <span class="header-text">MZPRIMER.COM</span>
          </div>
          
          <div style="width: 2px; height: 70px; background: linear-gradient(180deg, transparent, ${gold}, ${electricBlue}, ${gold}, transparent);"></div>
          
          <div style="display: flex; align-items: center; justify-content: flex-start; padding-left: 50px;">
            ${partnerLogo ? 
              `<img src="${partnerLogo}" class="partner-logo" />` : 
              `<span class="partner-text">LITEFINANCE</span>`
            }
          </div>
        </div>

        <!-- 2. ARABIC SUBTITLE -->
        <div class="authority-subtitle">
          <p style="font-size: 60px; font-weight: 400; color: white; margin-bottom: 5px;">السياق يغير كل شيء.</p>
          <p style="font-size: 39px; font-weight: 300; color: ${gold}; letter-spacing: 1px;"> ما يجب معرفته قبل بدء التداول اليوم</p>
        </div>

        <!-- 3. MAIN HOOK STAGE (CENTER) - NO FOOTER -->
        <div class="aperture-stage">
          <div class="hook-text-ar">
            <div class="label-thin">إيجاز</div>
            <div class="label-bold">اليوم</div>
          </div>
          
          <div style="
  font-family: 'JetBrains Mono', monospace;
  font-size: 52px;
  font-weight: 400;
  letter-spacing: 10px;
  color: white;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(0,0,0,0.3) 100%);
  padding: 18px 60px;
  border-radius: 80px;
  border: 1px solid ${gold}30;
  border-bottom: 3px solid ${gold}60;
  backdrop-filter: blur(12px);
  margin-top: 70px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(212, 175, 55, 0.2) inset;
  text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
">

  <!-- Subtle gold shimmer effect -->
  <div style="
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
    animation: shimmer 3s infinite;
  "></div>
  
  ${story.date.replace(/-/g, ' • ')}
</div>

<style>
  @keyframes shimmer {
    0% { left: -100%; }
    20% { left: 100%; }
    100% { left: 100%; }
  }
</style>
        </div>

        <!-- FOOTER REMOVED COMPLETELY -->

      </body>
    </html>
  `;
}