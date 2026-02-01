// app/lib/email.ts

export interface OrderEmailDetails {
  to: string;
  orderId: string;
  productName: string;
  amountPaid: number;
}

/**
 * FIXED: This satisfies the Stripe Webhook import.
 * Uses Fetch (0MB) instead of Nodemailer (15MB).
 */
export async function sendOrderConfirmation(order: OrderEmailDetails, env: any): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is missing in Cloudflare Dashboard");
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM || 'MZPrimer <orders@mzprimer.com>',
      to: [order.to],
      subject: `Order Confirmed: ${order.productName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1>Order Confirmed! 🎉</h1>
          <p>Product: ${order.productName}</p>
          <p>Order ID: ${order.orderId}</p>
          <p>Amount Paid: $${order.amountPaid.toFixed(2)}</p>
          <a href="https://mzprimer.com/client/dashboard">Go to Dashboard</a>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Email API Error:", err);
  }
}

/**
 * FIXED: This satisfies the Contact API import.
 */
export async function sendEmail(
  details: { to: string; subject: string; html: string; text?: string },
  env: any
): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM || 'MZPrimer Contact <contact@mzprimer.com>',
      to: [details.to],
      subject: details.subject,
      html: details.html,
      text: details.text,
    }),
  });
}