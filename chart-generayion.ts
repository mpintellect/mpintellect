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
          <h3 style="color: white; font-size: 18px; margin: 0;">${symbol}</h3>
        </div>
      
      </div>
      
            <!-- ============================================================ -->
      <!-- TWO SCENARIO CARDS (Scenario 1: TP / Scenario 2: SL) -->
      <!-- Colors determined by price direction -->
      <!-- ============================================================ -->
      <div style="display: flex; gap: 12px; margin-bottom: 15px; padding: 0 5px;">
        
        <!-- Scenario 1 Card (TP / Forecast) - Color matches direction -->
        <div style="flex: 1; background: ${isShort ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'}; border-radius: 16px; padding: 10px 12px; border: 1px solid ${isShort ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'};">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="background: ${isShort ? '#EF4444' : '#10B981'}; width: 8px; height: 8px; border-radius: 50%; display: inline-block;"></span>
            <span style="color: ${isShort ? '#EF4444' : '#10B981'}; font-size: 11px; font-weight: 700; letter-spacing: 1px;">SCENARIO 1 (TP)</span>
            <span style="background: ${isShort ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}; border-radius: 20px; padding: 2px 8px; font-size: 10px; font-weight: 700; color: ${isShort ? '#EF4444' : '#10B981'};">${prediction.confidence}%</span>
          </div>
          <div style="font-size: 13px; color: ${dim}; margin-bottom: 4px;">Price moves to TP ${isShort ? '⬇️ DOWN' : '⬆️ UP'}</div>
          <div style="display: flex; align-items: baseline; gap: 6px;">
            <span style="color: white; font-size: 16px; font-weight: 800;">${takeProfit ? formatPrice(takeProfit) : 'N/A'}</span>
            <span style="color: ${isShort ? '#EF4444' : '#10B981'}; font-size: 11px;">${isShort ? '▼ DOWN' : '▲ UP'}</span>
          </div>
          
        </div>
        
        <!-- Scenario 2 Card (SL / Stop Loss) - Opposite color -->
        <div style="flex: 1; background: ${isShort ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; border-radius: 16px; padding: 10px 12px; border: 1px solid ${isShort ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="background: ${isShort ? '#10B981' : '#EF4444'}; width: 8px; height: 8px; border-radius: 50%; display: inline-block;"></span>
            <span style="color: ${isShort ? '#10B981' : '#EF4444'}; font-size: 11px; font-weight: 700; letter-spacing: 1px;">SCENARIO 2 (SL)</span>
            <span style="background: ${isShort ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; border-radius: 20px; padding: 2px 8px; font-size: 10px; font-weight: 700; color: ${isShort ? '#10B981' : '#EF4444'};">${100 - (prediction.confidence || 84)}%</span>
          </div>
          <div style="font-size: 13px; color: ${dim}; margin-bottom: 4px;">Price hits SL ${isShort ? '⬆️ UP' : '⬇️ DOWN'}</div>
          <div style="display: flex; align-items: baseline; gap: 6px;">
            <span style="color: white; font-size: 16px; font-weight: 800;">${stopLoss ? formatPrice(stopLoss) : 'N/A'}</span>
            <span style="color: ${isShort ? '#10B981' : '#EF4444'}; font-size: 11px;">${isShort ? '▲ UP' : '▼ DOWN'}</span>
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




------

# daytrader/analysis_modules/analyze_tp_sl.py
import pandas as pd
import numpy as np
from data.symbols_config import get_pip_size, get_symbol_settings

# ✅ MASTER DECIMAL LOOKUP
PRICE_DECIMALS = {
    "EURUSD": 5, "GBPUSD": 5, "USDJPY": 3, "USDCAD": 5, "AUDUSD": 5,
    "NZDUSD": 5, "USDCHF": 5,
    "XAUUSD": 2, "XAUEUR": 2, "XAGUSD": 3,
    "PLATINUM": 2, "BRENT": 2, "BTCUSD": 1, "ETHUSD": 2, "XRPUSD": 4,
    "DOGEUSD": 4, "LTCUSD": 2, "US500": 2, "USTEC": 2, "US30": 2, "HK50": 2,
    "FRANCE40": 2, "CHINA50": 1, "UK100": 1, "EURJPY": 3, "EURGBP": 5,
    "GBPJPY": 3, "GBPCHF": 5
}

