// app/lib/translations.ts

export type Locale = 'en' | 'ar';

export const toolMapping = {
  en: {
    analysis: "analysis", trade: "trade", trend: "trend", momentum: "momentum",
    zones: "zones", volatility: "volatility", calculator: "calculator",
    indicator: "indicator", forecast: "forecast"
  },
  ar: {
    analysis: "analysis", trade: "trade", trend: "trend", momentum: "momentum",
    zones: "zones", volatility: "volatility", calculator: "calculator",
    indicator: "indicator", forecast: "forecast"
  }
};

export const toolDisplay = {
  en: {
    analysis: "Analysis", trade: "Trade", trend: "Trend", momentum: "Momentum",
    zones: "Zones", volatility: "Volatility", calculator: "Calculator",
    indicator: "Indicator", forecast: "Forecast"
  },
  ar: {
    analysis: "التحليل الشامل", trade: "التنفيذ", trend: "الاتجاه",
    momentum: "الزخم", zones: "المناطق", volatility: "التقلبات",
    calculator: "الحاسبة", indicator: "المؤشرات", forecast: "التوقعات"
  }
};
// app/lib/translations.ts

// Add these after commonTranslations, before the final closing brace

// ============================================================
// LOADING TEXTS FOR EACH TOOL
// ============================================================
export const loadingTexts = {
  en: {
    analysis: (symbol: string) => `Loading analysis for ${symbol}...`,
    trade: (symbol: string) => `Loading ${symbol} trade setup...`,
    trend: (symbol: string) => `Loading trend for ${symbol}...`,
    momentum: (symbol: string) => `Analyzing momentum for ${symbol}...`,
    zones: (symbol: string) => `Loading zones for ${symbol}...`,
    volatility: (symbol: string) => `Loading volatility for ${symbol}...`,
    calculator: (symbol: string) => `Calculating risk levels for ${symbol}...`,
    indicator: (symbol: string) => `Scanning RSI momentum for ${symbol}...`,
    forecast: (symbol: string) => `Generating ${symbol} forecast...`
  },
  ar: {
    analysis: (symbol: string) => `جاري تحميل تحليل ${symbol}...`,
    trade: (symbol: string) => `جاري تحميل إعداد صفقة ${symbol}...`,
    trend: (symbol: string) => `جاري تحميل اتجاه ${symbol}...`,
    momentum: (symbol: string) => `جاري تحليل زخم ${symbol}...`,
    zones: (symbol: string) => `جاري تحميل مناطق ${symbol}...`,
    volatility: (symbol: string) => `جاري تحميل تقلبات ${symbol}...`,
    calculator: (symbol: string) => `جاري حساب مستويات المخاطرة لـ ${symbol}...`,
    indicator: (symbol: string) => `جاري فحص زخم RSI لـ ${symbol}...`,
    forecast: (symbol: string) => `جاري إنشاء توقعات ${symbol}...`
  }
};

// ============================================================
// ERROR TITLES FOR EACH TOOL
// ============================================================
export const errorTitles = {
  en: {
    analysis: "Analysis not available",
    trade: "Trade Data Unavailable",
    trend: "Trend Data Unavailable",
    momentum: "Momentum Data Unavailable",
    zones: "Data Unavailable",
    volatility: "Volatility Data Unavailable",
    calculator: "Calculator Unavailable",
    indicator: "Indicator Unavailable",
    forecast: "Forecast Unavailable"
  },
  ar: {
    analysis: "التحليل غير متاح",
    trade: "بيانات الصفقة غير متاحة",
    trend: "بيانات الاتجاه غير متاحة",
    momentum: "بيانات الزخم غير متاحة",
    zones: "البيانات غير متاحة",
    volatility: "بيانات التقلب غير متاحة",
    calculator: "الحاسبة غير متاحة",
    indicator: "المؤشرات غير متاحة",
    forecast: "التوقعات غير متاحة"
  }
};

