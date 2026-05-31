// app/lib/unifiedGenerator.ts

import { SymbolData } from "./fetchData";
import { Locale } from "./translations";

// Helper formatter
const fmt = (num: number | undefined | null, symbol?: string): string => {
  if (num === undefined || num === null || isNaN(num)) return "N/A";
  
  // For calculator tool - determine decimals by price
  if (symbol) {
    const price = num;
    const decimals = price > 1000 ? 1 : 5;
    return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
  }
  
  // Default for zones, volatility, etc.
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 });
};

// Format for trend/analysis (max 10 decimals)
const fmtPrice = (num: number): string => {
  return num.toLocaleString('en-US', { maximumFractionDigits: 10 });
};

interface GeneratorOptions {
  data: SymbolData;
  symbol: string;
  locale: Locale;
  tool: string;
}

export const unifiedGenerator = ({ data, symbol, locale, tool }: GeneratorOptions) => {
  const isArabic = locale === 'ar';
  
  switch (tool) {
    case 'analysis':
      return generateAnalysisContent(data, symbol, isArabic);
    case 'trade':
      return generateTradeContent(data, symbol, isArabic);
    case 'trend':
      return generateTrendContent(data, symbol, isArabic);
    case 'momentum':
      return generateMomentumContent(data, symbol, isArabic);
    case 'zones':
      return generateZonesContent(data, symbol, isArabic);
    case 'volatility':
      return generateVolatilityContent(data, symbol, isArabic);
    case 'calculator':
      return generateCalculatorContent(data, symbol, isArabic);
    case 'indicator':
      return generateIndicatorContent(data, symbol, isArabic);
    case 'forecast':
      return generateForecastContent(data, symbol, isArabic);
    default:
      return generateAnalysisContent(data, symbol, isArabic);
  }
};

// ============================================================
// 1. ANALYSIS TOOL
// ============================================================
function generateAnalysisContent(data: SymbolData, symbol: string, isArabic: boolean) {
  const sym = symbol.toUpperCase();
  const t = data.trend;
  const m = data.momentum;
  const v = data.volatility;
  const z = data.zones;

  // Structure analysis (financial terms - keep English)
  let structure = "Neutral / Ranging";
  if (t?.ema_alignment === 'bullish' && (m?.rsi_latest || 50) > 50) structure = "Constructive Bullish Structure";
  if (t?.ema_alignment === 'bearish' && (m?.rsi_latest || 50) < 50) structure = "Deteriorating Bearish Structure";

  // Confluence score
  let confluenceCount = 0;
  if (t?.trend_strength === 'strong') confluenceCount++;
  if (m?.momentum_strength !== 'weak') confluenceCount++;
  if (z?.zone_strength === 'strong') confluenceCount++;
  
  let confluenceText = "Low Confluence (Retail Noise)";
  if (confluenceCount === 3) confluenceText = "High Confluence (Institutions Active)";
  else if (confluenceCount === 2) confluenceText = "Moderate Confluence (Standard Market)";

  const trendAlignment = m?.trend_alignment || 'neutral';
  const alignmentText = trendAlignment === 'aligned' ? 'movement authenticity' : 'potential divergence';
  const alignmentAr = trendAlignment === 'aligned' ? 'صحة الحركة' : 'تباعد محتمل';
  
  const supportZone = fmt(z?.support_zone);
  const resistanceZone = fmt(z?.resistance_zone);
  const volatilityRegime = v?.volatility_regime || 'neutral';
  const volatilityLevel = v?.volatility_level === 'high' ? 'loose stops' : 'standard position sizing';
  const volatilityLevelAr = v?.volatility_level === 'high' ? 'وقف فضفاض' : 'حجم مركز قياسي';
  const trendScore = t?.trend_strength_score || 0;
  const driver = trendScore > ((m?.momentum_strength?.length || 0) * 10) ? "Trend Following" : "Mean Reversion";
  const driverAr = trendScore > ((m?.momentum_strength?.length || 0) * 10) ? "اتباع الاتجاه" : "العودة إلى المتوسط";

  if (isArabic) {
    return {
      title: `${sym} تحليل فني | رؤى السوق بالذكاء الاصطناعي`,
      metaDesc: `${sym} تقييم كامل لصحة السوق. الهيكل: ${structure}. نظام التقلب: ${volatilityRegime}. درجة سلامة الاتجاه: ${trendScore}/100.`,
      health_check: `
        حركة السعر لـ ${sym} تظهر **${structure}**. 
        العلاقة بين تدفق الاتجاه والزخم حالياً **${trendAlignment}**، مما يؤكد ${alignmentAr}.
      `,
      liquidity: `
        تحليل تدفق الأوامر يحدد نشاطاً محدداً بالقرب من مناطق **${supportZone}** (Demand) و **${resistanceZone}** (Supply).
        مقاييس التقلب تشير إلى بيئة **${volatilityRegime}**، مما يتطلب ${volatilityLevelAr}.
      `,
      verdict: `
        واقع السوق: ${confluenceText}.
        المحرك الأساسي: ${driverAr}
      `
    };
  }

  return {
    title: `${sym} Technical Analysis: Deep Dive Market Structure & Risk Report`,
    metaDesc: `${sym} full market health check. Structure: ${structure}. Volatility Regime: ${volatilityRegime}. Trend Integrity Score: ${trendScore}/100.`,
    health_check: `
      Price action for ${sym} is exhibiting a **${structure}**. 
      The correlation between Trend Flow and Momentum is currently **${trendAlignment}**, which confirms ${alignmentText}.
    `,
    liquidity: `
      Order flow analysis identifies specific activity near the **${supportZone}** (Demand) and **${resistanceZone}** (Supply) pools.
      Volatility metrics suggest a **${volatilityRegime}** environment, requiring ${volatilityLevel}.
    `,
    verdict: `
      Market Reality: ${confluenceText}.
      Primary Driver: ${driver}
    `
  };
}

