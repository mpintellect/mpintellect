// app/lib/translations.ts

export type Locale = 'en' | 'ar';

// Tool URL mapping
export const toolMapping = {
  en: {
    analysis: "analysis",
    trade: "trade",
    trend: "trend",
    momentum: "momentum",
    zones: "zones",
    volatility: "volatility",
    calculator: "calculator",
    indicator: "indicator",
    forecast: "forecast"
  },
  ar: {
    // Use English tool names in URLs for both languages
    analysis: "analysis",  // NOT "تحليل"
    trade: "trade",        // NOT "تنفيذ"
    trend: "trend",        // NOT "اتجاه"
    momentum: "momentum",  // NOT "زخم"
    zones: "zones",        // NOT "مناطق"
    volatility: "volatility", // NOT "تقلبات"
    calculator: "calculator", // NOT "حاسبة"
    indicator: "indicator",   // NOT "مؤشرات"
    forecast: "forecast"      // NOT "توقعات"
  }
};

// Tool display names (for UI)
export const toolDisplay = {
  en: {
    analysis: "Analysis",
    trade: "Trade",
    trend: "Trend",
    momentum: "Momentum",
    zones: "Zones",
    volatility: "Volatility",
    calculator: "Calculator",
    indicator: "Indicator",
    forecast: "Forecast"
  },
  ar: {
    analysis: "تحليل",
    trade: "تنفيذ",
    trend: "اتجاه",
    momentum: "زخم",
    zones: "مناطق",
    volatility: "تقلبات",
    calculator: "حاسبة",
    indicator: "مؤشرات",
    forecast: "توقعات"
  }
};

