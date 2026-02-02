(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/trophy.js [app-client] (ecmascript) <export default as Trophy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$PropFirmChat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const PropFirmChatSection = ({ onLaunch })=>{
    _s();
    // Internal state for modal (same as main page)
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedSymbol, setSelectedSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Internal modal handlers
    const openModal = (symbol = null)=>{
        console.log('🔵 Opening modal with symbol:', symbol);
        setSelectedSymbol(symbol);
        setShowModal(true);
        document.body.style.overflow = 'hidden';
    };
    const closeModal = ()=>{
        setShowModal(false);
        setSelectedSymbol(null);
        document.body.style.overflow = 'auto';
    };
    // ✅ FIXED: This function wraps the click handler
    const handleLaunch = (symbol)=>{
        if (onLaunch && typeof onLaunch === 'function') {
            // Use the provided onLaunch function from parent (for main page)
            onLaunch(symbol);
        } else {
            // Use internal modal logic (for PropFirmPage)
            console.log('Using internal modal logic for symbol:', symbol);
            openModal(symbol);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "propfirm",
                className: "ai-chat-section",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "ai-chat-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "ai-chat-title",
                            children: "🏆 Prop Firm Challenge Assistant"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "ai-chat-subtitle",
                            children: "Institutional compliance for challenge phases. Select an asset or a ruleset to initialize."
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "launch-grid-label",
                            children: "Intelligence Assets"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "symbol-launch-grid mb-6",
                            children: [
                                "XAUUSD",
                                "BTCUSD",
                                "US30",
                                "EURUSD"
                            ].map((sym)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "symbol-launch-btn prop-style",
                                    // ✅ CRITICAL FIX: Call handleLaunch NOT onLaunch directly
                                    onClick: ()=>handleLaunch(sym),
                                    type: "button",
                                    "aria-label": `Launch prop firm analysis for ${sym}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sym-name",
                                            children: sym
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                            lineNumber: 57,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sym-status",
                                            children: "Verify Setup"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                            lineNumber: 58,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, sym, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                    lineNumber: 49,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "launch-grid-label",
                            children: "Strategic Rulesets"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "symbol-launch-grid mb-10",
                            children: [
                                "FTMO",
                                "FundedNext",
                                "5%ers",
                                "MFF"
                            ].map((firm)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "symbol-launch-btn firm-style",
                                    // ✅ CRITICAL FIX: Call handleLaunch NOT onLaunch directly
                                    onClick: ()=>handleLaunch(""),
                                    type: "button",
                                    "aria-label": `Apply ${firm} rules`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sym-name",
                                            children: firm
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                            lineNumber: 75,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sym-status",
                                            children: "Apply Rules"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                            lineNumber: 76,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, firm, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                    lineNumber: 67,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "launch-terminal-card gold-accent",
                            // ✅ CRITICAL FIX: Call handleLaunch NOT onLaunch directly
                            onClick: ()=>handleLaunch(""),
                            role: "button",
                            tabIndex: 0,
                            onKeyDown: (e)=>{
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleLaunch("");
                                    e.preventDefault();
                                }
                            },
                            "aria-label": "Launch Prop Firm Challenge Assistant",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "launch-header",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pulse-indicator gold"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                            lineNumber: 97,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Risk Protocol: Calibrated"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                            lineNumber: 98,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                    lineNumber: 96,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "launch-icon-box text-amber-500",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                                        size: 32,
                                        strokeWidth: 1.5
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                        lineNumber: 101,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                    lineNumber: 100,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "launch-terminal-btn gold",
                                    type: "button",
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        handleLaunch("");
                                    },
                                    children: "Launch Challenge Assistant"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "launch-footer-text",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                            lineNumber: 114,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " FTMO / MyForexFunds / FundedNext Compatible"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showModal && !onLaunch && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                            lineNumber: 126,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        "Prop Firm Security Protocol"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                    lineNumber: 125,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: closeModal,
                                    className: "immersive-close-btn",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 24
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                            lineNumber: 130,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "CLOSE"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                            lineNumber: 130,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                    lineNumber: 129,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "immersive-content",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$PropFirmChat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onClose: closeModal,
                                preselectedSymbol: selectedSymbol
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                                lineNumber: 135,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                            lineNumber: 134,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                    lineNumber: 123,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx",
                lineNumber: 122,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)), document.body)
        ]
    }, void 0, true);
};
_s(PropFirmChatSection, "muYD6kDV4tTW2dqPhlwXZjSGDWY=");
_c = PropFirmChatSection;
const __TURBOPACK__default__export__ = PropFirmChatSection;
var _c;
__turbopack_context__.k.register(_c, "PropFirmChatSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=mzprimer-nextjs-v1%20_99d46d60._.js.map