(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/mzprimer-nextjs-v1 /data/symbols.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// data/symbols.ts
__turbopack_context__.s([
    "CONTRACT_SIZES",
    ()=>CONTRACT_SIZES,
    "DISPLAY_NAMES",
    ()=>DISPLAY_NAMES,
    "SYMBOLS",
    ()=>SYMBOLS
]);
const SYMBOLS = [
    "EURUSD",
    "GBPUSD",
    "USDJPY",
    "USDCAD",
    "AUDUSD",
    "NZDUSD",
    "USDCHF",
    "XAUUSD",
    "XAUEUR",
    "XAGUSD",
    "PLATINUM",
    "BRENT",
    "BTCUSD",
    "ETHUSD",
    "XRPUSD",
    "DOGEUSD",
    "LTCUSD",
    "US500",
    "USTEC",
    "US30",
    "HK50",
    "FRANCE40",
    "CHINA50",
    "UK100",
    "EURJPY",
    "EURGBP",
    "GBPJPY",
    "GBPCHF"
];
const DISPLAY_NAMES = {
    EURUSD: "EUR/USD (Euro / US Dollar)",
    GBPUSD: "GBP/USD (British Pound / US Dollar)",
    USDJPY: "USD/JPY (US Dollar / Japanese Yen)",
    USDCAD: "USD/CAD (US Dollar / Canadian Dollar)",
    AUDUSD: "AUD/USD (Australian Dollar / US Dollar)",
    NZDUSD: "NZD/USD (New Zealand Dollar / US Dollar)",
    USDCHF: "USD/CHF (US Dollar / Swiss Franc)",
    XAUUSD: "XAU/USD (Gold / US Dollar)",
    XAUEUR: "XAU/EUR (Gold / Euro)",
    XAGUSD: "XAG/USD (Silver / US Dollar)",
    PLATINUM: "XPT/USD (Platinum / US Dollar)",
    BRENT: "US Crude Oil",
    BTCUSD: "BTC/USD (Bitcoin / US Dollar)",
    ETHUSD: "ETH/USD (Ethereum / US Dollar)",
    XRPUSD: "XRP/USD (Ripple / US Dollar)",
    DOGEUSD: "DGE/USD (Dogecoin / US Dollar)",
    LTCUSD: "LTC/USD (Litecoin / US Dollar)",
    US500: "S&P 500 Index (US)",
    USTEC: "NASDAQ 100 Index (US)",
    US30: "Dow Jones 30 Index (US).com Inc.",
    HK50: "Hong Kong 50 stock index Index (Europe) PLC",
    FRANCE40: "FRANCE40 Index (France)",
    CHINA50: "GER40 Index (DAX)",
    UK100: "UK100 Index (FTSE)",
    EURJPY: "EUR/JPY (Euro / Japanese Yen)",
    EURGBP: "EUR/GBP (Euro / British Pound)",
    GBPJPY: "GBP/JPY (British Pound / Japanese Yen)",
    GBPCHF: "GBP/CHF (British Pound / Swiss Franc)"
};
const CONTRACT_SIZES = {
    // === Forex Pairs ===
    EURUSD: {
        contract: 100000,
        pip: 0.0001
    },
    GBPUSD: {
        contract: 100000,
        pip: 0.0001
    },
    USDJPY: {
        contract: 100000,
        pip: 0.01
    },
    USDCAD: {
        contract: 100000,
        pip: 0.0001
    },
    AUDUSD: {
        contract: 100000,
        pip: 0.0001
    },
    NZDUSD: {
        contract: 100000,
        pip: 0.0001
    },
    USDCHF: {
        contract: 100000,
        pip: 0.0001
    },
    EURJPY: {
        contract: 100000,
        pip: 0.01
    },
    EURGBP: {
        contract: 100000,
        pip: 0.0001
    },
    GBPJPY: {
        contract: 100000,
        pip: 0.01
    },
    GBPCHF: {
        contract: 100000,
        pip: 0.0001
    },
    // === Commodities ===
    XAUUSD: {
        contract: 100,
        pip: 0.1
    },
    XAUEUR: {
        contract: 100,
        pip: 0.1
    },
    XAGUSD: {
        contract: 5000,
        pip: 0.01
    },
    PLATINUM: {
        contract: 100,
        pip: 0.1
    },
    BRENT: {
        contract: 1000,
        pip: 0.01
    },
    // === Cryptocurrencies ===
    BTCUSD: {
        contract: 1,
        pip: 0.5
    },
    ETHUSD: {
        contract: 1,
        pip: 0.1
    },
    XRPUSD: {
        contract: 1000,
        pip: 0.0001
    },
    DOGEUSD: {
        contract: 1000,
        pip: 0.0001
    },
    LTCUSD: {
        contract: 1,
        pip: 0.01
    },
    // === Indices ===
    US500: {
        contract: 10,
        pip: 0.1
    },
    USTEC: {
        contract: 10,
        pip: 0.1
    },
    US30: {
        contract: 10,
        pip: 1
    },
    HK50: {
        contract: 10,
        pip: 1
    },
    FRANCE40: {
        contract: 10,
        pip: 1
    },
    CHINA50: {
        contract: 10,
        pip: 1
    },
    UK100: {
        contract: 10,
        pip: 1
    } // FTSE 100 (UK)
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UserAnalytics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/recharts/es6/chart/PieChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/recharts/es6/polar/Pie.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/recharts/es6/component/Cell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/recharts/es6/chart/AreaChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/recharts/es6/cartesian/Area.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$data$2f$symbols$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /data/symbols.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function UserAnalytics() {
    _s();
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [setups, setSetups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [selectedSymbol, setSelectedSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ALL");
    const [timeFilter, setTimeFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ALL");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserAnalytics.useEffect": ()=>{
            // Get user from localStorage (Cloudflare auth)
            const token = localStorage.getItem('cf_token');
            const userData = localStorage.getItem('cf_user');
            if (!token || !userData) {
                console.log("❌ No user authenticated");
                setLoading(false);
                return;
            }
            try {
                const user = JSON.parse(userData);
                setUserId(user.id);
                fetchSetups(user.id);
            } catch (error) {
                console.error("❌ Error parsing user data:", error);
                setLoading(false);
            }
        }
    }["UserAnalytics.useEffect"], []);
    const fetchSetups = async (userId)=>{
        try {
            console.log("🔍 Fetching setups for user:", userId);
            const response = await fetch(`/api/setups?userId=${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success && data.setups) {
                console.log("🔍 Fetched setups:", data.setups.length);
                // Transform the data to match our interface
                const transformedSetups = data.setups.map((setup)=>({
                        id: setup.id,
                        symbol: setup.symbol,
                        entryPrice: parseFloat(setup.entry_price),
                        takeProfit: parseFloat(setup.take_profit),
                        stopLoss: parseFloat(setup.stop_loss),
                        generatedAt: setup.generated_at || setup.created_at,
                        createdAt: setup.created_at,
                        status: setup.status,
                        capital: parseFloat(setup.capital) || 1000,
                        lotSize: parseFloat(setup.lot_size) || 0.01,
                        riskReward: parseFloat(setup.risk_reward) || 1.5,
                        userId: setup.user_id
                    }));
                setSetups(transformedSetups);
                setError("");
            } else {
                throw new Error(data.error || "Failed to fetch setups");
            }
        } catch (error) {
            console.error("❌ Error fetching setups:", error);
            setError(`Failed to load data: ${error.message}`);
        } finally{
            setLoading(false);
        }
    };
    // Helper function to get timestamp from setup
    const getSetupTimestamp = (setup)=>{
        try {
            return new Date(setup.generatedAt || setup.createdAt).getTime();
        } catch  {
            return Date.now();
        }
    };
    // Filter setups based on selected symbol and time
    const filteredSetups = setups.filter((setup)=>{
        const symbolMatch = selectedSymbol === "ALL" || setup.symbol === selectedSymbol;
        if (timeFilter === "ALL") return symbolMatch;
        const setupDate = new Date(getSetupTimestamp(setup));
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - setupDate.getTime());
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (timeFilter === "WEEK") return symbolMatch && diffDays <= 7;
        if (timeFilter === "MONTH") return symbolMatch && diffDays <= 30;
        return symbolMatch;
    });
    // ==================== PROFIT/LOSS CALCULATIONS ====================
    const calculateProfitLoss = ()=>{
        let totalProfit = 0;
        let totalLoss = 0;
        let largestWin = 0;
        let largestLoss = 0;
        const completedTrades = filteredSetups.filter((s)=>s.status === "hit_tp" || s.status === "hit_sl");
        completedTrades.forEach((setup)=>{
            const contractSize = __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$data$2f$symbols$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONTRACT_SIZES"][setup.symbol]?.contract || 100000;
            if (setup.status === "hit_tp") {
                const priceDifference = Math.abs(setup.takeProfit - setup.entryPrice);
                const tradeProfit = priceDifference * setup.lotSize * contractSize;
                totalProfit += tradeProfit;
                largestWin = Math.max(largestWin, tradeProfit);
            } else if (setup.status === "hit_sl") {
                const priceDifference = Math.abs(setup.entryPrice - setup.stopLoss);
                const tradeLoss = priceDifference * setup.lotSize * contractSize;
                totalLoss += tradeLoss;
                largestLoss = Math.max(largestLoss, tradeLoss);
            }
        });
        const netProfit = totalProfit - totalLoss;
        const profitPerTrade = completedTrades.length > 0 ? netProfit / completedTrades.length : 0;
        const totalCapital = filteredSetups.reduce((sum, setup)=>sum + (setup.capital || 0), 0);
        const roi = totalCapital > 0 ? netProfit / totalCapital * 100 : 0;
        const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
        return {
            totalProfit,
            totalLoss,
            netProfit,
            profitPerTrade,
            roi,
            largestWin,
            largestLoss,
            profitFactor
        };
    };
    const profitLossData = calculateProfitLoss();
    // ==================== ANALYTICS CALCULATIONS ====================
    // Basic Stats
    const totalSetups = filteredSetups.length;
    const pendingSetups = filteredSetups.filter((s)=>s.status === "pending").length;
    const tpHitSetups = filteredSetups.filter((s)=>s.status === "hit_tp").length;
    const slHitSetups = filteredSetups.filter((s)=>s.status === "hit_sl").length;
    const expiredSetups = filteredSetups.filter((s)=>s.status === "expired").length;
    const completedTrades = tpHitSetups + slHitSetups;
    const winRate = completedTrades > 0 ? tpHitSetups / completedTrades * 100 : 0;
    // Trading Volume Analysis
    const totalLots = filteredSetups.reduce((sum, setup)=>sum + (setup.lotSize || 0), 0);
    const avgLotSize = totalSetups > 0 ? totalLots / totalSetups : 0;
    const totalCapital = filteredSetups.reduce((sum, setup)=>sum + (setup.capital || 0), 0);
    const avgCapital = totalSetups > 0 ? totalCapital / totalSetups : 0;
    // Symbol Analysis
    const symbolUsage = Object.entries(filteredSetups.reduce((acc, cur)=>{
        acc[cur.symbol] = (acc[cur.symbol] || 0) + 1;
        return acc;
    }, {})).map(([symbol, count])=>({
            symbol,
            count
        }));
    const topSymbol = symbolUsage.sort((a, b)=>b.count - a.count)[0]?.symbol || "N/A";
    // Risk Analysis
    const avgRiskReward = totalSetups > 0 ? filteredSetups.reduce((sum, setup)=>sum + (setup.riskReward || 1), 0) / totalSetups : 1;
    const highRiskSetups = filteredSetups.filter((s)=>(s.riskReward || 1) > 2).length;
    const lowRiskSetups = filteredSetups.filter((s)=>(s.riskReward || 1) < 1.5).length;
    // Time-based Analysis
    const setupsByHour = Array.from({
        length: 24
    }, (_, hour)=>{
        const hourSetups = filteredSetups.filter((setup)=>{
            try {
                const setupDate = new Date(getSetupTimestamp(setup));
                return setupDate.getHours() === hour;
            } catch  {
                return false;
            }
        });
        return {
            hour: `${hour}:00`,
            count: hourSetups.length
        };
    });
    // Profit/Loss by Symbol
    const profitBySymbol = symbolUsage.map((symbolData)=>{
        const symbolSetups = filteredSetups.filter((s)=>s.symbol === symbolData.symbol);
        const symbolProfit = symbolSetups.reduce((sum, setup)=>{
            const contractSize = __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$data$2f$symbols$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONTRACT_SIZES"][setup.symbol]?.contract || 100000;
            if (setup.status === "hit_tp") {
                const priceDifference = Math.abs(setup.takeProfit - setup.entryPrice);
                return sum + priceDifference * setup.lotSize * contractSize;
            } else if (setup.status === "hit_sl") {
                const priceDifference = Math.abs(setup.entryPrice - setup.stopLoss);
                return sum - priceDifference * setup.lotSize * contractSize;
            }
            return sum;
        }, 0);
        return {
            symbol: symbolData.symbol,
            profit: symbolProfit,
            trades: symbolData.count
        };
    });
    // Monthly Profit/Loss Trend
    const monthlyProfit = filteredSetups.reduce((acc, setup)=>{
        try {
            const date = new Date(getSetupTimestamp(setup));
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            if (!acc[monthKey]) {
                acc[monthKey] = 0;
            }
            const contractSize = __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$data$2f$symbols$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONTRACT_SIZES"][setup.symbol]?.contract || 100000;
            if (setup.status === "hit_tp") {
                const priceDifference = Math.abs(setup.takeProfit - setup.entryPrice);
                acc[monthKey] += priceDifference * setup.lotSize * contractSize;
            } else if (setup.status === "hit_sl") {
                const priceDifference = Math.abs(setup.entryPrice - setup.stopLoss);
                acc[monthKey] -= priceDifference * setup.lotSize * contractSize;
            }
        } catch (error) {
            console.error("Error processing setup for monthly profit:", error);
        }
        return acc;
    }, {});
    const monthlyProfitData = Object.entries(monthlyProfit).map(([month, profit])=>({
            month,
            profit
        })).sort((a, b)=>a.month.localeCompare(b.month));
    // ==================== TRADING STYLE ANALYSIS ====================
    const analyzeTradingStyle = ()=>{
        if (totalSetups === 0) {
            return {
                type: "CONSERVATIVE",
                confidence: 0,
                description: "No trading data available",
                characteristics: [
                    "Start trading to discover your style"
                ]
            };
        }
        const characteristics = [];
        let score = {
            scalper: 0,
            dayTrader: 0,
            swingTrader: 0,
            aggressive: 0,
            conservative: 0
        };
        // Trading Frequency Analysis
        const setupsPerDay = totalSetups / 30;
        if (setupsPerDay > 3) {
            score.scalper += 3;
            characteristics.push("High frequency trading");
        } else if (setupsPerDay > 1) {
            score.dayTrader += 2;
            characteristics.push("Daily trading activity");
        } else {
            score.swingTrader += 2;
            characteristics.push("Swing trading pattern");
        }
        // Risk Analysis
        if (avgRiskReward > 2) {
            score.aggressive += 3;
            characteristics.push("High risk-reward preference");
        } else if (avgRiskReward < 1.5) {
            score.conservative += 2;
            characteristics.push("Conservative risk management");
        }
        // Profitability Analysis
        if (profitLossData.netProfit > 0) {
            score.conservative += 2;
            characteristics.push("Profitable trading strategy");
        } else if (profitLossData.netProfit < -totalCapital * 0.1) {
            score.aggressive += 1;
            characteristics.push("High risk tolerance");
        }
        // Lot Size Analysis
        if (avgLotSize > 2) {
            score.aggressive += 2;
            characteristics.push("Large position sizes");
        } else if (avgLotSize < 0.5) {
            score.conservative += 2;
            characteristics.push("Small position sizes");
        }
        // Win Rate Analysis
        if (winRate > 60) {
            score.conservative += 2;
            characteristics.push("High win rate strategy");
        } else if (winRate < 40) {
            score.aggressive += 1;
            characteristics.push("Lower win rate, high risk");
        }
        // Symbol Concentration
        if (symbolUsage.length <= 3 && totalSetups > 5) {
            score.scalper += 1;
            characteristics.push("Focused on few symbols");
        }
        // Determine primary style
        const maxScore = Math.max(...Object.values(score));
        const primaryStyle = Object.keys(score).find((key)=>score[key] === maxScore);
        const styleMap = {
            scalper: {
                type: "SCALPER"
            },
            dayTrader: {
                type: "DAY_TRADER"
            },
            swingTrader: {
                type: "SWING_TRADER"
            },
            aggressive: {
                type: "AGGRESSIVE"
            },
            conservative: {
                type: "CONSERVATIVE"
            }
        };
        const confidence = Math.min(100, Math.max(30, maxScore / 8 * 100));
        const descriptions = {
            SCALPER: "Quick, frequent trades with small profits",
            DAY_TRADER: "Daily trading with medium-term positions",
            SWING_TRADER: "Holding positions for several days",
            AGGRESSIVE: "High risk, high reward approach",
            CONSERVATIVE: "Careful risk management, steady gains"
        };
        const selectedType = styleMap[primaryStyle || "conservative"]?.type || "CONSERVATIVE";
        return {
            type: selectedType,
            confidence,
            description: descriptions[selectedType],
            characteristics
        };
    };
    const tradingStyle = analyzeTradingStyle();
    // ==================== CHART DATA ====================
    const statusData = [
        {
            name: "TP Hit",
            value: tpHitSetups,
            color: "#10B981"
        },
        {
            name: "SL Hit",
            value: slHitSetups,
            color: "#EF4444"
        },
        {
            name: "Pending",
            value: pendingSetups,
            color: "#FBBF24"
        },
        {
            name: "Expired",
            value: expiredSetups,
            color: "#6B7280"
        }
    ];
    const performanceData = [
        {
            metric: "Win Rate",
            value: winRate
        },
        {
            metric: "Avg Risk/Reward",
            value: avgRiskReward
        },
        {
            metric: "ROI",
            value: profitLossData.roi
        }
    ];
    // ==================== RENDER ====================
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "analytics-container",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "analytics-loading",
                children: "Loading analytics..."
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 433,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
            lineNumber: 432,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "analytics-container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "analytics-header",
                    children: "📊 Trading Analytics"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                    lineNumber: 441,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "error-message",
                    children: [
                        error,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: '1rem',
                                fontSize: '0.9rem',
                                color: '#6b7280'
                            },
                            children: "Please check if you have setup data."
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 444,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                    lineNumber: 442,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
            lineNumber: 440,
            columnNumber: 7
        }, this);
    }
    if (setups.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "analytics-container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "analytics-header",
                    children: "📊 Trading Analytics"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                    lineNumber: 455,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "no-data",
                    children: [
                        "No trading data available yet. Start using setups to see your analytics.",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 458,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                            style: {
                                color: '#6b7280',
                                marginTop: '0.5rem',
                                display: 'block'
                            },
                            children: [
                                "User ID: ",
                                userId || 'No user'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 459,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                    lineNumber: 456,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
            lineNumber: 454,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "analytics-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "analytics-header",
                children: "📊 Advanced Trading Analytics"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 469,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: '#1a1a1a',
                    padding: '0.5rem',
                    marginBottom: '1rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    textAlign: 'center'
                },
                children: [
                    "📊 Showing ",
                    filteredSetups.length,
                    " of ",
                    setups.length,
                    " total setups",
                    selectedSymbol !== "ALL" && ` • Filtered by: ${selectedSymbol}`,
                    timeFilter !== "ALL" && ` • Time: ${timeFilter.toLowerCase()}`
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 472,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "analytics-filters",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: selectedSymbol,
                        onChange: (e)=>setSelectedSymbol(e.target.value),
                        className: "filter-select",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "ALL",
                                children: "All Symbols"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 493,
                                columnNumber: 11
                            }, this),
                            symbolUsage.map((symbol)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: symbol.symbol,
                                    children: [
                                        symbol.symbol,
                                        " (",
                                        symbol.count,
                                        ")"
                                    ]
                                }, symbol.symbol, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 495,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 488,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: timeFilter,
                        onChange: (e)=>setTimeFilter(e.target.value),
                        className: "filter-select",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "ALL",
                                children: "All Time"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 506,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "MONTH",
                                children: "Last 30 Days"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 507,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "WEEK",
                                children: "Last 7 Days"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 508,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 501,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 487,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "metrics-grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "metric-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metric-value",
                                children: totalSetups
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 515,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metric-label",
                                children: "Total Setups"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 516,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 514,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "metric-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metric-value",
                                children: [
                                    winRate.toFixed(1),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 519,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metric-label",
                                children: "Win Rate"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 520,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 518,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "metric-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metric-value",
                                style: {
                                    color: profitLossData.netProfit >= 0 ? '#10B981' : '#EF4444'
                                },
                                children: [
                                    "$",
                                    profitLossData.netProfit > 0 ? '+' : '',
                                    profitLossData.netProfit.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 523,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metric-label",
                                children: "Net P&L"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 526,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 522,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "metric-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metric-value",
                                children: [
                                    profitLossData.roi.toFixed(1),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 529,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metric-label",
                                children: "ROI"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 530,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 528,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 513,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "profit-loss-grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "profit-loss-card positive",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-value",
                                children: [
                                    "+$",
                                    profitLossData.totalProfit.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 537,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-label",
                                children: "Total Profit"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 538,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 536,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "profit-loss-card negative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-value",
                                children: [
                                    "-$",
                                    profitLossData.totalLoss.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 541,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-label",
                                children: "Total Loss"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 542,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 540,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "profit-loss-card neutral",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-value",
                                children: profitLossData.profitFactor === Infinity ? "∞" : profitLossData.profitFactor.toFixed(2)
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 545,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-label",
                                children: "Profit Factor"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 546,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 544,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "profit-loss-card neutral",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-value",
                                children: [
                                    "$",
                                    profitLossData.profitPerTrade.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 549,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-label",
                                children: "Average P&L/Trade"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 550,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 548,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 535,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "trading-style-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        children: "🎯 Your Trading Style"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 556,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "style-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "style-type",
                                children: tradingStyle.type
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 558,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "style-confidence",
                                children: [
                                    tradingStyle.confidence.toFixed(0),
                                    "% Match"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 559,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 557,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "style-description",
                        children: tradingStyle.description
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 561,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "style-characteristics",
                        children: tradingStyle.characteristics.map((char, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "characteristic-tag",
                                children: char
                            }, index, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 564,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 562,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 555,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "analytics-grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "analytics-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Trade Outcomes"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 573,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                width: "100%",
                                height: 250,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PieChart"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pie"], {
                                            data: statusData,
                                            cx: "50%",
                                            cy: "50%",
                                            labelLine: false,
                                            label: ({ name, value, percent })=>`${name}: ${value} (${percent ? (percent * 100).toFixed(1) : '0.0'}%)`,
                                            outerRadius: 80,
                                            dataKey: "value",
                                            children: statusData.map((entry, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                                    fill: entry.color
                                                }, `cell-${index}`, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 588,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 576,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 591,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 575,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 574,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 572,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "analytics-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Profit by Symbol"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 598,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                width: "100%",
                                height: 250,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                                    data: profitBySymbol,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                            dataKey: "symbol"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 601,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 602,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            formatter: (value)=>[
                                                    `$${value.toFixed(2)}`,
                                                    "Profit"
                                                ],
                                            labelFormatter: (label)=>`Symbol: ${label}`
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 603,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                            dataKey: "profit",
                                            fill: "#8884d8",
                                            name: "Profit"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 607,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 600,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 599,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 597,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "analytics-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Monthly Profit Trend"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 618,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                width: "100%",
                                height: 250,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AreaChart"], {
                                    data: monthlyProfitData,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                            strokeDasharray: "3 3"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 621,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                            dataKey: "month"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 622,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 623,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            formatter: (value)=>[
                                                    `$${value.toFixed(2)}`,
                                                    "Profit"
                                                ],
                                            labelFormatter: (label)=>`Month: ${label}`
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 624,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Area"], {
                                            type: "monotone",
                                            dataKey: "profit",
                                            stroke: "#10B981",
                                            fill: "#10B981",
                                            fillOpacity: 0.3,
                                            name: "Monthly Profit"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 628,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 620,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 619,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 617,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "analytics-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Performance Metrics"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 642,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                width: "100%",
                                height: 250,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                                    data: performanceData,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                            dataKey: "metric"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 645,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 646,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            formatter: (value)=>[
                                                    `${value.toFixed(1)}`,
                                                    "Value"
                                                ]
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 647,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                            dataKey: "value",
                                            fill: "#F59E0B"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 648,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 644,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 643,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 641,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 570,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "stats-grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stats-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                children: "Risk Analysis"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 657,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stats-list",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Avg Risk/Reward:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 660,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    avgRiskReward.toFixed(2),
                                                    ":1"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 661,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                        lineNumber: 659,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "High Risk Trades:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 664,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: highRiskSetups
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 665,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                        lineNumber: 663,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Low Risk Trades:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 668,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: lowRiskSetups
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 669,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                        lineNumber: 667,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 658,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 656,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stats-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                children: "Symbol Analysis"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 675,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stats-list",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Most Traded:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 678,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: topSymbol
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 679,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                        lineNumber: 677,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Unique Symbols:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 682,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: symbolUsage.length
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 683,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                        lineNumber: 681,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Symbol Concentration:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 686,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    ((symbolUsage[0]?.count || 0) / totalSetups * 100).toFixed(1),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 687,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                        lineNumber: 685,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 676,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 674,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stats-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                children: "Volume Analysis"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 693,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stats-list",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Total Lots:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 696,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: totalLots.toFixed(2)
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 697,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                        lineNumber: 695,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Total Capital:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 700,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "$",
                                                    totalCapital.toFixed(0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 701,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                        lineNumber: 699,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Active Trades:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 704,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: pendingSetups
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 705,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                        lineNumber: 703,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 694,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 692,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 655,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "performance-highlights",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "highlight-card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                            children: "🎯 Performance Highlights"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 714,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "highlight-list",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "highlight-item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Best Performing Symbol:"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 717,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: profitBySymbol.length > 0 ? profitBySymbol.reduce((max, current)=>current.profit > max.profit ? current : max).symbol : "N/A"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 718,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 716,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "highlight-item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Largest Win:"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 726,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#10B981'
                                            },
                                            children: [
                                                "$",
                                                profitLossData.largestWin.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 727,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 725,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "highlight-item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Largest Loss:"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 730,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#EF4444'
                                            },
                                            children: [
                                                "$",
                                                profitLossData.largestLoss.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 731,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 729,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "highlight-item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Total Completed Trades:"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 734,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: completedTrades
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 735,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 733,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 715,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                    lineNumber: 713,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 712,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
        lineNumber: 468,
        columnNumber: 5
    }, this);
}
_s(UserAnalytics, "YmzMynWcleiShik2NLyZ77eNIk8=");
_c = UserAnalytics;
var _c;
__turbopack_context__.k.register(_c, "UserAnalytics");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=mzprimer-nextjs-v1%20_6ffd0d40._.js.map