// ============================================================
// 2. TRADE TOOL
// ============================================================
function generateTradeContent(data: SymbolData, symbol: string, isArabic: boolean) {
  const sym = symbol.toUpperCase();
  const order = (data as any).pending_orders?.primary_order || (data as any).pending_orders?.pending_orders?.[0];
  const tpSl = (data as any).tp_sl;
  const risk = (data as any).risk_score;

  if (!order) {
    return {
      title: `${sym} Trading Update`,
      metaDesc: "No active setup available at this time.",
      header: "NO ACTIVE SETUP",
      rationale: "No active trading signals detected at this time.",
      execution: "Wait for market confirmation.",
      risk_manage: "Monitor market conditions."
    };
  }

  const action = order.type?.replace('_LIMIT', '').replace('_STOP', '') || "BUY";
  const rr = order.rr_ratio || tpSl?.rr_ratio || 2.0;
  const entry = order.entry_price || tpSl?.entry_price || 0;
  const sl = order.sl_price || tpSl?.sl_level || 0;
  const tp = order.tp_price || tpSl?.tp_level || 0;
  const rationale = order.rationale || "Algorithmic breakout detected";
  const marketContext = (data as any).pending_orders?.market_context?.replace(/_/g, ' ') || "Trend Following";
  const riskCategory = risk?.risk_category?.replace(/_/g, ' ') || 'STANDARD';
  const positionMultiplier = risk?.position_size_multiplier || 1.0;

  if (isArabic) {
    return {
      title: `${sym} إعداد صفقة | نقاط الدخول والخروج`,
      metaDesc: `إعداد صفقة احترافي لـ ${sym} مع دخول ${fmt(entry)} وجني أرباح ${fmt(tp)} ووقف خسارة ${fmt(sl)}.`,
      header: `${action} إشارة`,
      rationale: `
        الإعداد الرئيسي: **${order.type?.replace('_', ' ')}**.
        السبب: ${rationale}.
        سياق السوق: ${marketContext}.
      `,
      execution: `
        ضع الأوامر عند **${fmt(entry)}** للحصول على نسبة مخاطرة 1:${rr}.
        نقطة الإبطال (وقف الخسارة) تتوافق مع هيكل ${action === 'BUY' ? 'الدعم' : 'المقاومة'}.
      `,
      risk_manage: `
        فئة المخاطر: **${riskCategory}**.
        مضاعف حجم المركز الموصى به: ${positionMultiplier}x.
      `
    };
  }

  return {
    title: `Live Trade Setup: ${action} ${sym} | R:R ${rr} Signal`,
    metaDesc: `Active trading plan for ${sym}. Entry: ${fmt(entry)}. Stop Loss: ${fmt(sl)}. Take Profit: ${fmt(tp)}. Strategy: ${rationale}.`,
    header: `${action} SIGNAL DETECTED`,
    rationale: `
      Primary Setup: **${order.type?.replace('_', ' ')}**.
      Reasoning: ${rationale}.
      Market Context: ${marketContext}.
    `,
    execution: `
      Place orders at **${fmt(entry)}** to secure an optimal risk-reward ratio of 1:${rr}. 
      The calculated invalidation point (Stop Loss) aligns with recent ${action === 'BUY' ? 'support' : 'resistance'} structures.
    `,
    risk_manage: `
      Risk Category: **${riskCategory}**. 
      Recommended Position Size Multiplier: ${positionMultiplier}x.
    `
  };
}

