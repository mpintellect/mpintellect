// lib/orders.ts
import crypto from "crypto";
import path from "path";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import fs from "fs";
// --- Optional Vercel KV integration (no-op if not configured) ---
const HAS_KV =
  !!process.env.KV_REST_API_URL &&
  !!process.env.KV_REST_API_TOKEN; // set by Vercel when KV attached

async function kvGet<T>(key: string): Promise<T | null> {
  if (!HAS_KV) return null;
  const { kv } = await import("@vercel/kv");
  return (await kv.get<T>(key)) ?? null;
}

async function kvSet(key: string, val: unknown): Promise<void> {
  if (!HAS_KV) return;
  const { kv } = await import("@vercel/kv");
  await kv.set(key, val); // no `any`, no JSON constraint
}

// we’ll store the whole orders array under one key for simplicity
const KV_ORDERS_DUMP_KEY = "orders:dump:v1";
/* ========= Types ========= */
export type OrderStatus = "pending" | "paid" | "expired";
export type PaymentMethod = "card";
export function isTransactionAlreadyUsed(txid: string): boolean {
  for (const order of ORDERS.values()) {
    if (order.txid === txid && order.status === "paid") {
      return true;
    }
  }
  return false;
}

/* ========= Products ========= */
export const PRODUCTS = {
  // Subscriptions (no filePath needed)
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

  // One-time bots
  scalperX1: {
    id: "scalper-x1",
    name: "Scalper X1",
    filePath: "MZPrimer_Scalper_X1_V.1.ex5",
    priceUsd: 15,
    available: true,
  },
  fibonacciPro: {
    id: "fibonacci-pro",
    name: "Fibonacci Pro",
    filePath: "fibonacci_pro.ex5",
    priceUsd: 149,
    available: false,
  },
hedgeMatrix: {
id: "hedge-matrix",
name: "Hedge Matrix",
filePath: "hedge_matrix.ex5",
priceUsd: 119,
  available: false,
 },
 trendSeekerAi: {
id: "trend-seeker-ai",
name: "Trend Seeker AI",
filePath: "trend_seeker_ai.ex5",
priceUsd: 290,
available: false,
 },
} as const;
export interface Order {
  id: string;
  email?: string;
  buyerName?: string;

