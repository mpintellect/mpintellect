// ==========================================
// 1. SYMBOL CONFIGURATION (Decimal Precision)
// ==========================================
const SYMBOL_SPECS: Record<string, { pip: number; contract: number; decimals: number }> = {
  // Forex
  "EURUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "GBPUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "USDJPY": { pip: 0.01, contract: 100000, decimals: 3 },
  "USDCAD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "AUDUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "NZDUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "USDCHF": { pip: 0.0001, contract: 100000, decimals: 5 },
  "EURJPY": { pip: 0.01, contract: 100000, decimals: 3 },
  "EURGBP": { pip: 0.0001, contract: 100000, decimals: 5 },
  "GBPJPY": { pip: 0.01, contract: 100000, decimals: 3 },
  "GBPCHF": { pip: 0.0001, contract: 100000, decimals: 5 },

  // Metals
  "XAUUSD": { pip: 0.01, contract: 100, decimals: 2 }, 
  "XAUEUR": { pip: 0.01, contract: 100, decimals: 2 },
  "XAGUSD": { pip: 0.001, contract: 5000, decimals: 3 },
  "PLATINUM": { pip: 0.01, contract: 100, decimals: 2 },

  // Energy
  "BRENT": { pip: 0.01, contract: 1000, decimals: 2 },

  // Crypto
  "BTCUSD": { pip: 1.0, contract: 1, decimals: 1 },      
  "ETHUSD": { pip: 0.1, contract: 1, decimals: 2 },      
  "XRPUSD": { pip: 0.0001, contract: 1000, decimals: 4 }, 
  "LTCUSD": { pip: 0.01, contract: 10, decimals: 2 },    
  "DOGEUSD": { pip: 0.0001, contract: 1000, decimals: 4 },

  // Indices
  "US500": { pip: 0.1, contract: 1, decimals: 2 },
  "USTEC": { pip: 0.1, contract: 1, decimals: 2 },
  "US30": { pip: 1.0, contract: 1, decimals: 1 },
  "HK50": { pip: 0.1, contract: 1, decimals: 2 },
  "FRANCE40": { pip: 0.1, contract: 1, decimals: 2 },
  "CHINA50": { pip: 0.1, contract: 1, decimals: 1 },
  "UK100": { pip: 0.1, contract: 1, decimals: 1 },
};

// ==========================================
// 2. HELPER: PRICE NORMALIZATION
// ==========================================
function normalizePrice(symbol: string, value: number): number {
  if (value === undefined || value === null) return 0;
  
  // Clean symbol string (e.g. BTC-USD -> BTCUSD)
  const cleanSym = symbol.replace(/[-_/]/g, '').toUpperCase();
  const spec = SYMBOL_SPECS[cleanSym];

  // If we have a spec, use exact decimals. Otherwise, keep raw or default to 2.
  const decimals = spec ? spec.decimals : 2;

  // Convert to fixed string to handle floats, then back to number
  return parseFloat(value.toFixed(decimals));
}

// ==========================================
// 3. INTERFACES (Updated)
// ==========================================
export interface TrendData {
  trend: "weak_neutral" | "bullish" | "bearish" | "neutral";
  trend_strength: string;
  trend_strength_score: number;
  ema_alignment: string;
  price_position: {
    vs_ema8: string;
    vs_ema21: string;
    vs_ema50: string;
  };
  current_emas: {
    ema_8: number;
    ema_21: number;
    ema_50: number;
  };
  current_price: number;
  analysis_confidence: number;
  data_quality_score: number;
  trend_consistency: number;
  timestamp: string;
  component_quality: number;
}

export interface VolatilityData {
  volatility_level: "low" | "medium" | "high" | "extreme";
  avg_atr: number;
  current_atr: number;
  atr_trend: string;
  avg_range: number;
  volatility_score: number;
  volatility_regime: string;
  optimal_sl_multiplier: number;
  component_quality: number;
}

export interface MomentumData {
  momentum_bias: "bearish" | "bullish" | "neutral";
  rsi_latest: number;
  rsi_trend: string;
  rsi_zone: string;
  rsi_slope: number;
  momentum_strength: string;
  trend_alignment: string;
  divergence_detected: string;
  trend_consistency: number;
  component_quality: number;
}

