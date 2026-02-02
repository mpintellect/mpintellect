(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/mzprimer-nextjs-v1 /app/lib/fetchPrice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearPricesCache",
    ()=>clearPricesCache,
    "fetchAllPrices",
    ()=>fetchAllPrices,
    "fetchCurrentPrice",
    ()=>fetchCurrentPrice,
    "fetchMultiplePrices",
    ()=>fetchMultiplePrices,
    "fetchPriceClient",
    ()=>fetchPriceClient,
    "fetchPriceData",
    ()=>fetchPriceData,
    "fetchPricesClient",
    ()=>fetchPricesClient,
    "getAvailableSymbols",
    ()=>getAvailableSymbols,
    "getCacheStatus",
    ()=>getCacheStatus,
    "getPricesLastUpdate",
    ()=>getPricesLastUpdate,
    "symbolExists",
    ()=>symbolExists
]);
const SYMBOL_MAP = {
    EURUSD: 'EURUSD',
    GBPUSD: 'GBPUSD',
    USDJPY: 'USDJPY',
    USDCAD: 'USDCAD',
    AUDUSD: 'AUDUSD',
    NZDUSD: 'NZDUSD',
    USDCHF: 'USDCHF',
    XAUUSD: 'XAUUSD',
    XAUEUR: 'XAUEUR',
    XAGUSD: 'XAGUSD',
    PLATINUM: 'PLATINUM',
    BRENT: 'BRENT',
    BTCUSD: 'BTCUSD',
    ETHUSD: 'ETHUSD',
    XRPUSD: 'XRPUSD',
    DOGEUSD: 'DOGEUSD',
    LTCUSD: 'LTCUSD',
    US500: 'US500',
    USTEC: 'USTEC',
    US30: 'US30',
    HK50: 'HK50',
    FRANCE40: 'FRANCE40',
    CHINA50: 'CHINA50',
    UK100: 'UK100',
    EURJPY: 'EURJPY',
    EURGBP: 'EURGBP',
    GBPJPY: 'GBPJPY',
    GBPCHF: 'GBPCHF',
    NASDAQ: 'NASDAQ',
    TSLA: '#TSLA',
    AAPL: '#AAPL',
    AMD: '#AMD',
    AMZN: '#AMZN',
    TSCO: '#TSCO'
};
// Cache for prices (client-side only)
let pricesCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
async function fetchCurrentPrice(symbol) {
    try {
        console.log(`🔍 [fetchCurrentPrice] Requested symbol: ${symbol}`);
        const mappedSymbol = SYMBOL_MAP[symbol] || symbol;
        console.log(`🔍 [fetchCurrentPrice] Mapped symbol: ${mappedSymbol}`);
        // Use API route instead of direct R2 call
        const res = await fetch(`/api/price?symbol=${encodeURIComponent(mappedSymbol)}`);
        console.log(`📡 API response status: ${res.status}, ok: ${res.ok}`);
        if (!res.ok) {
            console.error(`❌ API route failed: ${res.status} ${res.statusText}`);
            return null;
        }
        const data = await res.json();
        console.log(`✅ [fetchCurrentPrice] SUCCESS: ${mappedSymbol} = ${data.price}`);
        return data.price;
    } catch (err) {
        console.error("❌ Error in fetchCurrentPrice:", err);
        return null;
    }
}
async function fetchAllPrices() {
    try {
        // Check cache first (client-side only)
        if ("TURBOPACK compile-time truthy", 1) {
            const now = Date.now();
            if (pricesCache && now - cacheTimestamp < CACHE_DURATION) {
                console.log('📊 Returning cached prices data');
                return pricesCache;
            }
        }
        console.log('🔄 Cache miss - fetching fresh prices data from R2...');
        // ✅ CLOUDFLARE R2 URL - Update with your actual URL
        const R2_PUBLIC_URL = 'https://your-r2-domain.com/prices.json';
        const res = await fetch(R2_PUBLIC_URL, {
            // Cloudflare-compatible cache headers
            headers: {
                'Cache-Control': 'public, max-age=120, s-maxage=120'
            }
        });
        if (!res.ok) {
            throw new Error(`Cloudflare R2 returned ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        // Validate data structure
        if (typeof data !== 'object' || data === null) {
            throw new Error('Invalid data structure from prices.json');
        }
        // Update cache (client-side only)
        if ("TURBOPACK compile-time truthy", 1) {
            pricesCache = data;
            cacheTimestamp = Date.now();
        }
        console.log(`✅ Successfully fetched ${Object.keys(data).length} symbols from R2`);
        return data;
    } catch (err) {
        console.error('❌ Error fetching all prices from R2:', err);
        // Return cached data even if expired (client-side only)
        if (("TURBOPACK compile-time value", "object") !== 'undefined' && pricesCache) {
            console.log('🔄 Using expired cache as fallback');
            return pricesCache;
        }
        return null;
    }
}
async function fetchPriceData(symbol) {
    try {
        const mappedSymbol = SYMBOL_MAP[symbol] || symbol;
        // For client-side, use the API
        if ("TURBOPACK compile-time truthy", 1) {
            const res = await fetch(`/api/price-data?symbol=${encodeURIComponent(mappedSymbol)}`);
            if (!res.ok) return null;
            return await res.json();
        }
        //TURBOPACK unreachable
        ;
        // For server-side, use getAllPrices
        const allPrices = undefined;
    } catch (err) {
        console.error(`❌ Error fetching price data for ${symbol}:`, err);
        return null;
    }
}
async function fetchMultiplePrices(symbols) {
    try {
        // For client-side, use batch API endpoint
        if ("TURBOPACK compile-time truthy", 1) {
            const res = await fetch(`/api/batch-prices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    symbols
                })
            });
            if (!res.ok) return {};
            const data = await res.json();
            const results = {};
            symbols.forEach((symbol)=>{
                results[symbol] = data[symbol] || null;
            });
            return results;
        }
        //TURBOPACK unreachable
        ;
        // Server-side: fetch all and filter
        const allPrices = undefined;
        const results = undefined;
        const symbol = undefined;
    } catch (err) {
        console.error('❌ Error fetching multiple prices:', err);
        // Return null for all symbols on error
        const results = {};
        symbols.forEach((symbol)=>{
            results[symbol] = null;
        });
        return results;
    }
}
async function getAvailableSymbols() {
    try {
        const allPrices = await fetchAllPrices();
        return allPrices ? Object.keys(allPrices) : [];
    } catch (err) {
        console.error('❌ Error getting available symbols:', err);
        return [];
    }
}
async function symbolExists(symbol) {
    try {
        const mappedSymbol = SYMBOL_MAP[symbol] || symbol;
        // For client-side, use API
        if ("TURBOPACK compile-time truthy", 1) {
            const res = await fetch(`/api/symbol-exists?symbol=${encodeURIComponent(mappedSymbol)}`);
            if (!res.ok) return false;
            const data = await res.json();
            return data.exists || false;
        }
        //TURBOPACK unreachable
        ;
        // Server-side: check in allPrices
        const allPrices = undefined;
    } catch (err) {
        console.error(`❌ Error checking if symbol exists: ${symbol}`, err);
        return false;
    }
}
async function getPricesLastUpdate() {
    try {
        // For client-side, use API
        if ("TURBOPACK compile-time truthy", 1) {
            const res = await fetch(`/api/prices-last-update`);
            if (!res.ok) return null;
            const data = await res.json();
            return data.timestamp || null;
        }
        //TURBOPACK unreachable
        ;
        // Server-side: calculate from data
        const allPrices = undefined;
        // Find the latest timestamp among all symbols
        let latestTimestamp;
    } catch (err) {
        console.error('❌ Error getting last update timestamp:', err);
        return null;
    }
}
function clearPricesCache() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    pricesCache = null;
    cacheTimestamp = 0;
    console.log('🧹 Prices cache cleared');
}
function getCacheStatus() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const now = Date.now();
    const hasCache = !!pricesCache;
    const isFresh = hasCache && now - cacheTimestamp < CACHE_DURATION;
    const cacheAge = hasCache ? Math.round((now - cacheTimestamp) / 1000) : 0;
    return {
        hasCache,
        isFresh,
        cacheAge
    };
}
async function fetchPricesClient() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const now = Date.now();
        if (pricesCache && now - cacheTimestamp < CACHE_DURATION) {
            return pricesCache;
        }
        const res = await fetch('/api/prices');
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        pricesCache = data;
        cacheTimestamp = now;
        return data;
    } catch (error) {
        console.error('Error fetching prices on client:', error);
        return pricesCache; // Return stale cache if available
    }
}
async function fetchPriceClient(symbol) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const res = await fetch(`/api/price-client?symbol=${encodeURIComponent(symbol)}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.price;
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
        return null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /app/hooks/useUser.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUser",
    ()=>useUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useUser() {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useUser.useEffect": ()=>{
            const checkAuth = {
                "useUser.useEffect.checkAuth": async ()=>{
                    const token = localStorage.getItem('cf_token');
                    const userData = localStorage.getItem('cf_user');
                    if (!token || !userData) {
                        setUser(null);
                        setLoading(false);
                        return;
                    }
                    try {
                        // Verify token with Cloudflare API
                        const response = await fetch('/api/auth/me', {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        if (response.ok) {
                            const data = await response.json();
                            if (data.success) {
                                setUser(data.user);
                            } else {
                                // Token invalid, clear local storage
                                localStorage.removeItem('cf_token');
                                localStorage.removeItem('cf_user');
                                localStorage.removeItem('cf_session_id');
                                setUser(null);
                            }
                        } else {
                            // Token invalid, clear local storage
                            localStorage.removeItem('cf_token');
                            localStorage.removeItem('cf_user');
                            localStorage.removeItem('cf_session_id');
                            setUser(null);
                        }
                    } catch (error) {
                        console.error("Auth check error:", error);
                        setUser(null);
                    } finally{
                        setLoading(false);
                    }
                }
            }["useUser.useEffect.checkAuth"];
            checkAuth();
            // Listen for storage changes (login/logout from other tabs)
            const handleStorageChange = {
                "useUser.useEffect.handleStorageChange": (e)=>{
                    if (e.key === 'cf_user' || e.key === 'cf_token') {
                        checkAuth();
                    }
                }
            }["useUser.useEffect.handleStorageChange"];
            window.addEventListener('storage', handleStorageChange);
            return ({
                "useUser.useEffect": ()=>window.removeEventListener('storage', handleStorageChange)
            })["useUser.useEffect"];
        }
    }["useUser.useEffect"], []);
    const refreshUser = async ()=>{
        const token = localStorage.getItem('cf_token');
        const userData = localStorage.getItem('cf_user');
        if (!token || !userData) {
            setUser(null);
            return;
        }
        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                    localStorage.setItem('cf_user', JSON.stringify(data.user));
                }
            }
        } catch (error) {
            console.error("Refresh user error:", error);
        }
    };
    const logout = async ()=>{
        try {
            const token = localStorage.getItem('cf_token');
            const sessionId = localStorage.getItem('cf_session_id');
            if (token && sessionId) {
                // Call Cloudflare logout API
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sessionId
                    })
                });
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally{
            // Clear local storage
            localStorage.removeItem('cf_token');
            localStorage.removeItem('cf_user');
            localStorage.removeItem('cf_session_id');
            setUser(null);
        }
    };
    return {
        user,
        loading,
        refreshUser,
        logout,
        isAuthenticated: !!user
    };
}
_s(useUser, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /app/lib/fetchSetup.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAllSetups",
    ()=>fetchAllSetups,
    "fetchMultipleSetups",
    ()=>fetchMultipleSetups,
    "fetchMultipleSetupsClient",
    ()=>fetchMultipleSetupsClient,
    "fetchSetup",
    ()=>fetchSetup,
    "fetchSetupClient",
    ()=>fetchSetupClient,
    "getAllPendingOrders",
    ()=>getAllPendingOrders,
    "getAvailableSetupSymbols",
    ()=>getAvailableSetupSymbols,
    "getMarketContext",
    ()=>getMarketContext,
    "getOrderConfidence",
    ()=>getOrderConfidence,
    "getPrimaryOrder",
    ()=>getPrimaryOrder,
    "hasValidPendingOrders",
    ()=>hasValidPendingOrders
]);
async function fetchSetup(symbol) {
    try {
        console.log(`🔍 Fetching setup via API for ${symbol}...`);
        const response = await fetch(`/api/setup?symbol=${symbol}`, {
            method: 'GET',
            // Cloudflare-compatible headers
            headers: {
                'Accept': 'application/json',
                // Use cache headers instead of no-cache for better performance
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
            }
        });
        console.log(`📡 API response status: ${response.status}, ok: ${response.ok}`);
        if (!response.ok) {
            // Try to get error details
            const errorData = await response.json().catch(()=>({}));
            console.error(`❌ API failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
            return null;
        }
        const data = await response.json();
        console.log(`✅ Successfully fetched setup for ${symbol}:`, {
            final_decision: data.final_decision,
            analysis_accuracy: data.analysis_accuracy,
            has_pending_orders: !!data.pending_orders
        });
        return data;
    } catch (error) {
        console.error("❌ Error fetching setup via API:", error);
        return null;
    }
}
async function fetchSetupClient(symbol) {
    try {
        console.log(`🔍 [Client] Fetching setup for ${symbol}...`);
        const response = await fetch(`/api/setup?symbol=${symbol}`);
        if (!response.ok) {
            console.error(`❌ Client API failed: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("❌ Error fetching setup on client:", error);
        return null;
    }
}
function hasValidPendingOrders(setup) {
    return !!(setup?.pending_orders?.is_valid && setup.pending_orders.primary_order);
}
function getPrimaryOrder(setup) {
    return setup?.pending_orders?.primary_order ?? null;
}
function getAllPendingOrders(setup) {
    return setup?.pending_orders?.pending_orders ?? [];
}
function getOrderConfidence(setup) {
    return setup?.pending_orders?.order_confidence ?? 0;
}
function getMarketContext(setup) {
    return setup?.pending_orders?.market_context ?? 'neutral';
}
async function fetchAllSetups() {
    try {
        console.log('⚠️ fetchAllSetups() is deprecated - using individual symbol files now');
        // Return empty object for backward compatibility
        return {};
    } catch (error) {
        console.error('❌ Error in fetchAllSetups:', error);
        return null;
    }
}
async function getAvailableSetupSymbols() {
    try {
        // Since we now have individual files for all symbols, return all supported ones
        const supportedSymbols = [
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
            "CAC",
            "CHINA50",
            "UK100",
            "EURJPY",
            "EURGBP",
            "GBPJPY",
            "GBPCHF"
        ];
        console.log(`✅ Available symbols: ${supportedSymbols.length} individual files`);
        return supportedSymbols;
    } catch (error) {
        console.error('❌ Error getting available symbols:', error);
        return [];
    }
}
async function fetchMultipleSetups(symbols) {
    try {
        console.log(`🔍 Fetching multiple setups: ${symbols.join(', ')}`);
        // For client-side, use batch API endpoint
        if ("TURBOPACK compile-time truthy", 1) {
            const response = await fetch('/api/batch-setups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    symbols
                })
            });
            if (!response.ok) return {};
            return await response.json();
        }
        //TURBOPACK unreachable
        ;
        // Server-side: fetch individually
        const promises = undefined;
        const results = undefined;
        const setups = undefined;
    } catch (error) {
        console.error('❌ Error fetching multiple setups:', error);
        return {};
    }
}
async function fetchMultipleSetupsClient(symbols) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const response = await fetch('/api/batch-setups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                symbols
            })
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /app/hooks/useOneSetup.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOneSetup",
    ()=>useOneSetup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useOneSetup() {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const deductSetup = async ()=>{
        setLoading(true);
        try {
            // Get auth token
            const token = localStorage.getItem('cf_token');
            const userData = localStorage.getItem('cf_user');
            if (!token || !userData) {
                console.error("Not authenticated");
                return "error";
            }
            const user = JSON.parse(userData);
            // Call Cloudflare API to use one setup
            const response = await fetch('/api/user/use-setup', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id
                })
            });
            if (!response.ok) {
                if (response.status === 400) {
                    // No credits available
                    return "no-credits";
                }
                return "error";
            }
            const data = await response.json();
            if (data.success) {
                // Update local user data with new setup count
                const updatedUser = {
                    ...user,
                    setup_count: data.newCount
                };
                localStorage.setItem('cf_user', JSON.stringify(updatedUser));
                return "ok";
            } else {
                return "error";
            }
        } catch (error) {
            console.error("Error using setup:", error);
            return "error";
        } finally{
            setLoading(false);
        }
    };
    return {
        deductSetup,
        loading
    };
}
_s(useOneSetup, "/Rjh5rPqCCqf0XYnTUk9ZNavw3Q=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignalTicket
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function SignalTicket({ data, onClose }) {
    _s();
    const isBuy = data.action === 'BUY';
    // Prevent body scroll when modal is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SignalTicket.useEffect": ()=>{
            document.body.style.overflow = 'hidden';
            return ({
                "SignalTicket.useEffect": ()=>{
                    document.body.style.overflow = 'auto';
                }
            })["SignalTicket.useEffect"];
        }
    }["SignalTicket.useEffect"], []);
    const handleShare = async (platform)=>{
        const text = `🚀 MZPrimer Signal: ${data.symbol} ${data.action}\nEntry: ${data.entry}\nSL: ${data.sl} (Risk: -$${data.slDistanceUSD.toFixed(2)})\nTP: ${data.tp} (Profit: $${data.tpDistanceUSD.toFixed(2)})\nLot Size: ${data.lot} Lots\n\nGet more AI Analysis at: https://mzprimer.com/`;
        const url = encodeURIComponent(window.location.href);
        if (platform === 'copy') {
            try {
                await navigator.clipboard.writeText(text);
                __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('Copied to clipboard');
            } catch (err) {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('Copied to clipboard');
            }
        } else if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        } else if (platform === 'telegram') {
            window.open(`https://t.me/share/url?url=${url}&text=${encodeURIComponent(text)}`, '_blank');
        } else if (platform === 'website') {
            window.open('https://www.litefinance.org/?uid=967798214', '_blank');
        }
    };
    const handleOverlayClick = (e)=>{
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    const modalContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "ticket-overlay",
        onClick: handleOverlayClick,
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 20px',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            margin: 0,
            overflow: 'auto'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `ticket-modal ${isBuy ? 'buy-mode' : 'sell-mode'}`,
            onClick: (e)=>e.stopPropagation(),
            style: {
                width: '100%',
                maxWidth: '380px',
                position: 'relative',
                margin: 0,
                transform: 'none'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "ticket-accent-bar"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "ticket-close-btn",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                        size: 20
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "ticket-content",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "ticket-symbol",
                            children: data.symbol
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ticket-badge",
                            children: data.action
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ticket-grid",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "ticket-item entry",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "label",
                                            children: "Entry"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                            lineNumber: 108,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "value",
                                            children: data.entry
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                            lineNumber: 109,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "ticket-item stop",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "label",
                                            children: "Stop (SL)"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                            lineNumber: 112,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "value",
                                            children: data.sl
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                            lineNumber: 113,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "distance-value text-red-400",
                                            children: [
                                                "-$",
                                                data.slDistanceUSD.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                            lineNumber: 114,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "ticket-item target",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "label",
                                            children: "Target (TP)"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                            lineNumber: 117,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "value",
                                            children: data.tp
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                            lineNumber: 118,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "distance-value text-emerald-400",
                                            children: [
                                                "+$",
                                                data.tpDistanceUSD.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                            lineNumber: 119,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ticket-lot-hero",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "lot-label",
                                    children: "Recommended Size"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                    lineNumber: 124,
                                    columnNumber: 14
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "lot-value",
                                    children: [
                                        data.lot,
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "unit",
                                            children: "Lots"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                            lineNumber: 126,
                                            columnNumber: 27
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                    lineNumber: 125,
                                    columnNumber: 14
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ticket-share-grid",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "share-btn",
                                    onClick: ()=>handleShare('copy'),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                        lineNumber: 131,
                                        columnNumber: 79
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "share-btn",
                                    onClick: ()=>handleShare('telegram'),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                        lineNumber: 132,
                                        columnNumber: 83
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "share-btn",
                                    onClick: ()=>handleShare('whatsapp'),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "wa-text font-bold",
                                        children: "WA"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                        lineNumber: 133,
                                        columnNumber: 83
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "share-btn",
                                    onClick: ()=>handleShare('website'),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                        lineNumber: 134,
                                        columnNumber: 82
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                                    lineNumber: 134,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "ticket-footer-btn",
                    children: "Close & View Full Analysis"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
                    lineNumber: 138,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
            lineNumber: 86,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
    if (typeof document === 'undefined') return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(modalContent, document.body);
}
_s(SignalTicket, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = SignalTicket;
var _c;
__turbopack_context__.k.register(_c, "SignalTicket");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AiChatBox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/lib/fetchPrice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/hooks/useUser.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/lib/fetchSetup.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f40$stripe$2f$stripe$2d$js$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/@stripe/stripe-js/lib/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f40$stripe$2f$stripe$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/@stripe/stripe-js/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useOneSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/hooks/useOneSetup.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$SignalTicket$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
// components/AiChatBox.tsx
"use client";
;
;
;
;
;
;
;
;
;
// ==========================================
// 🚀 QUICK ACTION BUTTONS CONFIGURATION
// ==========================================
const QUICK_SYMBOLS = [
    "XAUUSD",
    "BTCUSD",
    "EURUSD",
    "USDJPY"
];
// ==========================================
// 📊 EMBEDDED SYMBOL CONFIGURATION
// ==========================================
const ALL_SYMBOLS = [
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
const SYMBOL_NAMES = {
    EURUSD: "Euro / US Dollar",
    GBPUSD: "British Pound / US Dollar",
    USDJPY: "US Dollar / Japanese Yen",
    USDCAD: "US Dollar / Canadian Dollar",
    AUDUSD: "Australian Dollar / US Dollar",
    NZDUSD: "New Zealand Dollar / US Dollar",
    USDCHF: "US Dollar / Swiss Franc",
    EURJPY: "Euro / Japanese Yen",
    EURGBP: "Euro / British Pound",
    GBPJPY: "British Pound / Japanese Yen",
    GBPCHF: "British Pound / Swiss Franc",
    XAUUSD: "Gold / US Dollar",
    XAUEUR: "Gold / Euro",
    XAGUSD: "Silver / US Dollar",
    PLATINUM: "Platinum / US Dollar",
    BRENT: "Brent Crude Oil",
    BTCUSD: "Bitcoin / US Dollar",
    ETHUSD: "Ethereum / US Dollar",
    XRPUSD: "Ripple / US Dollar",
    LTCUSD: "Litecoin / US Dollar",
    DOGEUSD: "Dogecoin / US Dollar",
    US500: "S&P 500",
    USTEC: "Nasdaq 100",
    US30: "Dow Jones 30",
    HK50: "Hong Kong 50 stock index",
    FRANCE40: "FRANCE40",
    CHINA50: "CHINA50",
    UK100: "FTSE 100"
};
// ✅ EXACT MATCH WITH BACKEND PIP/CONTRACT SETTINGS
const SYMBOL_SPECS = {
    // Forex (Standard Lot = 100,000 units)
    "EURUSD": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "GBPUSD": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "USDJPY": {
        pip: 0.01,
        contract: 100000,
        decimals: 3
    },
    "USDCAD": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "AUDUSD": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "NZDUSD": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "USDCHF": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "EURJPY": {
        pip: 0.01,
        contract: 100000,
        decimals: 3
    },
    "EURGBP": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "GBPJPY": {
        pip: 0.01,
        contract: 100000,
        decimals: 3
    },
    "GBPCHF": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    // Metals
    "XAUUSD": {
        pip: 0.01,
        contract: 100,
        decimals: 2
    },
    "XAUEUR": {
        pip: 0.01,
        contract: 100,
        decimals: 2
    },
    "XAGUSD": {
        pip: 0.001,
        contract: 5000,
        decimals: 3
    },
    "PLATINUM": {
        pip: 0.01,
        contract: 100,
        decimals: 2
    },
    // Energy
    "BRENT": {
        pip: 0.01,
        contract: 1000,
        decimals: 2
    },
    // Crypto - ADJUSTED FOR MT5 CONTRACT SIZES (Standard CFD lots)
    "BTCUSD": {
        pip: 1.0,
        contract: 1,
        decimals: 1
    },
    "ETHUSD": {
        pip: 0.1,
        contract: 1,
        decimals: 2
    },
    "XRPUSD": {
        pip: 0.0001,
        contract: 1000,
        decimals: 4
    },
    "LTCUSD": {
        pip: 0.01,
        contract: 10,
        decimals: 2
    },
    "DOGEUSD": {
        pip: 0.0001,
        contract: 1000,
        decimals: 4
    },
    // Indices (Standard Lot = 1 Contract)
    "US500": {
        pip: 0.1,
        contract: 1,
        decimals: 2
    },
    "USTEC": {
        pip: 0.1,
        contract: 1,
        decimals: 2
    },
    "US30": {
        pip: 1.0,
        contract: 1,
        decimals: 1
    },
    "HK50": {
        pip: 0.1,
        contract: 1,
        decimals: 2
    },
    "FRANCE40": {
        pip: 0.1,
        contract: 1,
        decimals: 2
    },
    "CHINA50": {
        pip: 0.1,
        contract: 1,
        decimals: 1
    },
    "UK100": {
        pip: 0.1,
        contract: 1,
        decimals: 1
    }
};
// ==========================================
// 💾 LOCAL STORAGE TRIAL FUNCTIONS
// ==========================================
const getTrialCount = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const saved = localStorage.getItem("MZP_TRIAL_COUNT");
    return saved ? parseInt(saved) : 0;
};
const incrementTrialCount = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const current = getTrialCount();
    const newCount = current + 1;
    localStorage.setItem("MZP_TRIAL_COUNT", newCount.toString());
    return newCount;
};
// ==========================================
// 🖼️ MODAL COMPONENTS
// ==========================================
// Quick Registration Modal
function QuickRegisterModal({ onClose, onSuccess, selectedPlan }) {
    _s();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleQuickRegister = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }
        try {
            // Register with Cloudflare API
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    displayName: email.split('@')[0]
                })
            });
            const data = await response.json();
            if (data.success) {
                const user = data.user;
                // Store session
                localStorage.setItem('cf_token', data.token);
                localStorage.setItem('cf_user', JSON.stringify(user));
                localStorage.setItem('cf_session_id', data.sessionId);
                onSuccess(user, selectedPlan);
            } else {
                if (data.error.includes('already exists')) {
                    setError("This email is already registered. Please login instead.");
                } else if (data.error.includes('Invalid email')) {
                    setError("Invalid email address format.");
                } else if (data.error.includes('weak password')) {
                    setError("Password is too weak. Please use a stronger password.");
                } else {
                    setError(data.error || "Registration failed. Please try again.");
                }
            }
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally{
            setLoading(false);
        }
    };
    const modalContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-overlay",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal-content",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: "🎯 Quick Registration"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 230,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "close-modal",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 232,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                    lineNumber: 229,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleQuickRegister,
                    className: "quick-register-form",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Email Address"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 237,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    value: email,
                                    onChange: (e)=>setEmail(e.target.value),
                                    placeholder: "your@email.com",
                                    required: true,
                                    disabled: loading
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 238,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 236,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Password (min 6 characters)"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 249,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    value: password,
                                    onChange: (e)=>setPassword(e.target.value),
                                    placeholder: "Enter your password",
                                    required: true,
                                    disabled: loading
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 250,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 248,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Confirm Password"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 261,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    value: confirmPassword,
                                    onChange: (e)=>setConfirmPassword(e.target.value),
                                    placeholder: "Confirm your password",
                                    required: true,
                                    disabled: loading
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 262,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 260,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "error-message",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 273,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-actions",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "primary-btn",
                                    children: loading ? "Creating Account..." : `Register & Continue to Payment`
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 279,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "secondary-btn",
                                    disabled: loading,
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 286,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 278,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "registration-note",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "📧 We'll send a verification email. You can verify later and start using your setups immediately."
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                lineNumber: 297,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 296,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                    lineNumber: 235,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
            lineNumber: 228,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
        lineNumber: 227,
        columnNumber: 5
    }, this);
    // This sends the modal to the bottom of <body>
    return typeof document !== "undefined" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(modalContent, document.body) : null;
}
_s(QuickRegisterModal, "XKj1ZF4AqNGPTZ91vF5agbeVxKg=");
_c = QuickRegisterModal;
// Pricing Plans Modal
function PricingPlansModal({ onClose, onPlanSelect, onRegisterClick }) {
    _s1();
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PricingPlansModal.useEffect": ()=>{
            if (scrollRef.current) {
                // Scrolls the container to the middle on mount
                const container = scrollRef.current;
                const scrollAmount = (container.scrollWidth - container.offsetWidth) / 2;
                container.scrollLeft = scrollAmount;
            }
        }
    }["PricingPlansModal.useEffect"], []);
    const plans = [
        {
            id: "10",
            name: "Basic Plan",
            setups: "10 Setups",
            price: "€4.50",
            popular: false
        },
        {
            id: "20",
            name: "Pro Plan",
            setups: "20 Setups",
            price: "€8.00",
            popular: true
        },
        {
            id: "30",
            name: "Elite Plan",
            setups: "30 Setups",
            price: "€12.00",
            popular: false
        }
    ];
    const modalContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-overlay",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal-content pricing-modal",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: "🎯 Choose Your Setup Plan"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 341,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Select a plan that fits your trading needs"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 342,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "close-modal",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 343,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                    lineNumber: 340,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pricing-options",
                    ref: scrollRef,
                    children: plans.map((plan)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `pricing-card ${plan.popular ? 'popular' : ''}`,
                            children: [
                                plan.popular && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "popular-badge",
                                    children: "MOST POPULAR"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 352,
                                    columnNumber: 32
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "plan-header",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            children: plan.name
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                            lineNumber: 355,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "setups-count",
                                            children: plan.setups
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                            lineNumber: 356,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 354,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "plan-price",
                                    children: plan.price
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 359,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onPlanSelect(plan.id),
                                    className: "select-plan-btn",
                                    children: "Select Plan"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 363,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, plan.id, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 348,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                    lineNumber: 346,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pricing-footer",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "register-option",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "🔑 Create Account First"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                lineNumber: 375,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Register to get 1 free setup and manage your credits"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                lineNumber: 376,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onRegisterClick,
                                className: "register-first-btn",
                                children: "Register Now (Get 1 Free Setup)"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                lineNumber: 377,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                        lineNumber: 374,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                    lineNumber: 373,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
            lineNumber: 339,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
        lineNumber: 338,
        columnNumber: 5
    }, this);
    // This sends the modal to the bottom of <body>
    return typeof document !== "undefined" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(modalContent, document.body) : null;
}
_s1(PricingPlansModal, "P14GFulhWAl/Oec4Pk4QeBwKyr0=");
_c1 = PricingPlansModal;
function AiChatBox({ mode = "section", onClose, autoStart = true, preselectedSymbol = null }) {
    _s2();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [symbol, setSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [capital, setCapital] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isTyping, setIsTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { user, setupCount, isLoading: userLoading, userId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const chatRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scrollLocked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [trialCount, setTrialCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Modal states
    const [showPricingModal, setShowPricingModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showQuickRegister, setShowQuickRegister] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedPlan, setSelectedPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Signal Ticket State
    const [ticketData, setTicketData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const stripePromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f40$stripe$2f$stripe$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadStripe"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AiChatBox.useEffect": ()=>{
            const count = getTrialCount();
            setTrialCount(count);
        }
    }["AiChatBox.useEffect"], [
        userId
    ]);
    // ==========================================
    // ⚡ NEW: PRESELECTED SYMBOL EFFECT
    // ==========================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AiChatBox.useEffect": ()=>{
            if (preselectedSymbol && ALL_SYMBOLS.includes(preselectedSymbol)) {
                // Small timeout ensures the modal animation finishes before analysis starts
                const timer = setTimeout({
                    "AiChatBox.useEffect.timer": ()=>{
                        executeQuickAnalysis(preselectedSymbol);
                    }
                }["AiChatBox.useEffect.timer"], 600);
                return ({
                    "AiChatBox.useEffect": ()=>clearTimeout(timer)
                })["AiChatBox.useEffect"];
            }
        }
    }["AiChatBox.useEffect"], [
        preselectedSymbol
    ]);
    // ==========================================
    // ⚡ QUICK ANALYSIS FUNCTION
    // ==========================================
    const executeQuickAnalysis = async (targetSymbol)=>{
        // Check access first
        if (!user && trialCount >= 2) {
            setShowPricingModal(true);
            return;
        }
        let proceed = false;
        let newTrialCount = trialCount;
        // Access Control Logic
        if (user) {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useOneSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOneSetup"])();
            if (result === "ok") {
                proceed = true;
            } else if (result === "no-credits") {
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: [
                                {
                                    title: "❌ No Setups Left",
                                    content: "You've used all your setup credits. Please buy more to continue."
                                }
                            ]
                        }
                    ]);
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: [
                                {
                                    title: "🛒 Buy More Setups",
                                    content: `<button onclick="window.location.href='/client/dashboard?showPlans=true'" style="background: #22c55e; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                  View Pricing Plans
                </button>`
                                }
                            ]
                        }
                    ]);
                return;
            } else {
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: "⚠️ Error verifying account. Try again."
                        }
                    ]);
                return;
            }
        } else {
            if (trialCount < 2) {
                newTrialCount = incrementTrialCount();
                setTrialCount(newTrialCount);
                proceed = true;
            } else {
                setShowPricingModal(true);
                return;
            }
        }
        // Set $1,000 as default capital for quick analysis
        const quickCapital = 1000;
        // Show user message
        setMessages((prev)=>[
                ...prev,
                {
                    sender: "user",
                    text: `Quick Setup: ${targetSymbol} ($${quickCapital})`
                }
            ]);
        setIsTyping(true);
        setStep(3); // Skip to result state
        try {
            const setup = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSetup"])(targetSymbol);
            if (!setup) {
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: "⚠️ Setup not available. Try again later."
                        }
                    ]);
                setIsTyping(false);
                return;
            }
            // ✅ SAFE confidence access
            const confidenceScore = setup.risk_score?.confidence_score ?? setup.confidence?.confidence_score ?? 50;
            // ✅ SAFE EMBEDDED SYMBOL SPECS
            const symbolSpec = SYMBOL_SPECS[targetSymbol] || {
                pip: 0.0001,
                contract: 100000,
                decimals: 5
            };
            const contract = symbolSpec.contract;
            const decimalPlaces = symbolSpec.decimals;
            // ✅ EXTRACT ORDER DATA
            const hasValidOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasValidPendingOrders"])(setup);
            const primaryOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrimaryOrder"])(setup);
            const allOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllPendingOrders"])(setup);
            const orderConfidence = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOrderConfidence"])(setup);
            const marketContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMarketContext"])(setup);
            let entryPrice = 0;
            let slPrice = 0;
            let tpPrice = 0;
            let rrRatio = 1.0;
            let orderType = "MARKET";
            let orderRationale = "No specific order generated";
            if (hasValidOrders && primaryOrder) {
                entryPrice = Number(primaryOrder.entry_price) || 0;
                slPrice = Number(primaryOrder.sl_price) || 0;
                tpPrice = Number(primaryOrder.tp_price) || 0;
                rrRatio = Number(primaryOrder.rr_ratio) || 1.0;
                orderType = primaryOrder.type || "LIMIT";
                orderRationale = primaryOrder.rationale || "Algorithm generated";
            } else {
                // Fallback
                const currentPrice = setup.pending_orders?.current_price || 0;
                entryPrice = currentPrice;
                slPrice = entryPrice * 0.99;
                tpPrice = entryPrice * 1.01;
                orderRationale = "Fallback estimation";
            }
            // ✅ CORRECTED RISK CALCULATION
            const priceDifference = Math.abs(entryPrice - slPrice);
            // Calculate Dollar Risk per 1 Lot traded
            const riskPerTradePerLot = priceDifference * contract;
            const maxRiskAmount = quickCapital * 0.02; // 2% Risk Rule
            // ✅ FIX: Prevent division by zero & enforce min 0.01 lot
            let lotSize = 0;
            if (riskPerTradePerLot > 0.00000001) {
                const rawLots = maxRiskAmount / riskPerTradePerLot;
                lotSize = parseFloat(rawLots.toFixed(2)); // Round to 2 decimals
                // Enforce minimum 0.01 lot if valid trade
                if (lotSize < 0.01) lotSize = 0.01;
            } else {
                lotSize = 0.0; // Invalid trade parameters
            }
            const actualRiskAmount = riskPerTradePerLot * lotSize;
            const riskPercentage = quickCapital > 0 ? actualRiskAmount / quickCapital * 100 : 0;
            // Calculate distances for display
            const slDistanceUSD = Math.abs(slPrice - entryPrice) * contract * lotSize;
            const tpDistanceUSD = Math.abs(tpPrice - entryPrice) * contract * lotSize;
            const starRating = Math.min(5, Math.max(1, Math.floor(confidenceScore / 20)));
            const stars = "⭐".repeat(starRating) + "☆".repeat(5 - starRating);
            const signalStrength = confidenceScore < 60 ? "WEAK" : confidenceScore < 80 ? "MODERATE" : "STRONG";
            const signalWarning = confidenceScore < 60 ? "⚠️ **LOW CONFIDENCE** – Consider waiting for better setup." : "✅ **CONFIRMED SETUP** – Trade looks promising.";
            const decision = setup.final_decision || "WAIT";
            // 🚀 SHOW SIGNAL TICKET POPUP
            setTicketData({
                symbol: targetSymbol,
                action: decision,
                entry: entryPrice.toFixed(decimalPlaces),
                sl: slPrice.toFixed(decimalPlaces),
                tp: tpPrice.toFixed(decimalPlaces),
                lot: lotSize.toFixed(2),
                slDistanceUSD,
                tpDistanceUSD
            });
            // Create summary blocks in the format you requested
            const summary = [
                {
                    title: "🎯 Trade Signal",
                    content: `• Symbol: <strong>${targetSymbol} (${SYMBOL_NAMES[targetSymbol] || targetSymbol})</strong>\n` + `• Decision: ${setup.final_decision === "BUY" ? '<span class="buy"><strong>BUY</strong></span> 📈' : setup.final_decision === "SELL" ? '<span class="sell"><strong>SELL</strong></span> 📉' : '<span class="wait"><strong>WAIT</strong></span> ⏳'}\n` + `• Order Type: <strong>${orderType}</strong>\n` + `• Confidence: <strong>${confidenceScore}%</strong> ${stars}\n` + `• Signal: <strong>${signalStrength}</strong>\n` + `• Market Context: <strong>${marketContext}</strong>`
                },
                {
                    title: "⚡ Trade Parameters",
                    content: `• Entry Price: <strong>${entryPrice.toFixed(decimalPlaces)}</strong>\n` + `• Stop Loss: <strong>${slPrice.toFixed(decimalPlaces)}</strong> (<span style="color:red;">-$${slDistanceUSD.toFixed(2)}</span>)\n` + `• Take Profit: <strong>${tpPrice.toFixed(decimalPlaces)}</strong> (<span style="color:green;">$${tpDistanceUSD.toFixed(2)}</span>)\n` + `• Risk/Reward: <strong>${rrRatio.toFixed(2)}:1</strong>\n` + `• Strategy: ${orderRationale}`
                },
                {
                    title: "💰 Risk Management",
                    content: `• Capital: <strong>$${quickCapital.toLocaleString()}</strong>\n` + `• Risk/Trade: <strong>$${actualRiskAmount.toFixed(2)}</strong> (${riskPercentage.toFixed(1)}%)\n` + `• Lot Size: <strong>${lotSize.toFixed(2)}</strong>\n` + `• Position: ${setup.risk_score?.position_size_multiplier ?? 0.5}x`
                },
                {
                    title: signalStrength === "WEAK" ? "⚠️ Caution" : "✅ Final Signal",
                    content: `<strong>${signalWarning}</strong>`
                }
            ];
            // Convert summary blocks to chat messages
            const summaryCards = summary.map((block)=>({
                    sender: "ai",
                    text: [
                        {
                            title: block.title,
                            content: block.content
                        }
                    ]
                }));
            // Add additional order information card if available
            if (hasValidOrders) {
                summaryCards.push({
                    sender: "ai",
                    text: [
                        {
                            title: "📋 ORDER DETAILS",
                            content: `• Total Pending Orders: <strong>${allOrders.length}</strong>\n` + `• Order Confidence: <strong>${orderConfidence}%</strong>\n` + `• Primary Order Rationale: ${orderRationale}`
                        }
                    ]
                });
            }
            scrollLocked.current = true;
            setMessages((prev)=>[
                    ...prev,
                    ...summaryCards
                ]);
            if (!user && newTrialCount >= 2) {
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: [
                                {
                                    title: "🚫 Trial Limit Reached",
                                    content: "You've used all 2 free trials. Register and buy setups to continue using MZPrimer AI."
                                }
                            ]
                        }
                    ]);
            }
            // ✅ Saving logic
            if (userId) {
                try {
                    console.log("🔄 Saving quick setup for user:", userId);
                    const finalRR = tpPrice && slPrice && entryPrice ? Math.abs(tpPrice - entryPrice) / Math.abs(entryPrice - slPrice) : 1.0;
                    // Save setup via Cloudflare API
                    const saveResponse = await fetch('/api/setups', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('cf_token')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            symbol: targetSymbol,
                            entry_price: entryPrice,
                            take_profit: tpPrice,
                            stop_loss: slPrice,
                            capital: quickCapital,
                            lot_size: lotSize,
                            risk_reward: finalRR
                        })
                    });
                    if (!saveResponse.ok) {
                        throw new Error('Failed to save setup');
                    }
                    console.log("✅ Quick setup saved successfully");
                } catch (err) {
                    console.error("❌ Failed to save quick setup:", err);
                    setMessages((prev)=>[
                            ...prev,
                            {
                                sender: "ai",
                                text: "⚠️ Analysis complete, but failed to save to history."
                            }
                        ]);
                }
            }
        } catch (error) {
            console.error("❌ Error processing quick setup:", error?.message || error);
            setMessages((prev)=>[
                    ...prev,
                    {
                        sender: "ai",
                        text: "❌ Error processing trade setup. Please try again."
                    }
                ]);
        } finally{
            setIsTyping(false);
        }
    };
    const handleBuySetups = async (plan, userEmail)=>{
        if (!user) {
            console.error("No user found for purchase");
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch("/api/checkout/create-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user.id,
                    plan: plan,
                    email: user.email || userEmail
                })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Checkout URL not received.");
            }
        } catch (error) {
            console.error("Buy setup error:", error);
            alert(`Failed to start checkout: ${error.message}`);
        } finally{
            setIsLoading(false);
        }
    };
    const handlePlanSelect = (plan)=>{
        setSelectedPlan(plan);
        if (user) {
            handleBuySetups(plan);
            setShowPricingModal(false);
        } else {
            setShowPricingModal(false);
            setShowQuickRegister(true);
        }
    };
    const handleQuickRegisterSuccess = (newUser, plan)=>{
        setShowQuickRegister(false);
        handleBuySetups(plan, newUser.email);
    };
    const handleRegisterFirst = ()=>{
        setShowPricingModal(false);
        setShowQuickRegister(true);
        setSelectedPlan("10");
    };
    const incrementTrial = async ()=>{
        const newCount = incrementTrialCount();
        setTrialCount(newCount);
        return newCount;
    };
    // Welcome message with QUICK ACTION BUTTONS
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AiChatBox.useEffect": ()=>{
            const hasAccess = user || trialCount < 2;
            if (hasAccess && messages.length === 0 && autoStart && !userLoading) {
                setTimeout({
                    "AiChatBox.useEffect": ()=>{
                        const welcomeMessages = [
                            {
                                sender: "ai",
                                text: "🤖 MZPrimer AI:\nWelcome! I'm your personal AI Trading Assistant. Let's analyze a strategic setup."
                            }
                        ];
                        if (user) {
                            welcomeMessages.push({
                                sender: "ai",
                                text: `🎯 You have ${setupCount} setup credit${setupCount === 1 ? '' : 's'} available.`
                            });
                        } else {
                            welcomeMessages.push({
                                sender: "ai",
                                text: `🎉 You have ${2 - trialCount} free trial${2 - trialCount === 1 ? '' : 's'} remaining.`
                            });
                        }
                        welcomeMessages.push({
                            sender: "ai",
                            text: "2️⃣ 🔍 Choose a Trading Symbol to begin:"
                        });
                        // Add Quick Action Buttons as a separate message
                        welcomeMessages.push({
                            sender: "ai",
                            text: "🚀 **Quick Setup:** Click any asset below for instant $1,000 analysis:"
                        });
                        setMessages(welcomeMessages);
                        setStep(1);
                    }
                }["AiChatBox.useEffect"], 300);
            }
        }
    }["AiChatBox.useEffect"], [
        messages.length,
        autoStart,
        user,
        setupCount,
        userLoading,
        trialCount
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AiChatBox.useEffect": ()=>{
            if (chatRef.current && !scrollLocked.current) {
                chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }
        }
    }["AiChatBox.useEffect"], [
        messages
    ]);
    const handleUserInput = async (input)=>{
        if (!user && trialCount >= 2) {
            setShowPricingModal(true);
            return;
        }
        setMessages((prev)=>[
                ...prev,
                {
                    sender: "user",
                    text: input
                }
            ]);
        setIsTyping(true);
        // === STEP 1: SELECT SYMBOL ===
        if (step === 1) {
            const selectedSymbol = input.trim();
            setSymbol(selectedSymbol);
            const price = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCurrentPrice"])(selectedSymbol);
            if (!price) {
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: "⚠️ Could not fetch price. Try again."
                        }
                    ]);
                setIsTyping(false);
                return;
            }
            setMessages((prev)=>[
                    ...prev,
                    {
                        sender: "ai",
                        text: `📊 ${SYMBOL_NAMES[selectedSymbol] || selectedSymbol}\nLive Price: ${price}`
                    },
                    {
                        sender: "ai",
                        text: "💰 What's your trading capital in USD?"
                    }
                ]);
            setStep(2);
            setIsTyping(false);
            return;
        }
        // === STEP 2: ENTER CAPITAL & FETCH SETUP ===
        if (step === 2) {
            const capitalNumber = parseFloat(input);
            if (isNaN(capitalNumber) || capitalNumber <= 0 || capitalNumber > 10000000) {
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: "⚠️ Please enter a valid capital amount (1 - 10,000,000 USD)."
                        }
                    ]);
                setIsTyping(false);
                return;
            }
            if (!symbol) {
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: "⚠️ Please select a symbol first."
                        }
                    ]);
                setIsTyping(false);
                return;
            }
            let proceed = false;
            let newTrialCount = trialCount;
            // Access Control Logic
            if (user) {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useOneSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOneSetup"])();
                if (result === "ok") {
                    proceed = true;
                } else if (result === "no-credits") {
                    setMessages((prev)=>[
                            ...prev,
                            {
                                sender: "ai",
                                text: [
                                    {
                                        title: "❌ No Setups Left",
                                        content: "You've used all your setup credits. Please buy more to continue."
                                    }
                                ]
                            }
                        ]);
                    setMessages((prev)=>[
                            ...prev,
                            {
                                sender: "ai",
                                text: [
                                    {
                                        title: "🛒 Buy More Setups",
                                        content: `<button onclick="window.location.href='/client/dashboard?showPlans=true'" style="background: #22c55e; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    View Pricing Plans
                  </button>`
                                    }
                                ]
                            }
                        ]);
                    setIsTyping(false);
                    return;
                } else {
                    setMessages((prev)=>[
                            ...prev,
                            {
                                sender: "ai",
                                text: "⚠️ Error verifying account. Try again."
                            }
                        ]);
                    setIsTyping(false);
                    return;
                }
            } else {
                if (trialCount < 2) {
                    newTrialCount = incrementTrialCount();
                    setTrialCount(newTrialCount);
                    proceed = true;
                } else {
                    setShowPricingModal(true);
                    setIsTyping(false);
                    return;
                }
            }
            setCapital(input);
            setMessages((prev)=>[
                    ...prev,
                    {
                        sender: "ai",
                        text: "⏳ Fetching strategic setup..."
                    }
                ]);
            setStep(3);
            try {
                const setup = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSetup"])(symbol);
                if (!setup) {
                    setMessages((prev)=>[
                            ...prev,
                            {
                                sender: "ai",
                                text: "⚠️ Setup not available. Try again later."
                            }
                        ]);
                    setIsTyping(false);
                    return;
                }
                // ✅ SAFE confidence access
                const confidenceScore = setup.risk_score?.confidence_score ?? setup.confidence?.confidence_score ?? 50;
                // ✅ SAFE EMBEDDED SYMBOL SPECS
                const symbolSpec = SYMBOL_SPECS[symbol] || {
                    pip: 0.0001,
                    contract: 100000,
                    decimals: 5
                };
                const contract = symbolSpec.contract;
                const decimalPlaces = symbolSpec.decimals;
                // ✅ EXTRACT ORDER DATA
                const hasValidOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasValidPendingOrders"])(setup);
                const primaryOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrimaryOrder"])(setup);
                const allOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllPendingOrders"])(setup);
                const orderConfidence = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOrderConfidence"])(setup);
                const marketContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMarketContext"])(setup);
                let entryPrice = 0;
                let slPrice = 0;
                let tpPrice = 0;
                let rrRatio = 1.0;
                let orderType = "MARKET";
                let orderRationale = "No specific order generated";
                if (hasValidOrders && primaryOrder) {
                    entryPrice = Number(primaryOrder.entry_price) || 0;
                    slPrice = Number(primaryOrder.sl_price) || 0;
                    tpPrice = Number(primaryOrder.tp_price) || 0;
                    rrRatio = Number(primaryOrder.rr_ratio) || 1.0;
                    orderType = primaryOrder.type || "LIMIT";
                    orderRationale = primaryOrder.rationale || "Algorithm generated";
                } else {
                    // Fallback
                    const currentPrice = setup.pending_orders?.current_price || 0;
                    entryPrice = currentPrice;
                    slPrice = entryPrice * 0.99;
                    tpPrice = entryPrice * 1.01;
                    orderRationale = "Fallback estimation";
                }
                // ✅ CORRECTED RISK CALCULATION
                const priceDifference = Math.abs(entryPrice - slPrice);
                // Calculate Dollar Risk per 1 Lot traded
                const riskPerTradePerLot = priceDifference * contract;
                const maxRiskAmount = capitalNumber * 0.02; // 2% Risk Rule
                // ✅ FIX: Prevent division by zero & enforce min 0.01 lot
                let lotSize = 0;
                if (riskPerTradePerLot > 0.00000001) {
                    const rawLots = maxRiskAmount / riskPerTradePerLot;
                    lotSize = parseFloat(rawLots.toFixed(2)); // Round to 2 decimals
                    // Enforce minimum 0.01 lot if valid trade
                    if (lotSize < 0.01) lotSize = 0.01;
                } else {
                    lotSize = 0.0; // Invalid trade parameters
                }
                const actualRiskAmount = riskPerTradePerLot * lotSize;
                const riskPercentage = capitalNumber > 0 ? actualRiskAmount / capitalNumber * 100 : 0;
                // Calculate distances for display
                const slDistanceUSD = Math.abs(slPrice - entryPrice) * contract * lotSize;
                const tpDistanceUSD = Math.abs(tpPrice - entryPrice) * contract * lotSize;
                const starRating = Math.min(5, Math.max(1, Math.floor(confidenceScore / 20)));
                const stars = "⭐".repeat(starRating) + "☆".repeat(5 - starRating);
                const signalStrength = confidenceScore < 60 ? "WEAK" : confidenceScore < 80 ? "MODERATE" : "STRONG";
                const signalWarning = confidenceScore < 60 ? "⚠️ **LOW CONFIDENCE** – Consider waiting for better setup." : "✅ **CONFIRMED SETUP** – Trade looks promising.";
                const decision = setup.final_decision || "WAIT";
                // 🚀 SHOW SIGNAL TICKET POPUP
                setTicketData({
                    symbol: symbol,
                    action: decision,
                    entry: entryPrice.toFixed(decimalPlaces),
                    sl: slPrice.toFixed(decimalPlaces),
                    tp: tpPrice.toFixed(decimalPlaces),
                    lot: lotSize.toFixed(2),
                    slDistanceUSD,
                    tpDistanceUSD
                });
                // Create summary blocks in the format you requested
                const summary = [
                    {
                        title: "🎯 Trade Signal",
                        content: `• Symbol: <strong>${symbol} (${SYMBOL_NAMES[symbol] || symbol})</strong>\n` + `• Decision: ${setup.final_decision === "BUY" ? '<span class="buy"><strong>BUY</strong></span> 📈' : setup.final_decision === "SELL" ? '<span class="sell"><strong>SELL</strong></span> 📉' : '<span class="wait"><strong>WAIT</strong></span> ⏳'}\n` + `• Order Type: <strong>${orderType}</strong>\n` + `• Confidence: <strong>${confidenceScore}%</strong> ${stars}\n` + `• Signal: <strong>${signalStrength}</strong>\n` + `• Market Context: <strong>${marketContext}</strong>`
                    },
                    {
                        title: "⚡ Trade Parameters",
                        content: `• Entry Price: <strong>${entryPrice.toFixed(decimalPlaces)}</strong>\n` + `• Stop Loss: <strong>${slPrice.toFixed(decimalPlaces)}</strong> (<span style="color:red;">-$${slDistanceUSD.toFixed(2)}</span>)\n` + `• Take Profit: <strong>${tpPrice.toFixed(decimalPlaces)}</strong> (<span style="color:green;">$${tpDistanceUSD.toFixed(2)}</span>)\n` + `• Risk/Reward: <strong>${rrRatio.toFixed(2)}:1</strong>\n` + `• Strategy: ${orderRationale}`
                    },
                    {
                        title: "💰 Risk Management",
                        content: `• Capital: <strong>$${capitalNumber.toLocaleString()}</strong>\n` + `• Risk/Trade: <strong>$${actualRiskAmount.toFixed(2)}</strong> (${riskPercentage.toFixed(1)}%)\n` + `• Lot Size: <strong>${lotSize.toFixed(2)}</strong>\n` + `• Position: ${setup.risk_score?.position_size_multiplier ?? 0.5}x`
                    },
                    {
                        title: signalStrength === "WEAK" ? "⚠️ Caution" : "✅ Final Signal",
                        content: `<strong>${signalWarning}</strong>`
                    }
                ];
                // Convert summary blocks to chat messages
                const summaryCards = summary.map((block)=>({
                        sender: "ai",
                        text: [
                            {
                                title: block.title,
                                content: block.content
                            }
                        ]
                    }));
                // Add additional order information card if available
                if (hasValidOrders) {
                    summaryCards.push({
                        sender: "ai",
                        text: [
                            {
                                title: "📋 ORDER DETAILS",
                                content: `• Total Pending Orders: <strong>${allOrders.length}</strong>\n` + `• Order Confidence: <strong>${orderConfidence}%</strong>\n` + `• Primary Order Rationale: ${orderRationale}`
                            }
                        ]
                    });
                }
                scrollLocked.current = true;
                setMessages((prev)=>[
                        ...prev,
                        ...summaryCards
                    ]);
                if (!user && newTrialCount >= 2) {
                    setMessages((prev)=>[
                            ...prev,
                            {
                                sender: "ai",
                                text: [
                                    {
                                        title: "🚫 Trial Limit Reached",
                                        content: "You've used all 2 free trials. Register and buy setups to continue using MZPrimer AI."
                                    }
                                ]
                            }
                        ]);
                }
                // ✅ Saving logic
                if (userId) {
                    try {
                        console.log("🔄 Saving setup for user:", userId);
                        const finalRR = tpPrice && slPrice && entryPrice ? Math.abs(tpPrice - entryPrice) / Math.abs(entryPrice - slPrice) : 1.0;
                        // Save setup via Cloudflare API
                        const saveResponse = await fetch('/api/setups', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('cf_token')}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                symbol: symbol,
                                entry_price: entryPrice,
                                take_profit: tpPrice,
                                stop_loss: slPrice,
                                capital: capitalNumber,
                                lot_size: lotSize,
                                risk_reward: finalRR
                            })
                        });
                        if (!saveResponse.ok) {
                            throw new Error('Failed to save setup');
                        }
                        console.log("✅ Setup saved successfully");
                    } catch (err) {
                        console.error("❌ Failed to save setup:", err);
                        setMessages((prev)=>[
                                ...prev,
                                {
                                    sender: "ai",
                                    text: "⚠️ Analysis complete, but failed to save to history."
                                }
                            ]);
                    }
                }
            } catch (error) {
                console.error("❌ Error processing setup:", error?.message || error);
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: "❌ Error processing trade setup. Please try again."
                        }
                    ]);
            }
            setIsTyping(false);
        }
    };
    const showPaywall = !user && trialCount >= 2 || user && setupCount <= 0;
    if (showPaywall && !userLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "chatbox-wrapper section",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "license-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: "🔐 EXECUTIVE ACCESS REQUIRED"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 1228,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: user ? "You've used all your setup credits. Buy more setups to continue using advanced trading analysis." : "You've used all 2 free trials. Register or buy setups to continue using advanced trading analysis."
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 1229,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                    lineNumber: 1227,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "license-options",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "license-option",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "option-icon",
                                    children: "🎯"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 1239,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    children: "Buy Setups"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 1240,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Institutional AI analysis & precise lot sizing"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 1241,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        setShowPricingModal(true);
                                    },
                                    className: "btn-gold",
                                    disabled: isLoading,
                                    children: isLoading ? "Loading..." : "View Plans"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 1242,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 1238,
                            columnNumber: 11
                        }, this),
                        !user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "license-option",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "option-icon",
                                    children: "🔑"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 1254,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    children: "Register"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 1255,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Create account to get 1 free setup instantly"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 1256,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        handleRegisterFirst();
                                    },
                                    className: "btn-ghost-gold",
                                    children: "Register Now"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 1257,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 1253,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                    lineNumber: 1237,
                    columnNumber: 9
                }, this),
                showPricingModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PricingPlansModal, {
                    onClose: ()=>setShowPricingModal(false),
                    onPlanSelect: handlePlanSelect,
                    onRegisterClick: handleRegisterFirst
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                    lineNumber: 1270,
                    columnNumber: 11
                }, this),
                showQuickRegister && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickRegisterModal, {
                    onClose: ()=>setShowQuickRegister(false),
                    onSuccess: handleQuickRegisterSuccess,
                    selectedPlan: selectedPlan || "10"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                    lineNumber: 1278,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
            lineNumber: 1226,
            columnNumber: 7
        }, this);
    }
    if (userLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: mode === "full" ? "chatbox-wrapper full" : "chatbox-wrapper section",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chatbot-loading",
                children: "Loading AI Assistant..."
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                lineNumber: 1291,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
            lineNumber: 1290,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: mode === "full" ? "chatbox-wrapper full" : "chatbox-wrapper section",
        children: [
            showPricingModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PricingPlansModal, {
                onClose: ()=>setShowPricingModal(false),
                onPlanSelect: handlePlanSelect,
                onRegisterClick: handleRegisterFirst
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                lineNumber: 1299,
                columnNumber: 9
            }, this),
            showQuickRegister && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickRegisterModal, {
                onClose: ()=>setShowQuickRegister(false),
                onSuccess: handleQuickRegisterSuccess,
                selectedPlan: selectedPlan || "10"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                lineNumber: 1307,
                columnNumber: 9
            }, this),
            ticketData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$SignalTicket$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                data: ticketData,
                onClose: ()=>setTicketData(null)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                lineNumber: 1316,
                columnNumber: 9
            }, this),
            mode === "full" && onClose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chatbox-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: "MZPrimer AI Assistant"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                        lineNumber: 1324,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "chatbox-close",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                        lineNumber: 1325,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                lineNumber: 1323,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chatbox-body",
                ref: chatRef,
                children: [
                    messages.map((msg, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `chat-msg ${msg.sender === "ai" ? "ai" : "user"}`,
                            children: [
                                Array.isArray(msg.text) ? msg.text.map((block, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ai-card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ai-card-title",
                                                children: block.title
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                                lineNumber: 1337,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ai-card-content",
                                                dangerouslySetInnerHTML: {
                                                    __html: block.content.replace(/\n/g, "<br/>")
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                                lineNumber: 1338,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                        lineNumber: 1336,
                                        columnNumber: 17
                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: msg.sender === "user" ? "user-bubble" : "ai-bubble",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        dangerouslySetInnerHTML: {
                                            __html: msg.text.replace(/\n/g, "<br/>")
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                        lineNumber: 1348,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 1347,
                                    columnNumber: 15
                                }, this),
                                msg.text === "🚀 **Quick Setup:** Click any asset below for instant $1,000 analysis:" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "quick-action-buttons",
                                    children: QUICK_SYMBOLS.map((sym)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>executeQuickAnalysis(sym),
                                            className: "quick-action-btn",
                                            disabled: isTyping,
                                            children: sym
                                        }, sym, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                            lineNumber: 1360,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                    lineNumber: 1358,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, idx, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 1333,
                            columnNumber: 11
                        }, this)),
                    isTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chat-msg ai-msg",
                        children: "⏳ Analyzing market data..."
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                        lineNumber: 1373,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                lineNumber: 1331,
                columnNumber: 7
            }, this),
            step === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chatbox-input-group",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    value: symbol || "",
                    onChange: (e)=>{
                        const selected = e.target.value;
                        if (selected) handleUserInput(selected);
                    },
                    className: "chatbox-select",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Select a symbol…"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                            lineNumber: 1386,
                            columnNumber: 13
                        }, this),
                        ALL_SYMBOLS.map((sym)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: sym,
                                children: [
                                    SYMBOL_NAMES[sym],
                                    " (",
                                    sym,
                                    ")"
                                ]
                            }, sym, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                                lineNumber: 1388,
                                columnNumber: 15
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                    lineNumber: 1378,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                lineNumber: 1377,
                columnNumber: 9
            }, this),
            step === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: "chatbox-input-group",
                onSubmit: (e)=>{
                    e.preventDefault();
                    if (!capital.trim()) return;
                    handleUserInput(capital.trim());
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        name: "capital",
                        value: capital,
                        onChange: (e)=>setCapital(e.target.value),
                        placeholder: "Enter capital in USD…",
                        autoComplete: "off",
                        inputMode: "decimal",
                        step: "0.01",
                        min: "1",
                        className: "chatbox-input"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                        lineNumber: 1405,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "chatbox-submit",
                        children: "Analyze"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                        lineNumber: 1417,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                lineNumber: 1397,
                columnNumber: 9
            }, this),
            step === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chatbot-input",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        setStep(1);
                        setSymbol(null);
                        setCapital("");
                        setMessages([]);
                        scrollLocked.current = false;
                        setTicketData(null);
                    },
                    className: "chatbox-reset",
                    children: showPaywall ? "Buy More Setups" : "Start New Analysis"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                    lineNumber: 1425,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
                lineNumber: 1424,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx",
        lineNumber: 1297,
        columnNumber: 5
    }, this);
}
_s2(AiChatBox, "hpUi4JQ9mTuG5eUv4vQA1W0LdwE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c2 = AiChatBox;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "QuickRegisterModal");
__turbopack_context__.k.register(_c1, "PricingPlansModal");
__turbopack_context__.k.register(_c2, "AiChatBox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PropFirmChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/hooks/useUser.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/lib/fetchSetup.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f40$stripe$2f$stripe$2d$js$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/@stripe/stripe-js/lib/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f40$stripe$2f$stripe$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/@stripe/stripe-js/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useOneSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/hooks/useOneSetup.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$SignalTicket$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/SignalTicket.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
// components/PropFirmChat.tsx
"use client";
;
;
;
;
;
;
;
;
// ==========================================
// 🏆 PROP FIRM CONFIGURATION
// ==========================================
const PROP_COMPANIES = [
    {
        id: "ftmo",
        name: "FTMO"
    },
    {
        id: "fundednext",
        name: "FundedNext"
    },
    {
        id: "mff",
        name: "MyForexFunds"
    },
    {
        id: "fivepercenters",
        name: "The 5%ers"
    }
];
const PROP_STAGES = [
    {
        id: "step1",
        name: "Step 1: Challenge Phase",
        target: 0.10,
        dailyLoss: 0.05,
        maxLoss: 0.10,
        description: "Reach 10% profit target within 30 days"
    },
    {
        id: "step2",
        name: "Step 2: Verification Phase",
        target: 0.05,
        dailyLoss: 0.05,
        maxLoss: 0.10,
        description: "Reach 5% profit target within 60 days"
    },
    {
        id: "funded",
        name: "Funded Account",
        target: 0,
        dailyLoss: 0.05,
        maxLoss: 0.10,
        description: "No target - focus on consistent profits"
    }
];
const QUICK_SYMBOLS = [
    "XAUUSD",
    "BTCUSD",
    "US30",
    "USTEC",
    "EURUSD",
    "GBPUSD"
];
const ALL_SYMBOLS = [
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
const SYMBOL_NAMES = {
    EURUSD: "Euro / US Dollar",
    GBPUSD: "British Pound / US Dollar",
    USDJPY: "US Dollar / Japanese Yen",
    USDCAD: "US Dollar / Canadian Dollar",
    AUDUSD: "Australian Dollar / US Dollar",
    NZDUSD: "New Zealand Dollar / US Dollar",
    USDCHF: "US Dollar / Swiss Franc",
    EURJPY: "Euro / Japanese Yen",
    EURGBP: "Euro / British Pound",
    GBPJPY: "British Pound / Japanese Yen",
    GBPCHF: "British Pound / Swiss Franc",
    XAUUSD: "Gold / US Dollar",
    XAUEUR: "Gold / Euro",
    XAGUSD: "Silver / US Dollar",
    PLATINUM: "Platinum / US Dollar",
    BRENT: "Brent Crude Oil",
    BTCUSD: "Bitcoin / US Dollar",
    ETHUSD: "Ethereum / US Dollar",
    XRPUSD: "Ripple / US Dollar",
    LTCUSD: "Litecoin / US Dollar",
    DOGEUSD: "Dogecoin / US Dollar",
    US500: "S&P 500",
    USTEC: "Nasdaq 100",
    US30: "Dow Jones 30",
    HK50: "Hong Kong 50 stock index",
    FRANCE40: "FRANCE40",
    CHINA50: "CHINA50",
    UK100: "FTSE 100"
};
// ✅ EXACT MATCH WITH BACKEND PIP/CONTRACT SETTINGS
const SYMBOL_SPECS = {
    // Forex (Standard Lot = 100,000 units)
    "EURUSD": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "GBPUSD": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "USDJPY": {
        pip: 0.01,
        contract: 100000,
        decimals: 3
    },
    "USDCAD": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "AUDUSD": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "NZDUSD": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "USDCHF": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "EURJPY": {
        pip: 0.01,
        contract: 100000,
        decimals: 3
    },
    "EURGBP": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    "GBPJPY": {
        pip: 0.01,
        contract: 100000,
        decimals: 3
    },
    "GBPCHF": {
        pip: 0.0001,
        contract: 100000,
        decimals: 5
    },
    // Metals
    "XAUUSD": {
        pip: 0.01,
        contract: 100,
        decimals: 2
    },
    "XAUEUR": {
        pip: 0.01,
        contract: 100,
        decimals: 2
    },
    "XAGUSD": {
        pip: 0.001,
        contract: 5000,
        decimals: 3
    },
    "PLATINUM": {
        pip: 0.01,
        contract: 100,
        decimals: 2
    },
    // Energy
    "BRENT": {
        pip: 0.01,
        contract: 1000,
        decimals: 2
    },
    // Crypto - ADJUSTED FOR MT5 CONTRACT SIZES (Standard CFD lots)
    "BTCUSD": {
        pip: 1.0,
        contract: 1,
        decimals: 1
    },
    "ETHUSD": {
        pip: 0.1,
        contract: 1,
        decimals: 2
    },
    "XRPUSD": {
        pip: 0.0001,
        contract: 1000,
        decimals: 4
    },
    "LTCUSD": {
        pip: 0.01,
        contract: 10,
        decimals: 2
    },
    "DOGEUSD": {
        pip: 0.0001,
        contract: 1000,
        decimals: 4
    },
    // Indices (Standard Lot = 1 Contract)
    "US500": {
        pip: 0.1,
        contract: 1,
        decimals: 2
    },
    "USTEC": {
        pip: 0.1,
        contract: 1,
        decimals: 2
    },
    "US30": {
        pip: 1.0,
        contract: 1,
        decimals: 1
    },
    "HK50": {
        pip: 0.1,
        contract: 1,
        decimals: 2
    },
    "FRANCE40": {
        pip: 0.1,
        contract: 1,
        decimals: 2
    },
    "CHINA50": {
        pip: 0.1,
        contract: 1,
        decimals: 1
    },
    "UK100": {
        pip: 0.1,
        contract: 1,
        decimals: 1
    }
};
// ==========================================
// 💾 LOCAL STORAGE TRIAL FUNCTIONS
// ==========================================
const getTrialCount = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const saved = localStorage.getItem("MZP_PROP_TRIAL_COUNT");
    return saved ? parseInt(saved) : 0;
};
const incrementTrialCount = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const current = getTrialCount();
    const newCount = current + 1;
    localStorage.setItem("MZP_PROP_TRIAL_COUNT", newCount.toString());
    return newCount;
};
// ==========================================
// 🖼️ MODAL COMPONENTS
// ==========================================
// Quick Registration Modal
function QuickRegisterModal({ onClose, onSuccess, selectedPlan }) {
    _s();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleQuickRegister = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }
        try {
            // Register with Cloudflare API
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    displayName: email.split('@')[0]
                })
            });
            const data = await response.json();
            if (data.success) {
                const user = data.user;
                // Store session
                localStorage.setItem('cf_token', data.token);
                localStorage.setItem('cf_user', JSON.stringify(user));
                localStorage.setItem('cf_session_id', data.sessionId);
                onSuccess(user, selectedPlan);
            } else {
                if (data.error.includes('already exists')) {
                    setError("This email is already registered. Please login instead.");
                } else if (data.error.includes('Invalid email')) {
                    setError("Invalid email address format.");
                } else if (data.error.includes('weak password')) {
                    setError("Password is too weak. Please use a stronger password.");
                } else {
                    setError(data.error || "Registration failed. Please try again.");
                }
            }
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally{
            setLoading(false);
        }
    };
    const modalContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-overlay",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal-content",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: "🎯 Quick Registration"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 238,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "close-modal",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 240,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                    lineNumber: 237,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleQuickRegister,
                    className: "quick-register-form",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Email Address"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 245,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    value: email,
                                    onChange: (e)=>setEmail(e.target.value),
                                    placeholder: "your@email.com",
                                    required: true,
                                    disabled: loading
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 246,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Password (min 6 characters)"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 257,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    value: password,
                                    onChange: (e)=>setPassword(e.target.value),
                                    placeholder: "Enter your password",
                                    required: true,
                                    disabled: loading
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 258,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 256,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Confirm Password"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 269,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    value: confirmPassword,
                                    onChange: (e)=>setConfirmPassword(e.target.value),
                                    placeholder: "Confirm your password",
                                    required: true,
                                    disabled: loading
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 270,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 268,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "error-message",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 281,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-actions",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "primary-btn",
                                    children: loading ? "Creating Account..." : `Register & Continue to Payment`
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 287,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "secondary-btn",
                                    disabled: loading,
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 294,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 286,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "registration-note",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "📧 We'll send a verification email. You can verify later and start using your setups immediately."
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                lineNumber: 305,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 304,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                    lineNumber: 243,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
            lineNumber: 236,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
        lineNumber: 235,
        columnNumber: 5
    }, this);
    // This sends the modal to the bottom of <body>
    return typeof document !== "undefined" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(modalContent, document.body) : null;
}
_s(QuickRegisterModal, "XKj1ZF4AqNGPTZ91vF5agbeVxKg=");
_c = QuickRegisterModal;
// Pricing Plans Modal
function PricingPlansModal({ onClose, onPlanSelect, onRegisterClick }) {
    _s1();
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PricingPlansModal.useEffect": ()=>{
            if (scrollRef.current) {
                // Scrolls the container to the middle on mount
                const container = scrollRef.current;
                const scrollAmount = (container.scrollWidth - container.offsetWidth) / 2;
                container.scrollLeft = scrollAmount;
            }
        }
    }["PricingPlansModal.useEffect"], []);
    const plans = [
        {
            id: "10",
            name: "Basic Plan",
            setups: "10 Setups",
            price: "€4.50",
            popular: false
        },
        {
            id: "20",
            name: "Pro Plan",
            setups: "20 Setups",
            price: "€8.00",
            popular: true
        },
        {
            id: "30",
            name: "Elite Plan",
            setups: "30 Setups",
            price: "€12.00",
            popular: false
        }
    ];
    const modalContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-overlay",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal-content pricing-modal",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: "🎯 Choose Your Setup Plan"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 349,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Select a plan that fits your trading needs"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 350,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "close-modal",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 351,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                    lineNumber: 348,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pricing-options",
                    ref: scrollRef,
                    children: plans.map((plan)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `pricing-card ${plan.popular ? 'popular' : ''}`,
                            children: [
                                plan.popular && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "popular-badge",
                                    children: "MOST POPULAR"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 360,
                                    columnNumber: 32
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "plan-header",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            children: plan.name
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                            lineNumber: 363,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "setups-count",
                                            children: plan.setups
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                            lineNumber: 364,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 362,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "plan-price",
                                    children: plan.price
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 367,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onPlanSelect(plan.id),
                                    className: "select-plan-btn",
                                    children: "Select Plan"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 371,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, plan.id, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 356,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                    lineNumber: 354,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pricing-footer",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "register-option",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "🔑 Create Account First"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                lineNumber: 383,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Register to get 1 free setup and manage your credits"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                lineNumber: 384,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onRegisterClick,
                                className: "register-first-btn",
                                children: "Register Now (Get 1 Free Setup)"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                lineNumber: 385,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                        lineNumber: 382,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                    lineNumber: 381,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
            lineNumber: 347,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
        lineNumber: 346,
        columnNumber: 5
    }, this);
    // This sends the modal to the bottom of <body>
    return typeof document !== "undefined" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(modalContent, document.body) : null;
}
_s1(PricingPlansModal, "P14GFulhWAl/Oec4Pk4QeBwKyr0=");
_c1 = PricingPlansModal;
function PropFirmChat({ onClose, preselectedSymbol }) {
    _s2();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0); // 0=Firm, 1=Stage, 2=Balance, 3=Symbol, 4=Result
    const [selectedFirm, setSelectedFirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [stage, setStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [capital, setCapital] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [symbol, setSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isTyping, setIsTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { userId, setupCount, user, isLoading: userLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const chatRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [trialCount, setTrialCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Modal states
    const [showPricingModal, setShowPricingModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showQuickRegister, setShowQuickRegister] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedPlan, setSelectedPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Signal Ticket State
    const [ticketData, setTicketData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const stripePromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f40$stripe$2f$stripe$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadStripe"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropFirmChat.useEffect": ()=>{
            const count = getTrialCount();
            setTrialCount(count);
        }
    }["PropFirmChat.useEffect"], [
        userId
    ]);
    // ==========================================
    // ⚡ NEW: PRESELECTED SYMBOL EFFECT
    // ==========================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropFirmChat.useEffect": ()=>{
            if (preselectedSymbol && ALL_SYMBOLS.includes(preselectedSymbol)) {
                // Small timeout ensures the modal animation finishes before analysis starts
                const timer = setTimeout({
                    "PropFirmChat.useEffect.timer": ()=>{
                        startPropWorkflow(preselectedSymbol);
                    }
                }["PropFirmChat.useEffect.timer"], 600);
                return ({
                    "PropFirmChat.useEffect": ()=>clearTimeout(timer)
                })["PropFirmChat.useEffect"];
            }
        }
    }["PropFirmChat.useEffect"], [
        preselectedSymbol
    ]);
    const startPropWorkflow = (sym)=>{
        if (ALL_SYMBOLS.includes(sym)) {
            setSymbol(sym);
            setMessages([
                {
                    sender: "ai",
                    text: `🚀 **Prop Firm Analysis: ${sym}**\n\nTo calculate your compliant lot size, please select your Prop Firm:`,
                    actions: PROP_COMPANIES.map((c)=>({
                            label: c.name,
                            value: c.id
                        }))
                }
            ]);
            setStep(0);
        }
    };
    // ==========================================
    // 💳 PAYMENT & REGISTRATION HANDLERS
    // ==========================================
    const handleBuySetups = async (plan, userEmail)=>{
        if (!user) {
            console.error("No user found for purchase");
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch("/api/checkout/create-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user.id,
                    plan: plan,
                    email: user.email || userEmail
                })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Checkout URL not received.");
            }
        } catch (error) {
            console.error("Buy setup error:", error);
            alert(`Failed to start checkout: ${error.message}`);
        } finally{
            setIsLoading(false);
        }
    };
    const handlePlanSelect = (plan)=>{
        setSelectedPlan(plan);
        if (user) {
            handleBuySetups(plan);
            setShowPricingModal(false);
        } else {
            setShowPricingModal(false);
            setShowQuickRegister(true);
        }
    };
    const handleQuickRegisterSuccess = (newUser, plan)=>{
        setShowQuickRegister(false);
        handleBuySetups(plan, newUser.email);
    };
    const handleRegisterFirst = ()=>{
        setShowPricingModal(false);
        setShowQuickRegister(true);
        setSelectedPlan("10");
    };
    const incrementTrial = async ()=>{
        const newCount = incrementTrialCount();
        setTrialCount(newCount);
        return newCount;
    };
    // ==========================================
    // 🎯 STEP 0: FIRM SELECTION
    // ==========================================
    const handleFirmSelect = (firmId)=>{
        const firmName = PROP_COMPANIES.find((f)=>f.id === firmId)?.name;
        setSelectedFirm(firmId);
        setMessages((prev)=>[
                ...prev,
                {
                    sender: "user",
                    text: firmName || firmId
                },
                {
                    sender: "ai",
                    text: `🏢 Targeting **${firmName}** rules.\n\nWhich stage are you currently in?`,
                    actions: PROP_STAGES.map((s)=>({
                            label: s.name,
                            value: s.id
                        }))
                }
            ]);
        setStep(1);
    };
    // ==========================================
    // 🎯 STEP 1: STAGE SELECTION
    // ==========================================
    const handleStageSelect = (stageId)=>{
        const selected = PROP_STAGES.find((s)=>s.id === stageId);
        if (!selected) return;
        setStage(selected);
        setMessages((prev)=>[
                ...prev,
                {
                    sender: "user",
                    text: selected.name
                },
                {
                    sender: "ai",
                    text: `✅ **${selectedFirm.toUpperCase()}: ${selected.name} Rules Loaded**\n\n🎯 Profit Target: ${selected.target > 0 ? `${(selected.target * 100).toFixed(0)}%` : 'No target (Consistency Focus)'}\n⚠️ Max Daily Loss: ${(selected.dailyLoss * 100).toFixed(1)}%\n⛔ Max Overall Loss: ${(selected.maxLoss * 100).toFixed(1)}%\n\n${selected.description}\n\n💰 **What is your account balance?**`
                }
            ]);
        setStep(2);
    };
    // ==========================================
    // 💰 STEP 2: CAPITAL INPUT
    // ==========================================
    const handleCapitalInput = (val)=>{
        const balance = parseFloat(val);
        if (isNaN(balance) || balance <= 0 || balance > 10000000) {
            setMessages((prev)=>[
                    ...prev,
                    {
                        sender: "ai",
                        text: "⚠️ Please enter a valid account balance (1 - 10,000,000 USD)."
                    }
                ]);
            return;
        }
        setCapital(val);
        const displaySymbol = symbol || "selected asset";
        setMessages((prev)=>[
                ...prev,
                {
                    sender: "user",
                    text: `$${balance.toLocaleString()}`
                },
                {
                    sender: "ai",
                    text: `📊 Account: $${balance.toLocaleString()}\n🏢 Firm: ${selectedFirm.toUpperCase()}\n💵 Daily Loss Limit: **$${(balance * (stage?.dailyLoss || 0.05)).toLocaleString()}**\n\nSelect an asset to analyze. I will calculate lot sizes that keep you safe from drawdown violations:`,
                    actions: QUICK_SYMBOLS.map((s)=>({
                            label: s,
                            value: s
                        }))
                }
            ]);
        setStep(3);
    };
    // ==========================================
    // ⚡ WELCOME MESSAGE (when no preselected symbol)
    // ==========================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropFirmChat.useEffect": ()=>{
            if (!preselectedSymbol && messages.length === 0 && !userLoading) {
                setTimeout({
                    "PropFirmChat.useEffect": ()=>{
                        setMessages([
                            {
                                sender: "ai",
                                text: "🏆 **Prop Firm AI Assistant**\n\nI'm calibrated for FTMO, FundedNext, MyForexFunds & The5%ers rules.\n\nPlease select your Prop Firm:",
                                actions: PROP_COMPANIES.map({
                                    "PropFirmChat.useEffect": (c)=>({
                                            label: c.name,
                                            value: c.id
                                        })
                                }["PropFirmChat.useEffect"])
                            }
                        ]);
                        setStep(0);
                    }
                }["PropFirmChat.useEffect"], 500);
            }
        }
    }["PropFirmChat.useEffect"], [
        messages.length,
        userLoading,
        preselectedSymbol
    ]);
    // ==========================================
    // 🔄 SCROLL HANDLING
    // ==========================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropFirmChat.useEffect": ()=>{
            if (chatRef.current) {
                chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }
        }
    }["PropFirmChat.useEffect"], [
        messages
    ]);
    // ==========================================
    // 📈 STEP 3: SYMBOL ANALYSIS (Prop Firm Version)
    // ==========================================
    const executePropAnalysis = async (targetSymbol)=>{
        if (!stage || !capital || !selectedFirm) return;
        const balance = parseFloat(capital);
        const dailyLimit = balance * stage.dailyLoss;
        const maxRiskPerTrade = dailyLimit * 0.25; // Only risk 25% of daily limit per trade
        // Check access first
        if (!user && trialCount >= 2) {
            setShowPricingModal(true);
            return;
        }
        let proceed = false;
        let newTrialCount = trialCount;
        // Access Control Logic
        if (user) {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useOneSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOneSetup"])();
            if (result === "ok") {
                proceed = true;
            } else if (result === "no-credits") {
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: [
                                {
                                    title: "❌ No Setups Left",
                                    content: "You've used all your setup credits. Please buy more to continue."
                                }
                            ]
                        }
                    ]);
                // Add buy more setups button
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: [
                                {
                                    title: "🛒 Buy More Setups",
                                    content: `<button onclick="window.location.href='/client/dashboard?showPlans=true'" style="background: #22c55e; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                  View Pricing Plans
                </button>`
                                }
                            ]
                        }
                    ]);
                return;
            } else {
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: "⚠️ Error verifying account. Try again."
                        }
                    ]);
                return;
            }
        } else {
            if (trialCount < 2) {
                newTrialCount = incrementTrialCount();
                setTrialCount(newTrialCount);
                proceed = true;
            } else {
                setShowPricingModal(true);
                return;
            }
        }
        setSymbol(targetSymbol);
        setMessages((prev)=>[
                ...prev,
                {
                    sender: "user",
                    text: `Analyze ${targetSymbol}`
                }
            ]);
        setIsTyping(true);
        try {
            const setup = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSetup"])(targetSymbol);
            if (!setup) {
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: "⚠️ Setup not available. Try again later."
                        }
                    ]);
                setIsTyping(false);
                return;
            }
            // ✅ SAFE confidence access
            const confidenceScore = setup.risk_score?.confidence_score ?? setup.confidence?.confidence_score ?? 50;
            // ✅ SAFE EMBEDDED SYMBOL SPECS
            const symbolSpec = SYMBOL_SPECS[targetSymbol] || {
                pip: 0.0001,
                contract: 100000,
                decimals: 5
            };
            const contract = symbolSpec.contract;
            const decimalPlaces = symbolSpec.decimals;
            // ✅ EXTRACT ORDER DATA
            const hasValidOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasValidPendingOrders"])(setup);
            const primaryOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrimaryOrder"])(setup);
            const allOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllPendingOrders"])(setup);
            const orderConfidence = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOrderConfidence"])(setup);
            const marketContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchSetup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMarketContext"])(setup);
            let entryPrice = 0;
            let slPrice = 0;
            let tpPrice = 0;
            let rrRatio = 1.0;
            let orderType = "MARKET";
            let orderRationale = "No specific order generated";
            if (hasValidOrders && primaryOrder) {
                entryPrice = Number(primaryOrder.entry_price) || 0;
                slPrice = Number(primaryOrder.sl_price) || 0;
                tpPrice = Number(primaryOrder.tp_price) || 0;
                rrRatio = Number(primaryOrder.rr_ratio) || 1.0;
                orderType = primaryOrder.type || "LIMIT";
                orderRationale = primaryOrder.rationale || "Algorithm generated";
            } else {
                // Fallback
                const currentPrice = setup.pending_orders?.current_price || 0;
                entryPrice = currentPrice;
                slPrice = entryPrice * 0.99;
                tpPrice = entryPrice * 1.01;
                orderRationale = "Fallback estimation";
            }
            // ✅ PROP FIRM RISK CALCULATION
            const priceDifference = Math.abs(entryPrice - slPrice);
            const riskPerTradePerLot = priceDifference * contract;
            // Use maxRiskPerTrade (25% of daily limit) instead of 2% of balance
            const maxRiskAmount = Math.min(maxRiskPerTrade, balance * 0.02); // Cap at 2% of balance
            // ✅ FIX: Prevent division by zero & enforce min 0.01 lot
            let lotSize = 0;
            if (riskPerTradePerLot > 0.00000001) {
                const rawLots = maxRiskAmount / riskPerTradePerLot;
                lotSize = parseFloat(rawLots.toFixed(2)); // Round to 2 decimals
                // Enforce minimum 0.01 lot if valid trade
                if (lotSize < 0.01) lotSize = 0.01;
            } else {
                lotSize = 0.0; // Invalid trade parameters
            }
            const actualRiskAmount = riskPerTradePerLot * lotSize;
            const riskPercentageOfBalance = balance > 0 ? actualRiskAmount / balance * 100 : 0;
            const riskPercentageOfDailyLimit = dailyLimit > 0 ? actualRiskAmount / dailyLimit * 100 : 0;
            // Calculate distances for display
            const slDistanceUSD = Math.abs(slPrice - entryPrice) * contract * lotSize;
            const tpDistanceUSD = Math.abs(tpPrice - entryPrice) * contract * lotSize;
            const starRating = Math.min(5, Math.max(1, Math.floor(confidenceScore / 20)));
            const stars = "⭐".repeat(starRating) + "☆".repeat(5 - starRating);
            const signalStrength = confidenceScore < 60 ? "WEAK" : confidenceScore < 80 ? "MODERATE" : "STRONG";
            const signalWarning = confidenceScore < 60 ? "⚠️ **LOW CONFIDENCE** – Consider waiting for better setup to protect your challenge." : "✅ **PROP-FRIENDLY SETUP** – Trade aligns with challenge rules.";
            const decision = setup.final_decision || "WAIT";
            // Calculate progress towards target
            const targetProfitUSD = stage.target > 0 ? balance * stage.target : 0;
            const tradeProfitRatio = tpDistanceUSD / targetProfitUSD;
            const tradesNeeded = stage.target > 0 ? Math.ceil(targetProfitUSD / tpDistanceUSD) : 0;
            // 🚀 SHOW SIGNAL TICKET POPUP
            setTicketData({
                symbol: targetSymbol,
                action: decision,
                entry: entryPrice.toFixed(decimalPlaces),
                sl: slPrice.toFixed(decimalPlaces),
                tp: tpPrice.toFixed(decimalPlaces),
                lot: lotSize.toFixed(2),
                slDistanceUSD,
                tpDistanceUSD
            });
            // Create PROP FIRM specific summary blocks
            const summary = [
                {
                    title: "🏢 FIRM COMPLIANCE",
                    content: `• Prop Firm: <strong>${selectedFirm.toUpperCase()}</strong>\n` + `• Stage: <strong>${stage.name}</strong>\n` + `• Daily Cap: <strong>$${dailyLimit.toFixed(0)}</strong>\n` + `• Trade Risk: <span style="color:#3b82f6;"><strong>$${actualRiskAmount.toFixed(2)} (${riskPercentageOfDailyLimit.toFixed(1)}% of limit)</strong></span>\n` + `• Status: <span style="color:${riskPercentageOfDailyLimit <= 25 ? '#10b981' : '#f59e0b'}"><strong>${riskPercentageOfDailyLimit <= 25 ? '✓ SAFE' : '⚠ WARNING'}</strong></span> • Uses ${riskPercentageOfDailyLimit.toFixed(1)}% of daily allowance`
                },
                {
                    title: "🎯 TRADE SIGNAL",
                    content: `• Symbol: <strong>${targetSymbol} (${SYMBOL_NAMES[targetSymbol] || targetSymbol})</strong>\n` + `• Decision: ${decision === "BUY" ? '<span class="buy"><strong>BUY</strong></span> 📈' : decision === "SELL" ? '<span class="sell"><strong>SELL</strong></span> 📉' : '<span class="wait"><strong>WAIT</strong></span> ⏳'}\n` + `• Order Type: <strong>${orderType}</strong>\n` + `• Confidence: <strong>${confidenceScore}%</strong> ${stars}\n` + `• Signal: <strong>${signalStrength}</strong>\n` + `• Market Context: <strong>${marketContext}</strong>`
                },
                {
                    title: "⚡ TRADE PARAMETERS",
                    content: `• Entry Price: <strong>${entryPrice.toFixed(decimalPlaces)}</strong>\n` + `• Stop Loss: <strong>${slPrice.toFixed(decimalPlaces)}</strong> (<span style="color:red;">-$${slDistanceUSD.toFixed(2)}</span>)\n` + `• Take Profit: <strong>${tpPrice.toFixed(decimalPlaces)}</strong> (<span style="color:green;">$${tpDistanceUSD.toFixed(2)}</span>)\n` + `• Risk/Reward: <strong>${rrRatio.toFixed(2)}:1</strong>\n` + `• Strategy: ${orderRationale}`
                },
                {
                    title: stage.target > 0 ? "📊 TARGET PROGRESS" : "💰 PROFIT POTENTIAL",
                    content: stage.target > 0 ? `• Target Profit: <strong>$${targetProfitUSD.toFixed(2)}</strong> (${(stage.target * 100).toFixed(1)}%)\n` + `• This Trade: <strong>$${tpDistanceUSD.toFixed(2)}</strong> (${(tradeProfitRatio * 100).toFixed(1)}% of target)\n` + `• Trades Needed: <strong>${tradesNeeded}</strong> to complete challenge\n` + `• Completion Time: <strong>${Math.ceil(tradesNeeded / 2)} days</strong> (at 2 trades/day)` : `• Trade Profit: <strong>$${tpDistanceUSD.toFixed(2)}</strong>\n` + `• Monthly Potential: <strong>$${(tpDistanceUSD * 20).toFixed(2)}</strong> (20 trades/month)\n` + `• Risk/Reward: <strong>${rrRatio.toFixed(2)}:1</strong> (Prop Firm Approved)`
                }
            ];
            // Add order details if available
            if (hasValidOrders) {
                summary.push({
                    title: "📋 ORDER DETAILS",
                    content: `• Total Pending Orders: <strong>${allOrders.length}</strong>\n` + `• Order Confidence: <strong>${orderConfidence}%</strong>\n` + `• Primary Order Rationale: ${orderRationale}`
                });
            }
            // Convert summary blocks to chat messages
            const summaryCards = summary.map((block)=>({
                    sender: "ai",
                    text: [
                        {
                            title: block.title,
                            content: block.content
                        }
                    ]
                }));
            setMessages((prev)=>[
                    ...prev,
                    ...summaryCards
                ]);
            // ✅ Saving logic
            if (userId) {
                try {
                    console.log("🔄 Saving prop firm setup for user:", userId);
                    const finalRR = tpPrice && slPrice && entryPrice ? Math.abs(tpPrice - entryPrice) / Math.abs(entryPrice - slPrice) : 1.0;
                    // Save setup via Cloudflare API
                    const saveResponse = await fetch('/api/setups', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('cf_token')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            symbol: targetSymbol,
                            entry_price: entryPrice,
                            take_profit: tpPrice,
                            stop_loss: slPrice,
                            capital: balance,
                            lot_size: lotSize,
                            risk_reward: finalRR
                        })
                    });
                    if (!saveResponse.ok) {
                        throw new Error('Failed to save setup');
                    }
                    console.log("✅ Prop firm setup saved successfully");
                } catch (err) {
                    console.error("❌ Failed to save prop firm setup:", err);
                    setMessages((prev)=>[
                            ...prev,
                            {
                                sender: "ai",
                                text: "⚠️ Analysis complete, but failed to save to history."
                            }
                        ]);
                }
            }
            if (!user && newTrialCount >= 2) {
                setMessages((prev)=>[
                        ...prev,
                        {
                            sender: "ai",
                            text: [
                                {
                                    title: "🚫 TRIAL LIMIT REACHED",
                                    content: "You've used all 2 free trials. Register and buy setups to continue using Prop Firm AI Assistant."
                                }
                            ]
                        }
                    ]);
            }
        } catch (error) {
            console.error("❌ Error processing prop firm setup:", error?.message || error);
            setMessages((prev)=>[
                    ...prev,
                    {
                        sender: "ai",
                        text: "❌ Error processing trade setup. Please try again."
                    }
                ]);
        } finally{
            setIsTyping(false);
            setStep(4);
        }
    };
    // ==========================================
    // 🎨 RENDER - WITH PAYWALL SUPPORT
    // ==========================================
    const showPaywall = !user && trialCount >= 2 || user && setupCount <= 0;
    if (showPaywall && !userLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "chatbox-wrapper section",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "license-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: "🔐 EXECUTIVE ACCESS REQUIRED"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 956,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: user ? "You've used all your setup credits. Buy more setups to continue using advanced trading analysis." : "You've used all 2 free trials. Register or buy setups to continue using advanced trading analysis."
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 957,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                    lineNumber: 955,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "license-options",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "license-option",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "option-icon",
                                    children: "🎯"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 967,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    children: "Buy Setups"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 968,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Get more setup credits to continue using prop firm AI analysis"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 969,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        setShowPricingModal(true);
                                    },
                                    className: "btn-gold",
                                    disabled: isLoading,
                                    children: isLoading ? "Loading..." : "View Plans"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 970,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 966,
                            columnNumber: 11
                        }, this),
                        !user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "license-option",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "option-icon",
                                    children: "🔑"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 982,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    children: "Register"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 983,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Create account to get 1 free setup instantly"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 984,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        handleRegisterFirst();
                                    },
                                    className: "btn-ghost-gold",
                                    children: "Register Now"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 985,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 981,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                    lineNumber: 965,
                    columnNumber: 9
                }, this),
                showPricingModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PricingPlansModal, {
                    onClose: ()=>setShowPricingModal(false),
                    onPlanSelect: handlePlanSelect,
                    onRegisterClick: handleRegisterFirst
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                    lineNumber: 998,
                    columnNumber: 11
                }, this),
                showQuickRegister && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickRegisterModal, {
                    onClose: ()=>setShowQuickRegister(false),
                    onSuccess: handleQuickRegisterSuccess,
                    selectedPlan: selectedPlan || "10"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                    lineNumber: 1006,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
            lineNumber: 954,
            columnNumber: 7
        }, this);
    }
    if (userLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "chatbox-wrapper section",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chatbot-loading",
                children: "Loading Prop Firm Assistant..."
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                lineNumber: 1018,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
            lineNumber: 1017,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "chatbox-wrapper section",
        children: [
            showPricingModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PricingPlansModal, {
                onClose: ()=>setShowPricingModal(false),
                onPlanSelect: handlePlanSelect,
                onRegisterClick: handleRegisterFirst
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                lineNumber: 1027,
                columnNumber: 9
            }, this),
            showQuickRegister && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickRegisterModal, {
                onClose: ()=>setShowQuickRegister(false),
                onSuccess: handleQuickRegisterSuccess,
                selectedPlan: selectedPlan || "10"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                lineNumber: 1035,
                columnNumber: 9
            }, this),
            ticketData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$SignalTicket$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                data: ticketData,
                onClose: ()=>setTicketData(null)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                lineNumber: 1044,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chatbox-body",
                ref: chatRef,
                children: [
                    messages.map((msg, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `chat-msg ${msg.sender === "ai" ? "ai" : "user"}`,
                            children: Array.isArray(msg.text) ? msg.text.map((block, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "ai-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ai-card-title",
                                            children: block.title
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                            lineNumber: 1057,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ai-card-content",
                                            dangerouslySetInnerHTML: {
                                                __html: block.content.replace(/\n/g, "<br/>")
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                            lineNumber: 1058,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                    lineNumber: 1056,
                                    columnNumber: 17
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: msg.sender === "user" ? "user-bubble" : "ai-bubble",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        dangerouslySetInnerHTML: {
                                            __html: typeof msg.text === 'string' ? msg.text.replace(/\n/g, "<br/>") : ''
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                        lineNumber: 1068,
                                        columnNumber: 17
                                    }, this),
                                    msg.actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "chat-actions-grid",
                                        children: msg.actions.map((action)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    if (step === 0) {
                                                        handleFirmSelect(action.value);
                                                    } else if (step === 1) {
                                                        handleStageSelect(action.value);
                                                    } else if (step === 3 && ALL_SYMBOLS.includes(action.value)) {
                                                        executePropAnalysis(action.value);
                                                    }
                                                },
                                                className: "chat-action-btn",
                                                disabled: isTyping,
                                                children: action.label
                                            }, action.value, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                                lineNumber: 1078,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                        lineNumber: 1076,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                lineNumber: 1067,
                                columnNumber: 15
                            }, this)
                        }, idx, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 1053,
                            columnNumber: 11
                        }, this)),
                    isTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chat-msg ai-msg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ai-bubble",
                            children: "⏳ Calculating prop firm compliant lot sizes..."
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 1104,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                        lineNumber: 1103,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                lineNumber: 1051,
                columnNumber: 7
            }, this),
            step === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: "chatbox-input-group",
                onSubmit: (e)=>{
                    e.preventDefault();
                    handleCapitalInput(capital.trim());
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        value: capital,
                        onChange: (e)=>setCapital(e.target.value),
                        placeholder: "Enter account balance in USD…",
                        autoComplete: "off",
                        inputMode: "decimal",
                        step: "0.01",
                        min: "1",
                        max: "10000000",
                        className: "chatbox-input",
                        autoFocus: true
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                        lineNumber: 1120,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "chatbox-submit",
                        children: "Next"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                        lineNumber: 1133,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                lineNumber: 1113,
                columnNumber: 9
            }, this),
            step === 3 && !isTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chatbox-input-group",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    value: symbol || "",
                    onChange: (e)=>{
                        const selected = e.target.value;
                        if (ALL_SYMBOLS.includes(selected)) {
                            executePropAnalysis(selected);
                        }
                    },
                    className: "chatbox-select",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Or select any symbol…"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                            lineNumber: 1152,
                            columnNumber: 13
                        }, this),
                        ALL_SYMBOLS.map((sym)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: sym,
                                children: [
                                    SYMBOL_NAMES[sym],
                                    " (",
                                    sym,
                                    ")"
                                ]
                            }, sym, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                                lineNumber: 1154,
                                columnNumber: 15
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                    lineNumber: 1142,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                lineNumber: 1141,
                columnNumber: 9
            }, this),
            step === 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chatbot-input",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        setStep(0);
                        setSelectedFirm("");
                        setStage(null);
                        setCapital("");
                        setSymbol(preselectedSymbol && ALL_SYMBOLS.includes(preselectedSymbol) ? preselectedSymbol : null);
                        setMessages([]);
                        setTicketData(null);
                    },
                    className: "chatbox-reset",
                    children: showPaywall ? "Buy More Setups" : "Start New Prop Firm Analysis"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                    lineNumber: 1165,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
                lineNumber: 1164,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx",
        lineNumber: 1024,
        columnNumber: 5
    }, this);
}
_s2(PropFirmChat, "t+VIJJQv+MWHzeLdTdosShxu1U8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c2 = PropFirmChat;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "QuickRegisterModal");
__turbopack_context__.k.register(_c1, "PricingPlansModal");
__turbopack_context__.k.register(_c2, "PropFirmChat");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    // Get user from localStorage (Cloudflare auth)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserAnalytics.useEffect": ()=>{
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
    // Fetch setups from Cloudflare API
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
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "loading-spinner"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 434,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Loading analytics..."
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 435,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                lineNumber: 433,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
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
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                    lineNumber: 444,
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
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                            lineNumber: 447,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                    lineNumber: 445,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
            lineNumber: 443,
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
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                    lineNumber: 458,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "no-data",
                    children: [
                        "No trading data available yet. Start using setups to see your analytics.",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                            lineNumber: 461,
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
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                            lineNumber: 462,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                    lineNumber: 459,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
            lineNumber: 457,
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
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                lineNumber: 472,
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
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                lineNumber: 475,
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
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 496,
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
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                    lineNumber: 498,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 491,
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
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 509,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "MONTH",
                                children: "Last 30 Days"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 510,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "WEEK",
                                children: "Last 7 Days"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 511,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 504,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                lineNumber: 490,
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
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 518,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metric-label",
                                children: "Total Setups"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 519,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 517,
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
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 522,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metric-label",
                                children: "Win Rate"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 523,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 521,
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
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 526,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metric-label",
                                children: "Net P&L"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 529,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 525,
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
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 532,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metric-label",
                                children: "ROI"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 533,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 531,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                lineNumber: 516,
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
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 540,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-label",
                                children: "Total Profit"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 541,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 539,
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
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 544,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-label",
                                children: "Total Loss"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 545,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 543,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "profit-loss-card neutral",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-value",
                                children: profitLossData.profitFactor === Infinity ? "∞" : profitLossData.profitFactor.toFixed(2)
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 548,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-label",
                                children: "Profit Factor"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 549,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 547,
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
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 552,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-label",
                                children: "Avg P&L/Trade"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 553,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 551,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                lineNumber: 538,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "trading-style-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        children: "🎯 Your Trading Style"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 559,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "style-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "style-type",
                                children: tradingStyle.type
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 561,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "style-confidence",
                                children: [
                                    tradingStyle.confidence.toFixed(0),
                                    "% Match"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 562,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 560,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "style-description",
                        children: tradingStyle.description
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 564,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "style-characteristics",
                        children: tradingStyle.characteristics.map((char, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "characteristic-tag",
                                children: char
                            }, index, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 567,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 565,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                lineNumber: 558,
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
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 576,
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
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                    lineNumber: 591,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 579,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 594,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                    lineNumber: 578,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 577,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 575,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "analytics-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Profit by Symbol"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 601,
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
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 604,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 605,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            formatter: (value)=>[
                                                    `$${value.toFixed(2)}`,
                                                    "Profit"
                                                ],
                                            labelFormatter: (label)=>`Symbol: ${label}`
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 606,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                            dataKey: "profit",
                                            fill: "#8884d8",
                                            name: "Profit"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 610,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                    lineNumber: 603,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 602,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 600,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "analytics-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Monthly Profit Trend"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 621,
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
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 624,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                            dataKey: "month"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 625,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 626,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            formatter: (value)=>[
                                                    `$${value.toFixed(2)}`,
                                                    "Profit"
                                                ],
                                            labelFormatter: (label)=>`Month: ${label}`
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 627,
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
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 631,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                    lineNumber: 623,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 622,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 620,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "analytics-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Performance Metrics"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 645,
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
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 648,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 649,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            formatter: (value)=>[
                                                    `${value.toFixed(1)}`,
                                                    "Value"
                                                ]
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 650,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                            dataKey: "value",
                                            fill: "#F59E0B"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 651,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                    lineNumber: 647,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 646,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 644,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                lineNumber: 573,
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
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 660,
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
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 663,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    avgRiskReward.toFixed(2),
                                                    ":1"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 664,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                        lineNumber: 662,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "High Risk Trades:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 667,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: highRiskSetups
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 668,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                        lineNumber: 666,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Low Risk Trades:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 671,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: lowRiskSetups
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 672,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                        lineNumber: 670,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 661,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 659,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stats-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                children: "Symbol Analysis"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 678,
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
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 681,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: topSymbol
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 682,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                        lineNumber: 680,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Unique Symbols:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 685,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: symbolUsage.length
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 686,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                        lineNumber: 684,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Symbol Concentration:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 689,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    ((symbolUsage[0]?.count || 0) / totalSetups * 100).toFixed(1),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 690,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                        lineNumber: 688,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 679,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 677,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stats-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                children: "Volume Analysis"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 696,
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
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 699,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: totalLots.toFixed(2)
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 700,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                        lineNumber: 698,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Total Capital:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 703,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "$",
                                                    totalCapital.toFixed(0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 704,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                        lineNumber: 702,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "stat-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Active Trades:"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 707,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: pendingSetups
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                                lineNumber: 708,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                        lineNumber: 706,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                lineNumber: 697,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 695,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                lineNumber: 658,
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
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                            lineNumber: 717,
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
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 720,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: profitBySymbol.length > 0 ? profitBySymbol.reduce((max, current)=>current.profit > max.profit ? current : max).symbol : "N/A"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 721,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                    lineNumber: 719,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "highlight-item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Largest Win:"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 729,
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
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 730,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                    lineNumber: 728,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "highlight-item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Largest Loss:"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 733,
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
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 734,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                    lineNumber: 732,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "highlight-item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Total Completed Trades:"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 737,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: completedTrades
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                            lineNumber: 738,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                                    lineNumber: 736,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                            lineNumber: 718,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                    lineNumber: 716,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                lineNumber: 715,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>userId && fetchSetups(userId),
                        className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors",
                        children: "Refresh Analytics"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 746,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-500 mt-2",
                        children: [
                            "Last updated: ",
                            new Date().toLocaleTimeString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                        lineNumber: 752,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
                lineNumber: 745,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx",
        lineNumber: 471,
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
"[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/trophy.js [app-client] (ecmascript) <export default as Trophy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$AiChatBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$PropFirmChat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$client$2f$dashboard$2f$components$2f$AnalyticsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/client/dashboard/components/AnalyticsSection.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
// app/client/dashboard/page.tsx - COMPLETE FIXED VERSION
"use client";
;
;
;
;
;
;
;
;
const dynamic = "force-dynamic";
// Email Verification Message
function EmailVerificationMessage() {
    _s();
    const [sending, setSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleResend = async ()=>{
        setSending(true);
        try {
            // TODO: Implement email verification resend with Cloudflare
            __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Verification email sent! Check your inbox.");
        } catch (error) {
            console.error("Error sending verification:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Failed to send verification email");
        } finally{
            setSending(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "verify-message",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "verify-content",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: "📧"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: "Verify your email"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this),
                        " - Check your inbox for the verification link."
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleResend,
                    disabled: sending,
                    className: "verify-resend-btn",
                    children: sending ? "Sending..." : "Resend"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_s(EmailVerificationMessage, "pxgiU+vbHB5ek5gp5Kib/6rtizE=");
_c = EmailVerificationMessage;
function DashboardContent() {
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [setupCount, setSetupCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [buyLoading, setBuyLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPlanModal, setShowPlanModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedPlan, setSelectedPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // View States
    const [activeTool, setActiveTool] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAnalytics, setShowAnalytics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNavExpanded, setIsNavExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isScrolled, setIsScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    // Detect query param showPlans=true
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardContent.useEffect": ()=>{
            if (searchParams.get("showPlans") === "true") {
                setShowPlanModal(true);
            }
        }
    }["DashboardContent.useEffect"], [
        searchParams
    ]);
    // Handle scroll
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardContent.useEffect": ()=>{
            const handleScroll = {
                "DashboardContent.useEffect.handleScroll": ()=>{
                    const scrollTop = window.scrollY;
                    if (scrollTop > 50 && !isScrolled) setIsScrolled(true);
                    else if (scrollTop <= 50 && isScrolled) setIsScrolled(false);
                }
            }["DashboardContent.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll, {
                passive: true
            });
            return ({
                "DashboardContent.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["DashboardContent.useEffect"];
        }
    }["DashboardContent.useEffect"], [
        isScrolled
    ]);
    // Auth & Setup Count
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardContent.useEffect": ()=>{
            const checkAuth = {
                "DashboardContent.useEffect.checkAuth": async ()=>{
                    try {
                        const token = localStorage.getItem('cf_token');
                        const userData = localStorage.getItem('cf_user');
                        if (!token || !userData) {
                            router.push("/client/login");
                            return;
                        }
                        const user = JSON.parse(userData);
                        setUser(user);
                        setSetupCount(user.setup_count || 0);
                        if (searchParams.get("success") === "true") {
                            __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("✅ Payment successful! Setup credits added.");
                            const url = new URL(window.location.href);
                            url.searchParams.delete("success");
                            window.history.replaceState({}, "", url.toString());
                        }
                        setLoading(false);
                    } catch (error) {
                        console.error("Auth check error:", error);
                        router.push("/client/login");
                    }
                }
            }["DashboardContent.useEffect.checkAuth"];
            checkAuth();
        }
    }["DashboardContent.useEffect"], [
        router,
        searchParams
    ]);
    // Auto-center PRO card on mobile
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardContent.useEffect": ()=>{
            const grid = document.querySelector(".purchase-grid");
            if (!grid || window.innerWidth > 520) return;
            const middleCard = grid.querySelector(".popular-plan");
            if (middleCard) {
                const middleCardOffset = middleCard.offsetLeft;
                const gridVisibleWidth = grid.clientWidth;
                const scrollTo = middleCardOffset - gridVisibleWidth / 2 + middleCard.offsetWidth / 2;
                grid.scrollTo({
                    left: scrollTo,
                    behavior: "smooth"
                });
            }
        }
    }["DashboardContent.useEffect"], []);
    const refreshSetupCount = async ()=>{
        try {
            const token = localStorage.getItem('cf_token');
            if (!token || !user) return;
            const response = await fetch(`/api/user/trial-status?userId=${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setSetupCount(data.setup_count || 0);
                }
            }
        } catch (error) {
            console.error("Error refreshing setup count:", error);
        }
    };
    const handleLogout = async ()=>{
        try {
            // Call logout API
            const token = localStorage.getItem('cf_token');
            if (token) {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
            // Clear local storage
            localStorage.removeItem('cf_token');
            localStorage.removeItem('cf_user');
            localStorage.removeItem('cf_session_id');
            // Redirect to login
            router.push("/client/login");
        } catch (error) {
            console.error("Logout error:", error);
            // Still clear and redirect
            localStorage.clear();
            router.push("/client/login");
        }
    };
    // Use setup credit
    const openTool = async (tool)=>{
        if (setupCount <= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("No setups available. Please purchase more setups.");
            return;
        }
        try {
            const token = localStorage.getItem('cf_token');
            if (!token) {
                __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Please login again");
                router.push("/client/login");
                return;
            }
            // Use setup credit via API
            const response = await fetch('/api/user/use-setup', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id
                })
            });
            const data = await response.json();
            if (data.success) {
                // Deduct setup count
                setSetupCount((prev)=>Math.max(0, prev - 1));
                // Set active tool
                setActiveTool(tool);
                setShowAnalytics(false);
                setIsNavExpanded(false);
                document.body.style.overflow = 'hidden';
                __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Setup credit used. Starting analysis...");
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(data.error || "Failed to use setup credit");
            }
        } catch (error) {
            console.error("Error using setup:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Failed to start analysis");
        }
    };
    const closeTool = ()=>{
        setActiveTool(null);
        document.body.style.overflow = 'auto';
        refreshSetupCount();
    };
    const openAnalytics = ()=>{
        setShowAnalytics(true);
        setActiveTool(null);
        setIsNavExpanded(false);
    };
    const returnToDashboard = ()=>{
        setShowAnalytics(false);
        setActiveTool(null);
        setIsNavExpanded(false);
    };
    const handleBuySetups = async (plan = "10")=>{
        if (!user) {
            alert("Please log in to purchase setups.");
            return;
        }
        setBuyLoading(true);
        try {
            const token = localStorage.getItem('cf_token');
            const response = await fetch("/api/stripe/create-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: user.id,
                    plan: plan,
                    email: user.email
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Checkout URL not received.");
            }
        } catch (error) {
            console.error("Buy setup error:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Failed to start checkout. Please try again.");
        } finally{
            setBuyLoading(false);
        }
    };
    const handleBrokerGatewayClick = ()=>{
        if (window.fbq) window.fbq('track', 'Lead');
        window.open('https://www.litefinance.org/fr/?uid=967798214', '_blank', 'noopener,noreferrer');
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "client-cabinet",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cabinet-loading",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "loading-spinner"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 296,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Loading your cabinet..."
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 297,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 295,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
            lineNumber: 294,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "client-cabinet",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: `simple-header ${isScrolled ? 'scrolled' : ''}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "header-nav",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "desktop-layout",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "nav-buttons",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `nav-btn ${!showAnalytics && !activeTool ? 'active' : ''}`,
                                            onClick: returnToDashboard,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 315,
                                                    columnNumber: 17
                                                }, this),
                                                " Dashboard"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 311,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "nav-btn",
                                            onClick: ()=>openTool('ai'),
                                            children: "🎯 AI Assistant"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 317,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "nav-btn",
                                            onClick: ()=>openTool('prop'),
                                            children: "🏆 Prop Firm"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 320,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `nav-btn ${showAnalytics ? 'active' : ''}`,
                                            onClick: openAnalytics,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 327,
                                                    columnNumber: 17
                                                }, this),
                                                " Analytics"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 323,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "nav-btn",
                                            onClick: ()=>setShowPlanModal(true),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 330,
                                                    columnNumber: 17
                                                }, this),
                                                " Purchase"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 329,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "nav-btn",
                                            onClick: ()=>router.push('/client/dashboard/refer'),
                                            children: "👥 Refer"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 332,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 310,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "user-section",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "user-info-simple",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "user-avatar-small",
                                                    children: user?.email?.charAt(0).toUpperCase()
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 342,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "user-details",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "user-email-simple",
                                                            children: user?.email?.split('@')[0]
                                                        }, void 0, false, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                            lineNumber: 346,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "setup-count-simple",
                                                            children: [
                                                                setupCount,
                                                                " INTEL"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                            lineNumber: 349,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 345,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 341,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleLogout,
                                            className: "logout-btn-simple",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 355,
                                                    columnNumber: 17
                                                }, this),
                                                " Logout"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 354,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 340,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 309,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mobile-layout",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mobile-user-top",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "user-info-mobile-top",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "user-avatar-mobile",
                                                    children: user?.email?.charAt(0).toUpperCase()
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 364,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "user-details-mobile",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "user-email-mobile",
                                                            children: user?.email?.split('@')[0]
                                                        }, void 0, false, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                            lineNumber: 368,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "setup-count-mobile",
                                                            children: [
                                                                "Credits: ",
                                                                setupCount
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                            lineNumber: 369,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 367,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 363,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "nav-toggle-btn",
                                            onClick: ()=>setIsNavExpanded(!isNavExpanded),
                                            children: isNavExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 376,
                                                columnNumber: 34
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 376,
                                                columnNumber: 51
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 372,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 362,
                                    columnNumber: 13
                                }, this),
                                isNavExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mobile-nav-buttons",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "mobile-nav-btn",
                                            onClick: returnToDashboard,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 383,
                                                    columnNumber: 19
                                                }, this),
                                                " Dashboard"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 382,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "mobile-nav-btn",
                                            onClick: ()=>openTool('ai'),
                                            children: "🎯 AI Assistant"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 385,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "mobile-nav-btn",
                                            onClick: ()=>openTool('prop'),
                                            children: "🏆 Prop Firm"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 388,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "mobile-nav-btn",
                                            onClick: openAnalytics,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 19
                                                }, this),
                                                " Analytics"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 391,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "mobile-nav-btn",
                                            onClick: ()=>{
                                                setShowPlanModal(true);
                                                setIsNavExpanded(false);
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 395,
                                                    columnNumber: 19
                                                }, this),
                                                " Buy Setups"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 394,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "mobile-nav-btn",
                                            onClick: ()=>router.push('/client/dashboard/refer'),
                                            children: "👥 Refer Friends"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 397,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "mobile-nav-btn logout",
                                            onClick: handleLogout,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 401,
                                                    columnNumber: 19
                                                }, this),
                                                " Logout"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 400,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 381,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 361,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                    lineNumber: 307,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 306,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "cabinet-main",
                children: showAnalytics ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "analytics-full-view",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "analytics-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    children: "Analytics Dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 414,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Track your trading performance and progress"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 415,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "back-to-dashboard-btn",
                                    onClick: returnToDashboard,
                                    children: "← Back to Dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 416,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 413,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "analytics-container",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$client$2f$dashboard$2f$components$2f$AnalyticsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 421,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 420,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                    lineNumber: 412,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "dashboard-view",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "welcome-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    children: "Welcome back, Trader! 👋"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 428,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Ready to analyze the markets with AI-powered insights"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 429,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 427,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmailVerificationMessage, {}, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 432,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "status-card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "status-header",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: "Your Setup Credits"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 437,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `status-badge ${setupCount > 0 ? 'active' : 'inactive'}`,
                                            children: setupCount > 0 ? 'Active' : 'No Credits'
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 438,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 436,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "setup-count-display",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "count-number",
                                            children: setupCount
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 443,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "count-label",
                                            children: "Available Setups"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 444,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 442,
                                    columnNumber: 15
                                }, this),
                                setupCount === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "warning-message",
                                    children: "⚠️ You need to purchase setups to use the AI Assistant"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 447,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 435,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "actions-grid",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "action-card primary-action",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "action-icon",
                                            children: "🎯"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 457,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Standard AI"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 458,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Day trading & Scalping setups"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 459,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>openTool('ai'),
                                            disabled: setupCount <= 0,
                                            className: `action-btn ${setupCount > 0 ? 'primary' : 'disabled'}`,
                                            children: setupCount > 0 ? 'Start Analysis' : 'No Setups'
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 460,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 456,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "action-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "action-icon",
                                            children: "🏆"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 471,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Prop Firm AI"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 472,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Pass your challenge with rule-based risk"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 473,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>openTool('prop'),
                                            disabled: setupCount <= 0,
                                            className: `action-btn ${setupCount > 0 ? 'secondary' : 'disabled'}`,
                                            children: setupCount > 0 ? 'Launch Assistant' : 'No Setups'
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 474,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 470,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "action-card broker-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "choice-icon-box icon-box-blue",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                size: 24
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                lineNumber: 486,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 485,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "badge-new",
                                            children: "NEW"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 488,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "choice-title title-blue",
                                            children: "Broker Gateway"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 489,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "choice-desc",
                                            children: "Access authorized brokers to execute signals"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 490,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleBrokerGatewayClick,
                                            className: "choice-btn choice-btn-primary",
                                            children: [
                                                "Launch Gateway ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 495,
                                                    columnNumber: 34
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 491,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 484,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "action-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "action-icon",
                                            children: "📊"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 501,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Analytics"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 502,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "View your performance"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 503,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: openAnalytics,
                                            className: "action-btn secondary",
                                            children: "View Stats"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 504,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 500,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 454,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "purchase-section",
                            id: "purchase-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Quick Purchase"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 518,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "purchase-grid",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "purchase-option",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "plan-name",
                                                    children: "Basic"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 521,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "plan-price",
                                                    children: "€4.50"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 522,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "plan-setups",
                                                    children: "10 Setups"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 523,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleBuySetups("10"),
                                                    disabled: buyLoading,
                                                    className: "purchase-btn",
                                                    children: buyLoading ? "Processing..." : "Buy Now"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 524,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 520,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "purchase-option popular-plan",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "popular-badge",
                                                    children: "Most Popular"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 534,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "plan-name",
                                                    children: "Pro"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 535,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "plan-price",
                                                    children: "€8.00"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 536,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "plan-setups",
                                                    children: "20 Setups"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 537,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleBuySetups("20"),
                                                    disabled: buyLoading,
                                                    className: "purchase-btn primary",
                                                    children: buyLoading ? "Processing..." : "Buy Now"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 538,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 533,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "purchase-option",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "plan-name",
                                                    children: "Elite"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 548,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "plan-price",
                                                    children: "€12.00"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 549,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "plan-setups",
                                                    children: "30 Setups"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 550,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleBuySetups("30"),
                                                    disabled: buyLoading,
                                                    className: "purchase-btn",
                                                    children: buyLoading ? "Processing..." : "Buy Now"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                                    lineNumber: 551,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 547,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 519,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 517,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                    lineNumber: 425,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 410,
                columnNumber: 7
            }, this),
            showPlanModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-content pricing-modal",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pricing-modal-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "pricing-title",
                                    children: "🎯 Choose Your Plan"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 573,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "close-modal",
                                    onClick: ()=>setShowPlanModal(false),
                                    children: "✕"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 574,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 572,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "purchase-grid modal-plans-grid",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `purchase-option ${selectedPlan === "10" ? "selected" : ""}`,
                                    onClick: ()=>setSelectedPlan("10"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "plan-name",
                                            children: "Basic Plan"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 578,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "plan-price",
                                            children: "€4.50"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 579,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "plan-setups",
                                            children: "10 Setups"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 580,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `purchase-btn ${selectedPlan === "10" ? "primary" : ""}`,
                                            children: "Select"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 581,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 577,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `purchase-option popular-plan ${selectedPlan === "20" ? "selected" : ""}`,
                                    onClick: ()=>setSelectedPlan("20"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "popular-badge",
                                            children: "Most Popular"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 584,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "plan-name",
                                            children: "Pro Plan"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 585,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "plan-price",
                                            children: "€8.00"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 586,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "plan-setups",
                                            children: "20 Setups"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 587,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `purchase-btn primary ${selectedPlan === "20" ? "selected" : ""}`,
                                            children: "Select"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 588,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 583,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `purchase-option ${selectedPlan === "30" ? "selected" : ""}`,
                                    onClick: ()=>setSelectedPlan("30"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "plan-name",
                                            children: "Elite Plan"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 591,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "plan-price",
                                            children: "€12.00"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 592,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "plan-setups",
                                            children: "30 Setups"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 593,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `purchase-btn ${selectedPlan === "30" ? 'primary' : ''}`,
                                            children: "Select"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 594,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 590,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 576,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-footer",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "confirm-purchase-btn",
                                    disabled: !selectedPlan || buyLoading,
                                    onClick: ()=>selectedPlan && handleBuySetups(selectedPlan),
                                    children: buyLoading ? "Processing..." : "Proceed to Payment"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 598,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "cancel-btn",
                                    onClick: ()=>setShowPlanModal(false),
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 601,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 597,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                    lineNumber: 571,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 570,
                columnNumber: 9
            }, this),
            activeTool && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "immersive-modal-overlay",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "immersive-modal-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "immersive-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "tool-identity",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "live-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 613,
                                            columnNumber: 17
                                        }, this),
                                        activeTool === 'ai' ? 'AI Intel Terminal' : 'Prop Firm Security'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 612,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: closeTool,
                                    className: "immersive-close-btn",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                            lineNumber: 617,
                                            columnNumber: 17
                                        }, this),
                                        " CLOSE"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                    lineNumber: 616,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 611,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "immersive-content",
                            children: activeTool === 'ai' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$AiChatBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                mode: "section",
                                onClose: closeTool,
                                autoStart: true
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 621,
                                columnNumber: 38
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$PropFirmChat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onClose: closeTool
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                                lineNumber: 621,
                                columnNumber: 106
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                            lineNumber: 620,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                    lineNumber: 610,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 609,
                columnNumber: 9
            }, this), document.body)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
        lineNumber: 304,
        columnNumber: 5
    }, this);
}
_s1(DashboardContent, "f1FT9/E+19OKb/3Tb29Wa5ipWKc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c1 = DashboardContent;
function DashboardPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "client-cabinet",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cabinet-loading",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "loading-spinner"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 636,
                        columnNumber: 11
                    }, void 0),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Loading dashboard..."
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                        lineNumber: 637,
                        columnNumber: 11
                    }, void 0)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
                lineNumber: 635,
                columnNumber: 9
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
            lineNumber: 634,
            columnNumber: 7
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardContent, {}, void 0, false, {
            fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
            lineNumber: 641,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /app/client/dashboard/page.tsx",
        lineNumber: 633,
        columnNumber: 5
    }, this);
}
_c2 = DashboardPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "EmailVerificationMessage");
__turbopack_context__.k.register(_c1, "DashboardContent");
__turbopack_context__.k.register(_c2, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=mzprimer-nextjs-v1%20_e9f9712a._.js.map