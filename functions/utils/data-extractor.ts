// functions/utils/data-extractor.ts

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
  volatility: string;
  volatilityIcon: string;
  timestamp: string;
}

export function extractData(data: any, symbol: string): ExtractedData | null {
  if (!data) return null;
  
  const trendRaw = data.trend?.trend || 'neutral';
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
  
  const rsi = data.momentum?.rsi_latest || 50;
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
  
  const volatility = data.volatility?.volatility_level || 'moderate';
  let volatilityIcon = '📊';
  if (volatility === 'high') volatilityIcon = '⚠️';
  if (volatility === 'low') volatilityIcon = '😌';
  
  return {
    symbol: symbol,
    currentPrice: data.trend?.current_price || data.current_price || 0,
    entry: data.tp_sl?.entry_price || data.pending_orders?.primary_order?.entry_price || 0,
    tp: data.tp_sl?.tp_level || data.pending_orders?.primary_order?.tp_price || 0,
    sl: data.tp_sl?.sl_level || data.pending_orders?.primary_order?.sl_price || 0,
    rr: data.tp_sl?.rr_ratio || data.pending_orders?.primary_order?.rr_ratio || 0,
    trend: trendRaw.replace(/_/g, ' ').toUpperCase(),
    trendIcon: trendIcon,
    trendDirection: trendDirection,
    confidence: data.risk_score?.confidence_score || data.analysis_accuracy || 0,
    rsi: rsi,
    rsiZone: rsiZone,
    rsiIcon: rsiIcon,
    ema50: data.trend?.current_emas?.ema_50 || 0,
    pivot: data.pivot?.level || 0,
    volatility: volatility,
    volatilityIcon: volatilityIcon,
    timestamp: new Date().toISOString(),
  };
}