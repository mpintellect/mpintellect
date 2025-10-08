export function calculateLotSize({
  capital,
  slPips,
  pip,
  contract,
  riskPercent = 2.0,
  symbol = "",
}: {
  capital: number;
  slPips: number;
  pip: number;
  contract: number;
  riskPercent?: number;
  symbol?: string;
}): {
  lotSize: number;
  riskUSD: number;
  slUSD: number;
  tpUSD?: number;
  isValid: boolean;
  message?: string;
} {
  const MIN_LOT = 0.01;
  const MAX_LOT = 100;
  
  // Symbol-specific minimum SL pips
  const getMinSlPips = (sym: string) => {
    const minSlMap: Record<string, number> = {
      // Crypto (high volatility)
      "BTCUSD": 50, "ETHUSD": 30, "LTCUSD": 20, "XRPUSD": 15,
      // Metals (high volatility)
      "XAUUSD": 20, "XAUEUR": 20, "XAGUSD": 15, "XPTUSD": 15,
      // Indices (medium volatility)
      "SPX": 10, "NQ": 15, "YM": 12, "SX5E": 8, "CAC": 8, "FDAX": 10, "FTSE": 8,
      // Forex majors
      "EURUSD": 5, "GBPUSD": 5, "USDJPY": 5, "USDCAD": 5, "AUDUSD": 5, "NZDUSD": 5, "USDCHF": 5,
      // Forex crosses
      "EURJPY": 6, "EURGBP": 5, "GBPJPY": 8, "GBPCHF": 6,
      // Commodities
      "USCRUDE": 10, "DGEUSD": 8
    };
    return minSlMap[sym] || 5;
  };
  
  const MIN_SL_PIPS = getMinSlPips(symbol);

  // === VALIDATION ===
  if (capital <= 0 || slPips <= 0 || pip <= 0 || contract <= 0) {
    return {
      lotSize: 0,
      riskUSD: 0,
      slUSD: 0,
      isValid: false,
      message: "Invalid input parameters: all values must be positive"
    };
  }

  if (riskPercent <= 0 || riskPercent > 10) {
    return {
      lotSize: 0,
      riskUSD: 0,
      slUSD: 0,
      isValid: false,
      message: "Risk percentage must be between 0.1 and 10"
    };
  }

  if (slPips < MIN_SL_PIPS) {
    return {
      lotSize: 0,
      riskUSD: 0,
      slUSD: 0,
      isValid: false,
      message: `SL too small. Minimum ${MIN_SL_PIPS} pips required for ${symbol || 'this symbol'}`
    };
  }

  // === STEP 1: Calculate MAX risk amount (1-2% of capital) ===
  const MAX_RISK_PERCENT = 2.0; // Never risk more than 2%
  const riskUSD = Number(((capital * Math.min(riskPercent, MAX_RISK_PERCENT)) / 100).toFixed(2));

  // Safety check - risk should never exceed 2% of capital
  if (riskUSD > capital * 0.02) {
    return {
      lotSize: 0,
      riskUSD: Number((capital * 0.02).toFixed(2)),
      slUSD: 0,
      isValid: false,
      message: `Risk too high! Maximum allowed: $${(capital * 0.02).toFixed(2)} (2% of capital)`
    };
  }

  // === STEP 2: Calculate pip value ===
  // For most instruments: Pip Value = Contract Size × Pip
  let pipValuePerLot = contract * pip;
  
  // Special handling for JPY pairs and certain instruments
  if (symbol.includes('JPY') && pip === 0.01) {
    // For JPY pairs, pip is usually 0.01 but pip value calculation is different
    pipValuePerLot = contract * 0.01; // Adjust for JPY
  }

  const slValuePerLot = slPips * pipValuePerLot;

  // Safety check - if SL value is too small, something's wrong
  if (slValuePerLot <= 0.01) {
    return {
      lotSize: 0,
      riskUSD,
      slUSD: 0,
      isValid: false,
      message: "Invalid SL calculation: Check pip and contract values"
    };
  }

  // === STEP 3: Calculate lot size ===
  const rawLotSize = riskUSD / slValuePerLot;
  
  // Safety checks for lot size
  if (rawLotSize < MIN_LOT) {
    return {
      lotSize: 0,
      riskUSD,
      slUSD: 0,
      isValid: false,
      message: `Lot size too small. Minimum ${MIN_LOT} lot required. Consider:
• Increasing capital
• Using wider stop loss
• Choosing a different instrument`
    };
  }
  
  if (rawLotSize > MAX_LOT) {
    const cappedRisk = Number((slValuePerLot * MAX_LOT).toFixed(2));
    return {
      lotSize: MAX_LOT,
      riskUSD,
      slUSD: cappedRisk,
      isValid: false,
      message: `Lot size capped at ${MAX_LOT}. Actual risk: $${cappedRisk} (${((cappedRisk/capital)*100).toFixed(1)}% of capital)`
    };
  }
  
  // Round to appropriate decimal places
  const finalLotSize = Number(Math.max(MIN_LOT, rawLotSize).toFixed(2));
  
  // Calculate actual risk
  const finalRiskUSD = Number((slValuePerLot * finalLotSize).toFixed(2));
  const actualRiskPercent = (finalRiskUSD / capital) * 100;

  // Final validation
  const isValid = finalLotSize >= MIN_LOT && 
                  finalLotSize <= MAX_LOT && 
                  actualRiskPercent <= 2.5; // Allow small tolerance

  return {
    lotSize: finalLotSize,
    riskUSD, // Target risk amount
    slUSD: finalRiskUSD, // Actual risk amount
    isValid,
    message: isValid ? 
      `Risk: $${finalRiskUSD} (${actualRiskPercent.toFixed(1)}% of capital)` :
      `Risk too high: $${finalRiskUSD} (${actualRiskPercent.toFixed(1)}% of capital) - Max 2% allowed`
  };
}

