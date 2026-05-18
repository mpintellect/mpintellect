// functions/utils/caption-formatter.ts

import { ExtractedData } from './data-extractor';

export function formatCaption(data: ExtractedData): string {
  const priceFormatted = data.currentPrice.toLocaleString();
  const entryFormatted = data.entry.toLocaleString();
  const tpFormatted = data.tp.toLocaleString();
  const emaFormatted = data.ema50.toLocaleString();
  
  let trendText = '';
  if (data.trendDirection === 'bullish') {
    trendText = `${data.trendIcon} *BULLISH*`;
  } else if (data.trendDirection === 'bearish') {
    trendText = `${data.trendIcon} *BEARISH*`;
  } else {
    trendText = `${data.trendIcon} *NEUTRAL*`;
  }
  
  return `
📊 *${data.symbol} - REAL-TIME ANALYSIS*

💰 *Price:* ${priceFormatted}

🎯 *Target Zone:* ${entryFormatted} → ${tpFormatted}
   (Entry → Take Profit)

📈 *Trend:* ${trendText}

📉 *Key Insights:*
• RSI: ${data.rsi} ${data.rsiIcon} (${data.rsiZone})
• EMA50: ${emaFormatted}
• Volatility: ${data.volatilityIcon} ${data.volatility}

⚡ *AI Confidence:* ${data.confidence}% | R/R: ${data.rr}

📊 *Chart attached 👆*

[🔗 Full Analysis on MPIntellect](https://mpintellect.com/analysis/${data.symbol})

[🏦 Open Live Account - LiteFinance](https://my.litefinance.org/registration/?uid=967798214)

#${data.symbol} #${data.trendDirection === 'bullish' ? 'Bullish' : data.trendDirection === 'bearish' ? 'Bearish' : 'Neutral'} #ForexSignals #TradingMorocco
  `.trim();
}

export function formatShortCaption(data: ExtractedData): string {
  const priceFormatted = data.currentPrice.toLocaleString();
  const entryFormatted = data.entry.toLocaleString();
  const tpFormatted = data.tp.toLocaleString();
  
  const trendArrow = data.trendDirection === 'bullish' ? '🟢▲' : data.trendDirection === 'bearish' ? '🔴▼' : '🟡●';
  
  return `
📊 *${data.symbol}*

💰 ${priceFormatted}
🎯 ${entryFormatted} → ${tpFormatted}
${trendArrow} ${data.trendDirection.toUpperCase()} | RSI: ${data.rsi}
⚡ ${data.confidence}%

📈 [Analysis](https://mpintellect.com/analysis/${data.symbol})
  `.trim();
}