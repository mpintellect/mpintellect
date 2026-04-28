// app/lib/fetchSetup.ts
import { SymbolKey } from "@/data/symbols";

/** Individual pending order */
export interface PendingOrder {
  type: "BUY_STOP" | "BUY_LIMIT" | "SELL_STOP" | "SELL_LIMIT";
  entry_price: number;
  sl_price: number;
  tp_price: number;
  distance_pips: number;
  risk_pips: number;
  reward_pips: number;
  rr_ratio: number;
  rationale: string;
  expiry_hours: number;
}

/** Pending orders structure */
export interface PendingOrdersData {
  pending_orders: PendingOrder[];
  primary_order: PendingOrder | null;
  order_confidence: number;
  market_context: string;
  rationale: string;
  current_price: number;
  is_valid: boolean;
  fallback_used?: boolean;
}

/** Volume Profile Data Structure */
export interface VolumeData {
  poc_price: number;
  value_area_high: number;
  value_area_low: number;
  volume_bias: "bullish_accumulation" | "bearish_distribution" | "neutral_balance";
  position_vs_poc: "above_poc" | "below_poc" | "at_poc" | "inside";
  volume_concentration: number;
  imbalance_detected: boolean;
  component_quality: number;
  current_price: number;
}

/** Market Sessions Data Structure */
export interface SessionsData {
  session_name: "Asia" | "London" | "New York" | "Market Rollover";
  liquidity_rating: number;
  is_high_volume_window: boolean;
  volatility_expectation: "low" | "low_moderate" | "moderate" | "high";
  trading_regime_bias: "structural_accumulation" | "distribution" | "neutral" | "avoid";
  session_note: string;
  component_quality: number;
}

/** Full type for trade setups based on ACTUAL data structure */
export interface TradeSetupData {
  symbol: SymbolKey;
  trend: any;
  volatility: any;
  momentum: any;
  zones: any;
  volume?: VolumeData;
  sessions?: SessionsData;
  pending_orders?: PendingOrdersData;
  tp_sl?: any;
  risk_score?: any;
  trade_parameters?: any;
  summary: string;
  final_decision: "BUY" | "SELL" | "WAIT" | "LOW_CONFIDENCE_BUY" | "LOW_CONFIDENCE_SELL";
  generated_at: string;
  analysis_accuracy?: number;
  component_scores?: Record<string, number>;
  component_weights?: Record<string, number>;
  warnings?: string[];
  /** Strategy type used for this setup (scalper or daytrader) */
  _metadata?: {
    strategy: "scalper" | "daytrader";
    fetched_at: string;
  };
}

/** Extended interface for enhanced data */
export interface ExtendedTradeSetupData extends TradeSetupData {}

/**
 * ✅ Helper function to get volume data safely
 */
export function getVolumeData(setup: ExtendedTradeSetupData | null): VolumeData | null {
  return setup?.volume ?? null;
}

/**
 * ✅ Helper function to get sessions data safely
 */
export function getSessionsData(setup: ExtendedTradeSetupData | null): SessionsData | null {
  return setup?.sessions ?? null;
}

/**
 * ✅ Helper function to get formatted value area string
 */
export function getValueAreaString(setup: ExtendedTradeSetupData | null): string {
  const volume = setup?.volume;
  if (!volume?.value_area_low || !volume?.value_area_high) return "N/A";
  return `${volume.value_area_low.toFixed(5)} - ${volume.value_area_high.toFixed(5)}`;
}

/**
 * ✅ Helper function to get session with emoji
 */
export function getSessionWithEmoji(setup: ExtendedTradeSetupData | null): string {
  const session = setup?.sessions?.session_name;
  if (!session) return "Unknown";
  
  const emojiMap: Record<string, string> = {
    "Asia": "🌏 Asia",
    "London": "🇬🇧 London", 
    "New York": "🗽 New York",
    "Market Rollover": "🔄 Market Rollover"
  };
  
  return emojiMap[session] || session;
}

/**
 * ✅ Fetches setup via API route with strategy support
 * @param symbol - Trading symbol (e.g., "XAUUSD")
 * @param strategy - Trading strategy: "scalper" (5min) or "daytrader" (H1) - defaults to "daytrader"
 */