def format_price(value: float, symbol: str) -> float:
    if value is None or np.isnan(value): return 0.0
    decimals = PRICE_DECIMALS.get(symbol, 5)
    return float(f"{round(float(value), decimals):.{decimals}f}")

def analyze_tp_sl(df: pd.DataFrame, symbol: str, trend: dict = None, zones: dict = None, 
                  pending_orders: dict = None, volatility: dict = None) -> dict:
    """
    Day Trader (H1) Risk Auditor.
    Optimized for Interday expansions, survivors of news spikes, and professional RR caps.
    """
    result = {
        "entry_price": None, "tp_level": None, "sl_level": None, "rr_ratio": 1.5,
        "sl_distance_pips": 0.0, "tp_distance_pips": 0.0, "risk_management": "standard",
        "is_valid": True, "notes": "", "asset_class": "unknown", "rr_validation": "passed"
    }

    try:
        # 1. INITIALIZE MASTER RULES FOR DAY TRADING
        settings = get_symbol_settings(symbol)
        pip_size = settings["pip_size"]
        
        # --- 🛡️ DAY TRADER SAFETY REGISTRY (H1 OPTIMIZED) ---
        # We increase MIN_SL and MAX_RR to match the H1 volatility cycles.
        if settings["type"] == "crypto":
            MIN_SL = 100; MAX_RR = 5.0 # Crypto H1 swings are massive
        elif "metal" in settings["type"] or "commodity" in settings["type"]:
            MIN_SL = 50;  MAX_RR = 4.5 # Gold/Brent need more room on H1
        else: # Forex
            MIN_SL = 15;  MAX_RR = 4.0 # Forex H1 floor: 15 pips (Scalp was 7)
        # --------------------------------------------------
        
        result["asset_class"] = settings["type"]

        # 2. PATH A: AUDIT PENDING ORDERS
        if pending_orders and pending_orders.get("is_valid") and pending_orders.get("primary_order"):
            order = pending_orders["primary_order"]
            entry = float(order.get("entry_price", 0))
            sl = float(order.get("sl_price", 0))
            tp = float(order.get("tp_price", 0))
            otype = order.get("type", "BUY_LIMIT")

            # --- 🛡️ FIX 1: THE H1 SPREAD & NOISE FLOOR ---
            risk_pips = abs(entry - sl) / pip_size
            if risk_pips < MIN_SL:
                # Widen stop to ensure the trade survives the 24h noise cycle
                sl = (entry - (MIN_SL * pip_size)) if "BUY" in otype else (entry + (MIN_SL * pip_size))
                result["notes"] += f" | SL adjusted for H1 cycle ({MIN_SL}p floor)"
                risk_pips = MIN_SL

            # --- 🛡️ FIX 2: THE DAY TRADE GREED CAP ---
            risk_amt = abs(entry - sl)
            reward_amt = abs(tp - entry)
            current_rr = reward_amt / risk_amt if risk_amt > 0 else 1.0
            
            if current_rr > MAX_RR:
                # Pull the TP in to ensure it's hit within a 48-hour window
                new_reward = risk_amt * MAX_RR
                tp = (entry + new_reward) if "BUY" in otype else (entry - new_reward)
                result["notes"] += f" | TP capped at realistic H1 {MAX_RR}:1 RR"
                current_rr = MAX_RR

            result.update({
                "entry_price": format_price(entry, symbol),
                "sl_level": format_price(sl, symbol),
                "tp_level": format_price(tp, symbol),
                "rr_ratio": round(current_rr, 2),
                "sl_distance_pips": round(risk_pips, 1),
                "tp_distance_pips": round(abs(tp - entry) / pip_size, 1),
                "notes": f"H1 Verified {otype}" + result["notes"],
                "rr_validation": "passed_h1_audit"
            })
            return result

        # 3. PATH B: CONTEXTUAL FALLBACK (H1 Structural Logic)
        curr_p = df['close'].iloc[-1] if not df.empty else 0
        atr = volatility.get("current_atr", curr_p * 0.002) if volatility else curr_p * 0.002
        is_buy = "bullish" in trend.get("trend", "neutral") if trend else True
        
        # H1 Spacing: 2.0x ATR for safety (Scalper used 1.5x)
        spacing = max(atr * 2.0, MIN_SL * pip_size)
        
        f_entry = curr_p
        f_sl = (f_entry - spacing) if is_buy else (f_entry + spacing)
        
        # Hide stops behind H1 structural zones
        if zones:
            sup, res = zones.get("support_zone"), zones.get("resistance_zone")
            if is_buy and sup and sup < f_entry: f_sl = min(f_sl, sup - (atr * 0.3))
            elif not is_buy and res and res > f_entry: f_sl = max(f_sl, res + (atr * 0.3))

        # Aim for H1 targets (Default 2.5:1 RR for Day Traders)
        f_tp = (f_entry + (abs(f_entry - f_sl) * 2.5)) if is_buy else (f_entry - (abs(f_entry - f_sl) * 2.5))
        
        # Apply H1 Greed Cap
        final_rr = abs(f_tp - f_entry) / abs(f_entry - f_sl)
        if final_rr > MAX_RR:
            f_tp = f_entry + (abs(f_entry - f_sl) * MAX_RR) if is_buy else f_entry - (abs(f_entry - f_sl) * MAX_RR)

        result.update({
            "entry_price": format_price(f_entry, symbol),
            "sl_level": format_price(f_sl, symbol),
            "tp_level": format_price(f_tp, symbol),
            "rr_ratio": round(abs(f_tp - f_entry) / abs(f_entry - f_sl), 2),
            "notes": "H1 Strategic Cycle Fallback"
        })
        return result

    except Exception as e:
        result.update({"is_valid": False, "notes": f"H1 Risk Audit Error: {str(e)}"})
        return result


        ---------


        # daytrader/gather_trade_setup.py
