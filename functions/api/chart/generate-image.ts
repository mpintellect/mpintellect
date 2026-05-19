// functions/api/chart/generate-image.ts

export async function onRequestGet(context: any): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const symbol = url.searchParams.get('symbol') || 'XAUUSD';
  
  try {
    // Fetch chart data
    const dataUrl = `https://data.mpintellect.com/D1_output_${symbol}.json`;
    const dataRes = await fetch(dataUrl);
    
    if (!dataRes.ok) {
      return new Response('Chart data not found', { status: 404 });
    }
    
    const chartData = await dataRes.json();
    
    // Generate complete HTML page
    const html = generateChartHTMLPage(chartData, symbol);
    
    // Return HTML (Telegram will use this URL to fetch the image)
    // Note: For actual image generation, you'd need a screenshot service
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=300',
      },
    });
    
  } catch (error: any) {
    console.error('Chart generation error:', error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

function generateChartHTMLPage(chartData: any, symbol: string): string {
  const gold = "#D4AF37";
  const dim = "#94a3b8";
  
  const chartHTML = generateChartHTML(chartData, gold, dim);
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${symbol} Chart</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background: #050505;
      font-family: 'Inter', 'Noto Sans Arabic', sans-serif;
      padding: 20px;
      width: 1080px;
      margin: 0 auto;
    }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;900&display=swap');
  </style>
</head>
<body>
  ${chartHTML}
</body>
</html>`;
}

function generateChartHTML(chartData: any, gold: string, dim: string): string {
  if (!chartData || !chartData.candles || !chartData.candles.data || chartData.candles.data.length === 0) {
    return `<div style="background: #0a0a15; border-radius: 30px; padding: 40px; text-align: center; color: #666;">📊 Chart data unavailable</div>`;
  }

  const candles = chartData.candles.data;
  const prediction = chartData.prediction;
  const chart = chartData.chart;
  const pivot = chartData.pivot || {};
  const sym = chartData.symbol || "XAUUSD";
  
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
  
  const symbolSpec = SYMBOL_SPECS[sym] || { decimals: 2, pip: 0.01, contract: 1 };
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
  const pivotLevel = pivot.level;
  
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
          <span style="color: ${dim}; font-size: 24px; font-weight: 800;">${sym}</span>
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
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
        <span style="color: #475569; font-size: 11px;">MPIntellect.com - AI Institutional Analysis</span>
      </div>
      
    </div>
  `;
}