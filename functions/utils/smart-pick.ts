// functions/utils/smart-pick.ts

import { ExtractedData } from './data-extractor';
import { TELEGRAM_CONFIG } from '../config/telegram-config';

interface SymbolScore {
  symbol: string;
  score: number;
  data: ExtractedData;
  lastPostMinutes: number;
}

export async function pickBestSymbol(
  symbolsData: Map<string, ExtractedData>,
  lastPostTimes: Map<string, number>
): Promise<string> {
  const scores: SymbolScore[] = [];
  
  for (const [symbol, data] of symbolsData) {
    if (!data) continue;
    
    const lastPostMinutes = lastPostTimes.get(symbol) || 999;
    const weights = TELEGRAM_CONFIG.smartWeights;
    
    // Normalize confidence (0-100)
    const confidenceScore = (data.confidence / 100) * weights.confidence;
    
    // Volatility score
    let volatilityScore = 0;
    if (data.volatility === 'high') volatilityScore = 1 * weights.volatility;
    else if (data.volatility === 'moderate') volatilityScore = 0.5 * weights.volatility;
    else volatilityScore = 0.2 * weights.volatility;
    
    // Time since last post (capped at 60 minutes)
    const timeScore = Math.min(1, lastPostMinutes / 60) * weights.timeSinceLast;
    
    // Trend strength
    let trendScore = 0;
    if (data.trendDirection === 'bullish') trendScore = 0.7 * weights.trendStrength;
    else if (data.trendDirection === 'bearish') trendScore = 0.7 * weights.trendStrength;
    else trendScore = 0.3 * weights.trendStrength;
    
    const totalScore = confidenceScore + volatilityScore + timeScore + trendScore;
    
    scores.push({
      symbol,
      score: totalScore,
      data,
      lastPostMinutes,
    });
  }
  
  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);
  
  // Check max posts per day limit
  for (const candidate of scores) {
    const dailyCount = lastPostTimes.get(`${candidate.symbol}_daily`) || 0;
    const maxPerDay = TELEGRAM_CONFIG.maxPostsPerSymbol[candidate.symbol as keyof typeof TELEGRAM_CONFIG.maxPostsPerSymbol] || 2;
    
    if (dailyCount < maxPerDay) {
      return candidate.symbol;
    }
  }
  
  // Fallback to default symbol
  return TELEGRAM_CONFIG.defaultSymbol;
}