// app/lib/orders.ts
// ✅ REMOVE: import { randomUUID } from "node:crypto";
// ✅ USE: Web Crypto API or a polyfill

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

/* ========= UUID Generation (Cloudflare compatible) ========= */
function generateUUID(): string {
  // Use Web Crypto API if available (works in Cloudflare Workers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/* ========= Store (In-Memory Only for Edge) ========= */
const ORDERS: Map<string, Order> = new Map();

export async function ensureOrdersHydrated(): Promise<void> {
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
    id: generateUUID(), // Use our Cloudflare-compatible UUID generator
    status: "pending",
    createdAt: now,
    createdAtISO: new Date(now).toISOString(),
  };

  ORDERS.set(order.id, order);
  
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

  // Create a random token using crypto if available
  let rawToken: string;
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(20);
    crypto.getRandomValues(array);
    rawToken = btoa(String.fromCharCode.apply(null, Array.from(array)));
  } else {
    rawToken = btoa(Math.random().toString()).substring(0, 20);
  }
  
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