// SEO titles
export const toolSeo = {
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

// Tool descriptions for meta tags
export const toolDescriptions = {
  en: {
    analysis: (symbol: string) => `Live AI-powered technical analysis for ${symbol}. Get real-time trend, momentum, volatility and market structure insights.`,
    trade: (symbol: string) => `Professional trade setup for ${symbol} with entry levels, take profit, and stop loss. AI-powered risk management.`,
    trend: (symbol: string) => `${symbol} trend analysis with institutional strength score. Real-time trend direction and momentum confirmation.`,
    momentum: (symbol: string) => `${symbol} momentum analysis with RSI, divergence detection, and velocity metrics. AI-powered market thermal reading.`,
    zones: (symbol: string) => `${symbol} key support and resistance zones. Institutional supply and demand levels for precise entries.`,
    volatility: (symbol: string) => `${symbol} volatility regime analysis with ATR, range status, and optimal stop placement.`,
    calculator: (symbol: string) => `${symbol} position size calculator based on risk tolerance. Professional risk management tool.`,
    indicator: (symbol: string) => `Complete technical indicators dashboard for ${symbol} including EMAs, RSI, ATR, and pivot levels.`,
    forecast: (symbol: string) => `${symbol} AI price forecast with confidence score. Short-term price predictions based on institutional data.`
  },
  ar: {
    analysis: (symbol: string) => `تحليل فني مباشر بالذكاء الاصطناعي لـ ${symbol}. احصل على رؤى فورية حول اتجاه السوق والزخم والتقلبات وهيكل السوق.`,
    trade: (symbol: string) => `إعداد صفقة احترافي لـ ${symbol} مع مستويات الدخول وجني الأرباح ووقف الخسارة. إدارة مخاطر بالذكاء الاصطناعي.`,
    trend: (symbol: string) => `تحليل اتجاه ${symbol} مع درجة القوة المؤسسية. اتجاه فوري وتأكيد الزخم.`,
    momentum: (symbol: string) => `تحليل زخم ${symbol} مع RSI واكتشاف التباعد ومقاييس السرعة. قراءة حرارة السوق بالذكاء الاصطناعي.`,
    zones: (symbol: string) => `مناطق الدعم والمقاومة الرئيسية لـ ${symbol}. مستويات العرض والطلب المؤسسية لدخول دقيق.`,
    volatility: (symbol: string) => `تحليل نظام التقلب لـ ${symbol} مع ATR وحالة النطاق ووضع الوقف الأمثل.`,
    calculator: (symbol: string) => `حاسبة حجم المركز لـ ${symbol} بناءً على تحمل المخاطر. أداة احترافية لإدارة المخاطر.`,
    indicator: (symbol: string) => `لوحة تحكم المؤشرات الفنية الكاملة لـ ${symbol} بما في ذلك EMAs و RSI و ATR ومستويات المحور.`,
    forecast: (symbol: string) => `توقعات سعر ${symbol} بالذكاء الاصطناعي مع درجة الثقة. توقعات سعرية قصيرة المدى بناءً على بيانات مؤسسية.`
  }
};

// Loading texts for each tool
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

// Error titles for each tool
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

// Common UI translations
export const commonTranslations = {
  en: {
    // Common
    refresh: "Refresh",
    refreshing: "Refreshing...",
    retry: "Retry",
    updated: "Updated",
    
    // Headers
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
    relativeStrengthIndex: "Relative Strength Index (14)",
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
    
    // Premium blur text
    premiumBlur: "●●●●●"
  },
  ar: {
    // Common
    refresh: "تحديث",
    refreshing: "جاري التحديث...",
    retry: "إعادة المحاولة",
    updated: "آخر تحديث",
    
    // Headers
    systemStatus: "حالة النظام: متصل",
    currentPriceAction: "حركة السعر الحالية",
    
    // Analysis Tool
    marketMatrix: "ماتريكس",
    fullMarketStructure: "تحليل كامل لهيكل السوق",
    trendArchitecture: "هيكل الاتجاه",
    structureMode: "وضع الهيكل",
    strength: "القوة",
    marketThermal: "حرارة السوق",
    velocityBias: "انحياز السرعة",
    divergence: "التباعد",
    slopeAngle: "زاوية الانحدار",
    volatilityRegime: "نظام التقلب",
    atrDaily: "ATR (يومي)",
    historicalAvg: "المتوسط التاريخي",
    rangeStatus: "حالة النطاق",
    recStop: "وقف موصى به",
    liquidityStatus: "حالة السيولة",
    diagnosticReport: "تقرير التشخيص",
    algorithmFinalVerdict: "الحكم النهائي للخوارزم",
    aiValidationTitle: "هل هذا الإعداد مؤكد الآن؟",
    aiValidationDesc: "هذا التقرير مبني على هيكل السوق H1/H4. لدخول المضاربة (M5/M15) أو التحقق من الأخبار، تحتاج إلى تأكيد فوري.",
    aiValidationLink: "تحقق من هذه الصفقة مع محلل الذكاء الاصطناعي",
    receiveLiveUpdates: "احصل على تحديثات فورية عندما يتغير هيكل السوق.",
    
    // Calculator Tool
    intelligentRisk: "المخاطرة الذكية",
    safetyStops: "وقف الأمان",
    calculatedLive: "محسوب مباشرة باستخدام بيانات التقلب المؤسسية. تقلب السوق الحالي (ATR):",
    buying: "شراء",
    selling: "بيع",
    stopLossBelow: "وقف الخسارة أسفل",
    stopLossAbove: "وقف الخسارة أعلى",
    scalp: "مضاربة",
    scalpDesc: "حماية ضيقة",
    dayTrade: "تداول يومي",
    dayTradeDesc: "مخاطرة قياسية",
    swing: "متأرجح",
    swingDesc: "حماية عميقة",
    valuesUpdateDynamically: "القيم تتحدث ديناميكياً. أعد التحقق قبل الدخول.",
    unlockPremium: "فتح المميزات",
    
    // Forecast Tool
    aiPredictiveModel: "نموذج التنبؤ بالذكاء الاصطناعي",
    forecast: "توقعات",
    pricePrediction: "توقع السعر",
    probabilityMatrix: "مصفوفة الاحتمالات",
    dataIntegrity: "سلامة البيانات",
    trendQuality: "جودة الاتجاه",
    volatility: "التقلب",
    momentumBias: "انحياز الزخم",
    zoneClarity: "وضوح المنطقة",
    validation: "التحقق",
    validated: "موثق",
    needsReview: "بحاجة للمراجعة",
    score: "النتيجة",
    finalAlgorithmDecision: "قرار الخوارزم النهائي",
    
    // Indicator Tool
    momentumScanner: "ماسح الزخم",
    rsiCheck: "فحص RSI",
    institutionalMomentumAnalysis: "تحليل زخم مؤسسي يقيس ظروف ذروة الشراء والبيع باستخدام منطق RSI(14).",
    relativeStrengthIndex: "مؤشر القوة النسبية (14)",
    technicalContext: "السياق الفني",
    trendBias: "انحياز الاتجاه",
    velocityStrength: "قوة السرعة",
    divergenceDetected: "التباعد",
    
    // Momentum Tool
    kineticEnergy: "الطاقة الحركية",
    momentum: "الزخم",
    oscillatorHealth: "صحة المؤشر وسرعة الشراء",
    rsiHeatmap: "خريطة حرارة RSI",
    reading: "القراءة",
    oversold: "تشبع بيعي (30)",
    equilibrium: "توازن (50)",
    overbought: "تشبع شرائي (70)",
    trendAlignment: "توافق الاتجاه",
    slopeVelocity: "سرعة الانحدار",
    hot: "ساخن",
    cool: "بارد",
    neutral: "محايد",
    velocityAnalysisReport: "تقرير تحليل السرعة",
    
    // Trade Tool
    activeSignalFound: "إشارة نشطة تم اكتشافها",
    orderTicket: "تذكرة الأمر",
    entryPrice: "سعر الدخول",
    takeProfit: "جني الأرباح",
    stopLoss: "وقف الخسارة",
    targetLevels: "المستويات المستهدفة",
    tpSafe: "الهدف 1 (آمن)",
    tpSwing: "الهدف 2 (متأرجح)",
    tpAggressive: "الهدف 3 (عدواني)",
    signalStrength: "قوة الإشارة",
    riskCalculator: "حاسبة المخاطرة",
    riskRewardRatio: "نسبة المخاطرة/المكافأة",
    pipsAtRisk: "نقاط تحت المخاطرة",
    targetGain: "الربح المستهدف",
    setupAnalysis: "تحليل الإعداد",
    
    // Trend Tool
    algoTrendEngine: "محرك اتجاه الخوارزم",
    strengthMeter: "مقياس القوة",
    emaStructure: "هيكل EMA",
    position: "الموقع",
    emaFast: "EMA 8 (سريع)",
    emaBaseline: "EMA 21 (خط الأساس)",
    emaMacro: "EMA 50 (كلي)",
    trackSymbol: "تتبع",
    technicalAnalysisReport: "تقرير التحليل الفني",
    finalVerdict: "الحكم النهائي",
    
    // Volatility Tool
    marketPhysicsEngine: "محرك فيزياء السوق",
    volatilityAnalysis: "تحليل التقلب",
    impliedRiskScore: "درجة المخاطرة الضمنية",
    compressedSafe: "مضغوط (آمن)",
    explosiveRisk: "متفجر (خطر)",
    avgRangeCapability: "قدرة المدى المتوسط",
    recommendedStop: "وقف موصى به",
    regime: "النظام",
    volatilityRiskReport: "تقرير مخاطر التقلب",
    riskAdaptationProtocol: "بروتوكول تكييف المخاطر",
    
    // Zones Tool
    institutionalLevels: "المستويات المؤسسية",
    zones: "المناطق",
    rangeMap: "خريطة النطاق",
    quality: "الجودة",
    res: "مقاومة",
    sup: "دعم",
    status: "الحالة",
    spread: "الانتشار",
    strategy: "الاستراتيجية",
    shortLimit: "أمر بيع محدد",
    longLimit: "أمر شراء محدد",
    institutionalLevelsBreakdown: "تفصيل المستويات المؤسسية",
    currentPriceLocation: "موقع السعر الحالي",
    tradingDirective: "توجيه التداول",
    limitSellOrder: "أمر بيع محدد",
    limitBuyOrder: "أمر شراء محدد",
    standAside: "الوقوف جانباً",
    
    // Premium blur text
    premiumBlur: "●●●●●"
  }
};

// Helper to get translations based on locale
export const getTranslation = (locale: Locale) => commonTranslations[locale];