import pandas as pd
import sqlite3
import numpy as np
import os
from datetime import datetime, timedelta, timezone

# --- Institutional Analysis Modules (Day Trader H1 Versions) ---
from analysis_modules.analyze_trend import analyze_trend
from analysis_modules.analyze_volatility import analyze_volatility
from analysis_modules.analyze_momentum import analyze_momentum
from analysis_modules.analyze_zones import analyze_zones
from analysis_modules.analyze_volume_profile import analyze_volume_profile
from analysis_modules.analyze_market_sessions import analyze_market_sessions
from analysis_modules.analyze_pending_orders import analyze_pending_orders
from analysis_modules.analyze_tp_sl import analyze_tp_sl
from analysis_modules.analyze_risk_score import analyze_risk_score
from analysis_modules.generate_summary import generate_summary
from analysis_modules.generate_decision import generate_decision
from analysis_modules.analyze_trade_parameters import analyze_trade_parameters

# --- Master Configuration (Single Source of Truth) ---
from data.symbols_config import get_pip_size, get_symbol_settings, SYMBOL_MAP

# 🔧 DATABASE CONFIG
DATABASE_PATH = "market_dataH1.db"

# ✅ DATA WINDOW SETTINGS (Optimized for H1 Day Trading)
ANALYSIS_HOURS = 720   # 30 Days (Monthly Institutional Structure)
SHORT_TERM_HOURS = 168 # 1 Week (Interday Volatility Context)

# 🎯 COMPONENT WEIGHT CONFIGURATION (Day Trader Standard)
COMPONENT_WEIGHTS = {
    "trend": 25,        # Interday Cycle (EMA 200 Baseline)
    "momentum": 20,     # RSI/MACD momentum confirmation
    "volume": 15,       # Monthly Institutional POC
    "zones": 15,        # Weekly Structural Walls
    "volatility": 15,   # Hourly Noise Protection
    "sessions": 10,     # Global Liquidity Timing
}

def format_number_for_symbol(value, symbol: str):
    """Surgically accurate price formatting based on Master Symbol Map."""
    if value is None: return None
    try:
        decimals = SYMBOL_MAP.get(symbol, {}).get("dec", 5)
        return float(f"{round(float(value), decimals):.{decimals}f}")
    except (TypeError, ValueError):
        return value

