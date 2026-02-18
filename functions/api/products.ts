// functions/api/products.ts

// 1. We define the products locally or import them from a LIGHTWEIGHT file. 
// Avoid importing from 'app/lib/orders' if that file uses 'fs' or Node.js libs.
const PRODUCTS_DATA = {
  "ai-assistant-monthly": { id: "ai-assistant-monthly", name: "AI Assistant Monthly", priceUsd: 10, available: true, type: "subscription" },
  "scalper-x1": { id: "scalper-x1", name: "Scalper X1 Robot", priceUsd: 50, available: true, type: "one_time" },
  "fibonacci-pro": { id: "fibonacci-pro", name: "Fibonacci Pro", priceUsd: 149, available: true, type: "one_time" },
  "trend-seeker-ai": { id: "trend-seeker-ai", name: "Trend Seeker AI", priceUsd: 129, available: true, type: "one_time" },
  "hedge-matrix": { id: "hedge-matrix", name: "Hedge Matrix", priceUsd: 299, available: true, type: "one_time" },
};

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export async function onRequestGet() {
  try {
    const list = Object.values(PRODUCTS_DATA)
      .filter((p: any) => p.available)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        priceUsd: p.priceUsd,
        type: p.type,
      }));

    return new Response(JSON.stringify({ ok: true, products: list }), {
      status: 200,
      headers: HEADERS
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: HEADERS
    });
  }
}