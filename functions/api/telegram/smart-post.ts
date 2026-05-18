// functions/api/telegram/smart-post.ts

export async function onRequestPost(context: any): Promise<Response> {
  const { request, env } = context;
  
  // Log all environment variables (without exposing full tokens)
  console.log('🔍 Checking environment variables:');
  console.log('  ADMIN_SECRET exists:', !!env.ADMIN_SECRET);
  console.log('  TELEGRAM_BOT_TOKEN exists:', !!env.TELEGRAM_BOT_TOKEN);
  console.log('  TELEGRAM_CHANNEL_ID exists:', !!env.TELEGRAM_CHANNEL_ID);
  console.log('  API_URL:', env.API_URL);
  
  try {
    // Security check
    const authHeader = request.headers.get('Authorization');
    console.log('🔐 Auth header received:', authHeader ? 'Yes' : 'No');
    
    if (authHeader !== `Bearer ${env.ADMIN_SECRET}`) {
      console.log('❌ Auth failed');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    
    const body = await request.json();
    const symbol = body.symbol || 'XAUUSD';
    console.log(`📊 Processing symbol: ${symbol}`);
    
    // Fetch data from your data API
    const dataUrl = `https://data.mpintellect.com/D1_output_${symbol}.json`;
    console.log(`📡 Fetching data from: ${dataUrl}`);
    
    const dataRes = await fetch(dataUrl);
    console.log(`📡 Response status: ${dataRes.status}`);
    
    if (!dataRes.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch data for ${symbol}: ${dataRes.status}` }), { status: 500 });
    }
    
    const rawData = await dataRes.json();
    console.log(`✅ Data fetched successfully`);
    
    // Extract data
    const extractedData = extractData(rawData, symbol);
    if (!extractedData) {
      return new Response(JSON.stringify({ error: 'Failed to extract data' }), { status: 500 });
    }
    console.log(`✅ Data extracted: Price=${extractedData.currentPrice}, Confidence=${extractedData.confidence}`);
    
    // Generate chart image URL
    const baseUrl = env.API_URL || 'https://mpintellect.com';
    const chartUrl = `${baseUrl}/api/chart/generate?symbol=${symbol}&type=story&refresh=true`;
    console.log(`🖼️ Chart URL: ${chartUrl}`);
    
    // Format caption
    const caption = formatCaption(extractedData);
    console.log(`📝 Caption generated (length: ${caption.length})`);
    
    // Send to Telegram
    console.log(`📤 Sending to Telegram...`);
    const success = await sendPhotoToTelegram(
      env.TELEGRAM_BOT_TOKEN,
      env.TELEGRAM_CHANNEL_ID,
      chartUrl,
      caption
    );
    
    if (!success) {
      console.log(`❌ Telegram send failed`);
      return new Response(JSON.stringify({ error: 'Telegram send failed - check bot token and channel ID' }), { status: 500 });
    }
    
    console.log(`✅ Success!`);
    return new Response(JSON.stringify({
      success: true,
      symbol: symbol,
      confidence: extractedData.confidence,
      trend: extractedData.trend,
    }), { status: 200 });
    
  } catch (error: any) {
    console.error('💥 Smart post error:', error.message);
    console.error('Stack:', error.stack);
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), { status: 500 });
  }
}

// Helper functions (keep the same as before)
function extractData(rawData: any, symbol: string): any {
  if (!rawData) return null;
  
  const trendRaw = rawData.trend?.trend || 'neutral';
  const isBullish = trendRaw.includes('bullish');
  const isBearish = trendRaw.includes('bearish');
  
  let trendDirection = 'neutral';
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

function formatCaption(data: any): string {
  const priceFormatted = data.currentPrice.toLocaleString();
  const entryFormatted = data.entry.toLocaleString();
  const tpFormatted = data.tp.toLocaleString();
  
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

⚡ *AI Confidence:* ${data.confidence}%

📊 *Chart attached*

[🔗 Full Analysis](https://mpintellect.com/analysis/${data.symbol})

[🏦 Open Account](https://my.litefinance.org/registration/?uid=967798214)
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
    
    console.log('📨 Telegram response:', result);
    
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