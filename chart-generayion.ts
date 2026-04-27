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