export async function fetchSetup(
  symbol: SymbolKey, 
  strategy: "scalper" | "daytrader" = "daytrader"
): Promise<ExtendedTradeSetupData | null> {
  try {
    console.log(`🔍 Fetching setup via API for ${symbol} with strategy: ${strategy}...`);

    const response = await fetch(`/api/setup?symbol=${symbol}&strategy=${strategy}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
      },
    });
    
    console.log(`📡 API response status: ${response.status}, ok: ${response.ok}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ API failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${strategy} setup for ${symbol}:`, {
      final_decision: data.final_decision,
      analysis_accuracy: data.analysis_accuracy,
      has_pending_orders: !!data.pending_orders,
      has_volume: !!data.volume,
      has_sessions: !!data.sessions
    });

    return data as ExtendedTradeSetupData;
    
  } catch (error) {
    console.error("❌ Error fetching setup via API:", error);
    return null;
  }
}

/**
 * ✅ Client-side version (for Fetcher components)
 */
export async function fetchSetupClient(
  symbol: SymbolKey,
  strategy: "scalper" | "daytrader" = "daytrader"
): Promise<ExtendedTradeSetupData | null> {
  try {
    console.log(`🔍 [Client] Fetching setup for ${symbol} with strategy: ${strategy}...`);

    const response = await fetch(`/api/setup?symbol=${symbol}&strategy=${strategy}`);
    
    if (!response.ok) {
      console.error(`❌ Client API failed: ${response.status}`);
      return null;
    }

    return await response.json() as ExtendedTradeSetupData;
    
  } catch (error) {
    console.error("❌ Error fetching setup on client:", error);
    return null;
  }
}

/**
 * ✅ Helper function to check if setup has valid pending orders
 */
export function hasValidPendingOrders(setup: ExtendedTradeSetupData | null): boolean {
  return !!(setup?.pending_orders?.is_valid && setup.pending_orders.primary_order);
}

/**
 * ✅ Helper function to get primary order from setup
 */
export function getPrimaryOrder(setup: ExtendedTradeSetupData | null): PendingOrder | null {
  return setup?.pending_orders?.primary_order ?? null;
}

/**
 * ✅ Helper function to get all pending orders
 */
export function getAllPendingOrders(setup: ExtendedTradeSetupData | null): PendingOrder[] {
  return setup?.pending_orders?.pending_orders ?? [];
}

/**
 * ✅ Helper function to get order confidence
 */
export function getOrderConfidence(setup: ExtendedTradeSetupData | null): number {
  return setup?.pending_orders?.order_confidence ?? 0;
}

/**
 * ✅ Helper function to get market context
 */
export function getMarketContext(setup: ExtendedTradeSetupData | null): string {
  return setup?.pending_orders?.market_context ?? 'neutral';
}

/**
 * ✅ Helper function to get current strategy from setup metadata
 */
export function getStrategyFromSetup(setup: ExtendedTradeSetupData | null): "scalper" | "daytrader" | null {
  return setup?._metadata?.strategy ?? null;
}

/**
 * ✅ Fetch all setups at once (DEPRECATED - Individual files now)
 * This is kept for backward compatibility but will return empty
 */
export async function fetchAllSetups(): Promise<Record<string, any> | null> {
  try {
    console.log('⚠️ fetchAllSetups() is deprecated - using individual symbol files now');
    return {};
  } catch (error) {
    console.error('❌ Error in fetchAllSetups:', error);
    return null;
  }
}

/**
 * ✅ Get available symbols - Returns all supported symbols since we have individual files
 */
export async function getAvailableSetupSymbols(): Promise<string[]> {
  try {
    const supportedSymbols: string[] = [
      "EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD",
      "NZDUSD", "USDCHF", "XAUUSD", "XAUEUR", "XAGUSD",
      "PLATINUM", "BRENT", "BTCUSD", "ETHUSD", "XRPUSD",
      "DOGEUSD", "LTCUSD", "US500", "USTEC", "US30",
      "HK50", "FRANCE40", "CHINA50", "UK100", "EURJPY",
      "EURGBP", "GBPJPY", "GBPCHF"
    ];
    
    console.log(`✅ Available symbols: ${supportedSymbols.length} individual files`);
    return supportedSymbols;
  } catch (error) {
    console.error('❌ Error getting available symbols:', error);
    return [];
  }
}

/**
 * ✅ NEW: Fetch multiple symbols at once with strategy support
 */
export async function fetchMultipleSetups(
  symbols: SymbolKey[],
  strategy: "scalper" | "daytrader" = "daytrader"
): Promise<Record<string, ExtendedTradeSetupData | null>> {
  try {
    console.log(`🔍 Fetching multiple setups: ${symbols.join(', ')} with strategy: ${strategy}`);
    
    // For client-side, use batch API endpoint
    if (typeof window !== 'undefined') {
      const response = await fetch('/api/batch-setups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols, strategy }),
      });
      
      if (!response.ok) return {};
      return await response.json();
    }
    
    // Server-side: fetch individually
    const promises = symbols.map(symbol => fetchSetup(symbol, strategy));
    const results = await Promise.allSettled(promises);
    
    const setups: Record<string, ExtendedTradeSetupData | null> = {};
    
    results.forEach((result, index) => {
      const symbol = symbols[index];
      if (result.status === 'fulfilled' && result.value) {
        setups[symbol] = result.value;
      } else {
        setups[symbol] = null;
        console.warn(`❌ Failed to fetch setup for ${symbol}`);
      }
    });
    
    console.log(`✅ Successfully fetched ${Object.values(setups).filter(Boolean).length}/${symbols.length} setups`);
    return setups;
    
  } catch (error) {
    console.error('❌ Error fetching multiple setups:', error);
    return {};
  }
}

/**
 * ✅ Client-side: Fetch multiple setups at once with strategy support
 */
export async function fetchMultipleSetupsClient(
  symbols: SymbolKey[],
  strategy: "scalper" | "daytrader" = "daytrader"
): Promise<Record<string, ExtendedTradeSetupData | null>> {
  if (typeof window === 'undefined') {
    throw new Error('fetchMultipleSetupsClient can only be called on the client');
  }
  
  try {
    const response = await fetch('/api/batch-setups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbols, strategy }),
    });
    
    if (!response.ok) {
      console.error(`Batch API failed: ${response.status}`);
      return {};
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching multiple setups on client:', error);
    return {};
  }
}