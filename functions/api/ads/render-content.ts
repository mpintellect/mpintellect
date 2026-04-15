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
  const imageType = searchParams.get("type") || "bonus"; // Only bonus type for this version

  if (imageType !== 'bonus') return new Response("This endpoint only supports bonus images", { status: 400 });

  let browser: any;

  try {
    // 🛡️ STEP 1: FETCH PARTNER LOGO ONLY
    const partnerLogoUrl = `https://news.mpintellect.com/lftrnas.webp`;
    const partnerLogo = await fetchImageAsBase64(partnerLogoUrl);

    // 🛡️ STEP 2: RENDER ENGINE (Puppeteer)
    console.log(`🎨 Generating fresh bonus image`);
    browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    
    // Set viewport for Instagram post
    await page.setViewport({ width: 1080, height: 1350 });

    // Generate bonus HTML
    const html = generateBonusPostHTML(partnerLogo);

    await page.setContent(html);
    await page.waitForNetworkIdle({ timeout: 2000 });
    const screenshot = await page.screenshot();

    await browser.close();
    
    // 🛡️ STEP 3: RETURN FRESH IMAGE
    return new Response(screenshot, { 
      headers: { 
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      } 
    });

  } catch (e: any) {
    console.error("💥 Render Error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}

// ==================== CLEAN BONUS POST HTML (LiteFinance Morocco Only) ====================
function generateBonusPostHTML(partnerLogo: string | null) {
  const gold = "#D4AF37";
  const emerald = "#10B981";
  const deepBlue = "#2563EB"; // Lighter, more vibrant blue
  const black = "#1E1E1E"; // Lighter black (charcoal instead of pure black)
 const forest = "#065F46"; // Darker green
  const olive = "#3D6216"; // Deep olive
  const amber = "#B45309"; // Darker amber/gold
  const deepBase = "#0F1720"; // Very dark base

  // DARKER GREEN & YELLOW BACKGROUND
  const backgroundStyle = `
    background-color: ${deepBase};
    background-image: 
      /* 1. Very subtle grid */
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px),
      
      /* 2. Deep Forest Green (Dominant) */
      radial-gradient(circle at 30% 40%, ${forest}60 0%, transparent 70%),
      
      /* 3. Rich Emerald (Secondary) */
      radial-gradient(circle at 70% 30%, ${emerald}40 0%, transparent 70%),
      
      /* 4. Dark Gold/Amber (Accent) */
      radial-gradient(circle at 80% 70%, ${amber}50 0%, transparent 70%),
      
      /* 5. Olive undertone */
      radial-gradient(circle at 20% 80%, ${olive}40 0%, transparent 70%),
      
      /* 6. Gold glow (center) */
      radial-gradient(circle at 50% 50%, ${gold}30 0%, transparent 60%),
      
      /* 7. Deepening layer */
      radial-gradient(circle at 50% 50%, rgba(0,0,0,0.3) 0%, transparent 80%);
      
    background-size: 100px 100px, 100px 100px, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%;
    background-blend-mode: overlay, overlay, screen, screen, screen, screen, screen, multiply;
  `;


  return `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&family=JetBrains+Mono:wght@500;800&display=swap" rel="stylesheet">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;400;900&display=swap');
          
          body { 
            font-family: 'Tajawal', sans-serif; 
            color: white; margin: 0; overflow: hidden; 
            ${backgroundStyle}
            height: 1350px; width: 1080px;
            display: flex; flex-direction: column; align-items: center;
          }

          .mono { font-family: 'JetBrains Mono', monospace; }

          /* TOP FLOATING LOGO - MAXIMUM IMPACT */
          .big-logo-stage {
            margin-top: 100px;
            z-index: 80;
            position: relative;
          }
          .big-logo-stage img {
            height: 300px; /* Large and prominent */
            filter: drop-shadow(0 20px 40px rgba(0,0,0,0.7));
          }

          /* MAIN OFFER SECTION */
          .hero-content {
            flex: 1;
            display: flex; flex-direction: column;
            justify-content: center; align-items: center;
            text-align: center;
            width: 100%;
            margin-top: -40px;
            z-index: 50;
          }

          .arabic-headline {
            direction: rtl;
            font-size: 68px;
            font-weight: 300;
            letter-spacing: 1px;
            color: rgba(255,255,255,0.9);
            margin-bottom: 0px;
            text-shadow: 0 5px 15px rgba(0,0,0,0.5);
          }

          .bonus-giant {
  position: relative;
  z-index: 10;
  font-family: 'Inter', sans-serif;
  font-size: 360px; /* Massive size */
  font-weight: 900;
  line-height: 0.8;
  letter-spacing: -15px;
  /* Premium Tri-Tone Gradient */
  background: linear-gradient(180deg, #FFFFFF 20%, ${gold} 50%, #8e793e 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 20px 50px rgba(0,0,0,0.8));
}

          .tagline-pill {
            direction: rtl;
            background: rgba(16, 185, 129, 0.15); /* Emerald Tint */
            border: 1px solid ${emerald};
            color: white;
            padding: 12px 60px;
            border-radius: 100px;
            font-size: 44px;
            font-weight: 700;
            box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
            backdrop-filter: blur(10px);
          }

          /* UPDATED PROMO SECTION: THE VAULT ACCESS TICKET */
.promo-footer {
  margin-bottom: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 50;
  width: 100%;
}

.promo-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 24px;
  padding: 30px 80px;
  position: relative;
  box-shadow: 0 25px 50px rgba(0,0,0,0.6), inset 0 0 20px rgba(212, 175, 55, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

/* Corner Accents for the "Document" feel */
.promo-card::before {
  content: 'ACCESS KEY';
  position: absolute;
  top: 10px;
  left: 20px;
  font-family: 'JetBrains Mono';
  font-size: 10px;
  letter-spacing: 3px;
  color: ${gold};
  opacity: 0.5;
}

.promo-label {
  direction: rtl;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 2px;
  color: #94a3b8; /* Dim Slate */
  margin-bottom: 10px;
  text-transform: uppercase;
}

.promo-code-box {
  font-family: 'JetBrains Mono', monospace;
  font-size: 82px; /* Massive and clear */
  font-weight: 800;
  letter-spacing: 12px;
  color: white;
  text-shadow: 0 0 40px rgba(212, 175, 55, 0.4);
  margin-left: 12px; /* Centers the extra spacing on the last letter */
}

.promo-status {
  margin-top: 15px;
  font-size: 14px;
  color: ${emerald};
  font-family: 'JetBrains Mono';
  letter-spacing: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-blink {
  width: 6px; height: 6px;
  background: ${emerald};
  border-radius: 50%;
  box-shadow: 0 0 10px ${emerald};
  animation: blink 1.5s infinite;
}

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        </style>
      </head>
      <body>
        
        <!-- 1. FLOATING PARTNER LOGO -->
        <div class="big-logo-stage">
          <img src="${partnerLogo}" alt="LiteFinance Morocco" />
        </div>

        <!-- 2. THE MAIN HERO -->
<div class="hero-content">
  <div class="arabic-headline">LiteFinance تهنئكم بحلول عيد الفطر المبارك</div>
          
          
          
        </div>

      </body>
    </html>
  `;
}