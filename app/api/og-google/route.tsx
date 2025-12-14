import { ImageResponse } from "next/og";

export const runtime = "edge";

/* ======================================================
   SIZE PRESETS
====================================================== */
const SIZES: Record<string, { w: number; h: number }> = {
  standard: { w: 1200, h: 628 },     // Google OG
  standardAlt: { w: 1200, h: 630 },
  square: { w: 1080, h: 1080 },
  mobile: { w: 1080, h: 566 },
  story: { w: 1080, h: 1920 },
  portrait: { w: 1080, h: 1350 },
  pinterest: { w: 800, h: 1200 },
};

/* ======================================================
   SYMBOL METADATA
====================================================== */
const SYMBOLS: Record<string, { name: string; decimals: number }> = {
  BTCUSD: { name: "Bitcoin", decimals: 1 },
  ETHUSD: { name: "Ethereum", decimals: 2 },
  XAUUSD: { name: "Gold", decimals: 2 },
  EURUSD: { name: "EUR / USD", decimals: 5 },
  US500: { name: "S&P 500", decimals: 2 },
};

const clean = (s: string) => s.replace(/[^A-Z0-9]/gi, "").toUpperCase();

/* ======================================================
   MOCK METRICS (safe for ads)
   Replace later with live backend if needed
====================================================== */
function buildMetrics(symbol: string) {
  return {
    trend: Math.random() > 0.5 ? "BULLISH" : "BEARISH",
    confidence: Math.floor(65 + Math.random() * 25),
    volatility: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
    rsi: Math.floor(45 + Math.random() * 25),
    quality: Math.floor(70 + Math.random() * 25),
    rr: (2 + Math.random()).toFixed(2),
    timeframe: "H1 / M15",
    traders: Math.floor(120 + Math.random() * 200),
    price: (Math.random() * 50000 + 2000).toFixed(
      SYMBOLS[symbol]?.decimals || 2
    ),
  };
}

/* ======================================================
   SHARED COMPONENTS
====================================================== */
const Header = ({ symbol, metrics }: any) => (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 36, fontWeight: 900 }}>MZPRIMER</div>
      <div style={{ fontSize: 18, color: "#94A3B8" }}>AI Market Analysis</div>
    </div>
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: 44, fontWeight: 900 }}>{symbol}</div>
      <div style={{ fontSize: 20, color: "#94A3B8" }}>{metrics.price}</div>
    </div>
  </div>
);

const Footer = ({ metrics }: any) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      fontSize: 14,
      color: "#94A3B8",
    }}
  >
    <div>Professional access</div>
    <div>{metrics.traders} traders online</div>
  </div>
);

/* ======================================================
   LAYOUTS
====================================================== */
const Comprehensive = ({ symbol, metrics }: any) => (
  <div style={{ display: "flex", flex: 1, gap: 30 }}>
    {/* LEFT */}
    <div style={{ display: "flex", flexDirection: "column", flex: 3, gap: 16 }}>
      <div style={{ fontSize: 32, fontWeight: 900 }}>
        Signal: {metrics.trend}
      </div>
      <div>Confidence: {metrics.confidence}%</div>
      <div>Volatility: {metrics.volatility}</div>
      <div>RSI: {metrics.rsi}</div>
      <div>Quality Score: {metrics.quality}%</div>
      <div>Timeframe: {metrics.timeframe}</div>
    </div>

    {/* MIDDLE */}
    <div style={{ display: "flex", flexDirection: "column", flex: 2, gap: 12 }}>
      <div style={{ fontSize: 22, fontWeight: 800 }}>Trade Setup</div>
      <div>Entry: ****</div>
      <div>Stop Loss: ****</div>
      <div>Take Profit: ****</div>
      <div>RR: {metrics.rr}</div>
    </div>

    {/* RIGHT */}
    <div
      style={{
        display: "flex",
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #334155",
        borderRadius: 12,
      }}
    >
      📈 Chart Preview
    </div>
  </div>
);

const Visual = ({ metrics }: any) => (
  <div style={{ display: "flex", flex: 1 }}>
    <div
      style={{
        flex: 4,
        border: "1px solid #334155",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
      }}
    >
      📊 Large Chart
    </div>
    <div
      style={{
        flex: 1,
        marginLeft: 20,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div>Trend: {metrics.trend}</div>
      <div>Confidence: {metrics.confidence}%</div>
      <div>RR: {metrics.rr}</div>
    </div>
  </div>
);

const Minimal = ({ symbol, metrics }: any) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ fontSize: 42, fontWeight: 900 }}>{symbol}</div>
    <div>Signal: {metrics.trend}</div>
    <div>Confidence: {metrics.confidence}%</div>
    <div>Quality: {metrics.quality}%</div>
    <div style={{ marginTop: 10 }}>📈 Mini Chart</div>
  </div>
);

/* ======================================================
   MAIN HANDLER
====================================================== */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const symbol = clean(searchParams.get("symbol") || "BTCUSD");
  const layout = searchParams.get("layout") || "comprehensive";
  const sizeKey = searchParams.get("size") || "standard";

  const size = SIZES[sizeKey] || SIZES.standard;
  const metrics = buildMetrics(symbol);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: 40,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#020617",
          color: "#FFFFFF",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI"',
        }}
      >
        <Header symbol={symbol} metrics={metrics} />

        <div style={{ display: "flex", flex: 1, marginTop: 30 }}>
          {layout === "visual" && <Visual metrics={metrics} />}
          {layout === "minimal" && (
            <Minimal symbol={symbol} metrics={metrics} />
          )}
          {layout === "comprehensive" && (
            <Comprehensive symbol={symbol} metrics={metrics} />
          )}
        </div>

        <div style={{ marginTop: 30 }}>
          <Footer metrics={metrics} />
        </div>
      </div>
    ),
    {
      width: size.w,
      height: size.h,
    }
  );
}