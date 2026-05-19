// functions/api/telegram/publish.ts

export async function onRequestPost(context: any) {
  const { request, env } = context;
  
  console.log(`🔍 Publish endpoint called`);
  
  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Authentication
    const authHeader = request.headers.get('Authorization');
    const expectedSecret = env.ADMIN_SECRET || 'mp2026';
    
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get symbol from request
    const body = await request.json();
    const symbol = body.symbol || 'XAUUSD';
    
    console.log(`📊 Publishing ${symbol} to Telegram...`);
    
    // Generate the chart image
    const chartApiUrl = `https://mpintellect.com/api/ads/render-chart?symbol=${symbol}&refresh=true`;
    console.log(`🎨 Generating chart: ${chartApiUrl}`);
    
    const chartRes = await fetch(chartApiUrl);
    if (!chartRes.ok) {
      throw new Error(`Chart generation failed: ${chartRes.status}`);
    }
    
    // Image URL
    const imageUrl = `https://news.mpintellect.com/${symbol}.png`;
    console.log(`🖼️ Image URL: ${imageUrl}`);
    
    // Fetch data for caption
    const dataUrl = `https://data.mpintellect.com/D1_output_${symbol}.json`;
    const dataRes = await fetch(dataUrl);
    const data = await dataRes.json();
    
    // Generate caption (plain text, no Markdown)
    const caption = generateCaptionFromData(data, symbol);
    console.log(`📝 Caption generated`);
    
    // Prepare inline keyboard buttons
    const buttons = {
      inline_keyboard: [
        [
          { text: "✅ افتح حسابك من هنا", url: `https://my.litefinance.org/registration/?uid=967798214&utm_source=telegram&utm_medium=signal&utm_campaign=${symbol.toLowerCase()}` }
        ],
        [
          { text: "📊 عرض التحليل الكامل", url: `https://mpintellect.com/` }
        ]
      ]
    };
    
    // Send to Telegram with buttons
    const sendSuccess = await sendPhotoWithButtonsToTelegram(
      env.TELEGRAM_BOT_TOKEN,
      env.TELEGRAM_CHANNEL_ID,
      imageUrl,
      caption,
      buttons
    );
    
    if (!sendSuccess) {
      await sendMessageToTelegram(
        env.TELEGRAM_BOT_TOKEN,
        env.TELEGRAM_CHANNEL_ID,
        caption + "\n\n⚠️ Chart image temporarily unavailable"
      );
    }
    
    console.log(`✅ Published ${symbol} successfully`);
    
    return new Response(JSON.stringify({
      success: true,
      symbol: symbol,
      imageUrl: imageUrl,
      caption: caption,
    }), { 
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
    
  } catch (error: any) {
    console.error('Publish error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// NEW: Send photo with inline keyboard buttons
async function sendPhotoWithButtonsToTelegram(
  botToken: string,
  chatId: string,
  imageUrl: string,
  caption: string,
  replyMarkup: any
): Promise<boolean> {
  const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;
  
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('photo', imageUrl);
  formData.append('caption', caption);
  formData.append('reply_markup', JSON.stringify(replyMarkup));
  
  try {
    const response = await fetch(url, { method: 'POST', body: formData });
    const result = await response.json();
    console.log('📨 Telegram response:', result);
    return result.ok;
  } catch (error) {
    console.error('Failed to send photo:', error);
    return false;
  }
}

async function sendMessageToTelegram(
  botToken: string,
  chatId: string,
  message: string
): Promise<boolean> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true,
    }),
  });
  
  const result = await response.json();
  return result.ok;
}

function generateCaptionFromData(data: any, symbol: string): string {
  const price = data.trend?.current_price || 0;
  const entry = data.tp_sl?.entry_price || data.pending_orders?.primary_order?.entry_price || 0;
  const tp = data.tp_sl?.tp_level || data.pending_orders?.primary_order?.tp_price || 0;
  const confidence = data.risk_score?.confidence_score || 0;
  const trend = data.trend?.trend || 'neutral';
  const rsi = data.momentum?.rsi_latest || 50;
  
  const trendIcon = trend.includes('bullish') ? '🟢' : trend.includes('bearish') ? '🔴' : '⚪';
  const trendText = trend.replace(/_/g, ' ').toUpperCase();
  
  // RSI zone text
  let rsiZone = 'Neutral';
  if (rsi > 70) rsiZone = 'Overbought';
  else if (rsi < 30) rsiZone = 'Oversold';
  
  return `
🤖 MPIntellect - AI Analysis

📊 ${symbol}
💰 Price: ${price.toLocaleString()}
🎯 Target Zone: ${entry.toLocaleString()} → ${tp.toLocaleString()}
📈 Trend: ${trendIcon} ${trendText}
📉 RSI: ${rsi.toFixed(1)} (${rsiZone})
⚡ Confidence: ${confidence}%
  `.trim();
}