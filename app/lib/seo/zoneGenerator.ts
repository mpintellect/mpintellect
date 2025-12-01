import { SymbolData } from "../../lib/fetchData";

export const generateZoneReport = (data: SymbolData) => {
  const z = data.zones;
  // Defensive check: If trend data is missing, create a fake/empty object to prevent crashes
  const t = data.trend || { current_price: 0 }; 
  const sym = data.symbol ? data.symbol.toUpperCase() : "Unknown";

  // --- FIX: SAFE FORMATTER ---
  // If 'num' is undefined/null/NaN, return "N/A" instead of crashing
  const fmt = (num: number | undefined | null) => {
    if (num === undefined || num === null || isNaN(num)) return "N/A";
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 });
  };

  // Logic: Interpret current position
  let proximityText = "mid-range";
  
  // Safely check properties
  const position = z.current_price_position || "";
  const context = z.order_placement_context || "";

  if (position.includes('support')) {
      proximityText = "testing structural support";
  }
  if (position.includes('resistance')) {
      proximityText = "probing resistance";
  }

  // Logic: Trading Execution
  let execution = "Stand Aside";
  if (context.includes('resistance')) execution = "Limit Sell Order";
  if (context.includes('support')) execution = "Limit Buy Order";

  // Ensure confidence is defined before printing
  const confidence = z.zone_strength ? z.zone_strength.toUpperCase() : "NEUTRAL";

  return {
    // 1. PAGE TITLE
    title: `${sym} Key Levels: Support @ ${fmt(z.support_zone)} / Res @ ${fmt(z.resistance_zone)}`,
    
    // 2. META DESCRIPTION
    metaDesc: `Live levels for ${sym}. Support: ${fmt(z.support_zone)}. Resistance: ${fmt(z.resistance_zone)}. Zone Clarity: ${z.component_quality ?? 50}/100.`,

    // 3. MAIN CONTEXT
    context: `
      Liquidity scans show the trading range for ${sym}.
      Resistance ceiling detected at **${fmt(z.resistance_zone)}**.
      Support floor holding at **${fmt(z.support_zone)}**.
      Structure Strength: **${confidence}**.
    `,

    // 4. PRICE ACTION CONTEXT
    position: `
      Current price (${fmt(t.current_price)}) is ${proximityText}. 
      Compression spread: ${(z.zone_width_pips || 0).toFixed(1)} pips.
      Setup Clarity: **${z.component_quality}/100**.
    `,

    // 5. STRATEGY
    strategy: `
      Context Signal: ${context}.
      Aggressive: **${execution}** on rejection.
      Conservative: Wait for confirm.
    `
  };
};