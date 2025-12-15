// app/api/og-google/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZES = {
  square: { width: 1080, height: 1080, pad: 60, scale: 1.0 },
  wide: { width: 1200, height: 630, pad: 48, scale: 1.0 },
  story: { width: 1080, height: 1920, pad: 72, scale: 1.0 },
};

const SYMBOL_SPECS: Record<string, { decimals: number; fullName: string; category: string }> = {
  EURUSD: { decimals: 5, fullName: "EUR/USD", category: "Forex" },
  GBPUSD: { decimals: 5, fullName: "GBP/USD", category: "Forex" },
  USDJPY: { decimals: 3, fullName: "USD/JPY", category: "Forex" },
  USDCAD: { decimals: 5, fullName: "USD/CAD", category: "Forex" },
  AUDUSD: { decimals: 5, fullName: "AUD/USD", category: "Forex" },
  BTCUSD: { decimals: 1, fullName: "Bitcoin", category: "Crypto" },
  ETHUSD: { decimals: 2, fullName: "Ethereum", category: "Crypto" },
  XRPUSD: { decimals: 4, fullName: "Ripple", category: "Crypto" },
  SOLUSD: { decimals: 2, fullName: "Solana", category: "Crypto" },
  XAUUSD: { decimals: 2, fullName: "Gold", category: "Metals" },
  XAGUSD: { decimals: 3, fullName: "Silver", category: "Metals" },
};

function formatPrice(price: number | null | undefined, symbol: string) {
  if (price === null || price === undefined || Number.isNaN(price)) return "----";
  const spec = SYMBOL_SPECS[symbol] ?? { decimals: 5, fullName: symbol };
  return price.toFixed(spec.decimals);
}

