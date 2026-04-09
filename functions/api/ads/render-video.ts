// functions/api/ads/render-video.ts
import puppeteer from "@cloudflare/puppeteer";
import JSZip from 'jszip';

// Fetch market data from your R2 or API
async function fetchMarketData(symbol: string, env: any) {
  try {
    const response = await fetch(`https://data.mzprimer.com/output_${symbol}.json`);
    if (response.ok) {
      const data = await response.json();
      return {
        ...data,
        mzLogo: "https://news.mzprimer.com/mzlogo.webp",
        partnerLogo: "https://news.mzprimer.com/lfmo1.webp"
      };
    }
  } catch (e) {
    console.log("API fetch failed, using fallback");
  }
  
  return {
    symbol: symbol,
    final_decision: "SELL",
    trend: { current_price: 1.15141 },
    momentum: { rsi_latest: 44.27 },
    volume: { volume_bias: "bearish_distribution" },
    zones: {
      support_zone: 1.15015,
      resistance_zone: 1.16292,
      support_quality: 1.0,
      resistance_quality: 1.0
    },
    mzLogo: "https://news.mzprimer.com/mzlogo.webp",
    partnerLogo: "https://news.mzprimer.com/lfmo1.webp"
  };
}


function generateAnimatedHTML(data: any, frame: number, totalFrames: number) {
  const gold = "#D4AF37";
  const dim = "#94a3b8";
  
  // Extract data from market JSON
  const symbol = data.symbol || "EURUSD";
  const currentPrice = data.trend?.current_price || 1.16013;
  const rsi = data.momentum?.rsi_latest || 37.13;
  const finalDecision = data.final_decision || "SELL";
  const volumeBias = data.volume?.volume_bias || "bearish_distribution";
  
  // Support/Resistance from zones
  const resistanceZone = data.zones?.resistance_zone || "1.17173";
  const supportZone = data.zones?.support_zone || "1.15937";
  const resistanceStrength = data.zones?.resistance_quality || 1.0;
  const supportStrength = data.zones?.support_quality || 1.0;
  
  // Session from sessions data
  const sessionName = data.sessions?.session_name || "New York";
  
  // Trend variables
  const trend = data.trend?.trend || "weak_bearish";
  const isBearish = trend.includes("bearish");
  const trendColor = isBearish ? "#EF4444" : "#10B981";
  const trendArrow = isBearish ? "▼" : "▲";
  const trendLabel = isBearish ? "SHORT" : "LONG";
  
  // Date from generated_at
  // Date from timestamp (format: 2026-04-01T17:39:14.325748+00:00)
const timestamp = data.trend?.timestamp || data.generated_at || new Date().toISOString();
const date = new Date(timestamp);

// Format as: 01-04-2026 17:39
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0');
const year = date.getFullYear();
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');

const releaseDate = `${day}-${month}-${year} ${hours}:${minutes}`;
  
  // Category (always TECHNICAL ANALYSIS BRIEFING)
  const category = "TECHNICAL ANALYSIS BRIEFING";
  
  // Animation progress
  const progress = frame / totalFrames;
  const pulseScale = 1 + Math.sin(progress * Math.PI * 4) * 0.02;
  const battlePos = 20 + Math.sin(progress * Math.PI * 2) * 30;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          width: 1080px;
          height: 1920px;
          background: linear-gradient(145deg, #050505 0%, #0a0a0a 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          display: flex;
          flex-direction: column;
          padding: 40px 60px;
          position: relative;
          overflow: hidden;
        }
        
        /* Glow background */
        .glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 30%, rgba(212,175,55,0.1), transparent 70%);
          animation: pulseGlow 3s infinite;
          pointer-events: none;
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        /* HEADER */
        .header-container {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 15px;
          margin: 0 auto 40px auto;
          padding: 12px 40px;
          background: rgba(0, 0, 0, 0.71);
          backdrop-filter: blur(15px);
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          width: 800px;
          animation: headerPulse 2s infinite;
          z-index: 10;
        }
        
        @keyframes headerPulse {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); border-color: rgba(212,175,55,0.3); }
        }
        
        .header-logo { height: 66px; }
        .header-text { font-size: 22px; font-weight: 300; letter-spacing: 2px; color: white; }
        .header-divider { width: 1px; height: 45px; background: rgba(255,255,255,0.25); }
        .partner-logo { height: 66px; border-radius: 12px; }
        
        /* INSTITUTIONAL SUBTITLE */
        .institutional-subtitle {
          text-align: center;
          margin-bottom: 30px;
          animation: subtitleFade 3s infinite;
        }
        
        @keyframes subtitleFade {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        .subtitle-text {
          font-size: 18px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 6px;
          color: #94a3b8;
        }
        
        /* SYMBOL SECTION */
        .identity-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-top: 20px;
          margin-bottom: 30px;
        }
        
        .symbol-pill {
          background: linear-gradient(90deg, ${gold}20, transparent);
          border-left: 3px solid ${gold};
          padding: 8px 30px;
          border-radius: 4px 40px 40px 4px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .symbol-text {
          font-size: 56px;
          font-weight: 900;
          letter-spacing: -1px;
          color: white;
        }
        
        .trend-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: ${trendColor}20;
          border: 1px solid ${trendColor};
          border-radius: 40px;
          padding: 6px 14px;
        }
        
        .trend-arrow {
          font-size: 24px;
          font-weight: 900;
          color: ${trendColor};
        }
        
        .trend-label {
          font-size: 18px;
          font-weight: 600;
          text-transform: uppercase;
          color: ${trendColor};
        }
        
        .session-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 40px;
          padding: 8px 20px;
          backdrop-filter: blur(5px);
        }
        
        .session-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 18px;
          font-weight: 600;
          color: #EF4444;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        
        /* CATEGORY BADGE */
        .category-badge {
          text-align: left;
          margin-bottom: 20px;
        }
        
        .category-text {
          color: ${gold};
          font-size: 14px;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 500;
        }
        
        /* DATE */
        .date-text {
          font-family: 'JetBrains Mono', monospace;
          color: ${dim};
          font-size: 12px;
          letter-spacing: 1px;
          text-align: left;
          margin-bottom: 20px;
        }
        
        /* PRICE */
        .price {
          font-size: 96px;
          font-weight: 900;
          color: ${gold};
          text-align: center;
          margin: 30px 0;
          transform: scale(${pulseScale});
          text-shadow: 0 0 ${20 + Math.sin(progress * Math.PI * 4) * 15}px ${gold};
        }
        
        /* STATS ROW */
        .stats-row {
          display: flex;
          gap: 20px;
          margin: 30px 0;
          justify-content: center;
        }
        
        .stat-card {
          background: rgba(0,0,0,0.3);
          padding: 20px;
          border-radius: 24px;
          text-align: center;
          min-width: 140px;
          backdrop-filter: blur(10px);
        }
        
        .stat-label { color: #94a3b8; font-size: 12px; margin-bottom: 12px; }
        .trend-arrow-large { font-size: 48px; animation: bounce 0.8s infinite; display: inline-block; }
        .rsi-value { font-size: 28px; font-weight: 700; }
        .volume-value { font-size: 24px; font-weight: 700; }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        
        /* LEVEL BARS */
        .level-section { width: 100%; margin: 20px 0; }
        .level-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .bar-bg { height: 32px; background: rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; }
        .bar-fill { height: 100%; width: ${resistanceStrength * 100}%; background: linear-gradient(90deg, #EF4444, #F87171); border-radius: 16px; }
        .bar-fill-support { width: ${supportStrength * 100}%; background: linear-gradient(90deg, #10B981, #34D399); }
        
        /* BATTLE SLIDER */
        .battle-slider {
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          position: relative;
          margin: 40px 0;
        }
        
        .battle-ball {
          position: absolute;
          width: 20px;
          height: 20px;
          background: ${gold};
          border-radius: 50%;
          top: -8px;
          left: ${battlePos}%;
          box-shadow: 0 0 20px ${gold};
        }
        
        /* FOOTER */
        .institutional-footer {
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 20px;
          margin-top: auto;
        }
        
        .footer-mono {
          font-family: 'JetBrains Mono', monospace;
          color: #475569;
          font-size: 18px;
          letter-spacing: 8px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        
        .footer-copyright {
          font-size: 12px;
          color: #334155;
          letter-spacing: 2px;
        }
        
        .red-text { color: #EF4444; }
        .green-text { color: #10B981; }
      </style>
    </head>
    <body>
      <div class="glow"></div>
      
      <!-- HEADER -->
      <div class="header-container">
        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-right: 30px;">
          <img src="https://news.mzprimer.com/mzlogo.webp" class="header-logo" />
          <span class="header-text">MZPRIMER.COM</span>
        </div>
        <div class="header-divider"></div>
        <div style="display: flex; align-items: center; justify-content: flex-start; padding-left: 40px;">
          <img src="https://news.mzprimer.com/lfmo1.webp" class="partner-logo" />
        </div>
      </div>
      
      <!-- SUBTITLE -->
      <div class="institutional-subtitle">
        <p class="subtitle-text">Context changes everything. What you need to know before you trade.</p>
      </div>
      
      <!-- IDENTITY SECTION: Symbol + Trend + Session -->
      <div class="identity-section" style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 30px; margin-top: 20px;">
        <div class="symbol-pill">
          <span class="symbol-text">${symbol}</span>
          <div class="trend-badge">
            <span class="trend-arrow">${trendArrow}</span>
            <span class="trend-label">${trendLabel}</span>
          </div>
        </div>
        <div class="session-badge">
          <span class="session-text">Trading Session: ${sessionName}</span>
        </div>
      </div>
      
      <!-- CATEGORY BADGE - CHANGE TO LEFT ALIGN -->
<div class="category-badge" style="text-align: left; margin-bottom: 20px;">
  <span class="category-text">⚡ ${category}</span>
</div>
      
      <!-- DATE - CHANGE TO LEFT ALIGN, SMALLER FONT -->
<div class="date-text" style="font-family: 'JetBrains Mono', monospace; color: ${dim}; font-size: 14px; letter-spacing: 1px; text-align: left; margin-bottom: 20px;">
  RELEASED: ${releaseDate}
</div>
      
      <!-- PRICE -->
      <div class="price">${currentPrice.toFixed(5)}</div>
      
      <!-- STATS ROW -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-label">TREND</div>
          <div class="trend-arrow-large">${trendArrow}</div>
          <div class="red-text">${finalDecision}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">RSI</div>
          <div class="rsi-value">${rsi.toFixed(1)}</div>
          <div class="${rsi > 60 ? 'green-text' : rsi < 40 ? 'red-text' : ''}">${rsi > 60 ? 'BULLISH' : rsi < 40 ? 'BEARISH' : 'NEUTRAL'}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">VOLUME</div>
          <div class="volume-value">${volumeBias === 'bullish_accumulation' ? '▲ BUY' : '▼ SELL'}</div>
          <div class="${volumeBias === 'bullish_accumulation' ? 'green-text' : 'red-text'}">${volumeBias === 'bullish_accumulation' ? 'ACCUMULATION' : 'DISTRIBUTION'}</div>
        </div>
      </div>
      
      <!-- RESISTANCE BAR -->
      <div class="level-section">
        <div class="level-header">
          <span style="color: #EF4444;">⚔️ RESISTANCE</span>
          <span style="color: #EF4444;">${(resistanceStrength * 100).toFixed(0)}%</span>
        </div>
        <div class="bar-bg"><div class="bar-fill"></div></div>
        <div style="color: #EF4444; margin-top: 8px;">${resistanceZone}</div>
      </div>
      
      <!-- SUPPORT BAR -->
      <div class="level-section">
        <div class="level-header">
          <span style="color: #10B981;">🛡️ SUPPORT</span>
          <span style="color: #10B981;">${(supportStrength * 100).toFixed(0)}%</span>
        </div>
        <div class="bar-bg"><div class="bar-fill bar-fill-support"></div></div>
        <div style="color: #10B981; margin-top: 8px;">${supportZone}</div>
      </div>
      
      <!-- BATTLE SLIDER -->
      <div class="battle-slider"><div class="battle-ball"></div></div>
      <div style="color: #94a3b8; text-align: center; margin-bottom: 20px;">
        ZONE BATTLE: ${Math.abs(supportStrength - resistanceStrength) < 0.1 ? 'BALANCED' : (supportStrength > resistanceStrength ? 'SUPPORT DOMINANT' : 'RESISTANCE DOMINANT')}
      </div>
      
      <!-- FOOTER -->
      <div class="institutional-footer">
        <div class="footer-mono">Institutional Analysis Feed</div>
        <div class="footer-copyright">MZPRIMER INTELLIGENCE SYSTEM • © 2026 GLOBAL DATA RESEARCH</div>
      </div>
      
    </body>
    </html>
  `;
}

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);
  
 const symbol = (searchParams.get("symbol") || "EURUSD").toUpperCase();
const fps = parseInt(searchParams.get("fps") || "10");  // Changed default to 20
const duration = parseInt(searchParams.get("duration") || "2");
const totalFrames = fps * duration;
const frameDelay = 1000 / fps; // 50ms for 20fps
  
  
  try {
    if (fps > 15 || duration > 3) {
  return new Response(JSON.stringify({
    error: "Parameters too heavy. Use fps <= 15 and duration <= 3",
    suggested: "/api/ads/render-video?symbol=EURUSD&fps=10&duration=2"
  }), {
    status: 400,
    headers: { "Content-Type": "application/json" }
  });
}
    console.log(`🎬 Generating video for ${symbol}`);
    console.log(`📊 Settings: ${duration}s at ${fps}fps = ${totalFrames} frames`);
    console.log(`⏱️ Frame delay: ${frameDelay}ms`);
    
    // Fetch market data
    const marketData = await fetchMarketData(symbol, env);
    
    // Launch Puppeteer
    const browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    
    // Capture all frames
    const frames = [];
    const startTime = Date.now();
    
    for (let i = 0; i < totalFrames; i++) {
      // Show progress every 10 frames
      if (i % 10 === 0 || i === totalFrames - 1) {
        const percent = Math.round((i / totalFrames) * 100);
        console.log(`  Frame ${i + 1}/${totalFrames} (${percent}%)`);
      }
      
      // Generate HTML with current frame progress for animations
      const html = generateAnimatedHTML(marketData, i, totalFrames);
      await page.setContent(html);
      await page.waitForNetworkIdle({ timeout: 500 });
      
      const frame = await page.screenshot({ type: 'png' });
      frames.push(frame);
      
      // Wait exact delay between frames for smooth animation
      await new Promise(resolve => setTimeout(resolve, frameDelay));
    }
    // Quick health check - return early if parameters are too heavy

    await browser.close();
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Captured ${frames.length}/${totalFrames} frames in ${elapsed}s`);
    
// Create ZIP file with all frames
console.log(`📦 Creating ZIP archive with ${frames.length} frames...`);
const zip = new JSZip();

frames.forEach((frame, i) => {
  const frameNum = String(i).padStart(4, '0');
  zip.file(`frame_${frameNum}.png`, frame);
});

// Add metadata with conversion instructions
zip.file("instructions.txt", `
HOW TO CONVERT TO GIF:

1. Install FFmpeg (if not already):
   brew install ffmpeg

2. Extract frames:
   unzip ${symbol}_frames_*.zip -d frames/

3. Convert to GIF (20fps, loop forever):
   ffmpeg -framerate ${fps} -pattern_type glob -i 'frames/frame_*.png' -loop 0 output_${symbol}.gif

4. Convert to MP4 (better quality):
   ffmpeg -framerate ${fps} -pattern_type glob -i 'frames/frame_*.png' -c:v libx264 -pix_fmt yuv420p output_${symbol}.mp4

Created: ${new Date().toISOString()}
Symbol: ${symbol}
Frames: ${totalFrames}
FPS: ${fps}
Duration: ${duration}s
`);

const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

console.log(`✅ ZIP created, size: ${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB`);

return new Response(zipBuffer as any, {
  headers: {
    "Content-Type": "application/zip",
    "Content-Disposition": `attachment; filename="${symbol}_frames_${Date.now()}.zip"`
  }
});
    
  } catch (error: any) {
    console.error("💥 Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}