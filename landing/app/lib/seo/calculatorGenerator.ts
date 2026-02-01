import { SymbolData } from "@/landing/app/lib/fetchData";

export function generateCalculatorReport(data: SymbolData) {
  const v = data.volatility;
  const p = data.trend.current_price;
  const atr = v.current_atr;

  // Format decimals based on asset type
  const fmt = (n: number) => {
    // If Price > 1000 (Crypto/Indices) -> 1 Decimal. If < 1000 (Forex) -> 5 Decimals.
    const decimals = p > 1000 ? 1 : 5;
    return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
  };

  // SEO Text Logic
  const title = `Live Stop Loss Calculator for ${data.symbol} | Risk Management Tool`;
  const description = `Protect your ${data.symbol} trades with volatility-based Stop Loss levels. Current ATR: ${fmt(atr)}. Optimal stops calculated for Scalping, Day Trading, and Swings.`;

  // Provide pre-calculated values for clean frontend consumption
  const calculations = {
    long: {
      scalp: { level: fmt(p - atr), label: "1.0x ATR" },
      day:   { level: fmt(p - (atr * 1.5)), label: "1.5x ATR" },
      swing: { level: fmt(p - (atr * 2.5)), label: "2.5x ATR" }
    },
    short: {
      scalp: { level: fmt(p + atr), label: "1.0x ATR" },
      day:   { level: fmt(p + (atr * 1.5)), label: "1.5x ATR" },
      swing: { level: fmt(p + (atr * 2.5)), label: "2.5x ATR" }
    }
  };

  return {
    title,
    description,
    atrString: fmt(atr),
    calculations
  };
}