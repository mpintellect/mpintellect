// ✅ REMOVED: fs, path, and process.cwd()
import { randomUUID } from "node:crypto"; // Cloudflare supports node:crypto

/* ========= Types ========= */
export type OrderStatus = "pending" | "paid" | "expired";
export type PaymentMethod = "card";

export interface Order {
  id: string;
  email?: string;
  buyerName?: string;
  productId: string;
  productName: string;
  filePath: string;
  amountUsd: number;
  method: "card";
  status: "pending" | "paid" | "expired";
  txid?: string;
  createdAt: number;
  createdAtISO?: string;
  downloadTokenHash?: string;
  downloadExpiresAt?: number;
  downloadUsed?: boolean;
  ip?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
}

/* ========= Products ========= */
export const PRODUCTS = {
  aiAssistantMonthly: {
    id: "ai-assistant-monthly",
    name: "AI Assistant – Monthly",
    priceUsd: 6,
    available: true,
  },
  aiAssistantPro: {
    id: "ai-assistant-pro",
    name: "AI Assistant – Pro Monthly",
    priceUsd: 30,
    available: false,
  },
  scalperX1: {
    id: "scalper-x1",
    name: "Scalper X1",
    filePath: "MZPrimer_Scalper_X1_V.1.ex5",
    priceUsd: 15,
    available: true,
  }
} as const;

/* ========= Store (In-Memory Only for Edge) ========= */
// NOTE: On Cloudflare, global variables reset often. 
// You should use Firestore to save/load these in production.
const ORDERS: Map<string, Order> = new Map();

export async function ensureOrdersHydrated(): Promise<void> {
  // Logic to pull from Firebase/KV would go here
  return Promise.resolve();
}

export async function getAllOrdersAsync(): Promise<Order[]> {
  return Array.from(ORDERS.values()).sort((a, b) => b.createdAt - a.createdAt);
}

/* ========= CRUD helpers ========= */
export function createOrder(
  o: Omit<Order, "id" | "status" | "createdAt" | "createdAtISO">
): Order {
  const now = Date.now();

  const order: Order = {
    ...o,
    id: randomUUID(), // Standard Edge-compatible UUID
    status: "pending",
    createdAt: now,
    createdAtISO: new Date(now).toISOString(),
  };

  ORDERS.set(order.id, order);
  
  // ✅ IMPORTANT: You should call a Firebase function here to save the order
  console.log("🆕 ORDER CREATED:", order.id);

  return order;
}

export function getOrder(id: string): Order | undefined {
  return ORDERS.get(id);
}

export function updateOrder(id: string, patch: Partial<Order>): Order | undefined {
  const cur = ORDERS.get(id);
  if (!cur) return undefined;
  
  const next: Order = { ...cur, ...patch };
  ORDERS.set(id, next);
  
  return next;
}

/* ========= Token Logic (Simplified for Edge) ========= */
export function issueDownloadToken(orderId: string, ttlSeconds = 24 * 3600) {
  const order = ORDERS.get(orderId);
  if (!order) throw new Error("Order not found");

  // Create a random token using Web Crypto API
  const rawToken = btoa(Math.random().toString()).substring(0, 20); 
  const expires = Date.now() + ttlSeconds * 1000;

  updateOrder(orderId, {
    downloadTokenHash: rawToken,
    downloadExpiresAt: expires,
    downloadUsed: false,
  });

  return { rawToken, expiresAt: expires };
}

export async function verifyDownloadToken(token: string): Promise<Order> {
  await ensureOrdersHydrated();
  let order: Order | undefined;
  
  for (const o of ORDERS.values()) {
    if (o.downloadTokenHash === token) { order = o; break; }
  }
  
  if (!order) throw new Error("Invalid token");
  return order;
}

export function markDownloadUsed(orderId: string) {
  updateOrder(orderId, { downloadUsed: true });
}

export function getAllOrders(): Order[] {
  return Array.from(ORDERS.values()).sort((a, b) => b.createdAt - a.createdAt);
}