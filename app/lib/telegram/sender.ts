// app/lib/telegram/sender.ts

interface SendPhotoParams {
  botToken: string;
  chatId: string;
  imageUrl: string;
  caption: string;
}

export async function sendPhotoToTelegram(params: SendPhotoParams): Promise<boolean> {
  const { botToken, chatId, imageUrl, caption } = params;
  
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