// ============================================================
// TOOL DESCRIPTIONS FOR META TAGS
// ============================================================
export const toolDescriptions: Record<Locale, Record<string, (symbol: string) => string>> = {
  en: {
    analysis: (symbol: string) => `Live AI-powered technical analysis for ${symbol}. Get real-time trend, momentum, volatility and market structure insights.`,
    trade: (symbol: string) => `Professional trade setup for ${symbol} with entry levels, take profit, and stop loss. AI-powered risk management.`,
    trend: (symbol: string) => `${symbol} trend analysis with institutional strength score. Real-time trend direction and momentum confirmation.`,
    momentum: (symbol: string) => `${symbol} momentum analysis with RSI, divergence detection, and velocity metrics.`,
    zones: (symbol: string) => `${symbol} key support and resistance zones. Institutional supply and demand levels.`,
    volatility: (symbol: string) => `${symbol} volatility regime analysis with ATR, range status, and optimal stop placement.`,
    calculator: (symbol: string) => `${symbol} position size calculator based on risk tolerance. Professional risk management tool.`,
    indicator: (symbol: string) => `Complete technical indicators dashboard for ${symbol} including RSI, and key levels.`,
    forecast: (symbol: string) => `${symbol} AI price forecast with confidence score. Short-term price predictions based on institutional data.`
  },
  ar: {
    analysis: (symbol: string) => `تحليل فني مباشر بالذكاء الاصطناعي لـ ${symbol}. احصل على رؤى فورية حول اتجاه السوق والزخم والتقلبات.`,
    trade: (symbol: string) => `إعداد صفقة احترافي لـ ${symbol} مع مستويات الدخول وجني الأرباح ووقف الخسارة.`,
    trend: (symbol: string) => `تحليل اتجاه ${symbol} مع درجة القوة المؤسسية. اتجاه فوري وتأكيد الزخم.`,
    momentum: (symbol: string) => `تحليل زخم ${symbol} مع RSI واكتشاف التباعد ومقاييس السرعة.`,
    zones: (symbol: string) => `مناطق الدعم والمقاومة الرئيسية لـ ${symbol}. مستويات العرض والطلب المؤسسية.`,
    volatility: (symbol: string) => `تحليل نظام التقلب لـ ${symbol} مع ATR وحالة النطاق ووضع الوقف الأمثل.`,
    calculator: (symbol: string) => `حاسبة حجم المركز لـ ${symbol} بناءً على تحمل المخاطر. أداة احترافية لإدارة المخاطر.`,
    indicator: (symbol: string) => `لوحة تحكم المؤشرات الفنية الكاملة لـ ${symbol} بما في ذلك RSI والمستويات الرئيسية.`,
    forecast: (symbol: string) => `توقعات سعر ${symbol} بالذكاء الاصطناعي مع درجة الثقة. توقعات سعرية قصيرة المدى.`
  }
};
// app/lib/translations.ts

// Add this after toolDisplay and before commonTranslations

// ============================================================
// TOOL SEO TITLES (for page metadata)
// ============================================================
export const toolSeo: Record<Locale, Record<string, (symbol: string) => string>> = {
  en: {
    analysis: (symbol: string) => `${symbol} Technical Analysis | AI-Powered Market Insights`,
    trade: (symbol: string) => `${symbol} Trade Setup | Entry, TP, SL Levels`,
    trend: (symbol: string) => `${symbol} Trend Analysis | Direction & Strength`,
    momentum: (symbol: string) => `${symbol} Momentum | RSI & Divergence Analysis`,
    zones: (symbol: string) => `${symbol} Key Zones | Support & Resistance Levels`,
    volatility: (symbol: string) => `${symbol} Volatility | ATR & Market Regime`,
    calculator: (symbol: string) => `${symbol} Position Size Calculator | Risk Management`,
    indicator: (symbol: string) => `${symbol} Technical Indicators | Complete Dashboard`,
    forecast: (symbol: string) => `${symbol} Price Forecast | AI Prediction`
  },
  ar: {
    analysis: (symbol: string) => `${symbol} تحليل فني | رؤى السوق بالذكاء الاصطناعي`,
    trade: (symbol: string) => `${symbol} إعداد صفقة | نقاط الدخول والخروج`,
    trend: (symbol: string) => `${symbol} تحليل الاتجاه | قوة الاتجاه`,
    momentum: (symbol: string) => `${symbol} تحليل الزخم | RSI`,
    zones: (symbol: string) => `${symbol} المناطق الرئيسية | دعم ومقاومة`,
    volatility: (symbol: string) => `${symbol} التقلبات | ATR`,
    calculator: (symbol: string) => `${symbol} حاسبة حجم المركز | إدارة المخاطر`,
    indicator: (symbol: string) => `${symbol} المؤشرات الفنية`,
    forecast: (symbol: string) => `${symbol} توقعات السعر | توقع الذكاء الاصطناعي`
  }
};
// app/lib/translations.ts

// ============================================================
// TOOL DESCRIPTIONS (for meta description tags)
// ============================================================