function safeUpper(s: string) {
  return (s || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

async function fetchSymbolData(symbolRaw: string) {
  const symbol = safeUpper(symbolRaw);
  const url = `https://storage.googleapis.com/mzprimer-data-store/output_${symbol}.json`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;

    const data = await res.json();

    const decision = (data.final_decision || "HOLD").toString().toUpperCase();
    const trend = data.trend?.trend?.replace("_", " ").toUpperCase() || "NEUTRAL";
    
    const tpSl = data.tp_sl || {};
    const entry = tpSl.entry_price ?? null;
    const tp = tpSl.tp_level ?? null;
    const sl = tpSl.sl_level ?? null;
    const lotSize = data.risk_management?.lot_size || "0.10";
    const rrRatio = tpSl.rr_ratio || 1.5;
    const slPips = tpSl.sl_distance_pips || 0;
    const tpPips = tpSl.tp_distance_pips || 0;

    const confidence = 
      data.risk_score?.confidence_score ??
      data.trend?.analysis_confidence ??
      data.analysis_confidence ??
      50;

    const currentPrice = data.trend?.current_price ?? data.current_price ?? null;

    return { 
      symbol, 
      decision, 
      trend, 
      entry, 
      tp, 
      sl, 
      confidence, 
      currentPrice, 
      lotSize,
      rrRatio,
      slPips,
      tpPips
    };
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
    const type = (searchParams.get("type") || "CHAT").toUpperCase();
    const sizeKey = (searchParams.get("size") || "square") as keyof typeof SIZES;
    const cfg = SIZES[sizeKey] || SIZES.square;
    
    const data = await fetchSymbolData(symbol);
    const spec = SYMBOL_SPECS[symbol] ?? { decimals: 5, fullName: symbol, category: "Trading" };
    
    // Colors based on type
    const isBuy = data?.decision.includes("BUY");
    const isSell = data?.decision.includes("SELL");
    
    let signalColor, primaryColor, secondaryColor, accentColor;
    
    if (type === "CHAT") {
      signalColor = isBuy ? "#00FF88" : isSell ? "#FF4757" : "#94A3B8";
      primaryColor = "#0084FF"; // Messenger blue
      secondaryColor = "#0066CC";
      accentColor = "#E3F2FD";
    } else if (type === "RISK") {
      signalColor = isBuy ? "#00FF88" : isSell ? "#FF4757" : "#94A3B8";
      primaryColor = "#EF4444"; // Red for risk
      secondaryColor = "#DC2626";
      accentColor = "#FEE2E2";
    } else { // TARGETS
      signalColor = isBuy ? "#00FF88" : isSell ? "#FF4757" : "#94A3B8";
      primaryColor = "#10B981"; // Green for targets
      secondaryColor = "#059669";
      accentColor = "#D1FAE5";
    }
    
    // Format prices
    const currentPrice = formatPrice(data?.currentPrice ?? null, symbol);
    const entry = formatPrice(data?.entry ?? null, symbol);
    const sl = formatPrice(data?.sl ?? null, symbol);
    const tp = formatPrice(data?.tp ?? null, symbol);
    const confidence = Math.round(data?.confidence ?? 50);
    const trend = data?.trend || "NEUTRAL";
    const lotSize = data?.lotSize || "0.10";
    const decision = data?.decision || "ANALYZING";
    const rrRatio = data?.rrRatio ? data.rrRatio.toFixed(2) : "1.50";
    const slPips = Math.round(data?.slPips || 0);
    const tpPips = Math.round(data?.tpPips || 0);

    // Elegant color scheme
    const bgColor = "#000000";
    const surfaceColor = "#111111";
    const surfaceElevated = "#1A1A1A";
    const borderColor = "rgba(255,255,255,0.08)";
    const borderHover = "rgba(255,255,255,0.12)";
    const textPrimary = "#FFFFFF";
    const textSecondary = "#A3A3A3";
    const textTertiary = "#737373";

    // Logo URL
    const baseUrl = new URL(request.url);
    const logoUrl = `${baseUrl.origin}/logos/icon.png`;

    // Common header component
    const Header = () => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${cfg.pad * 0.7}px ${cfg.pad}px`,
          borderBottom: `1px solid ${borderColor}`,
          backgroundColor: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(20px)",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              width: "36px",
              height: "36px",
              borderRadius: "9px",
              background: surfaceElevated,
              border: `1px solid ${borderColor}`,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={logoUrl}
              style={{
                width: "20px",
                height: "20px",
              }}
              onError={(e: any) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div style="display: flex; width: 20px; height: 20px; background: linear-gradient(135deg, #7877C6, #6366F1); border-radius: 4px; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: white;">MZ</div>';
              }}
            />
          </div>
          <div style={{ 
            display: "flex", 
            fontSize: "18px", 
            fontWeight: "300", 
            letterSpacing: "-0.3px",
            color: textSecondary 
          }}>
            MZPrimer
          </div>
        </div>
        
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
        }}>
          <div style={{ 
            display: "flex", 
            fontSize: "36px", 
            fontWeight: "700", 
            color: textPrimary,
            letterSpacing: "-0.5px",
          }}>
            {symbol}
          </div>
          <div style={{ 
            display: "flex", 
            fontSize: "14px", 
            color: signalColor, 
            fontWeight: "500",
            marginTop: "2px",
          }}>
            {spec.fullName}
          </div>
        </div>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px",
          padding: "6px 14px",
          borderRadius: "20px",
          background: surfaceElevated,
          border: `1px solid ${borderColor}`,
        }}>
          <div style={{
            display: "flex",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: signalColor,
            boxShadow: `0 0 12px ${signalColor}`,
          }} />
          <div style={{ 
            display: "flex", 
            fontSize: "16px", 
            fontWeight: "600", 
            color: signalColor,
          }}>
            {decision}
          </div>
        </div>
      </div>
    );

    // Common footer component
    const Footer = () => (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 48px",
          borderTop: `1px solid ${borderColor}`,
          backgroundColor: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
        }}>
          <div
            style={{
              display: "flex",
              width: "24px",
              height: "24px",
              borderRadius: "6px",
              background: surfaceElevated,
              border: `1px solid ${borderColor}`,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={logoUrl}
              style={{
                width: "14px",
                height: "14px",
              }}
              onError={(e: any) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div style="display: flex; width: 20px; height: 20px; background: linear-gradient(135deg, #7877C6, #6366F1); border-radius: 4px; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: white;">MZ</div>';
              }}
            />
          </div>
          <div style={{ 
            display: "flex", 
            fontSize: "15px", 
            color: textSecondary, 
            fontWeight: "300",
          }}>
            MZPrimer • AI Trading Intelligence
          </div>
        </div>
        
        <div style={{ 
          display: "flex", 
          fontSize: "14px", 
          color: textTertiary,
          fontWeight: "300",
        }}>
          mzprimer.com
        </div>
      </div>
    );

    // CHAT TYPE - Messenger Style
    const ChatView = () => (
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          padding: `${cfg.pad}px`,
          gap: "24px",
          backgroundColor: bgColor,
        }}
      >
        {/* User Message - Messenger Style */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <div style={{ display: "flex", fontSize: "12px", color: textSecondary, marginBottom: "4px" }}>
              You • Just now
            </div>
            <div
              style={{
                display: "flex",
                background: primaryColor,
                color: "white",
                padding: "16px 24px",
                borderRadius: "24px 24px 4px 24px",
                fontSize: "24px",
                fontWeight: "500",
                maxWidth: "600px",
                boxShadow: `0 4px 20px ${primaryColor}40`,
                position: "relative",
              }}
            >
              Analyze {symbol} trading setup now
              {/* Messenger bubble tail */}
              <div
                style={{
                  position: "absolute",
                  right: "-8px",
                  bottom: "0",
                  width: "16px",
                  height: "16px",
                  backgroundColor: primaryColor,
                  clipPath: "polygon(0 0, 100% 0, 0 100%)",
                }}
              />
            </div>
          </div>
          
          {/* User Avatar */}
          <div style={{
            display: "flex",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: primaryColor,
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
            flexShrink: 0,
            marginTop: "28px",
          }}>
            👤
          </div>
        </div>

        {/* AI Response Card */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          {/* AI Avatar */}
          <div style={{
            display: "flex",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(0, 132, 255, 0.2), rgba(0, 132, 255, 0.1))",
            border: `1px solid rgba(0, 132, 255, 0.3)`,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: "8px",
          }}>
            <img
              src={logoUrl}
              style={{
                width: "24px",
                height: "24px",
              }}
              onError={(e: any) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div style="display: flex; width: 20px; height: 20px; background: linear-gradient(135deg, #0084FF, #0066CC); border-radius: 4px; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: white;">AI</div>';
              }}
            />
          </div>

          {/* AI Message Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              background: surfaceElevated,
              border: `1px solid rgba(0, 132, 255, 0.2)`,
              borderRadius: "4px 24px 24px 24px",
              padding: "32px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              position: "relative",
              maxWidth: "900px",
            }}
          >
            {/* AI bubble tail */}
            <div
              style={{
                position: "absolute",
                left: "-8px",
                top: "20px",
                width: "16px",
                height: "16px",
                backgroundColor: surfaceElevated,
                borderLeft: `1px solid rgba(0, 132, 255, 0.2)`,
                borderBottom: `1px solid rgba(0, 132, 255, 0.2)`,
                clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                transform: "rotate(45deg)",
              }}
            />

            {/* Signal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
                paddingBottom: "20px",
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  display: "flex",
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, ${signalColor}20, ${signalColor}10)`,
                  border: `1px solid ${signalColor}30`,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <div style={{ display: "flex", fontSize: "22px", color: signalColor }}>
                    {isBuy ? "↗" : isSell ? "↘" : "↔"}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", fontSize: "28px", fontWeight: "600", color: signalColor }}>
                    {decision} SIGNAL
                  </div>
                  <div style={{ display: "flex", fontSize: "16px", color: textSecondary, fontWeight: "400" }}>
                    AI Analysis • {confidence}% confidence
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", fontSize: "16px", color: textSecondary }}>
                Just now
              </div>
            </div>

            {/* Price Levels */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "28px",
              }}
            >
              {[
                { label: "ENTRY", value: entry, color: textPrimary, icon: "📍" },
                { label: "STOP LOSS", value: sl, color: "#FF4757", icon: "🛡️" },
                { label: "TAKE PROFIT", value: tp, color: "#00FF88", icon: "🎯" },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    padding: "20px",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", fontSize: "20px" }}>{item.icon}</div>
                    <div style={{ display: "flex", fontSize: "14px", color: item.color, fontWeight: "600" }}>
                      {item.label}
                    </div>
                  </div>
                  <div style={{ display: "flex", fontSize: "28px", fontWeight: "600", fontFamily: "monospace", color: item.color }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Current Price Highlight */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px",
                background: "rgba(0, 132, 255, 0.1)",
                border: `1px solid rgba(0, 132, 255, 0.2)`,
                borderRadius: "16px",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
                  CURRENT {symbol} PRICE
                </div>
                <div style={{ display: "flex", fontSize: "36px", fontWeight: "600", color: textPrimary, fontFamily: "monospace" }}>
                  {currentPrice}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex", fontSize: "16px", color: textSecondary }}>
                  Trend: <span style={{ color: signalColor, marginLeft: "8px", fontWeight: "600" }}>{trend}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    // RISK TYPE - Risk Management Focus (WITH ADDED "STOP LOSS" TEXT)
    const RiskView = () => (
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          padding: `${cfg.pad}px`,
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
          backgroundColor: bgColor,
        }}
      >
        {/* Risk Header - WITH ADDED "STOP LOSS" */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          gap: "16px",
          width: "100%",
        }}>
          <div style={{ 
            display: "flex", 
            fontSize: "14px", 
            color: primaryColor, 
            fontWeight: "600",
            padding: "8px 24px",
            background: `rgba(239, 68, 68, 0.1)`,
            border: `1px solid rgba(239, 68, 68, 0.3)`,
            borderRadius: "20px",
            letterSpacing: "1px",
          }}>
            RISK MANAGEMENT • STOP LOSS
          </div>
          
          {/* Symbol Focus */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            gap: "8px",
            marginTop: "12px",
          }}>
            <div style={{ 
              display: "flex", 
              fontSize: "72px", 
              fontWeight: "800", 
              color: textPrimary,
              letterSpacing: "-2px",
              textShadow: `0 4px 30px ${primaryColor}30`,
            }}>
              {symbol}
            </div>
            <div style={{ 
              display: "flex", 
              fontSize: "20px", 
              color: textSecondary,
              fontWeight: "400",
            }}>
              Stop Loss Protection Level
            </div>
          </div>
        </div>

        {/* Stop Loss Focus - WITH ADDED "STOP LOSS" HEADER */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            padding: "40px 48px",
            border: `2px solid rgba(239, 68, 68, 0.4)`,
            borderRadius: "24px",
            background: `linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))`,
            width: "70%",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ 
            display: "flex", 
            fontSize: "16px", 
            color: textSecondary, 
            fontWeight: "600",
            letterSpacing: "1px",
          }}>
            STOP LOSS PROTECTION AT
          </div>
          <div style={{ 
            display: "flex", 
            fontSize: "64px", 
            fontWeight: "700", 
            color: "#EF4444", 
            fontFamily: "monospace",
            textShadow: `0 4px 20px rgba(239, 68, 68, 0.3)`,
          }}>
            {sl}
          </div>
          <div style={{ 
            display: "flex", 
            fontSize: "18px", 
            color: textTertiary,
            fontWeight: "400",
            marginTop: "8px",
          }}>
            {slPips}p risk distance • {rrRatio} R/R Ratio
          </div>
        </div>

        {/* Price Progression */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "60px",
            padding: "32px",
            width: "90%",
            background: surfaceElevated,
            border: `1px solid ${borderColor}`,
            borderRadius: "20px",
          }}
        >
          {[
            { label: "ENTRY", value: entry, color: textPrimary, position: "start" },
            { label: "CURRENT", value: currentPrice, color: signalColor, position: "center" },
            { label: "STOP LOSS", value: sl, color: "#EF4444", position: "end" }, // CHANGED: Added "LOSS" to make it "STOP LOSS"
          ].map((item, index) => (
            <div 
              key={index} 
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: item.position === "start" ? "flex-start" : item.position === "end" ? "flex-end" : "center",
                flex: 1,
              }}
            >
              <div style={{ 
                display: "flex", 
                fontSize: "14px", 
                color: textTertiary, 
                marginBottom: "8px",
                fontWeight: "500",
              }}>
                {item.label}
              </div>
              <div style={{ 
                display: "flex", 
                fontSize: "32px", 
                fontWeight: "600", 
                fontFamily: "monospace", 
                color: item.color,
              }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Risk Metrics */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "90%",
          }}
        >
          {[
            { 
              label: "AI SIGNAL", 
              value: decision, 
              desc: `${confidence}% confidence`,
              gradient: `linear-gradient(135deg, ${signalColor}15, ${signalColor}08)`,
              border: `${signalColor}30`,
              color: signalColor
            },
            { 
              label: "POSITION SIZE", 
              value: lotSize, 
              desc: "Standard lots",
              gradient: "linear-gradient(135deg, rgba(120, 119, 198, 0.1), rgba(120, 119, 198, 0.05))",
              border: "rgba(120, 119, 198, 0.2)",
              color: "#7877C6"
            },
            { 
              label: "STOP LOSS", // CHANGED: Now says "STOP LOSS" instead of "RISK/REWARD"
              value: `${slPips}p`, 
              desc: "Risk distance",
              gradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
              border: "rgba(239, 68, 68, 0.2)",
              color: "#EF4444"
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                padding: "24px",
                background: item.gradient,
                border: `1px solid ${item.border}`,
                borderRadius: "16px",
              }}
            >
              <div style={{ 
                display: "flex", 
                fontSize: "13px", 
                color: textTertiary, 
                marginBottom: "12px", 
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}>
                {item.label}
              </div>
              <div style={{ 
                display: "flex", 
                fontSize: "32px", 
                fontWeight: "700", 
                color: item.color,
                marginBottom: "4px",
              }}>
                {item.value}
              </div>
              <div style={{ 
                display: "flex", 
                fontSize: "13px", 
                color: textTertiary,
              }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  // TARGETS TYPE - SIMPLE SQUARE VERSION (from provided code)
const TargetsView = () => {
  // Using the simple square version from the provided code
  const S = 1.0; // Scale for square
  const pad = 64; // Square padding
  const isSquare = true;
  
  // Colors for dark theme
  const accent = isBuy ? "#10B981" : isSell ? "#EF4444" : "#F59E0B";
  const bg = "#050505";
  const card = "#0A0A0A";
  const border = "rgba(255,255,255,0.10)";
  const textMain = "#FFFFFF";
  const textDim = "#A3A3A3";
  
  // Font sizes for square
  const symbolSize = Math.round(110 * S);
  const signalSize = Math.round(72 * S);
  const labelSize = Math.round(18 * S);
  const priceSize = Math.round(44 * S);
  const rowGap = 16;
  
  // Fetch logo - removed await since we can't use async here
  // Instead, we'll use the logoUrl directly
  const logoData = logoUrl; // Use the URL directly

  return (
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
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
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
          <img
            src={logoData}
            width={32}
            height={32}
            style={{
              borderRadius: 8,
              objectFit: "contain",
            }}
            onError={(e: any) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
              const parent = e.target.parentNode;
              const fallback = document.createElement('div');
              fallback.style.cssText = 'display: flex; width: 32px; height: 32px; border-radius: 8px; background-color: ' + accent + '; box-shadow: 0 0 18px ' + accent + ';';
              parent.appendChild(fallback);
            }}
          />
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
            Live
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 12px",
              borderRadius: 999,
              border: `1px solid ${border}`,
              backgroundColor: "rgba(255,255,255,0.04)",
              color: textDim,
              fontSize: Math.round(16 * S),
              fontWeight: 800,
            }}
          >
            {confidence}% Confidence
          </div>
        </div>
      </div>

      {/* Main */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: `${pad}px ${pad}px`,
          gap: 34,
          zIndex: 1,
          alignItems: "stretch",
          justifyContent: "center",
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
              backgroundColor: "rgba(255,255,255,0.03)",
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
            flexDirection: "row",
            gap: rowGap,
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
              padding: `${Math.round(22 * S)}px`,
              gap: 10,
            }}
          >
            <div style={{ display: "flex", fontSize: labelSize, color: textDim, fontWeight: 800, letterSpacing: 2 }}>
              ENTRY
            </div>
            <div style={{ display: "flex", fontSize: priceSize, fontWeight: 1000, letterSpacing: -1 }}>
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
              padding: `${Math.round(22 * S)}px`,
              gap: 10,
            }}
          >
            <div style={{ display: "flex", fontSize: labelSize, color: "#EF4444", fontWeight: 900, letterSpacing: 2 }}>
              STOP LOSS
            </div>
            <div style={{ display: "flex", fontSize: priceSize, fontWeight: 1000, letterSpacing: -1, color: "#EF4444" }}>
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
              padding: `${Math.round(22 * S)}px`,
              gap: 10,
            }}
          >
            <div style={{ display: "flex", fontSize: labelSize, color: "#10B981", fontWeight: 900, letterSpacing: 2 }}>
              TAKE PROFIT
            </div>
            <div style={{ display: "flex", fontSize: priceSize, fontWeight: 1000, letterSpacing: -1, color: "#10B981" }}>
              {tp}
            </div>
          </div>
        </div>

        {/* Minimal footer line */}
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
  );
};

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            backgroundColor: bgColor,
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'SF Pro Display', sans-serif",
            color: textPrimary,
            position: "relative",
          }}
        >
          {/* Background gradient based on type */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: type === "CHAT" 
                ? `radial-gradient(ellipse at 20% 30%, ${primaryColor}05 0%, transparent 60%)`
                : type === "RISK"
                ? `radial-gradient(ellipse at 80% 20%, ${primaryColor}05 0%, transparent 60%)`
                : `radial-gradient(ellipse at 50% 50%, ${primaryColor}05 0%, transparent 60%)`,
              opacity: 0.3,
            }}
          />

          <Header />
          
          {type === "CHAT" ? <ChatView /> : 
           type === "RISK" ? <RiskView /> : 
           <TargetsView />}
          
          <Footer />
        </div>
      ),
      { 
        width: cfg.width, 
        height: cfg.height,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600',
        }
      }
    );
  } catch (e: any) {
    console.error("OG Image generation error:", e);
    return new Response(`Failed to generate: ${e?.message || "unknown error"}`, { status: 500 });
  }
}