// ============================================================
// 3. TREND TOOL
// ============================================================
function generateTrendContent(data: SymbolData, symbol: string, isArabic: boolean) {
  const sym = symbol.toUpperCase();
  const t = data.trend;
  
  if (!t) {
    return {
      title: `${sym} Trend Analysis`,
      metaDesc: "Trend data currently unavailable.",
      context: "Unable to load trend data at this time.",
      technicals: "Please try again later.",
      verdict: "Check back for updates."
    };
  }

  const trend = t.trend?.toUpperCase() || "NEUTRAL";
  const trendStrength = t.trend_strength || "neutral";
  const trendScore = t.trend_strength_score || 0;
  const price = fmtPrice(t.current_price);
  const ema50 = fmtPrice(t.current_emas?.ema_50);
  const pricePosition = t.price_position?.vs_ema50 || "near";
  const emaAlignment = t.ema_alignment || "neutral";
  const isBullish = trend.includes("BULLISH");

  if (isArabic) {
    return {
      title: `${sym} تحليل الاتجاه | قوة الاتجاه`,
      metaDesc: `${sym} تحليل الاتجاه مع درجة القوة المؤسسية ${trendScore}/100. الاتجاه: ${trend}.`,
      context: `
        هيكل السوق العام لـ ${sym} هو حالياً ${trend}. 
        خوارزمية الاتجاه المؤسسية تحسب درجة القوة ${trendScore}/100، 
        وتصنف هذه الحركة على أنها "${trendStrength}".
        ${trendScore > 75 ? "الدرجات العالية تشير إلى التزام مؤسسي قوي بهذا الاتجاه." : "الدرجات المنخفضة تشير إلى سوق متقلب أو exhaustion."}
      `,
      technicals: `
        حركة السعر (${price}) تتداول حالياً ${pricePosition === 'above' ? 'أعلى' : pricePosition === 'below' ? 'أسفل' : 'قرب'} المتوسط المتحرك EMA50 الرئيسي (${ema50}).
        محاذاة EMA الحالية تحمل علامة "${emaAlignment}"، والتي تؤكد عادة ${isBullish ? 'تماسك الدعم على الانخفاضات' : 'مقاومة عند القمم السابقة'}.
      `,
      verdict: `
        تدفق الأموال الذكية يشير إلى زخم ${isBullish ? "صاعد" : "هابط"}. 
        يجب على المتداولين التركيز على صفقات ${isBullish ? 'شراء' : 'بيع'} المتوافقة مع الاتجاه الرئيسي لتقليل مخاطر السيولة.
      `
    };
  }

  return {
    title: `${sym} Trend Analysis: ${trend} Structure Confirmed`,
    metaDesc: `Live trend report for ${sym}. Our AI Trend Score is ${trendScore}/100, signaling a ${trendStrength} move.`,
    context: `
      The overarching market structure for ${sym} is currently ${trend}. 
      Our institutional trend algorithm calculates a Strength Score of ${trendScore}/100, 
      classifying this movement as "${trendStrength}".
      ${trendScore > 75 ? "High scores indicate strong institutional commitment to this direction." : "Lower scores suggest a potential chopping market or trend exhaustion."}
    `,
    technicals: `
      Price action (${price}) is currently trading ${pricePosition} the key 50-period moving average (${ema50}).
      The current EMA Alignment is labeled as "${emaAlignment}", which typically validates ${isBullish ? 'support holding on dips' : 'overhead resistance at prior swing highs'}.
    `,
    verdict: `
      Smart money flow indicates ${isBullish ? "Upward" : "Downward"} momentum. 
      Traders should focus on ${isBullish ? 'long' : 'short'} entries aligning with the primary trend to minimize liquidity risk.
    `
  };
}