// === SAFE LOT SIZE CALCULATOR (Alternative explicit version) ===
interface SafeLotSizeParams {
  capital: number;
  slPips: number;
  symbol?: string;
  defaultContracts?: Record<string, number>;
  defaultPips?: Record<string, number>;
}

interface LotSizeResult {
  lotSize: number;
  riskUSD: number;
  slUSD: number;
  tpUSD?: number;
  isValid: boolean;
  message?: string;
}

export function calculateSafeLotSize(params: SafeLotSizeParams): LotSizeResult {
  const {
    capital,
    slPips,
    symbol = "",
    defaultContracts = {
      "EURUSD": 100000, "GBPUSD": 100000, "USDJPY": 100000, "USDCAD": 100000,
      "AUDUSD": 100000, "NZDUSD": 100000, "USDCHF": 100000,
      "EURJPY": 100000, "EURGBP": 100000, "GBPJPY": 100000, "GBPCHF": 100000,
      "XAUUSD": 100, "XAUEUR": 100, "XAGUSD": 100, "XPTUSD": 100,
      "SPX": 10, "NQ": 10, "YM": 10, "SX5E": 10, "CAC": 10, "FDAX": 10, "FTSE": 10,
      "BTCUSD": 1, "ETHUSD": 1, "LTCUSD": 1, "XRPUSD": 1,
      "USCRUDE": 1000, "DGEUSD": 1000
    },
    defaultPips = {
      "EURUSD": 0.0001, "GBPUSD": 0.0001, "USDJPY": 0.01, "USDCAD": 0.0001,
      "AUDUSD": 0.0001, "NZDUSD": 0.0001, "USDCHF": 0.0001,
      "EURJPY": 0.01, "EURGBP": 0.0001, "GBPJPY": 0.01, "GBPCHF": 0.0001,
      "XAUUSD": 0.01, "XAUEUR": 0.01, "XAGUSD": 0.01, "XPTUSD": 0.01,
      "SPX": 0.1, "NQ": 0.1, "YM": 0.1, "SX5E": 0.1, "CAC": 0.1, "FDAX": 0.1, "FTSE": 0.1,
      "BTCUSD": 1, "ETHUSD": 0.1, "LTCUSD": 0.01, "XRPUSD": 0.0001,
      "USCRUDE": 0.01, "DGEUSD": 0.0001
    }
  } = params;

  const contract = defaultContracts[symbol] || 100000;
  const pip = defaultPips[symbol] || 0.0001;
  
  return calculateLotSize({
    capital,
    slPips,
    pip,
    contract,
    riskPercent: 2.0,
    symbol
  });
}