export const commonTranslations = {
  en: {
    refresh: "Refresh",
    refreshing: "Refreshing...",
    retry: "Retry",
    updated: "Updated",
    systemStatus: "System Status: Online",
    currentPriceAction: "Current Price Action",
    
    // Analysis Tool
    marketMatrix: "Matrix",
    fullMarketStructure: "Full Market Structure Deconstruction",
    trendArchitecture: "Trend Architecture",
    structureMode: "Structure Mode",
    strength: "Strength",
    marketThermal: "Market Thermal",
    velocityBias: "Velocity Bias",
    divergence: "Divergence",
    slopeAngle: "Slope Angle",
    volatilityRegime: "Volatility Regime",
    atrDaily: "ATR (Daily)",
    historicalAvg: "Historical Avg",
    rangeStatus: "Range Status",
    recStop: "Rec. Stop",
    liquidityStatus: "Liquidity Status",
    diagnosticReport: "Diagnostic System Report",
    algorithmFinalVerdict: "Algorithm Final Verdict",
    aiValidationTitle: "Is this setup confirmed right now?",
    aiValidationDesc: "This report is based on H1/H4 market structure. For Scalping entries (M5/M15) or News validation, you need real-time confirmation.",
    aiValidationLink: "Validate this trade with AI Analyst",
    receiveLiveUpdates: "Receive live updates when market structure shifts.",
    
    // Calculator Tool
    intelligentRisk: "Intelligent Risk",
    safetyStops: "Safety Stops",
    calculatedLive: "Calculated live using institutional volatility data. Current Market Volatility (ATR):",
    buying: "Buying",
    selling: "Selling",
    stopLossBelow: "Stop Loss Below",
    stopLossAbove: "Stop Loss Above",
    scalp: "Scalp",
    scalpDesc: "Tight Protection",
    dayTrade: "Day Trade",
    dayTradeDesc: "Standard Risk",
    swing: "Swing",
    swingDesc: "Deep Protection",
    valuesUpdateDynamically: "Values update dynamically. Recheck before entering.",
    unlockPremium: "UNLOCK PREMIUM",
    
    // Forecast Tool
    aiPredictiveModel: "AI Predictive Model",
    forecast: "Forecast",
    pricePrediction: "Price Prediction",
    probabilityMatrix: "Probability Matrix",
    dataIntegrity: "Data Integrity",
    trendQuality: "Trend Quality",
    volatility: "Volatility",
    momentumBias: "Momentum Bias",
    zoneClarity: "Zone Clarity",
    validation: "Validation",
    validated: "Validated",
    needsReview: "Needs Review",
    score: "Score",
    finalAlgorithmDecision: "Final Algorithm Decision",
    
    // Indicator Tool
    momentumScanner: "Momentum Scanner",
    rsiCheck: "RSI Check",
    institutionalMomentumAnalysis: "Institutional momentum analysis measuring overbought/oversold conditions using RSI(14) logic.",
    relativeStrengthIndex: "Relative Strength Index (RSI)",
    technicalContext: "Technical Context",
    trendBias: "Trend Bias",
    velocityStrength: "Velocity Strength",
    divergenceDetected: "Divergence",
    
    // Momentum Tool
    kineticEnergy: "Kinetic Energy",
    momentum: "Momentum",
    oscillatorHealth: "Oscillator Health & Buying Velocity Analysis",
    rsiHeatmap: "RSI Heatmap",
    reading: "READING",
    oversold: "Oversold (30)",
    equilibrium: "Equilibrium (50)",
    overbought: "Overbought (70)",
    trendAlignment: "Trend Alignment",
    slopeVelocity: "Slope Velocity",
    hot: "Hot",
    cool: "Cool",
    neutral: "Neutral",
    velocityAnalysisReport: "Velocity Analysis Report",
    
    // Trade Tool
    activeSignalFound: "Active Signal Found",
    orderTicket: "Order Ticket",
    entryPrice: "Entry Price",
    takeProfit: "TAKE PROFIT",
    stopLoss: "STOP LOSS",
    targetLevels: "Target Levels",
    tpSafe: "TP 1 (Safe)",
    tpSwing: "TP 2 (Swing)",
    tpAggressive: "TP 3 (Aggressive)",
    signalStrength: "Signal Strength",
    riskCalculator: "Risk Calculator",
    riskRewardRatio: "Risk / Reward Ratio",
    pipsAtRisk: "Pips at Risk",
    targetGain: "Target Gain",
    setupAnalysis: "Setup Analysis",
    analysisNotAvailable: "Analysis not available",
    analysisNotAvailableDesc: (symbol: string) => `We couldn't load analysis data for ${symbol}. Please try another symbol or refresh the page.`,

    // Trend Tool
    algoTrendEngine: "Algo Trend Engine",
    strengthMeter: "Strength Meter",
    emaStructure: "EMA Structure",
    position: "Position",
    emaFast: "EMA 8 (Fast)",
    emaBaseline: "EMA 21 (Baseline)",
    emaMacro: "EMA 50 (Macro)",
    trackSymbol: "Track",
    technicalAnalysisReport: "Technical Analysis Report",
    finalVerdict: "FINAL VERDICT",

    // Volatility Tool
    marketPhysicsEngine: "Market Physics Engine",
    volatilityAnalysis: "Volatility Analysis",
    impliedRiskScore: "Implied Risk Score",
    compressedSafe: "Compressed (Safe)",
    explosiveRisk: "Explosive (Risk)",
    avgRangeCapability: "Avg Range Capability",
    recommendedStop: "Recommended Stop",
    regime: "Regime",
    volatilityRiskReport: "Volatility Risk Report",
    riskAdaptationProtocol: "Risk Adaptation Protocol",
    
    // Zones Tool
    institutionalLevels: "Institutional Levels",
    zones: "ZONES",
    rangeMap: "RANGE MAP",
    quality: "Quality",
    res: "RES",
    sup: "SUP",
    status: "Status",
    spread: "Spread",
    strategy: "Strategy",
    shortLimit: "SHORT Limit",
    longLimit: "LONG Limit",
    institutionalLevelsBreakdown: "Institutional Levels Breakdown",
    currentPriceLocation: "Current Price Location",
    tradingDirective: "Trading Directive",
    limitSellOrder: "Limit Sell Order",
    limitBuyOrder: "Limit Buy Order",
    standAside: "Stand Aside",
    premiumBlur: "●●●●●"
  },
  ar: {
    refresh: "تحديث",
    refreshing: "جاري التحديث...",
    retry: "إعادة المحاولة",
    updated: "آخر تحديث",
    systemStatus: "حالة النظام: متصل",
    currentPriceAction: "حركة السعر الحالية",
    
    // Analysis Tool
    marketMatrix: "مصفوفة السوق",
    fullMarketStructure: "تحليل هيكلي كامل للسوق",
    trendArchitecture: "بنية الاتجاه",
    structureMode: "نمط الهيكل",
    strength: "القوة",
    marketThermal: "حرارة السوق",
    velocityBias: "انحياز السرعة",
    divergence: "الانحراف (Divergence)",
    slopeAngle: "زاوية الانحدار",
    volatilityRegime: "نظام التقلب",
    atrDaily: "ATR (يومي)",
    historicalAvg: "المتوسط التاريخي",
    rangeStatus: "حالة النطاق",
    recStop: "الوقف المقترح",
    liquidityStatus: "حالة السيولة",
    diagnosticReport: "تقرير التشخيص الفني",
    algorithmFinalVerdict: "الحكم النهائي للخوارزمية",
    aiValidationTitle: "هل هذا الإعداد مؤكد حالياً؟",
    aiValidationDesc: "هذا التقرير يعتمد على هيكل السوق (H1/H4). لمداخل المضاربة (M5/M15) أو تأكيد الأخبار، تحتاج إلى تأكيد لحظي.",
    aiValidationLink: "تأكيد الصفقة عبر محلل الذكاء الاصطناعي",
    receiveLiveUpdates: "تلقي تحديثات فورية عند تغير هيكل السوق.",
    
    // Calculator Tool
    intelligentRisk: "المخاطرة الذكية",
    safetyStops: "مستويات وقف الأمان",
    calculatedLive: "محسوب لحظياً بناءً على بيانات التقلب المؤسسية. تقلب السوق الحالي (ATR):",
    buying: "شراء (Long)",
    selling: "بيع (Short)",
    stopLossBelow: "وقف الخسارة أسفل",
    stopLossAbove: "وقف الخسارة أعلى",
    scalp: "مضاربة (Scalp)",
    scalpDesc: "حماية ضيقة",
    dayTrade: "تداول يومي",
    dayTradeDesc: "مخاطرة معيارية",
    swing: "تداول متأرجح (Swing)",
    swingDesc: "حماية عميقة",
    valuesUpdateDynamically: "القيم تتحدث ديناميكياً. أعد الفحص قبل الدخول.",
    unlockPremium: "فتح النسخة الممتازة",
    
    // Forecast Tool
    aiPredictiveModel: "نموذج التنبؤ الرقمي",
    forecast: "التوقعات",
    pricePrediction: "توقع السعر",
    probabilityMatrix: "مصفوفة الاحتمالات",
    dataIntegrity: "سلامة البيانات",
    trendQuality: "جودة الاتجاه",
    volatility: "التقلبات",
    momentumBias: "انحياز الزخم",
    zoneClarity: "وضوح المناطق",
    validation: "التحقق",
    validated: "تم التحقق",
    needsReview: "يحتاج مراجعة",
    score: "الدرجة",
    finalAlgorithmDecision: "قرار الخوارزمية النهائي",
    
    // Indicator Tool
    momentumScanner: "ماسح الزخم",
    rsiCheck: "فحص مؤشر RSI",
    institutionalMomentumAnalysis: "تحليل الزخم المؤسسي لقياس مستويات ذروة الشراء والبيع باستخدام منطق RSI(14).",
    relativeStrengthIndex: "مؤشر القوة النسبية (RSI)",
    technicalContext: "السياق الفني",
    trendBias: "انحياز الاتجاه",
    velocityStrength: "قوة السرعة",
    divergenceDetected: "الانحراف (Divergence)",
    
    // Momentum Tool
    kineticEnergy: "الطاقة الحركية",
    momentum: "الزخم",
    oscillatorHealth: "صحة المؤشر وتحليل سرعة الشراء",
    rsiHeatmap: "خريطة حرارة RSI",
    reading: "القراءة",
    oversold: "تشبع بيعي (30)",
    equilibrium: "نقطة التعادل (50)",
    overbought: "تشبع شرائي (70)",
    trendAlignment: "توافق الاتجاه",
    slopeVelocity: "سرعة الانحدار",
    hot: "ساخن",
    cool: "بارد",
    neutral: "محايد",
    velocityAnalysisReport: "تقرير تحليل السرعة",
    
    // Trade Tool
    activeSignalFound: "تم العثور على إشارة نشطة",
    orderTicket: "تذكرة التنفيذ",
    entryPrice: "سعر الدخول",
    takeProfit: "أهداف الربح (TP)",
    stopLoss: "وقف الخسارة (SL)",
    targetLevels: "المستويات المستهدفة",
    tpSafe: "هدف آمن (TP 1)",
    tpSwing: "هدف متأرجح (TP 2)",
    tpAggressive: "هدف طموح (TP 3)",
    signalStrength: "قوة الإشارة",
    riskCalculator: "حاسبة المخاطر",
    riskRewardRatio: "نسبة العائد إلى المخاطرة",
    pipsAtRisk: "النقاط المعرضة للمخاطرة",
    targetGain: "الربح المستهدف",
    setupAnalysis: "تحليل الإعداد",
    
    // Trend Tool
    algoTrendEngine: "محرك الاتجاه الرقمي",
    strengthMeter: "مقياس القوة",
    emaStructure: "هيكل المتوسطات (EMA)",
    position: "تمركز السعر",
    emaFast: "EMA 8 (سريع)",
    emaBaseline: "EMA 21 (أساسي)",
    emaMacro: "EMA 50 (كلي)",
    trackSymbol: "تتبع",
    technicalAnalysisReport: "تقرير التحليل الفني",
    finalVerdict: "الحكم النهائي",
    
    // Volatility Tool
    marketPhysicsEngine: "محرك فيزياء السوق",
    volatilityAnalysis: "تحليل التقلبات",
    impliedRiskScore: "درجة المخاطر الضمنية",
    compressedSafe: "مضغوط (آمن)",
    explosiveRisk: "انفجاري (خطر)",
    avgRangeCapability: "متوسط المدى المتاح",
    recommendedStop: "الوقف الموصى به",
    regime: "نمط التقلب",
    volatilityRiskReport: "تقرير مخاطر التقلبات",
    riskAdaptationProtocol: "بروتوكول تكييف المخاطر",
    
    // Zones Tool
    institutionalLevels: "المستويات المؤسسية",
    zones: "المناطق (Zones)",
    rangeMap: "خريطة النطاق",
    quality: "الجودة",
    res: "مقاومة (RES)",
    sup: "دعم (SUP)",
    status: "الحالة",
    spread: "الفارق (Spread)",
    strategy: "الاستراتيجية",
    shortLimit: "أمر بيع معلق (Short)",
    longLimit: "أمر شراء معلق (Long)",
    institutionalLevelsBreakdown: "تفصيل المستويات المؤسسية",
    currentPriceLocation: "تمركز السعر الحالي",
    tradingDirective: "توجيهات التداول",
    limitSellOrder: "أمر بيع محدد",
    limitBuyOrder: "أمر شراء محدد",
    standAside: "البقاء خارج السوق",
    premiumBlur: "●●●●●"
  }
};