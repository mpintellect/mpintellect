// functions/api/telegram/publish.ts

import { generateCaptionFromData, buildSignalButtons } from '../../../backend-lib/telegram-post';

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
    // Same shared admin secret (and same fail-closed convention) as every
    // other /admin/* surface - see backend-lib/ad-shared.ts:verifyAdminAuth
    // and functions/api/admin/validate.ts.
    const expectedSecret = env.ADMIN_PASSWORD || env.ADMIN_KEY;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get symbol from request
    const body = await request.json();
    const symbol = body.symbol || 'XAUUSD';
    
    console.log(`📊 Publishing ${symbol} to Telegram...`);
    
    // Generate the chart image (returns timestamped image URL in headers)
    const chartApiUrl = `https://mpintellect.com/api/ads/render-chart?symbol=${symbol}&refresh=true`;
    console.log(`🎨 Generating chart: ${chartApiUrl}`);
    
    const chartRes = await fetch(chartApiUrl);
    if (!chartRes.ok) {
      throw new Error(`Chart generation failed: ${chartRes.status}`);
    }
    
    // Get the new timestamped image URL from response headers
    const imageUrl = chartRes.headers.get('X-Image-Url') || `https://news.mpintellect.com/${symbol}.png`;
    console.log(`🖼️ New Image URL: ${imageUrl}`);
    
    // Fetch data for caption
    const dataUrl = `https://data.mpintellect.com/D1_output_${symbol}.json`;
    const dataRes = await fetch(dataUrl);
    const data = await dataRes.json();
    
    // Generate caption
    const caption = generateCaptionFromData(data, symbol);
    console.log(`📝 Caption generated`);
    
    // Prepare inline keyboard buttons
    const buttons = buildSignalButtons(symbol);
    
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

// Send photo with inline keyboard buttons
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
  formData.append('parse_mode', 'Markdown');
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