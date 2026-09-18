// functions/api/livemarketfeed.ts
import { normalizePrice } from "../../app/lib/fetchData";

const R2_BASE = "https://data.mpintellect.com";

// The base feed only ever carries 6 symbols (whatever the external signal
// generator that writes market_intelligence.json currently covers). Top it
// up with a curated set of extra symbols pulled from the same per-symbol
// analysis files AiChatBox/LiveChartsTerminal/PropFirmChat already read
// (D1_output_<SYMBOL>.json). Those files are regenerated on a schedule by
// that same external pipeline regardless of whether this endpoint reads
// them, so this costs nothing against its data-provider quota - the only
// thing to budget here is our OWN request volume against R2, which is why
// this list stays short and everything below is cached hard.
const EXTRA_SYMBOLS = ["XAUUSD", "EURUSD", "USDJPY", "GBPUSD", "AUDUSD", "USDCAD", "XAGUSD", "US30"];

async function fetchExtraSignal(symbol: string) {
  const res = await fetch(`${R2_BASE}/D1_output_${symbol}.json`, {
    headers: { Accept: "application/json" },
    // These files are only regenerated every few minutes upstream, so cache
    // them longer at the edge than the base feed.
    // @ts-ignore
    cf: { cacheTtl: 120, cacheEverything: true },
  });
  if (!res.ok) return null;

  const d: any = await res.json();
  const action = d?.final_decision;
  if (action !== "BUY" && action !== "SELL") return null; // skip WAIT/unset

  const current_price = d?.trend?.current_price;
  const confidence = d?.risk_score?.confidence_score;
  if (typeof current_price !== "number" || typeof confidence !== "number") return null;

  const tp = d?.tp_sl?.tp_level;

  return {
    symbol: d.symbol || symbol,
    action,
    current_price: normalizePrice(symbol, current_price),
    tp: typeof tp === "number" ? normalizePrice(symbol, tp) : undefined,
    confidence,
  };
}

async function buildFeed(): Promise<Response> {
  const baseRes = await fetch(`${R2_BASE}/market_intelligence.json?t=${Date.now()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    // @ts-ignore
    cf: { cacheTtl: 30, cacheEverything: true },
  });

  if (!baseRes.ok) {
    return new Response(
      JSON.stringify({
        error: "R2 Fetch Failed",
        status: baseRes.status,
        statusText: baseRes.statusText,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  }

  const data: any = await baseRes.json();
  const baseSignals = data?.signals || [];
  const haveSymbols = new Set(baseSignals.map((s: any) => s.symbol));
  const toFetch = EXTRA_SYMBOLS.filter((s) => !haveSymbols.has(s));

  const extraResults = await Promise.allSettled(toFetch.map(fetchExtraSignal));
  const extraSignals = extraResults
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter((s): s is NonNullable<typeof s> => s !== null);

  const merged = { ...data, signals: [...baseSignals, ...extraSignals] };

  return new Response(JSON.stringify(merged), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=30",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function onRequestGet(context: any) {
  const { request } = context;

  try {
    // Collapse concurrent visitors onto one shared response: without this,
    // every page load re-runs the base fetch plus up to 8 extra subrequests
    // even though the underlying data only changes every 30-120s. The Cache
    // API here caches this endpoint's OWN merged output at the edge, on top
    // of (not instead of) the per-URL `cf.cacheTtl` on each upstream fetch
    // above, so a burst of traffic within the window costs one origin round
    // trip total instead of one per visitor.
    // @ts-ignore
    const cache = caches.default;
    const cacheKey = new Request(request.url, request);
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const response = await buildFeed();

    if (response.status === 200) {
      context.waitUntil(cache.put(cacheKey, response.clone()));
    }

    return response;
  } catch (error: any) {
    console.error("Error in livemarketfeed function:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