// ============================================================
// 4. MOMENTUM TOOL
// ============================================================
function generateMomentumContent(data: SymbolData, symbol: string, isArabic: boolean) {
  const sym = symbol.toUpperCase();
  const m = data.momentum;
  
  if (!m) {
    return {
      title: `${sym} Momentum Analysis`,
      metaDesc: "Momentum data currently unavailable.",
      context: "Unable to load momentum data.",
      stats: "Please try again later.",
      verdict: "Check back for updates."
    };
  }

  const rsi = m.rsi_latest;
  const slope = m.rsi_slope;
  const bias = m.momentum_bias?.toUpperCase() || "NEUTRAL";
  const strength = m.momentum_strength || "weak";
  const divergence = m.divergence_detected !== "none" ? m.divergence_detected : null;
  
  let state = "Equilibrium";
  if (rsi > 70) state = "Overbought (Potential Exhaustion)";
  if (rsi < 30) state = "Oversold (Value Area)";
  
  const velocity = slope > 0.05 ? "Accelerating" : slope < -0.05 ? "Decelerating" : "Stable";
  const velocityAr = slope > 0.05 ? "متسارع" : slope < -0.05 ? "متباطئ" : "مستقر";

  if (isArabic) {
    return {
      title: `${sym} تحليل الزخم | ${bias} | RSI ${rsi?.toFixed(1)}`,
      metaDesc: `تحليل زخم مباشر لـ ${sym}. RSI عند ${rsi?.toFixed(1)} (${state}). السرعة: ${velocityAr}.`,
      context: `
        سرعة السعر لـ ${sym} تحمل حالياً انحياز "${bias}". 
        مؤشر القوة النسبية (RSI) يسجل ${rsi?.toFixed(1)}، مما يضع السوق في منطقة ${state}.
        خوارزمياتنا تصنف قوة الزخم الخام على أنها "${strength}"، مما يشير إلى ${strength === 'weak' ? 'تردد أو احتمال توحيد' : 'حركة دافعة ملتزمة'}.
      `,
      stats: `
        منحدر مؤشر الزخم هو حالياً ${velocityAr} (${slope?.toFixed(4)})، والذي يقيس معدل التغير في عدوانية تدفق الأوامر.
        فحص التباعد: ${divergence ? `⚠️ تنبيه: ${divergence} تم اكتشافه. غالباً ما يشير هذا إلى خطر الانعكاس.` : 'لم يتم اكتشاف أي تباعد هيكلي.'}
      `,
      verdict: `
        ${rsi > 70 ? "حذر من المراكز الطويلة؛ المؤشر ممتد." : rsi < 30 ? "راقب مشغلات الشراء." : "السوق متوازن؛ ركز على استراتيجيات اتباع الاتجاه."}
      `
    };
  }

  return {
    title: `${sym} Momentum Analysis: ${bias} | RSI ${rsi?.toFixed(1)}`,
    metaDesc: `Live Momentum oscillator check for ${sym}. RSI is at ${rsi?.toFixed(1)} (${state}). Velocity: ${velocity}.`,
    context: `
      Price velocity for ${sym} currently holds a "${bias}" bias. 
      The Relative Strength Index (RSI) is printing at ${rsi?.toFixed(1)}, placing the market in the ${state} zone.
      Our algorithms grade the raw momentum strength as "${strength}", indicating ${strength === 'weak' ? 'indecision or potential consolidation' : 'a committed impulse move'}.
    `,
    stats: `
      The slope of the momentum oscillator is currently ${velocity} (${slope?.toFixed(4)}), which measures the rate of change in order flow aggression.
      Divergence Scan: ${divergence ? `⚠️ ALERT: ${divergence} detected. This often signals a reversal risk.` : 'No structural anomalies detected.'}
    `,
    verdict: `
      ${rsi > 70 ? "Caution on long positions; oscillator extended." : rsi < 30 ? "Watch for mean-reversion buy triggers." : "Market is balanced; focus on trend following strategies."}
    `
  };
}

