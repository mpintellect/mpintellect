// app/lib/email.ts

export async function sendEmail(
  { to, subject, html, text }: { to: string; subject: string; html: string; text?: string },
  env: any
) {
  // Use Resend, Brevo, or any HTTP API. 
  // This example uses Resend.com (Register for a free API key)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM || 'MZPrimer <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
      text: text,
    }),
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Email API failed: ${errorData}`);
  }

  return await res.json();
}