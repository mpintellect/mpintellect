// backend-lib/email.ts

export interface OrderEmailDetails {
  to: string;
  orderId: string;
  productName: string;
  amountPaid: number;
}

/**
 * FIXED: This satisfies the Contact API (functions/api/contact.ts)
 */
export async function sendEmail(
  details: { to: string; subject: string; html: string; text?: string },
  env: any
): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("❌ Email error: RESEND_API_KEY missing in Dashboard");
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM || 'MZPrimer <onboarding@resend.dev>',
      to: [details.to],
      subject: details.subject,
      html: details.html,
      text: details.text,
    }),
  });

  if (!res.ok) {
    const errorData = await res.text();
    console.error("❌ Resend API failed:", errorData);
  } else {
    console.log(`✅ Email successfully sent to ${details.to}`);
  }
}

/**
 * FIXED: This satisfies the Stripe Webhook (functions/api/webhooks/stripe.ts)
 */
export async function sendOrderConfirmation(order: OrderEmailDetails, env: any): Promise<void> {
  // We reuse the same sendEmail logic to keep the bundle small
  await sendEmail({
    to: order.to,
    subject: `Order Confirmed: ${order.productName}`,
    html: `<h1>Thank you for your purchase!</h1><p>Order ID: ${order.orderId}</p>`,
    text: `Thank you for your purchase! Order ID: ${order.orderId}`
  }, env);
}