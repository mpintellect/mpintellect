// app/api/google-og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

/** -----------------------------
 *  SIZES (Google Ads / Feeds)
 *  ----------------------------- */
const SIZES: Record<
  string,
  { width: number; height: number; pad: number; scale: number; layout: "wide" | "square" | "story" }
> = {
  standard: { width: 1200, height: 628, pad: 48, scale: 1.0, layout: "wide" },
  alt: { width: 1200, height: 630, pad: 48, scale: 1.0, layout: "wide" },
  square: { width: 1080, height: 1080, pad: 64, scale: 1.18, layout: "square" },
  mobile: { width: 1080, height: 566, pad: 40, scale: 0.95, layout: "wide" },
  story: { width: 1080, height: 1920, pad: 72, scale: 1.05, layout: "story" },
  portrait: { width: 1080, height: 1350, pad: 64, scale: 1.05, layout: "story" },
  pinterest: { width: 800, height: 1200, pad: 56, scale: 1.0, layout: "story" },
};

/** -----------------------------
 *  SYMBOL SPECS (decimals)
 *  ----------------------------- */
const SYMBOL_SPECS: Record<string, { decimals: number; fullName: string }> = {
  // Forex
  EURUSD: { decimals: 5, fullName: "EUR/USD" },
  GBPUSD: { decimals: 5, fullName: "GBP/USD" },
  USDJPY: { decimals: 3, fullName: "USD/JPY" },
  USDCAD: { decimals: 5, fullName: "USD/CAD" },
  AUDUSD: { decimals: 5, fullName: "AUD/USD" },
  NZDUSD: { decimals: 5, fullName: "NZD/USD" },
  USDCHF: { decimals: 5, fullName: "USD/CHF" },
  EURJPY: { decimals: 3, fullName: "EUR/JPY" },
  EURGBP: { decimals: 5, fullName: "EUR/GBP" },
  GBPJPY: { decimals: 3, fullName: "GBP/JPY" },
  GBPCHF: { decimals: 5, fullName: "GBP/CHF" },

  // Metals / Energy
  XAUUSD: { decimals: 2, fullName: "Gold (XAU/USD)" },
  XAUEUR: { decimals: 2, fullName: "Gold/EUR" },
  XAGUSD: { decimals: 3, fullName: "Silver (XAG/USD)" },
  PLATINUM: { decimals: 2, fullName: "Platinum" },
  BRENT: { decimals: 2, fullName: "Brent Oil" },

  // Crypto
  BTCUSD: { decimals: 1, fullName: "Bitcoin (BTC)" },
  ETHUSD: { decimals: 2, fullName: "Ethereum (ETH)" },
  XRPUSD: { decimals: 4, fullName: "Ripple (XRP)" },
  LTCUSD: { decimals: 2, fullName: "Litecoin (LTC)" },
  DOGEUSD: { decimals: 4, fullName: "Dogecoin" },

  // Indices
  US500: { decimals: 2, fullName: "S&P 500" },
  USTEC: { decimals: 2, fullName: "NASDAQ 100" },
  US30: { decimals: 1, fullName: "Dow Jones 30" },
  HK50: { decimals: 2, fullName: "Hong Kong 50" },
  FRANCE40: { decimals: 2, fullName: "CAC 40" },
  CHINA50: { decimals: 1, fullName: "China A50" },
  UK100: { decimals: 1, fullName: "FTSE 100" },
};

function formatPrice(price: number | null | undefined, symbol: string) {
  if (price === null || price === undefined || Number.isNaN(price)) return "----";
  const spec = SYMBOL_SPECS[symbol] ?? { decimals: 5, fullName: symbol };
  return price.toFixed(spec.decimals);
}

