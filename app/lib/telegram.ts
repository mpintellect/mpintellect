export async function sendToTelegram(title: string, message: string, link: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;

  if (!token || !chatId) {
    console.warn("⚠️ Telegram credentials missing");
    return;
  }

  // Format the message content with proper structure
  const formattedContent = formatMessageContent(message);
  
  // Build the complete message template
  const telegramMessage = buildMessageTemplate(title, formattedContent, link);

  try {
    await sendTelegramMessage(token, chatId, telegramMessage);
    console.log("✅ Signal successfully sent to Telegram channel");
  } catch (error) {
    console.error("❌ Failed to send Telegram message:", error);
    throw error; // Re-throw to handle in calling function
  }
}

function formatMessageContent(message: string): string {
  return message
    .split(' | ')
    .map(line => {
      // Enhance key metrics with emphasis
      const enhancedLine = line
        .replace(/^(Entry|TP|SL|Confidence|Trend|Leverage):/i, '<b>$1:</b>')
        .replace(/(\d+\.?\d*)/, '<code>$1</code>'); // Format numbers
      
      return `• ${enhancedLine}`;
    })
    .join('\n');
}

function buildMessageTemplate(title: string, content: string, link: string): string {
  return `
🚀 <b>MZPrimer AI Trading Signal</b>
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

🎯 <b>${title.toUpperCase()}</b>

${content}

<b>QUICK ACTIONS:</b>
└─ <a href="${link}">📈 Live Chart & Analysis</a>
└─ <a href="https://mzprimer.com//AIChat">🌐 AI Trading Expert</a>

<i>AI-powered signals • Real-time monitoring</i>
  `.trim();
}

async function sendTelegramMessage(token: string, chatId: string, text: string) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'User-Agent': 'MZPrimer-Trading-Bot/1.0'
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      disable_notification: false // Set to true for silent messages
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Telegram API error: ${errorData.description || response.statusText}`);
  }

  return await response.json();
}