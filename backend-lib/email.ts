// backend-lib/email.ts

export async function sendEmail(
  details: { to: string; subject: string; html: string; text?: string },
  env: any
): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("❌ RESEND_API_KEY is missing");
    return;
  }

  try {
    console.log(`📧 Sending email via Resend to: ${details.to}`);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM || 'MZ Primer Intel <info@mzpintel.com>',
        to: [details.to],
        subject: details.subject,
        html: details.html,
        text: details.text || '',
      }),
    });

    const responseData = await response.json();
    
    if (response.ok) {
      console.log(`✅ Email sent successfully to ${details.to}`, responseData);
    } else {
      console.error("❌ Resend API Error:", responseData);
    }
  } catch (e: any) {
    console.error("❌ Email System Failure:", e.message);
  }
}