export interface ZoneData {
  support_zone: number;
  resistance_zone: number;
  zone_strength: string;
  support_quality: number;
  resistance_quality: number;
  zone_width_pips: number;
  current_price_position: string;
  zone_clarity: string;
  trend_alignment: string;
  order_placement_context: string;
  zone_confidence: string;
  component_quality: number;
}

export interface ComponentScores {
  trend: number;
  volatility: number;
  momentum: number;
  zones: number;
}

export interface ValidationData {
  symbol: string;
  is_valid: boolean;
  validation_score: number;
  issues: string[];
  warnings: string[];
  strengths: string[];
  component_quality: ComponentScores;
}

export interface SymbolData {
  symbol: string;
  trend: TrendData;
  volatility: VolatilityData;
  momentum: MomentumData;
  zones: ZoneData;
  summary: string;
  analysis_accuracy: number;
  component_scores: ComponentScores;
  generated_at: string;
  validation: ValidationData;
  quality_indicator: string;
  final_decision: string;
  risk_score: {
    confidence_score: number;
    risk_category: string;
    position_size_multiplier: number;
    analysis_accuracy_used: number;
    base_confidence: number;
  };
}

// ==========================================
// 4. FETCH AND FORMAT FUNCTION (UPDATED FOR CLOUDFLARE)
// ==========================================
export async function getSymbolData(
  symbolParam?: string
): Promise<SymbolData | null> {
  try {
    if (!symbolParam) return null;

    const cleanSymbol = symbolParam.replace(/[-_/]/g, "").toUpperCase();
    
    // ✅ CLOUDFLARE R2 URL - Use your R2 public URL
    // Change this to your actual R2 domain
    const R2_PUBLIC_URL = "https://data.mzprimer.com"; 
    const url = `${R2_PUBLIC_URL}/output_${cleanSymbol}.json`;

    const res = await fetch(url, {
      // Cloudflare Workers: Use cache control headers
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 minute cache
      },
      // Remove Next.js-specific options
      // next: { revalidate: 300 }, // ❌ REMOVE THIS
    });

    if (!res.ok) {
      console.warn("Failed to fetch from R2:", cleanSymbol, res.status);
      return null;
    }

    const data: SymbolData = await res.json();
    
    // Fallback if symbol key missing in JSON
    if (!data.symbol) {
      data.symbol = cleanSymbol;
    }

    // --- APPLY DATA NORMALIZATION BASED ON SYMBOL SPECS ---
    
    // 1. Trend Data (Prices & EMAs)
    if (data.trend) {
      data.trend.current_price = normalizePrice(cleanSymbol, data.trend.current_price);
      
      if (data.trend.current_emas) {
        data.trend.current_emas.ema_8 = normalizePrice(cleanSymbol, data.trend.current_emas.ema_8);
        data.trend.current_emas.ema_21 = normalizePrice(cleanSymbol, data.trend.current_emas.ema_21);
        data.trend.current_emas.ema_50 = normalizePrice(cleanSymbol, data.trend.current_emas.ema_50);
      }
    }

    // 2. Zone Data (Support & Resistance)
    if (data.zones) {
      data.zones.support_zone = normalizePrice(cleanSymbol, data.zones.support_zone);
      data.zones.resistance_zone = normalizePrice(cleanSymbol, data.zones.resistance_zone);
    }

    // 3. Volatility (ATR & Ranges are prices or price-differences)
    if (data.volatility) {
      data.volatility.avg_atr = normalizePrice(cleanSymbol, data.volatility.avg_atr);
      data.volatility.current_atr = normalizePrice(cleanSymbol, data.volatility.current_atr);
      data.volatility.avg_range = normalizePrice(cleanSymbol, data.volatility.avg_range);
    }

    return data;

  } catch (error) { 
    console.error(`Data fetch error for ${symbolParam}:`, error);
    return null; 
  }
}

// ==========================================
// 5. NEW: FETCH FOR CLIENT-SIDE (for Fetcher components)
// ==========================================
export async function fetchSymbolDataClient(
  symbol: string
): Promise<SymbolData | null> {
  try {
    // Call your API endpoint instead of direct R2
    const res = await fetch(`/api/data-proxy?symbol=${symbol}`);
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Client fetch error for ${symbol}:`, error);
    return null;
  }
}