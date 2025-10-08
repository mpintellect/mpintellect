import { getFirestore, doc, getDoc } from "firebase/firestore";
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

/** Execution plan from enhanced uploader */
export interface ExecutionPlan {
  action: string;
  order_type: string;
  entry_price: number;
  take_profit: number;
  stop_loss: number;
  risk_reward_ratio: number;
  entry_timing: string;
  position_size: number;
  max_risk_percent: number;
  urgency: string;
  market_context: string;
  has_pending_orders: boolean;
  total_orders: number;
  order_confidence: number;
}

/** Upload metadata */
export interface UploadMetadata {
  timestamp: string;
  symbol: string;
  decimals: number;
  analysis_version: string;
  upload_id: string;
  analysis_accuracy: number;
}

/** Full type for trade setups saved in Firebase */
export interface TradeSetupData {
  symbol: SymbolKey;
  trend: {
    trend: string;
    slope?: string;
    ema_gap: number;
    trend_strength?: string;
  };
  momentum: {
    momentum_bias: string;
    rsi_latest: number;
    rsi_trend?: string;
    overbought?: boolean;
    oversold?: boolean;
    momentum_strength?: string;
  };
  volatility: {
    volatility_level: string;
    avg_atr: number;
    avg_range?: number;
    atr_vs_range?: number;
    volatility_regime?: string;
    current_atr?: number;
  };
  zones: {
    support_zone: number | null;
    resistance_zone: number | null;
    zone_strength: string;
    current_price_position?: string;
    error?: string;
  };
  entry_zone: {
    entry_zone: [number, number];
    entry_bias: string;
    zone_strength: string;
    zone_width_pips?: number;
  };
  tp_sl: {
    tp_level: number;
    sl_level: number;
    rr_ratio: number;
    direction?: string;
    entry_price?: number;
  };
  fibonacci?: {
    swing_high: number | null;
    swing_low: number | null;
    fibonacci_levels: Record<string, number>;
  };
  confidence?: {
    confidence_score: number;
    risk_reward?: number | null;
    notes?: string;
  };
  risk_score?: {
    confidence_score: number;
    risk_category: string;
    position_size_multiplier: number;
    recommendation?: string;
  };
  summary: string;
  final_decision: "BUY" | "SELL" | "WAIT" | "LOW_CONFIDENCE_BUY" | "LOW_CONFIDENCE_SELL";
  generated_at: string;
  analysis_accuracy?: number;
  component_scores?: Record<string, number>;
  warnings?: string[];
  
  // ✅ NEW: Pending orders support
  pending_orders?: PendingOrdersData;
  execution_plan?: ExecutionPlan;
  upload_metadata?: UploadMetadata;
}

/** Extended interface for enhanced data from Firebase uploader */
export interface ExtendedTradeSetupData extends TradeSetupData {
  pending_orders?: PendingOrdersData;
  execution_plan?: ExecutionPlan;
  upload_metadata?: UploadMetadata;
  analysis_components?: {
    trend: any;
    momentum: any;
    volatility: any;
    zones: any;
  };
}

/**
 * ✅ Fetches setup from Firestore with flexible data structure handling
 * Now supports PENDING ORDERS system
 */