// ============================================================
// 5. ZONES TOOL
// ============================================================
function generateZonesContent(data: SymbolData, symbol: string, isArabic: boolean) {
  const sym = symbol.toUpperCase();
  const z = data.zones;
  const t = data.trend;
  
  if (!z) {
    return {
      title: `${sym} Key Levels`,
      metaDesc: "Zone data currently unavailable.",
      context: "Unable to load support/resistance levels.",
      position: "Please try again later.",
      strategy: "Check back for updates."
    };
  }

  const support = fmt(z.support_zone);
  const resistance = fmt(z.resistance_zone);
  const zoneStrength = z.zone_strength?.toUpperCase() || "NEUTRAL";
  const zoneQuality = z.component_quality || 50;
  const position = z.current_price_position || "mid-range";
  const context = z.order_placement_context || "";
  const width = z.zone_width_pips || 0;
  const price = fmtPrice(t?.current_price);

  let proximityText = "mid-range";
  if (position.includes('support')) proximityText = "testing structural support";
  if (position.includes('resistance')) proximityText = "probing resistance";
  
  let execution = "Stand Aside";
  if (context.includes('resistance')) execution = "Limit Sell Order";
  if (context.includes('support')) execution = "Limit Buy Order";

  if (isArabic) {
    return {
      title: `${sym} المستويات الرئيسية: دعم @ ${support} / مقاومة @ ${resistance}`,
      metaDesc: `مستويات مباشرة لـ ${sym}. الدعم: ${support}. المقاومة: ${resistance}. وضوح المنطقة: ${zoneQuality}/100.`,
      context: `
        فحوصات السيولة تظهر نطاق التداول لـ ${sym}.
        سقف المقاومة detected عند **${resistance}**.
        أرضية الدعم holding عند **${support}**.
        قوة الهيكل: **${zoneStrength}**.
      `,
      position: `
        السعر الحالي (${price}) هو ${proximityText === 'mid-range' ? 'في منتصف النطاق' : proximityText === 'testing structural support' ? 'يختبر الدعم الهيكلي' : 'يختبر المقاومة'}.
        عرض الضغط: ${width?.toFixed(1)} نقطة.
        وضوح الإعداد: **${zoneQuality}/100**.
      `,
      strategy: `
        إشارة السياق: ${context || 'مراقبة'}.
        القوي: **${execution}** على الرفض.
        المحافظ: انتظر التأكيد.
      `
    };
  }

  return {
    title: `${sym} Key Levels: Support @ ${support} / Res @ ${resistance}`,
    metaDesc: `Live levels for ${sym}. Support: ${support}. Resistance: ${resistance}. Zone Clarity: ${zoneQuality}/100.`,
    context: `
      Liquidity scans show the trading range for ${sym}.
      Resistance ceiling detected at **${resistance}**.
      Support floor holding at **${support}**.
      Structure Strength: **${zoneStrength}**.
    `,
    position: `
      Current price (${price}) is ${proximityText}. 
      Compression spread: ${width?.toFixed(1)} pips.
      Setup Clarity: **${zoneQuality}/100**.
    `,
    strategy: `
      Context Signal: ${context || 'Monitor'}.
      Aggressive: **${execution}** on rejection.
      Conservative: Wait for confirm.
    `
  };
}

