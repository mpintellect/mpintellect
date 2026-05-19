// functions/api/telegram/smart-post.ts
// COMPLETELY SEPARATE - calls generate-and-upload

export async function onRequestPost(context: any): Promise<Response> {
  const { request, env } = context;
  
  try {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${env.ADMIN_SECRET}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    
    const { symbol } = await request.json();
    
    // 1. Generate and upload chart image
    const generateUrl = `${env.API_URL}/api/chart/generate-and-upload`;
    const generateRes = await fetch(generateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol }),
    });
    
    const { imageUrl } = await generateRes.json();
    
    // 2. Fetch data for caption
    const dataRes = await fetch(`https://data.mpintellect.com/D1_output_${symbol}.json`);
    const data = await dataRes.json();
    
    // 3. Create caption
    const caption = formatCaption(data, symbol);
    
    // 4. Send to Telegram
    const sendSuccess = await sendPhotoToTelegram(
      env.TELEGRAM_BOT_TOKEN,
      env.TELEGRAM_CHANNEL_ID,
      imageUrl,
      caption
    );
    
    return new Response(JSON.stringify({ success: true, imageUrl }), { status: 200 });
    
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

function formatCaption(data: any, symbol: string): string {
  const price = data.trend?.current_price || 0;
  const entry = data.tp_sl?.entry_price || 0;
  const tp = data.tp_sl?.tp_level || 0;
  const confidence = data.risk_score?.confidence_score || 0;
  const trend = data.trend?.trend || 'neutral';
  const rsi = data.momentum?.rsi_latest || 50;
  
  const trendIcon = trend.includes('bullish') ? '🟢📈' : trend.includes('bearish') ? '🔴📉' : '🟡➡️';
  const rsiIcon = rsi > 70 ? '🔥' : rsi < 30 ? '🥶' : '🌡️';
  const rsiZone = rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral';
  
  return `
📊 *${symbol}*

💰 *Price:* ${price.toLocaleString()}

🎯 *Target Zone:* ${entry.toLocaleString()} → ${tp.toLocaleString()}

📈 *Trend:* ${trendIcon} ${trend.toUpperCase()}

📉 *RSI:* ${rsi} ${rsiIcon} (${rsiZone})

⚡ *AI Confidence:* ${confidence}%

📊 *Chart attached 👆*

[🔗 Full Analysis](https://mpintellect.com/analysis/${symbol})
[🏦 Open Account](https://my.litefinance.org/registration/?uid=967798214)
  `.trim();
}

async function sendPhotoToTelegram(botToken: string, chatId: string, imageUrl: string, caption: string): Promise<boolean> {
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('photo', imageUrl);
  formData.append('caption', caption);
  formData.append('parse_mode', 'Markdown');
  
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method: 'POST', body: formData });
  const result = await res.json();
  return result.ok;
}