// app/lib/fetchSetup.ts - SIMPLIFIED VERSION USING API ROUTE
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

/** Full type for trade setups based on ACTUAL data structure */
export interface TradeSetupData {
  symbol: SymbolKey;
  trend: any;
  volatility: any;
  momentum: any;
  zones: any;
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
}

/** Extended interface for enhanced data */
export interface ExtendedTradeSetupData extends TradeSetupData {
  // Add any additional fields if needed
}

/**
 * ✅ Fetches setup via API route (more reliable)
 */
export async function fetchSetup(symbol: SymbolKey): Promise<ExtendedTradeSetupData | null> {
  try {
    console.log(`🔍 Fetching setup via API for ${symbol}...`);

    const response = await fetch(`/api/setup?symbol=${symbol}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log(`📡 API response status: ${response.status}, ok: ${response.ok}`);

    if (!response.ok) {
      // Try to get error details
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ API failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched setup for ${symbol}:`, {
      final_decision: data.final_decision,
      analysis_accuracy: data.analysis_accuracy,
      has_pending_orders: !!data.pending_orders
    });

    return data as ExtendedTradeSetupData;
    
  } catch (error) {
    console.error("❌ Error fetching setup via API:", error);
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
 * ✅ Fetch all setups at once
 */
export async function fetchAllSetups(): Promise<Record<string, any> | null> {
  try {
    console.log('🔍 Fetching all setups from Google Storage...');
    
    const response = await fetch('https://us-central1-mzprimer-livefeed.cloudfunctions.net/api/tradesetup');
    
    if (!response.ok) {
      console.error(`❌ Failed to fetch tradesetup.json: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${Object.keys(data).length} setups`);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching all setups:', error);
    return null;
  }
}

/**
 * ✅ Get available symbols from tradesetup.json
 */
export async function getAvailableSetupSymbols(): Promise<string[]> {
  try {
    const allSetups = await fetchAllSetups();
    return allSetups ? Object.keys(allSetups) : [];
  } catch (error) {
    console.error('❌ Error getting available symbols:', error);
    return [];
  }
}