  // (USDT fields removed)
  // depositAddress?: string;
  // depositIndex?: number;

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
/* ========= File persistence ========= */
const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const ROBOTS_DIR = path.join(process.cwd(), "private", "robots");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function loadOrdersFromDisk(): Promise<Map<string, Order>> {
  try {
    await ensureDataDir();
    const raw = await readFile(ORDERS_FILE, "utf8");
    const arr = JSON.parse(raw) as Order[];
    const m = new Map<string, Order>();
    for (const o of arr) m.set(o.id, o);
    
    // 🚨 ADD DEBUG
    console.log('📥 LOADED ORDERS FROM DISK:', arr.length, 'orders');
    arr.forEach(order => {
      console.log('   -', order.id, order.status, order.amountUsd, order.productName);
    });
    
    return m;
  } catch {
    console.log('📂 No orders file found or error loading, starting fresh');
    return new Map<string, Order>();
  }
}

async function saveOrdersToDisk(map: Map<string, Order>) {
  try {
    await ensureDataDir();
    const arr = Array.from(map.values());
    const tmp = ORDERS_FILE + ".tmp";
    await writeFile(tmp, JSON.stringify(arr, null, 2), "utf8");
    await fs.promises.rename(tmp, ORDERS_FILE); // atomic-ish on most OSes
    console.log("💾 ORDERS SAVED TO DISK:", arr.length, "orders");
  } catch (e) {
    console.error("💥 FAILED to save orders.json:", e);
  }
}
// --- KV mirror: load & save ---
async function loadOrdersFromKV(): Promise<Map<string, Order>> {
  try {
    if (!HAS_KV) return new Map();
    const arr = (await kvGet<Order[]>(KV_ORDERS_DUMP_KEY)) || [];
    console.log("🔑 LOADED ORDERS FROM KV:", arr.length, "orders");
    const m = new Map<string, Order>();
    for (const o of arr) m.set(o.id, o);
    return m;
  } catch (e) {
    console.log("⚠️ KV load skipped/failed:", (e as Error)?.message);
    return new Map();
  }
}

async function saveOrdersToKV(map: Map<string, Order>) {
  try {
    if (!HAS_KV) return;
    const arr = Array.from(map.values());
    await kvSet(KV_ORDERS_DUMP_KEY, arr);
    console.log("🔐 ORDERS SAVED TO KV:", arr.length, "orders");
  } catch (e) {
    console.log("⚠️ KV save skipped/failed:", (e as Error)?.message);
  }
}
/* ========= Store ========= */
// in-memory, hydrated from disk on boot
const ORDERS: Map<string, Order> = new Map();

// One-time hydration from disk (dev) then KV (prod)
let _ordersHydrated: Promise<void> | null = null;

async function hydrateOrdersOnce() {
  // 1) Disk (useful in dev/local)
  const fromDisk = await loadOrdersFromDisk();
  for (const [k, v] of fromDisk) ORDERS.set(k, v);

  // 2) KV (source of truth in prod)
  const fromKV = await loadOrdersFromKV();
  for (const [k, v] of fromKV) ORDERS.set(k, v);

  console.log("✅ Orders hydrated:", ORDERS.size);
}
_ordersHydrated = hydrateOrdersOnce();

// Ensure the in-memory store is hydrated exactly once.
export async function ensureOrdersHydrated(): Promise<void> {
  // If hydration hasn’t been kicked off yet (edge import order), start it now.
  if (!_ordersHydrated) {
    _ordersHydrated = hydrateOrdersOnce();
  }
  await _ordersHydrated;
}

// Async getter for pages/APIs that want fresh data
export async function getAllOrdersAsync(): Promise<Order[]> {
  await ensureOrdersHydrated();
  return Array.from(ORDERS.values()).sort((a, b) => b.createdAt - a.createdAt);
}
/* ========= CRUD helpers ========= */
export function createOrder(
  o: Omit<Order, "id" | "status" | "createdAt" | "createdAtISO">
): Order {
  const now = Date.now();

  const order: Order = {
    ...o,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: now,
    createdAtISO: new Date(now).toISOString(),
  };

  ORDERS.set(order.id, order);
  saveOrdersToKV(ORDERS).catch(() => {});

  console.log("🆕 ORDER CREATED:", {
    id: order.id,
    amount: order.amountUsd,
    product: order.productName,
    method: order.method,
    status: order.status,
  });

  try { saveOrdersToDisk?.(ORDERS); } catch {}
  return order;
}

export function getOrder(id: string): Order | undefined {
  const order = ORDERS.get(id);
  
  // 🚨 ADD DEBUG
  console.log('🔍 GET ORDER:', id, 'Found:', !!order);
  if (order) {
    console.log('   - Status:', order.status);
    console.log('   - Amount:', order.amountUsd);
    console.log('   - Method:', order.method);
  } else {
    console.log('   - Available orders:', Array.from(ORDERS.keys()));
  }
  
  return order;
}
export function updateOrder(id: string, patch: Partial<Order>): Order | undefined {
  const cur = ORDERS.get(id);
  if (!cur) {
    console.log('❌ UPDATE FAILED: Order not found', id);
    return undefined;
  }
  
  const next: Order = { ...cur, ...patch };
  ORDERS.set(id, next);
  
  // 🚨 ADD DEBUG
  console.log('🔄 ORDER UPDATED:', id, {
    fromStatus: cur.status,
    toStatus: next.status,
    changes: patch
  });
  
  // persist in background
  saveOrdersToDisk(ORDERS).catch(() => {});
  saveOrdersToKV(ORDERS).catch(() => {});
  return next;
}

/* ========= Token issuing (after payment) ========= */
export function issueDownloadToken(orderId: string, ttlSeconds = 24 * 3600) {
  const order = ORDERS.get(orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "paid") throw new Error("Order not paid");

  const rawToken = crypto.randomBytes(32).toString("base64url"); // ~43 chars
  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");   // 64 chars
  const expires = Date.now() + ttlSeconds * 1000;

  updateOrder(orderId, {
    downloadTokenHash: hash,
    downloadExpiresAt: expires,
    downloadUsed: false,
  });

  return { rawToken, expiresAt: expires };
}

/* ========= Verify + consume token ========= */
export async function verifyAndConsumeToken(token: string): Promise<Order> {
  if (!token) throw new Error("Missing token");

  await ensureOrdersHydrated();

  const tokenHash =
    token.length === 64 && /^[a-f0-9]+$/i.test(token)
      ? token
      : crypto.createHash("sha256").update(token).digest("hex");

  let order: Order | undefined;
  for (const o of ORDERS.values()) {
    if (o.downloadTokenHash === tokenHash) { order = o; break; }
  }
  if (!order) throw new Error("Invalid token");

  // Check if order expired due to timeout (30 minutes)
  const orderAge = Date.now() - order.createdAt;
  const thirtyMinutesMs = 30 * 60 * 1000;
  
  if (order.status === "pending" && orderAge > thirtyMinutesMs) {
    updateOrder(order.id, { status: "expired" });
    throw new Error("Order expired - payment not completed within 30 minutes");
  }

  if (order.status !== "paid") throw new Error("Order not paid");
  if (order.downloadUsed) throw new Error("Token already used");
  if (!order.downloadExpiresAt || Date.now() > order.downloadExpiresAt) {
    updateOrder(order.id, { status: "expired" });
    throw new Error("Download token expired");
  }

  // Ensure file exists
  const abs = path.join(ROBOTS_DIR, path.basename(order.filePath));
  await access(abs, fs.constants.R_OK).catch(() => { throw new Error("File not available"); });

  // One-time use
  updateOrder(order.id, { downloadUsed: true });

  return order;
}
// AFTER — verify only, NO consumption here
export async function verifyDownloadToken(token: string): Promise<Order> {
  if (!token) throw new Error("Missing token");

  // ✅ Hydrate before reading ORDERS
  await ensureOrdersHydrated();

  const tokenHash =
    token.length === 64 && /^[a-f0-9]+$/i.test(token)
      ? token
      : crypto.createHash("sha256").update(token).digest("hex");

  let order: Order | undefined;
  for (const o of ORDERS.values()) {
    if (o.downloadTokenHash === tokenHash) { order = o; break; }
  }
  if (!order) throw new Error("Invalid token");

  // 30-min payment window enforcement
  const orderAge = Date.now() - order.createdAt;
  const thirtyMinutesMs = 30 * 60 * 1000;
  if (order.status === "pending" && orderAge > thirtyMinutesMs) {
    updateOrder(order.id, { status: "expired" });
    throw new Error("Order expired - payment not completed within 30 minutes");
  }

  if (order.status !== "paid") throw new Error("Order not paid");
  if (order.downloadUsed) throw new Error("Token already used");
  if (!order.downloadExpiresAt || Date.now() > order.downloadExpiresAt) {
    updateOrder(order.id, { status: "expired" });
    throw new Error("Download token expired");
  }

  return order;
}

// NEW: consume only when you KNOW you can send the bytes
export function markDownloadUsed(orderId: string) {
  updateOrder(orderId, { downloadUsed: true });
}
/* ========= Query helpers (debug/admin) ========= */
export function getAllOrders(): Order[] {
  return Array.from(ORDERS.values()).sort((a, b) => b.createdAt - a.createdAt);
}