def load_candles(symbol: str, hours: int) -> pd.DataFrame:
    """Load H1 candle data and force numeric types for institutional math."""
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cutoff = (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()
        # FIXED: Use correct table name 'candles_h1'
        query = "SELECT * FROM candles_h1 WHERE symbol = ? AND time >= ? ORDER BY time ASC"
        df = pd.read_sql(query, conn, params=(symbol, cutoff), parse_dates=["time"])
        conn.close()
        
        if df.empty: return df

        # Surgical Fix: Ensure data types are floats to prevent binary errors
        numeric_cols = ['open', 'high', 'low', 'close', 'tick_volume', 'ema_20', 'ema_50', 'ema_200', 'atr', 'rsi']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
                
        return df
    except Exception as e:
        print(f"❌ H1 Database Error for {symbol}: {e}")
        return pd.DataFrame()

def gather_trade_setup(symbol: str) -> dict:
    """
    Day Trader Orchestrator: Surgically fixed for Null-Safety.
    Ensures 100% stability even when components are missing.
    """
    df = load_candles(symbol, hours=ANALYSIS_HOURS)
    if df.empty: 
        return {"symbol": symbol, "error": "No data"}

    last_ts = df['time'].max()
    df_week = df[df['time'] >= (last_ts - timedelta(hours=SHORT_TERM_HOURS))].copy()

    analysis_results = {}
    component_scores = {}

    # 1. CORE ANALYTICS - Process all components including momentum
    for component in COMPONENT_WEIGHTS.keys():
        try:
            if component == "trend": 
                result = analyze_trend(df)
            elif component == "momentum":  # FIXED: Added momentum processing
                result = analyze_momentum(df, analysis_results.get("trend"))
            elif component == "volume": 
                result = analyze_volume_profile(df, symbol)
            elif component == "zones": 
                result = analyze_zones(df, symbol, analysis_results.get("trend"))
            elif component == "volatility": 
                result = analyze_volatility(df_week, symbol)
            elif component == "sessions": 
                result = analyze_market_sessions(df)
            else:
                result = {"component_quality": 50}
            
            analysis_results[component] = result
            # FIXED: Default to 50 instead of 0 for missing quality
            component_scores[component] = result.get("component_quality", 50) if result else 50
            
        except Exception as e:
            print(f"⚠️ {component} failed for {symbol}: {e}")
            analysis_results[component] = {"fallback": True, "component_quality": 50}
            component_scores[component] = 50  # FIXED: Changed from 0 to 50

    # NULL-SAFE PLACEHOLDERS
    trend = analysis_results.get("trend", {})
    volatility = analysis_results.get("volatility", {})
    momentum = analysis_results.get("momentum", {"momentum_bias": "neutral", "component_quality": 50})
    zones = analysis_results.get("zones", {})
    volume = analysis_results.get("volume", {})
    sessions = analysis_results.get("sessions", {})

    # FIXED: Calculate accuracy with proper weighting
    total_weight = sum(COMPONENT_WEIGHTS.values())
    accuracy = sum(component_scores.get(c, 50) * COMPONENT_WEIGHTS.get(c, 0) for c in COMPONENT_WEIGHTS) / total_weight

    # 2. EXECUTION MATH
    pending_orders = analyze_pending_orders(df_week, symbol, trend, zones, momentum, volatility)
    tp_sl = analyze_tp_sl(df_week, symbol, trend, zones, pending_orders, volatility)
    
    risk_score = analyze_risk_score(trend, volatility, momentum, zones, pending_orders, tp_sl, volume, sessions)
    risk_score = adjust_risk_score_by_accuracy(risk_score, accuracy)
    
    final_decision = generate_decision(trend, momentum, zones, risk_score, volatility, pending_orders, tp_sl, None, volume, None, sessions)
    
    trade_params = analyze_trade_parameters(df_week, symbol, final_decision, pending_orders, trend, volatility, zones)

    summary = generate_summary(symbol, trend, momentum, volatility, zones, pending_orders, tp_sl, risk_score, final_decision, trade_params, volume, sessions)
    
    analysis_results.update({
        "summary": summary,
        "symbol": symbol,
        "analysis_accuracy": round(accuracy, 1),
        "component_scores": component_scores,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "risk_score": risk_score,
        "final_decision": final_decision,
        "trade_parameters": trade_params,
        "tp_sl": tp_sl,
        "pending_orders": pending_orders  # FIXED: Added missing pending_orders
    })

    return analysis_results

# --- 🛠️ HELPER FUNCTIONS ---

def adjust_risk_score_by_accuracy(base_score: dict, accuracy: float) -> dict:
    """Adjust confidence score based on overall analysis accuracy"""
    adj_conf = base_score.get("confidence_score", 50) * (accuracy / 100)
    base_score["confidence_score"] = round(min(100, max(0, adj_conf)))
    return base_score

def create_weighted_fallback(component: str, df: pd.DataFrame, symbol: str, score: float) -> dict:
    """Create fallback data for failed components"""
    curr = df['close'].iloc[-1] if not df.empty else 0
    return {
        "diagnostic_symbol": symbol, 
        "failed_module": component, 
        "fallback_used": True, 
        "component_quality": score, 
        "current_price": curr
    }


    -----

    # daytrader/fetch_h1.py
import MetaTrader5 as mt5
import pandas as pd
import sqlite3
import os
from datetime import datetime, timezone
from ta.volatility import AverageTrueRange
from ta.trend import EMAIndicator
from ta.momentum import RSIIndicator

# === CONFIG ===
SYMBOLS = [
    "EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD", "NZDUSD", "USDCHF",
    "XAUUSD", "XAUEUR", "XAGUSD", "PLATINUM", "BRENT",
    "BTCUSD", "ETHUSD", "XRPUSD", "DOGEUSD", "LTCUSD",
    "US500", "USTEC", "US30", "HK50", "FRANCE40", "CHINA50", "UK100",
    "EURJPY", "EURGBP", "GBPJPY", "GBPCHF"
]

# Timeframe to H1 (Day Trading Standard)
TIMEFRAME = mt5.TIMEFRAME_H1

# FIXED: Keep 1000 candles (approx 41 days) for proper EMA 200 and momentum analysis
KEEP_ROWS = 1000

# FIXED: Database path (consistent with gather_trade_setup.py)
DATABASE_PATH = "market_dataH1.db"

# === INSTITUTIONAL MTF BIAS HELPER (H1 Edition) ===
def get_timeframe_bias(symbol, timeframe):
    """Calculates bias for Day Trading anchors: D1 and Weekly."""
    try:
        rates = mt5.copy_rates_from_pos(symbol, timeframe, 0, 150)
        if rates is None or len(rates) < 50:
            return "neutral"
        
        df_tf = pd.DataFrame(rates)
        # Day traders use the EMA 50 on higher timeframes to define the 'Boss' trend
        ema50 = EMAIndicator(df_tf['close'], window=50).ema_indicator()
        if ema50.isna().all():
            return "neutral"
        ema50_latest = ema50.iloc[-1]
        current_close = df_tf['close'].iloc[-1]
        
        return "bullish" if current_close > ema50_latest else "bearish"
    except Exception as e:
        print(f"⚠️ Error getting bias: {e}")
        return "neutral"

# === MT5 Init ===
if not mt5.initialize():
    print("❌ MT5 initialization failed")
    exit()

print("✅ MT5 initialized successfully")

# === DB Init (Targeting H1 Table) ===
conn = sqlite3.connect(DATABASE_PATH)
cursor = conn.cursor()

# Create table if not exists (matching gather_trade_setup.py expectations)
cursor.execute("""
CREATE TABLE IF NOT EXISTS candles_h1 (
    symbol TEXT,
    time TEXT,
    open REAL, 
    high REAL, 
    low REAL, 
    close REAL,
    tick_volume REAL,
    ema_20 REAL, 
    ema_50 REAL, 
    ema_200 REAL,
    atr REAL, 
    rsi REAL,
    d1_bias TEXT, 
    w1_bias TEXT,
    PRIMARY KEY (symbol, time)
)
""")
conn.commit()
print("✅ Database initialized\n")

# === MAIN LOOP ===
print(f"📥 Syncing Day Trader (H1) Data (Keeping {KEEP_ROWS} candles per symbol)...\n")
print("=" * 60)

success_count = 0
fail_count = 0

for symbol in SYMBOLS:
    try:
        # FIXED: Fetch 500 candles to ensure we have enough for EMA 200
        rates = mt5.copy_rates_from_pos(symbol, TIMEFRAME, 0, 500)
        
        if rates is None:
            print(f"❌ {symbol}: No data received from MT5")
            fail_count += 1
            continue
            
        if len(rates) < 200:
            print(f"⚠️ {symbol}: Only {len(rates)} candles (need 200+ for EMA 200)")
            fail_count += 1
            continue

        df = pd.DataFrame(rates)
        df['time'] = pd.to_datetime(df['time'], unit='s', utc=True)

        # Calculate the H1 Institutional Indicator Stack (20, 50, 200)
        df['ema_20'] = EMAIndicator(df['close'], window=20).ema_indicator()
        df['ema_50'] = EMAIndicator(df['close'], window=50).ema_indicator()
        df['ema_200'] = EMAIndicator(df['close'], window=200).ema_indicator()
        df['atr'] = AverageTrueRange(df['high'], df['low'], df['close'], window=14).average_true_range()
        df['rsi'] = RSIIndicator(df['close'], window=14).rsi()

        # Fill NaN values for initial periods
        df['ema_20'] = df['ema_20'].fillna(df['close'])
        df['ema_50'] = df['ema_50'].fillna(df['close'])
        df['ema_200'] = df['ema_200'].fillna(df['close'])
        df['atr'] = df['atr'].fillna(df['high'] - df['low'])
        df['rsi'] = df['rsi'].fillna(50)

        # Fetch Macro Anchors (Daily and Weekly)
        d1_bias = get_timeframe_bias(symbol, mt5.TIMEFRAME_D1)
        w1_bias = get_timeframe_bias(symbol, mt5.TIMEFRAME_W1)

        # Count how many rows we'll insert
        rows_inserted = 0
        
        # Insert all rows (not just the last one) to build proper history
        for idx, row in df.iterrows():
            try:
                cursor.execute("""
                    INSERT OR REPLACE INTO candles_h1 (
                        symbol, time, open, high, low, close,
                        tick_volume, ema_20, ema_50, ema_200,
                        atr, rsi, d1_bias, w1_bias
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    symbol, row['time'].isoformat(),
                    float(row['open']), float(row['high']), float(row['low']), float(row['close']),
                    float(row['tick_volume']),
                    float(row['ema_20']), float(row['ema_50']), float(row['ema_200']),
                    float(row['atr']), float(row['rsi']),
                    d1_bias, w1_bias
                ))
                rows_inserted += 1
            except Exception as e:
                print(f"  ⚠️ Row insert error: {e}")
                continue

        # Maintenance: Keep only the most recent KEEP_ROWS candles
        cursor.execute("""
            DELETE FROM candles_h1 
            WHERE symbol=? AND time NOT IN (
                SELECT time FROM candles_h1 
                WHERE symbol=? 
                ORDER BY time DESC 
                LIMIT ?
            )
        """, (symbol, symbol, KEEP_ROWS))
        
        conn.commit()
        
        # Get final count
        cursor.execute("SELECT COUNT(*) FROM candles_h1 WHERE symbol=?", (symbol,))
        final_count = cursor.fetchone()[0]
        
        print(f"✅ {symbol}: Inserted {rows_inserted} rows | Total: {final_count} candles | D1: {d1_bias} | W1: {w1_bias}")
        success_count += 1

    except Exception as e:
        print(f"❌ Error {symbol}: {e}")
        fail_count += 1

# === FINAL SUMMARY ===
print("\n" + "=" * 60)
print(f"📊 SYNC SUMMARY")
print("=" * 60)
print(f"✅ Successful: {success_count}")
print(f"❌ Failed: {fail_count}")
print(f"📊 Total symbols: {len(SYMBOLS)}")
print("=" * 60)

# Verify data quality
print("\n🔍 DATA QUALITY CHECK:")
cursor.execute("""
    SELECT symbol, COUNT(*) as count, 
           SUM(CASE WHEN ema_200 IS NULL THEN 1 ELSE 0 END) as null_ema
    FROM candles_h1 
    GROUP BY symbol 
    ORDER BY count DESC
    LIMIT 5
""")
for row in cursor.fetchall():
    print(f"  {row[0]}: {row[1]} candles | Null EMA: {row[2]}")

conn.close()
mt5.shutdown()

print("\n✅ H1 data syncs complete!")