// ============================================================
// 6. VOLATILITY TOOL
// ============================================================
function generateVolatilityContent(data: SymbolData, symbol: string, isArabic: boolean) {
  const sym = symbol.toUpperCase();
  const v = data.volatility;
  
  if (!v) {
    return {
      title: `${sym} Volatility Analysis`,
      metaDesc: "Volatility data currently unavailable.",
      context: "Unable to load volatility data.",
      stats: "Please try again later.",
      strategy: "Check back for updates."
    };
  }

  const regime = v.volatility_regime?.toUpperCase() || "NORMAL";
  const level = v.volatility_level || "moderate";
  const score = v.volatility_score || 0;
  const currentAtr = fmt(v.current_atr);
  const avgRange = fmt(v.avg_range);
  const optimalSl = v.optimal_sl_multiplier || 1.5;
  const isHighVol = level === "high" || score > 0.7;
  const isExpanding = v.current_atr > v.avg_range;

  if (isArabic) {
    return {
      title: `${sym} تحليل التقلبات | ${regime}`,
      metaDesc: `درجة تقلب ${sym} الحالية: ${score}. ATR اليومي هو ${currentAtr}.`,
      context: `
        حالة السوق لـ ${sym} مصنفة حالياً على أنها "${regime}". 
        درجة التقلب الموحدة تقرأ ${score?.toFixed(2)} (مقياس 0-1). 
        ${score < 0.3 ? "هذه القراءة المنخفضة تشير إلى ضغط السعر. يشار إليها غالباً بـ 'الهدوء قبل العاصفة'، وغالباً ما تسبق هذه الحالة اختراقات متفجرة." : "القراءات المرتفعة تشير إلى نطاقات موسعة. يجب على المتداولين توقع تحركات أوسع واحتمالية الانزلاق."}
      `,
      stats: `
        متوسط المدى الحقيقي اليومي (ATR) يمثل التحرك المتوقع خلال 24 ساعة. 
        حالياً، ${sym} يتحرك حوالي ${currentAtr} نقطة في اليوم. 
        مقارنة بخط الأساس التاريخي ${avgRange}، فإن التقلب ${isExpanding ? "يتوسع" : "يتقلص"}.
      `,
      strategy: `
        يجب تعديل علاوات المخاطرة لهذه البيئة. 
        تحسب الذكاء الاصطناعي مضاعف وقف الخسارة الأمثل بـ ${optimalSl}x ATR لتجنب "الضوضاء" مع حماية رأس المال. 
        في بيئة ${regime} هذه، يوصى بشدة باستخدام أوامر الحد بدلاً من تنفيذ السوق.
      `
    };
  }

  return {
    title: `${sym} Volatility Analysis: ${regime} Risk Profile`,
    metaDesc: `Current ${sym} Volatility Score: ${score?.toFixed(2)}. Daily ATR is ${currentAtr}.`,
    context: `
      The market state for ${sym} is currently classified as "${regime}". 
      The standardized Volatility Score is reading ${score?.toFixed(2)} (Scale 0-1). 
      ${score < 0.3 ? "This low reading indicates price compression. Often referred to as the 'Calm before the Storm', this state frequently precedes explosive breakouts." : "Elevated readings suggest expanded ranges. Traders should expect wider swings and potentially slippage on market orders."}
    `,
    stats: `
      The Daily Average True Range (ATR) represents the expected move over a 24-hour period. 
      Currently, ${sym} moves approximately ${currentAtr} points per day. 
      Compared to its historical baseline of ${avgRange}, volatility is ${isExpanding ? "expanding" : "contracting"}.
    `,
    strategy: `
      Risk premiums must be adjusted for this environment. 
      Our AI calculates an optimal Stop Loss multiplier of ${optimalSl}x ATR to avoid "noise" while protecting capital. 
      In this ${regime} environment, strictly limit order placement is recommended over market execution.
    `
  };
}

// ============================================================
// 7. CALCULATOR TOOL
// ============================================================
function generateCalculatorContent(data: SymbolData, symbol: string, isArabic: boolean) {
  const sym = symbol.toUpperCase();
  const v = data.volatility;
  const price = data.trend?.current_price || 0;
  
  if (!v) {
    return {
      title: `${sym} Position Calculator`,
      description: "Calculator data unavailable.",
      atrString: "N/A",
      calculations: { long: {}, short: {} }
    };
  }

  const atr = v.current_atr;
  const fmtCalc = (n: number) => {
    const decimals = price > 1000 ? 1 : 5;
    return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
  };
  const atrString = fmtCalc(atr);

  if (isArabic) {
    return {
      title: `حاسبة وقف الخسارة المباشرة لـ ${sym} | أداة إدارة المخاطر`,
      description: `احم صفقات ${sym} الخاصة بك بمستويات وقف خسارة مبنية على التقلب. ATR الحالي: ${atrString}.`,
      atrString,
      calculations: {
        long: {
          scalp: { level: fmtCalc(price - atr), label: "1.0x ATR" },
          day: { level: fmtCalc(price - (atr * 1.5)), label: "1.5x ATR" },
          swing: { level: fmtCalc(price - (atr * 2.5)), label: "2.5x ATR" }
        },
        short: {
          scalp: { level: fmtCalc(price + atr), label: "1.0x ATR" },
          day: { level: fmtCalc(price + (atr * 1.5)), label: "1.5x ATR" },
          swing: { level: fmtCalc(price + (atr * 2.5)), label: "2.5x ATR" }
        }
      }
    };
  }

  return {
    title: `Live Stop Loss Calculator for ${sym} | Risk Management Tool`,
    description: `Protect your ${sym} trades with volatility-based Stop Loss levels. Current ATR: ${atrString}.`,
    atrString,
    calculations: {
      long: {
        scalp: { level: fmtCalc(price - atr), label: "1.0x ATR" },
        day: { level: fmtCalc(price - (atr * 1.5)), label: "1.5x ATR" },
        swing: { level: fmtCalc(price - (atr * 2.5)), label: "2.5x ATR" }
      },
      short: {
        scalp: { level: fmtCalc(price + atr), label: "1.0x ATR" },
        day: { level: fmtCalc(price + (atr * 1.5)), label: "1.5x ATR" },
        swing: { level: fmtCalc(price + (atr * 2.5)), label: "2.5x ATR" }
      }
    }
  };
}