export async function fetchSetup(symbol: SymbolKey): Promise<ExtendedTradeSetupData | null> {
  try {
    console.log(`🔍 Fetching setup from /trade_setups/${symbol}...`);

    const db = getFirestore();
    const docRef = doc(db, "trade_setups", symbol);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn(`❌ No setup document found for ${symbol} at /trade_setups/${symbol}`);
      return null;
    }

    const data = docSnap.data();
    console.log(`📦 Raw Firestore data for ${symbol}:`, data);

    // ✅ FLEXIBLE DATA EXTRACTION: Handle both direct and nested structures
    let setupData = data;
    
    // Check if data is nested under 'latest' (enhanced uploader structure)
    if (data.latest) {
      console.log(`📁 Found data in 'latest' field`);
      setupData = data.latest;
    }
    
    // Check if data is nested under 'setup' (alternative structure)
    if (data.setup) {
      console.log(`📁 Found data in 'setup' field`);
      setupData = data.setup;
    }

    console.log(`📊 Extracted setup data:`, setupData);

    // 🔧 SAFE DATA PARSING with fallbacks and PENDING ORDERS support
    const setup: ExtendedTradeSetupData = {
      symbol: symbol,
      trend: setupData.trend ?? { 
        trend: setupData.trend?.trend ?? "neutral", 
        slope: setupData.trend?.slope ?? "flat", 
        ema_gap: setupData.trend?.ema_gap ?? 0,
        trend_strength: setupData.trend?.trend_strength ?? "weak"
      },
      momentum: setupData.momentum ?? {
        momentum_bias: setupData.momentum?.momentum_bias ?? "neutral",
        rsi_latest: setupData.momentum?.rsi_latest ?? 50,
        rsi_trend: setupData.momentum?.rsi_trend ?? "flat",
        overbought: setupData.momentum?.overbought ?? false,
        oversold: setupData.momentum?.oversold ?? false,
        momentum_strength: setupData.momentum?.momentum_strength ?? "weak"
      },
      volatility: setupData.volatility ?? {
        volatility_level: setupData.volatility?.volatility_level ?? "moderate",
        avg_atr: setupData.volatility?.avg_atr ?? 0,
        avg_range: setupData.volatility?.avg_range ?? 0,
        atr_vs_range: setupData.volatility?.atr_vs_range ?? 0,
        volatility_regime: setupData.volatility?.volatility_regime ?? "normal",
        current_atr: setupData.volatility?.current_atr ?? 0
      },
      zones: setupData.zones ?? {
        support_zone: setupData.zones?.support_zone ?? null,
        resistance_zone: setupData.zones?.resistance_zone ?? null,
        zone_strength: setupData.zones?.zone_strength ?? "medium",
        current_price_position: setupData.zones?.current_price_position ?? "middle"
      },
      entry_zone: {
        // Handle both direct array and nested entry_zone structure
        entry_zone: Array.isArray(setupData.entry_zone) 
          ? setupData.entry_zone as [number, number] 
          : (setupData.entry_zone?.entry_zone ?? [0, 0]),
        entry_bias: setupData.entry_zone?.entry_bias ?? setupData.entry_bias ?? "neutral",
        zone_strength: setupData.entry_zone?.zone_strength ?? setupData.zone_strength ?? "medium",
        zone_width_pips: setupData.entry_zone?.zone_width_pips ?? 0
      },
      tp_sl: setupData.tp_sl ?? {
        tp_level: setupData.tp_sl?.tp_level ?? 0,
        sl_level: setupData.tp_sl?.sl_level ?? 0,
        rr_ratio: setupData.tp_sl?.rr_ratio ?? 1.0,
        direction: setupData.tp_sl?.direction ?? setupData.final_decision?.includes("BUY") ? "BUY" : "SELL",
        entry_price: setupData.tp_sl?.entry_price ?? 0
      },
      fibonacci: setupData.fibonacci ?? {
        swing_high: null,
        swing_low: null,
        fibonacci_levels: {},
      },
      confidence: setupData.confidence ?? {
        confidence_score: setupData.confidence?.confidence_score ?? 50,
        risk_reward: setupData.confidence?.risk_reward ?? null,
        notes: setupData.confidence?.notes ?? "",
      },
      risk_score: setupData.risk_score ?? {
        confidence_score: setupData.risk_score?.confidence_score ?? setupData.confidence?.confidence_score ?? 50,
        risk_category: setupData.risk_score?.risk_category ?? "MEDIUM_RISK",
        position_size_multiplier: setupData.risk_score?.position_size_multiplier ?? 0.5,
        recommendation: setupData.risk_score?.recommendation ?? "Proceed with caution"
      },
      summary: setupData.summary ?? `Analysis for ${symbol}`,
      final_decision: (setupData.final_decision as any) ?? "WAIT",
      generated_at: setupData.generated_at ?? new Date().toISOString(),
      analysis_accuracy: setupData.analysis_accuracy ?? 100,
      component_scores: setupData.component_scores ?? {},
      warnings: setupData.warnings ?? [],
      
      // ✅ NEW: PENDING ORDERS SUPPORT
      pending_orders: setupData.pending_orders ? {
        pending_orders: setupData.pending_orders.pending_orders ?? [],
        primary_order: setupData.pending_orders.primary_order ?? null,
        order_confidence: setupData.pending_orders.order_confidence ?? 0,
        market_context: setupData.pending_orders.market_context ?? 'neutral',
        rationale: setupData.pending_orders.rationale ?? 'No orders generated',
        current_price: setupData.pending_orders.current_price ?? 0,
        is_valid: setupData.pending_orders.is_valid ?? false,
        fallback_used: setupData.pending_orders.fallback_used ?? false
      } : undefined,
      
      // ✅ EXECUTION PLAN (from enhanced uploader)
      execution_plan: setupData.execution_plan ? {
        action: setupData.execution_plan.action ?? 'BUY',
        order_type: setupData.execution_plan.order_type ?? 'MARKET_ORDER',
        entry_price: setupData.execution_plan.entry_price ?? 0,
        take_profit: setupData.execution_plan.take_profit ?? 0,
        stop_loss: setupData.execution_plan.stop_loss ?? 0,
        risk_reward_ratio: setupData.execution_plan.risk_reward_ratio ?? 1.0,
        entry_timing: setupData.execution_plan.entry_timing ?? 'immediate',
        position_size: setupData.execution_plan.position_size ?? 0.5,
        max_risk_percent: setupData.execution_plan.max_risk_percent ?? 1.5,
        urgency: setupData.execution_plan.urgency ?? 'medium',
        market_context: setupData.execution_plan.market_context ?? 'neutral',
        has_pending_orders: setupData.execution_plan.has_pending_orders ?? false,
        total_orders: setupData.execution_plan.total_orders ?? 0,
        order_confidence: setupData.execution_plan.order_confidence ?? 0
      } : undefined,
      
      // ✅ UPLOAD METADATA
      upload_metadata: setupData.upload_metadata ? {
        timestamp: setupData.upload_metadata.timestamp ?? new Date().toISOString(),
        symbol: setupData.upload_metadata.symbol ?? symbol,
        decimals: setupData.upload_metadata.decimals ?? 5,
        analysis_version: setupData.upload_metadata.analysis_version ?? 'v1',
        upload_id: setupData.upload_metadata.upload_id ?? 'unknown',
        analysis_accuracy: setupData.upload_metadata.analysis_accuracy ?? 100
      } : undefined,
      
      // ✅ ANALYSIS COMPONENTS (from enhanced uploader)
      analysis_components: data.analysis_components ? {
        trend: data.analysis_components.trend ?? {},
        momentum: data.analysis_components.momentum ?? {},
        volatility: data.analysis_components.volatility ?? {},
        zones: data.analysis_components.zones ?? {}
      } : undefined
    };

    console.log(`✅ Successfully parsed setup for ${symbol}:`, {
      final_decision: setup.final_decision,
      entry_zone: setup.entry_zone.entry_zone,
      tp_sl: setup.tp_sl,
      has_risk_score: !!setup.risk_score,
      analysis_accuracy: setup.analysis_accuracy,
      has_pending_orders: !!setup.pending_orders,
      pending_orders_valid: setup.pending_orders?.is_valid ?? false,
      total_orders: setup.pending_orders?.pending_orders?.length ?? 0
    });

    return setup;
  } catch (error) {
    console.error("❌ Error fetching setup:", error);
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