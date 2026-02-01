// app/lib/email.ts (CLEAN CLOUDFLARE VERSION)

export interface OrderEmailDetails {
  to: string;
  orderId: string;
  productName: string;
  amountPaid: number;
  downloadToken?: string;
  paymentDetails?: {
    wallet: string;
    amount: number;
    network: string;
  };
}

// We use FETCH instead of Nodemailer to save 15MB of bundle space
export async function sendOrderConfirmation(
  order: OrderEmailDetails, 
  env: any // We pass env to get API keys
): Promise<void> {
  
  // Example using Resend.com (Free and very popular for Next.js)
  // You just need to add RESEND_API_KEY to your Cloudflare Dashboard
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'MZPrimer <contact@mzprimer.com>',
      to: [order.to],
      subject: `Order Confirmed: ${order.productName}`,
      html: `<h1>Thank you!</h1><p>Order ${order.orderId} is complete.</p>`,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Email API Error:", error);
  }
}