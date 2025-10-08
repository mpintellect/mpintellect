import { adminDb } from '../firebaseAdmin';
import * as admin from 'firebase-admin';

const ORDERS_COLLECTION = 'ai_assistant_orders';

export interface OrderData {
  orderId: string;
  email: string;
  productName: string;
  priceId: string;
  status: 'pending' | 'paid' | 'failed';
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  sessionId?: string;
}

// 🟡 Create a new order before redirecting to Stripe
export async function createOrder(order: Omit<OrderData, 'createdAt' | 'updatedAt' | 'status'>) {
  const now = admin.firestore.Timestamp.now();

  const data: OrderData = {
    ...order,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  await adminDb.collection(ORDERS_COLLECTION).doc(order.orderId).set(data);
  console.log('📦 Order created:', order.orderId);
}

// 🔵 Get order by ID (used in webhook to verify before creating license)
export async function getOrderById(orderId: string): Promise<OrderData | null> {
  const doc = await adminDb.collection(ORDERS_COLLECTION).doc(orderId).get();
  return doc.exists ? (doc.data() as OrderData) : null;
}

// ✅ Update order status after Stripe confirms
export async function updateOrderStatus(orderId: string, status: 'paid' | 'failed', sessionId?: string) {
  const updates: Partial<OrderData> = {
    status,
    updatedAt: admin.firestore.Timestamp.now(),
    ...(sessionId ? { sessionId } : {}),
  };

  await adminDb.collection(ORDERS_COLLECTION).doc(orderId).update(updates);
  console.log(`✅ Order ${orderId} status updated to ${status}`);
}