// ============================================================
// 8. INDICATOR TOOL
// ============================================================
function generateIndicatorContent(data: SymbolData, symbol: string, isArabic: boolean) {
  const sym = symbol.toUpperCase();
  const m = data.momentum;
  
  if (!m) {
    return {
      title: `${sym} Technical Indicators`,
      desc: "Indicator data unavailable.",
      rsiValue: 50,
      status: "DATA UNAVAILABLE",
      color: "text-gray-400",
      barColor: "bg-gray-500",
      advice: "Please try again later.",
      sentiment: "Check back for updates",
      divergence: "Unknown",
      strength: "unknown"
    };
  }

  const rsi = m.rsi_latest;
  const bias = m.momentum_bias?.toUpperCase() || "NEUTRAL";
  const divergence = m.divergence_detected !== "none" ? m.divergence_detected : "No Divergence";
  const strength = m.momentum_strength || "weak";

  let status = "NEUTRAL MOMENTUM";
  let color = "text-purple-400";
  let barColor = "bg-purple-500";
  let sentiment = "Wait for clarity";
  let advice = "RSI is floating in the middle zone (30-70). This indicates price is following the average trend without extremes. Look for price action confirmation rather than trading off RSI alone.";

  if (rsi >= 70) {
    status = "⚠️ CRITICAL: OVERBOUGHT";
    color = "text-red-500";
    barColor = "bg-red-500";
    sentiment = "Reversal Risk High";
    advice = "Price is statistically extended to the upside. The probability of a pullback or consolidation is very high. Buying here chases the top. Watch for Bearish Divergence.";
  } else if (rsi <= 30) {
    status = "💎 OPPORTUNITY: OVERSOLD";
    color = "text-emerald-400";
    barColor = "bg-emerald-500";
    sentiment = "Bounce Likely";
    advice = "Selling pressure has exhausted. Price is statistically cheap relative to recent history. Watch for a bullish reaction or rejection wicks to enter long.";
  } else if (rsi > 55 && (bias.includes("BULL"))) {
    status = "STRONG BULLISH MOMENTUM";
    color = "text-green-400";
    barColor = "bg-green-500";
    sentiment = "Trend Following";
    advice = "Buyers are in control. RSI is holding above 50, supporting the uptrend. Dip buying is favored while RSI stays above the 40-50 floor.";
  } else if (rsi < 45 && (bias.includes("BEAR"))) {
    status = "STRONG BEARISH MOMENTUM";
    color = "text-red-400";
    barColor = "bg-red-500";
    sentiment = "Sell Rallies";
    advice = "Sellers are dominating. RSI is suppressed below 50, confirming the downtrend. Rallies that fail to push RSI above 60 offer selling opportunities.";
  }

  if (isArabic) {
    const statusAr = status.includes("OVERBOUGHT") ? "⚠️ حرج: تشبع شرائي" : status.includes("OVERSOLD") ? "💎 فرصة: تشبع بيعي" : status.includes("BULLISH") ? "زخم صاعد قوي" : status.includes("BEARISH") ? "زخم هابط قوي" : "زخم محايد";
    const sentimentAr = sentiment === "Reversal Risk High" ? "خطر انعكاس مرتفع" : sentiment === "Bounce Likely" ? "ارتداد محتمل" : sentiment === "Trend Following" ? "اتباع الاتجاه" : sentiment === "Sell Rallies" ? "بيع الارتفاعات" : "انتظار الوضوح";
    
    return {
      title: `مؤشر RSI المباشر لـ ${sym}: ${rsi?.toFixed(1)} - ${statusAr}`,
      desc: `مراقبة RSI فورية لـ ${sym}. القيمة الحالية: ${rsi?.toFixed(1)}. انحياز السوق: ${bias}.`,
      rsiValue: rsi,
      status: statusAr,
      color,
      barColor,
      advice,
      sentiment: sentimentAr,
      divergence: divergence !== "No Divergence" ? divergence : "لا يوجد تباعد",
      strength
    };
  }

  return {
    title: `Live RSI Indicator for ${sym}: ${rsi?.toFixed(1)} - ${status}`,
    desc: `Real-time RSI monitor for ${sym}. Current Value: ${rsi?.toFixed(1)}. Market Bias: ${bias}.`,
    rsiValue: rsi,
    status,
    color,
    barColor,
    advice,
    sentiment,
    divergence,
    strength
  };
}

