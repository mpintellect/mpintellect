// functions/api/telegram/send-message.ts

export async function onRequestPost(context: any) {
  const { request, env } = context;
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const authHeader = request.headers.get('Authorization');
    const expectedSecret = env.ADMIN_SECRET || 'mp2026';
    
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const body = await request.json();
    let { message, buttons } = body;
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`📤 Sending message to Telegram...`);
    
    // Prepare inline keyboard if buttons are provided
    let replyMarkup = undefined;
    if (buttons && buttons.length > 0) {
      const keyboard = [];
      for (const row of buttons) {
        const buttonRow = [];
        for (const btn of row) {
          buttonRow.push({
            text: btn.text,
            url: btn.url
          });
        }
        keyboard.push(buttonRow);
      }
      replyMarkup = { inline_keyboard: keyboard };
    }
    
    const payload: any = {
      chat_id: env.TELEGRAM_CHANNEL_ID,
      text: message,
      parse_mode: 'Markdown',  // ← ENABLED for bold text
      disable_web_page_preview: false,
    };
    
    if (replyMarkup) {
      payload.reply_markup = JSON.stringify(replyMarkup);
    }
    
    const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    const result = await response.json();
    
    if (!result.ok) {
      console.error('Telegram error:', result);
      return new Response(JSON.stringify({ error: result.description }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`✅ Message sent successfully`);
    
    return new Response(JSON.stringify({
      success: true,
      message_id: result.result.message_id,
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Send message error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}