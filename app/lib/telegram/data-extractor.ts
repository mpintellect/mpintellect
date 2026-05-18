// app/lib/telegram/data-extractor.ts

export interface ExtractedData {
  symbol: string;
  currentPrice: number;
  entry: number;
  tp: number;
  sl: number;
  rr: number;
  trend: string;
  trendIcon: string;
  trendDirection: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  rsi: number;
  rsiZone: string;
  rsiIcon: string;
  ema50: number;
  pivot: number;
  timestamp: string;
}

export function extractData(rawData: any, symbol: string): ExtractedData | null {
  if (!rawData) return null;
  
  const trendRaw = rawData.trend?.trend || 'neutral';
  const isBullish = trendRaw.includes('bullish');
  const isBearish = trendRaw.includes('bearish');
  
  let trendDirection: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let trendIcon = '🟡➡️';
  
  if (isBullish) {
    trendDirection = 'bullish';
    trendIcon = trendRaw.includes('strong') ? '🟢📈' : '🟢';
  } else if (isBearish) {
    trendDirection = 'bearish';
    trendIcon = trendRaw.includes('strong') ? '🔴📉' : '🔴';
  }
  
  const rsi = rawData.momentum?.rsi_latest || 50;
  let rsiZone = 'neutral';
  let rsiIcon = '🌡️';
  
  if (rsi > 70) {
    rsiZone = 'Overbought';
    rsiIcon = '🔥';
  } else if (rsi < 30) {
    rsiZone = 'Oversold';
    rsiIcon = '🥶';
  } else if (rsi < 50) {
    rsiZone = 'Bearish Zone';
    rsiIcon = '🔻';
  } else if (rsi > 50) {
    rsiZone = 'Bullish Zone';
    rsiIcon = '🔺';
  }
  
  return {
    symbol: symbol,
    currentPrice: rawData.trend?.current_price || rawData.current_price || 0,
    entry: rawData.tp_sl?.entry_price || rawData.pending_orders?.primary_order?.entry_price || 0,
    tp: rawData.tp_sl?.tp_level || rawData.pending_orders?.primary_order?.tp_price || 0,
    sl: rawData.tp_sl?.sl_level || rawData.pending_orders?.primary_order?.sl_price || 0,
    rr: rawData.tp_sl?.rr_ratio || rawData.pending_orders?.primary_order?.rr_ratio || 0,
    trend: trendRaw.replace(/_/g, ' ').toUpperCase(),
    trendIcon: trendIcon,
    trendDirection: trendDirection,
    confidence: rawData.risk_score?.confidence_score || rawData.analysis_accuracy || 0,
    rsi: rsi,
    rsiZone: rsiZone,
    rsiIcon: rsiIcon,
    ema50: rawData.trend?.current_emas?.ema_50 || 0,
    pivot: rawData.pivot?.level || 0,
    timestamp: new Date().toISOString(),
  };
}