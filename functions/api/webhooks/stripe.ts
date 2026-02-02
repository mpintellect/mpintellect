// functions/api/webhooks/stripe.ts

import Stripe from "stripe";
import { execute, queryOne } from "../../../backend-lib/db-simple";

const SETUP_CREDITS: Record<string, number> = {
  "price_1SSyQORmR6ESDQvobwheaXws": 10,
  "price_1SSyRGRmR6ESDQvoKgAI9CAN": 20,
  "price_1SSyUORmR6ESDQvo7dzPKmPt": 30,
};

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { 
    // @ts-ignore
    apiVersion: "2023-10-16" 
  });
  
  const sig = request.headers.get("stripe-signature") || "";
  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET_CHATBOT);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // 1. Identify User and Product
      const userId = session.metadata?.userId;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id || "";

      const setupsToAdd = SETUP_CREDITS[priceId];

      if (userId && setupsToAdd) {
        console.log(`🎉 Success: Adding ${setupsToAdd} setups to user ${userId}`);

        // 2. Update D1 Database (Atomic SQL Update)
        await execute(
          "UPDATE users SET setup_count = setup_count + ?, updated_at = datetime('now') WHERE id = ?",
          [setupsToAdd, userId]
        );

        // 3. Log purchase history
        await execute(
          "INSERT INTO stripe_purchases (user_id, amount_paid, status, created_at) VALUES (?, ?, 'completed', datetime('now'))",
          [userId, (session.amount_total || 0) / 100]
        );
      }
    }

    return Response.json({ received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return Response.json({ error: err.message }, { status: 400 });
  }
}