function safeUpper(s: string) {
  return (s || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

/** -----------------------------
 *  Fetch your JSON (GCS pipeline)
 *  ----------------------------- */
async function fetchSymbolData(symbolRaw: string) {
  const symbol = safeUpper(symbolRaw);
  const url = `https://storage.googleapis.com/mzprimer-data-store/output_${symbol}.json`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;

    const data = await res.json();

    // PRIMARY: decision + tp/sl from your authoritative place
    const decision = (data.final_decision || "WAIT").toString().toUpperCase();

    const tpSl = data.tp_sl || {};
    const entry = tpSl.entry_price ?? null;
    const tp = tpSl.tp_level ?? null;
    const sl = tpSl.sl_level ?? null;

    // Confidence + time
    const confidence =
      data.risk_score?.confidence_score ??
      data.trend?.analysis_confidence ??
      data.analysis_confidence ??
      50;

    const ts = data.trend?.timestamp || data.generated_at || "";

    // Current price is optional in this UI, but we keep it for fallback
    const currentPrice = data.trend?.current_price ?? data.current_price ?? null;

    return { symbol, decision, entry, tp, sl, confidence, ts, currentPrice, raw: data };
  } catch {
    return null;
  }
}

function minutesAgo(ts: string) {
  if (!ts) return null;
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return null;
  const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60));
  if (diff < 0) return 0;
  return Math.min(diff, 999);
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const symbolParam = searchParams.get("symbol") || "BTCUSD";
    const symbol = safeUpper(symbolParam);

    const sizeKey = (searchParams.get("size") || "standard").toLowerCase();
    const cfg = SIZES[sizeKey] || SIZES.standard;

    // theme optional
    const theme = (searchParams.get("theme") || "dark").toLowerCase();

    const data = await fetchSymbolData(symbol);

    // Fetch logo from public folder
    const baseUrl = new URL(request.url);
    baseUrl.pathname = "/logos/icon.png";
    const logoUrl = baseUrl.toString();

    let logoData = null;
    try {
      const logoRes = await fetch(logoUrl);
      if (logoRes.ok) {
        const logoBuffer = await logoRes.arrayBuffer();
        const logoBase64 = Buffer.from(logoBuffer).toString('base64');
        logoData = `data:image/png;base64,${logoBase64}`;
      }
    } catch (error) {
      // Logo fetch failed, will use fallback
      console.error('Failed to fetch logo:', error);
    }

    // Decide what to show
    const decision = data?.decision || "ANALYZING";
    const isBuy = decision.includes("BUY");
    const isSell = decision.includes("SELL");

    const accent = isBuy ? "#10B981" : isSell ? "#EF4444" : "#F59E0B"; // green/red/amber
    const bg = theme === "light" ? "#F8FAFC" : "#050505";
    const card = theme === "light" ? "#FFFFFF" : "#0A0A0A";
    const border = theme === "light" ? "rgba(15,23,42,0.12)" : "rgba(255,255,255,0.10)";
    const textMain = theme === "light" ? "#0F172A" : "#FFFFFF";
    const textDim = theme === "light" ? "#334155" : "#A3A3A3";

    const spec = SYMBOL_SPECS[symbol] ?? { decimals: 5, fullName: symbol };

    // Prices (ENTRY/SL/TP) – fallback if missing
    const entry = formatPrice(data?.entry ?? null, symbol);
    const sl = formatPrice(data?.sl ?? null, symbol);
    const tp = formatPrice(data?.tp ?? null, symbol);

    const conf = clamp(Number(data?.confidence ?? 50), 0, 100);
    const ago = minutesAgo(data?.ts || "");

    // Typography scale by size
    const S = cfg.scale;

    const symbolSize =
      cfg.layout === "wide" ? Math.round(84 * S) : cfg.layout === "square" ? Math.round(110 * S) : Math.round(120 * S);
    const signalSize =
      cfg.layout === "wide" ? Math.round(64 * S) : cfg.layout === "square" ? Math.round(72 * S) : Math.round(82 * S);

    const labelSize = Math.round(18 * S);
    const priceSize = Math.round(44 * S);

    const pad = cfg.pad;

    // Layout rules
    const isStory = cfg.layout === "story";
    const isSquare = cfg.layout === "square";

    // Spacing tuned so:
    // - square is NOT empty (bigger + centered)
    // - story is NOT crowded (one column, limited blocks)
    const mainGap = isStory ? 34 : isSquare ? 34 : 28;

    // Card height tuning
    const rowGap = isStory ? 20 : 16;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: bg,
            fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
            color: textMain,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              backgroundImage:
                theme === "light"
                  ? "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.08) 1px, transparent 0)"
                  : "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
              backgroundSize: "40px 40px",
              opacity: 0.6,
              zIndex: 0,
            }}
          />

          {/* Top bar */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `${Math.round(pad * 0.75)}px ${pad}px`,
              borderBottom: `1px solid ${border}`,
              backgroundColor: bg,
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 14 }}>
              {logoData ? (
                <img
                  src={logoData}
                  width={32}
                  height={32}
                  style={{
                    borderRadius: 8,
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: accent,
                    boxShadow: `0 0 18px ${accent}`,
                  }}
                />
              )}
              <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline", gap: 10 }}>
                <div style={{ display: "flex", fontWeight: 900, letterSpacing: 1, fontSize: Math.round(22 * S) }}>
                  MZPRIMER
                </div>
                <div style={{ display: "flex", color: accent, fontWeight: 800, fontSize: Math.round(18 * S) }}>
                  // TRADE SETUP
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row", gap: 14, alignItems: "center" }}>
              <div style={{ display: "flex", color: textDim, fontSize: Math.round(16 * S), fontWeight: 700 }}>
                {ago === null ? "Live" : `Detected ${ago}m ago`}
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: `1px solid ${border}`,
                  backgroundColor: theme === "light" ? "rgba(15,23,42,0.04)" : "rgba(255,255,255,0.04)",
                  color: textDim,
                  fontSize: Math.round(16 * S),
                  fontWeight: 800,
                }}
              >
                {conf}% Confidence
              </div>
            </div>
          </div>

          {/* Main */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: isStory ? "column" : "column",
              padding: `${pad}px ${pad}px`,
              gap: mainGap,
              zIndex: 1,
              alignItems: "stretch",
              justifyContent: isSquare ? "center" : "flex-start",
            }}
          >
            {/* HERO: Symbol BIG + Name */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: symbolSize,
                  fontWeight: 1000,
                  letterSpacing: -2,
                  lineHeight: 1,
                  color: textMain,
                  textAlign: "center",
                }}
              >
                {symbol}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: Math.round(22 * S),
                  fontWeight: 700,
                  color: textDim,
                  textAlign: "center",
                }}
              >
                {spec.fullName}
              </div>
            </div>

            {/* SIGNAL BIG */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: `${Math.round(18 * S)}px ${Math.round(26 * S)}px`,
                  borderRadius: 18,
                  border: `2px solid ${accent}55`,
                  backgroundColor: theme === "light" ? "rgba(15,23,42,0.03)" : "rgba(255,255,255,0.03)",
                  boxShadow: `0 18px 40px ${accent}18`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: signalSize,
                    fontWeight: 1000,
                    letterSpacing: 2,
                    color: accent,
                    lineHeight: 1,
                  }}
                >
                  {isBuy ? "BUY" : isSell ? "SELL" : "WAIT"}
                </div>
              </div>
            </div>

            {/* SETUP: Entry / SL / TP */}
            <div
              style={{
                display: "flex",
                flexDirection: "row", // Changed: Always horizontal for all sizes
                gap: isStory ? 12 : rowGap, // Reduced gap for story
                width: "100%",
                alignItems: "stretch",
                justifyContent: "space-between",
              }}
            >
              {/* ENTRY */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  backgroundColor: card,
                  border: `1px solid ${border}`,
                  borderRadius: 18,
                  padding: isStory ? `${Math.round(16 * S)}px` : `${Math.round(22 * S)}px`, // Reduced padding for story
                  gap: isStory ? 6 : 10, // Reduced gap for story
                }}
              >
                <div style={{ 
                  display: "flex", 
                  fontSize: isStory ? Math.round(16 * S) : labelSize, // Smaller font for story
                  color: textDim, 
                  fontWeight: 800, 
                  letterSpacing: isStory ? 1 : 2 
                }}>
                  ENTRY
                </div>
                <div style={{ 
                  display: "flex", 
                  fontSize: isStory ? Math.round(36 * S) : priceSize, // Smaller font for story
                  fontWeight: 1000, 
                  letterSpacing: -1 
                }}>
                  {entry}
                </div>
              </div>

              {/* STOP LOSS */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  backgroundColor: card,
                  border: `1px solid ${border}`,
                  borderRadius: 18,
                  padding: isStory ? `${Math.round(16 * S)}px` : `${Math.round(22 * S)}px`, // Reduced padding for story
                  gap: isStory ? 6 : 10, // Reduced gap for story
                }}
              >
                <div style={{ 
                  display: "flex", 
                  fontSize: isStory ? Math.round(16 * S) : labelSize, // Smaller font for story
                  color: "#EF4444", 
                  fontWeight: 900, 
                  letterSpacing: isStory ? 1 : 2 
                }}>
                  STOP LOSS
                </div>
                <div style={{ 
                  display: "flex", 
                  fontSize: isStory ? Math.round(36 * S) : priceSize, // Smaller font for story
                  fontWeight: 1000, 
                  letterSpacing: -1, 
                  color: "#EF4444" 
                }}>
                  {sl}
                </div>
              </div>

              {/* TAKE PROFIT */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  backgroundColor: card,
                  border: `1px solid ${border}`,
                  borderRadius: 18,
                  padding: isStory ? `${Math.round(16 * S)}px` : `${Math.round(22 * S)}px`, // Reduced padding for story
                  gap: isStory ? 6 : 10, // Reduced gap for story
                }}
              >
                <div style={{ 
                  display: "flex", 
                  fontSize: isStory ? Math.round(16 * S) : labelSize, // Smaller font for story
                  color: "#10B981", 
                  fontWeight: 900, 
                  letterSpacing: isStory ? 1 : 2 
                }}>
                  TAKE PROFIT
                </div>
                <div style={{ 
                  display: "flex", 
                  fontSize: isStory ? Math.round(36 * S) : priceSize, // Smaller font for story
                  fontWeight: 1000, 
                  letterSpacing: -1, 
                  color: "#10B981" 
                }}>
                  {tp}
                </div>
              </div>
            </div>

            {/* Minimal footer line (NOT crowded) */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 6,
                color: textDim,
                fontSize: Math.round(16 * S),
                fontWeight: 700,
              }}
            >
              <div style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: accent,
                    boxShadow: `0 0 12px ${accent}`,
                  }}
                />
                <div style={{ display: "flex" }}>MZPrimer • AI Trade Setup</div>
              </div>

              <div style={{ display: "flex" }}>mzprimer.com</div>
            </div>
          </div>
        </div>
      ),
      { width: cfg.width, height: cfg.height }
    );
  } catch (e: any) {
    return new Response(`Failed to generate: ${e?.message || "unknown error"}`, { status: 500 });
  }
}