// functions/api/telegram/smart-post.ts

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
}

function extractData(rawData: any, symbol: string): ExtractedData | null {
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
  };
}

function formatCaption(data: ExtractedData): string {
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

⚡ *AI Confidence:* ${data.confidence}% | R/R: ${data.rr}

📊 *Chart attached 👆*

[🔗 Full Analysis on MPIntellect](https://mpintellect.com/analysis/${data.symbol})

[🏦 Open Live Account - LiteFinance](https://my.litefinance.org/registration/?uid=967798214)

#${data.symbol} #${data.trendDirection === 'bullish' ? 'Bullish' : data.trendDirection === 'bearish' ? 'Bearish' : 'Neutral'} #ForexSignals #TradingMorocco
  `.trim();
}

async function sendPhotoToTelegram(
  botToken: string,
  chatId: string,
  imageUrl: string,
  caption: string
): Promise<boolean> {
  const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;
  
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('photo', imageUrl);
  formData.append('caption', caption);
  formData.append('parse_mode', 'Markdown');
  
  try {
    const response = await fetch(url, { method: 'POST', body: formData });
    const result = await response.json();
    
    if (!result.ok) {
      console.error('Telegram API Error:', result.description);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to send to Telegram:', error);
    return false;
  }
}

export async function onRequestPost(context: any): Promise<Response> {
  const { request, env } = context;
  
  try {
    // Security check
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${env.ADMIN_SECRET}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    
    const body = await request.json();
    const symbol = body.symbol || 'XAUUSD';
    
    // Fetch data from your data API
    const dataUrl = `https://data.mpintellect.com/D1_output_${symbol}.json`;
    const dataRes = await fetch(dataUrl);
    
    if (!dataRes.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch data for ${symbol}` }), { status: 500 });
    }
    
    const rawData = await dataRes.json();
    const extractedData = extractData(rawData, symbol);
    
    if (!extractedData) {
      return new Response(JSON.stringify({ error: 'Failed to extract data' }), { status: 500 });
    }
    
    // Generate chart image URL (using your existing chart API)
    const chartUrl = `${env.API_URL || 'https://mpintellect.com'}/api/chart/generate?symbol=${symbol}&type=story&refresh=true`;
    
    // Format caption
    const caption = formatCaption(extractedData);
    
    // Send to Telegram
    const success = await sendPhotoToTelegram(
      env.TELEGRAM_BOT_TOKEN,
      env.TELEGRAM_CHANNEL_ID,
      chartUrl,
      caption
    );
    
    if (!success) {
      return new Response(JSON.stringify({ error: 'Telegram send failed' }), { status: 500 });
    }
    
    return new Response(JSON.stringify({
      success: true,
      symbol: symbol,
      confidence: extractedData.confidence,
      trend: extractedData.trend,
    }), { status: 200 });
    
  } catch (error: any) {
    console.error('Smart post error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}