// ============================================================
// 9. FORECAST TOOL
// ============================================================
function generateForecastContent(data: SymbolData, symbol: string, isArabic: boolean) {
  const sym = symbol.toUpperCase();
  const summary = data.summary || "";
  const score = data.analysis_accuracy || 0;
  const riskScore = (data as any).risk_score?.confidence_score || score;
  const isHighConfidence = score > 80;
  
  // Extract action from summary
  const actionMatch = summary.match(/Action:\s*(?:.+?\*\*)?([A-Z]+)/i);
  const action = actionMatch ? actionMatch[1].toUpperCase() : "WATCH";
  
  // Extract risk level
  const riskMatch = summary.match(/Risk Level:\s*(.*?)(?:\n|$)/);
  const riskLevel = riskMatch ? riskMatch[1].trim() : "Moderate Risk";
  const cleanRisk = riskLevel.replace(/[^\w\s]/gi, '').trim();
  
  // Extract market context
  const contextMatch = summary.match(/Market Context:\s*(.*?)(?:\n|$)/);
  const marketContext = contextMatch ? contextMatch[1].trim() : "Consolidated";

  const biasText = action === "BUY" ? "indicates potential for upward expansion (Bullish Bias)." : action === "SELL" ? "suggests potential downside rejection (Bearish Bias)." : "remains neutral, awaiting a breakout trigger.";
  const biasAr = action === "BUY" ? "يشير إلى إمكانية التوسع الصاعد." : action === "SELL" ? "يشير إلى احتمال الرفض الهبوطي." : "يبقى محايداً، في انتظار إشارة اختراق.";
  
  const zoneType = action === 'BUY' ? 'Demand Zone' : 'Supply Zone';
  const zoneAr = action === 'BUY' ? 'منطقة الطلب' : 'منطقة العرض';
  const componentZones = (data as any).component_quality?.zones ?? 0;
  const componentMomentum = (data as any).component_quality?.momentum ?? 0;

  if (isArabic) {
    return {
      title: `${sym} توقعات: إشارة ${action} detected (${score.toFixed(0)}% دقة)`,
      metaDesc: `توقعات سعر بالذكاء الاصطناعي لـ ${sym}. قرار التوقعات: ${action}. حالة السوق: ${marketContext}.`,
      executive: `
        نموذج التوقع الخاص بنا يحدد انحياز اتجاهي **${action}** لـ ${sym}. 
        سياق السوق الأوسع محدد حالياً على أنه **"${marketContext}"**.
        تحمل هذه التوقعات تصنيف ثقة إحصائية بنسبة ${score.toFixed(1)}%، بناءً على التقاء الزخم وهيكل الاتجاه ومناطق السيولة.
      `,
      risk_analysis: `
        تقييم المخاطر: **${cleanRisk}**. 
        فحص جودة المكونات يكشف تحققاً قوياً من ${componentZones}% سلامة المنطقة و ${componentMomentum}% تدفق الزخم. 
        ${isHighConfidence ? "هذا التقاء العالي يشير إلى أن تكتيكات الدخول القوية مسموحة." : "نظراً للثقة المعتدلة، يوصى بتقليل حجم المركز."}
      `,
      conclusion: `
        حكم الخوارزم: تقارب نقاط البيانات ${biasAr}
        الإعداد النشط: ابحث عن تأكيد **${zoneAr}** قبل التنفيذ.
      `
    };
  }

  return {
    title: `${sym} Forecast: ${action} Signal Detected (${score.toFixed(0)}% Accuracy)`,
    metaDesc: `AI Price Prediction for ${sym}. Forecast Decision: ${action}. Market State: ${marketContext}. Probability Score: ${score}%.`,
    executive: `
      Our Predictive Model has finalized a directional bias of **${action}** for ${sym}. 
      The broader market context is currently identified as **"${marketContext}"**.
      This forecast carries a statistical confidence rating of ${score.toFixed(1)}%, based on the confluence of momentum, trend structure, and liquidity zones.
    `,
    risk_analysis: `
      Risk Assessment: **${cleanRisk}**. 
      The component quality check reveals strong validation from ${componentZones}% Zone Integrity and ${componentMomentum}% Momentum Flow. 
      ${isHighConfidence ? "This high confluence suggests aggressive entry tactics are permissible." : "Given the moderate confidence, reduced position sizing is recommended."}
    `,
    conclusion: `
      Algorithm Verdict: The confluence of data points ${biasText}
      Active Setup: Look for **${zoneType}** validation before execution.
    `
  };
}