// app/lib/email.ts

export interface OrderEmailDetails {
  to: string;
  orderId: string;
  productName: string;
  amountPaid: number;
}

/**
 * Sends a professional order confirmation via Resend HTTP API
 * This satisfies Cloudflare's 25MB limit (0MB added)
 */
export async function sendOrderConfirmation(order: OrderEmailDetails, env: any): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = env.EMAIL_FROM || 'MZPrimer <onboarding@resend.dev>';

  if (!apiKey) {
    console.error("❌ RESEND_API_KEY is missing in the environment");
    return;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [order.to],
        subject: `Success: Your ${order.productName} is ready!`,
        // REQUIRED: Branding & Anti-Spam Headers
        headers: {
          "X-Entity-ID": "MZPrimer-Intelligence",
          "List-Unsubscribe": `<https://mzprimer.com/unsubscribe?email=${order.to}>`
        },
        html: `
          <div style="background:#0a0a0a; padding:40px; font-family:sans-serif; color:#fff;">
            <div style="max-width:600px; margin:0 auto; background:#111; padding:20px; border:1px solid #333; border-radius:12px;">
              <h2 style="color:#22c55e;">Order Confirmed 🎉</h2>
              <p>Hello,</p>
              <p>Your payment was successful. We have added the setups to your account.</p>
              <div style="background:#1a1a1a; padding:15px; border-radius:8px; margin:20px 0;">
                <p style="margin:5px 0;"><b>Product:</b> ${order.productName}</p>
                <p style="margin:5px 0;"><b>Order ID:</b> ${order.orderId}</p>
                <p style="margin:5px 0;"><b>Amount:</b> $${order.amountPaid.toFixed(2)}</p>
              </div>
              <a href="https://mzprimer.com/client/dashboard" 
                 style="display:inline-block; background:#22c55e; color:#000; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
                 Access Dashboard
              </a>
              <p style="margin-top:30px; font-size:12px; color:#666;">MZPrimer LTD - AI Trading Solutions</p>
            </div>
          </div>
        `,
      }),
    });

    if (response.ok) {
      console.log(`📧 Confirmation email sent to ${order.to}`);
    } else {
      const error = await response.text();
      console.error("❌ Resend API Error:", error);
    }
  } catch (e: any) {
    console.error("❌ Failed to trigger email fetch:", e.message);
  }
}