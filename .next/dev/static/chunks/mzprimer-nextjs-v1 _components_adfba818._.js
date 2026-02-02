(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/mzprimer-nextjs-v1 /components/StickyLogo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StickyLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/image.js [app-client] (ecmascript)");
'use client';
;
;
;
// Cache logo URL
const LOGO_URL = '/logos/mzlogo.webp';
function StickyLogo() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: "/",
        className: "sticky-logo visible",
        "aria-label": "Go to homepage",
        prefetch: false,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: LOGO_URL,
            alt: "MZPrimer Logo",
            className: "sticky-logo-img",
            width: 60,
            height: 60,
            quality: 75,
            priority: false,
            sizes: "60px",
            style: {
                maxWidth: '100%',
                height: 'auto'
            }
        }, void 0, false, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/StickyLogo.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/StickyLogo.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = StickyLogo;
var _c;
__turbopack_context__.k.register(_c, "StickyLogo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/ConditionalStickyLogo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConditionalStickyLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$StickyLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/StickyLogo.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// components/ConditionalStickyLogo.tsx
"use client";
;
;
function ConditionalStickyLogo() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Hide StickyLogo if the path starts with /client/dashboard
    if (pathname?.startsWith("/client/dashboard")) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$StickyLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/ConditionalStickyLogo.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
_s(ConditionalStickyLogo, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ConditionalStickyLogo;
var _c;
__turbopack_context__.k.register(_c, "ConditionalStickyLogo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/MobileMenu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MobileMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const navItems = [
    {
        label: 'Home',
        href: '/'
    },
    {
        label: 'AI Chat',
        href: '/AIChat'
    },
    {
        label: '🔴 LIVE MARKETS',
        href: '/markets'
    },
    {
        label: 'Prop Trading',
        href: '/prop-firm'
    },
    {
        label: 'Trading Robots',
        href: '/ai-robot'
    },
    {
        label: 'AI Assistant',
        href: '/tools/ai-assistant'
    },
    {
        label: 'Contact',
        href: '/#contacts'
    },
    {
        label: 'Privacy',
        href: '/legal'
    },
    {
        label: 'Blog',
        href: '/blog'
    },
    {
        label: 'LOGIN',
        href: '/client/login'
    }
];
function MobileMenu() {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeItem, setActiveItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mobile-header-left",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setIsOpen(!isOpen),
                    className: "mobile-menu-button",
                    "aria-label": "Toggle Menu",
                    children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                        size: 28
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/MobileMenu.tsx",
                        lineNumber: 35,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                        size: 28
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/MobileMenu.tsx",
                        lineNumber: 35,
                        columnNumber: 39
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/MobileMenu.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/MobileMenu.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `mobile-menu-list ${isOpen ? 'open' : ''}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mobile-menu-panel",
                    children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: item.href,
                            onClick: ()=>{
                                setActiveItem(item.href);
                                setIsOpen(false);
                            },
                            className: `mobile-menu-link ${activeItem === item.href ? 'active' : ''}`,
                            children: item.label
                        }, item.href, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/MobileMenu.tsx",
                            lineNumber: 42,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/MobileMenu.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/MobileMenu.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(MobileMenu, "orungUf1Jcb9TGg0zgkGoP99Fgg=");
_c = MobileMenu;
var _c;
__turbopack_context__.k.register(_c, "MobileMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/ConditionalMobileMenu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConditionalNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$MobileMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/MobileMenu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$StickyLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/StickyLogo.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ConditionalNavigation() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Check if the path starts with /client/dashboard
    if (pathname?.startsWith("/client/dashboard")) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$StickyLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/ConditionalMobileMenu.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$MobileMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/ConditionalMobileMenu.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(ConditionalNavigation, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ConditionalNavigation;
var _c;
__turbopack_context__.k.register(_c, "ConditionalNavigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/Navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
;
function Navbar() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "navbar-desktop",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/",
                className: "text-white hover:text-yellow-400 transition",
                children: "Home"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Navbar.tsx",
                lineNumber: 6,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/AIChat",
                className: "text-white hover:text-yellow-400 transition",
                children: "AI Chat"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Navbar.tsx",
                lineNumber: 7,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/markets",
                className: "text-white hover:text-yellow-400 transition",
                children: "🔴 LIVE MARKETS"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Navbar.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/prop-firm",
                className: "text-white hover:text-yellow-400 transition",
                children: "Prop Trading"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Navbar.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/ai-robot",
                className: "text-white hover:text-yellow-400 transition",
                children: "Trading Robots"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Navbar.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/tools/ai-assistant",
                className: "text-white hover:text-yellow-400 transition",
                children: " AI Assistant"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Navbar.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/#contacts",
                className: "text-white hover:text-yellow-400 transition",
                children: "Contact"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Navbar.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/legal",
                className: "text-white hover:text-yellow-400 transition",
                children: "Privacy"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Navbar.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/blog",
                className: "text-white hover:text-yellow-400 transition",
                children: "Blog"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Navbar.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/client/login",
                className: "text-white hover:text-yellow-400 transition",
                children: "LOGIN"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Navbar.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/Navbar.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/ConditionalNavbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConditionalNavbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/Navbar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ConditionalNavbar() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Hide Navbar if the path starts with /client/dashboard
    if (pathname?.startsWith("/client/dashboard")) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/ConditionalNavbar.tsx",
        lineNumber: 14,
        columnNumber: 10
    }, this);
}
_s(ConditionalNavbar, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ConditionalNavbar;
var _c;
__turbopack_context__.k.register(_c, "ConditionalNavbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/CTATracker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CtaTracker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function CtaTracker() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CtaTracker.useEffect": ()=>{
            const onClick = {
                "CtaTracker.useEffect.onClick": (e)=>{
                    const el = e.target?.closest('[data-cta="true"]');
                    if (!el) return;
                    const name = el.getAttribute('data-cta-name') || 'cta_click';
                    const gaEvent = el.getAttribute('data-ga-event') || 'select_content';
                    const adsSendTo = el.getAttribute('data-ads-send-to') || '';
                    const valueAttr = el.getAttribute('data-value');
                    const currency = el.getAttribute('data-currency') || undefined;
                    const value = typeof valueAttr === 'string' && valueAttr.trim() !== '' ? Number(valueAttr) : undefined;
                    // Fire GA4 event
                    window.gtag?.('event', gaEvent, {
                        event_category: 'cta',
                        event_label: name,
                        content_type: 'cta',
                        ...value !== undefined ? {
                            value
                        } : {},
                        ...currency ? {
                            currency
                        } : {}
                    });
                    const fireAdsConversion = {
                        "CtaTracker.useEffect.onClick.fireAdsConversion": (cb)=>{
                            if (!adsSendTo) {
                                cb?.();
                                return;
                            }
                            const params = {
                                send_to: adsSendTo
                            };
                            if (value !== undefined) params.value = value;
                            if (currency) params.currency = currency;
                            if (cb) params.event_callback = cb;
                            window.gtag?.('event', 'conversion', params);
                        }
                    }["CtaTracker.useEffect.onClick.fireAdsConversion"];
                    // If it's a link opening in the same tab, delay navigation very briefly
                    const isAnchor = el.tagName === 'A';
                    const href = isAnchor && typeof el.href === 'string' ? el.href : null;
                    const newTab = isAnchor && el.target === '_blank';
                    if (href && !newTab) {
                        e.preventDefault();
                        let navigated = false;
                        const go = {
                            "CtaTracker.useEffect.onClick.go": ()=>{
                                if (!navigated) {
                                    navigated = true;
                                    window.location.href = href;
                                }
                            }
                        }["CtaTracker.useEffect.onClick.go"];
                        // Try to use event_callback; also set a timeout fallback
                        fireAdsConversion(go);
                        setTimeout(go, 400);
                    } else {
                        // No navigation to wait for (or opens in new tab)
                        fireAdsConversion();
                    }
                }
            }["CtaTracker.useEffect.onClick"];
            document.addEventListener('click', onClick);
            return ({
                "CtaTracker.useEffect": ()=>document.removeEventListener('click', onClick)
            })["CtaTracker.useEffect"];
        }
    }["CtaTracker.useEffect"], []);
    return null;
}
_s(CtaTracker, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = CtaTracker;
var _c;
__turbopack_context__.k.register(_c, "CtaTracker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/FacebookPixel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FacebookPixel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/script.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Pixel ID (from env or fallback)
const PIXEL_ID = __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_FB_PIXEL_ID || "719990012398471004";
function FacebookPixel() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    // Track a PageView whenever the route changes (SPA navigation)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FacebookPixel.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (typeof window.fbq === "undefined") return;
            window.fbq("track", "PageView");
        }
    }["FacebookPixel.useEffect"], [
        pathname,
        searchParams
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "fb-pixel-base",
                strategy: "afterInteractive",
                dangerouslySetInnerHTML: {
                    __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
            n.callMethod.apply(n,arguments) : n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            // Initialize Pixel
            fbq('init', '${PIXEL_ID}');
            // Initial PageView on first load
            fbq('track', 'PageView');
          `
                }
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/FacebookPixel.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("noscript", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    height: "1",
                    width: "1",
                    style: {
                        display: "none"
                    },
                    src: `https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`,
                    alt: ""
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/FacebookPixel.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/FacebookPixel.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(FacebookPixel, "h6p6PpCFmP4Mu5bIMduBzSZThBE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = FacebookPixel;
var _c;
__turbopack_context__.k.register(_c, "FacebookPixel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/Footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$noop$2d$head$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/client/components/noop-head.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// 🛑 UPDATE YOUR LINKS HERE
const SOCIAL_LINKS = {
    facebook: "https://www.facebook.com/mzprimer",
    instagram: "https://www.instagram.com/mzprimer",
    telegram: "https://t.me/mzprimer"
};
// Static year to avoid re-renders
const CURRENT_YEAR = new Date().getFullYear();
const LOGOS = {
    mzlogo: {
        src: '/logos/mzlogo.webp',
        alt: 'MZPrimer Logo',
        width: 120,
        height: 120,
        priority: true
    },
    stripe: {
        src: '/logos/stripe.svg',
        alt: 'Stripe',
        width: 40,
        height: 25
    },
    visa: {
        src: '/logos/visa.svg',
        alt: 'Visa',
        width: 40,
        height: 25
    },
    mastercard: {
        src: '/logos/mastercard.svg',
        alt: 'Mastercard',
        width: 40,
        height: 25
    },
    applepay: {
        src: '/logos/Applepay.svg',
        alt: 'Apple Pay',
        width: 40,
        height: 25
    },
    googlepay: {
        src: '/logos/google.svg',
        alt: 'Google Pay',
        width: 40,
        height: 25
    },
    pci: {
        src: '/logos/pci.svg',
        alt: 'PCI',
        width: 40,
        height: 25
    }
};
// Payment badges only (exclude main logo)
const PAYMENT_LOGOS = [
    'stripe',
    'visa',
    'mastercard',
    'applepay',
    'googlepay',
    'pci'
];
function Footer() {
    _s();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    // Memoize payment badges to prevent re-renders
    const PaymentBadges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Footer.useMemo[PaymentBadges]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "payment-badges",
                children: PAYMENT_LOGOS.map({
                    "Footer.useMemo[PaymentBadges]": (key)=>{
                        const logo = LOGOS[key];
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: logo.src,
                            alt: logo.alt,
                            className: "trust-logo",
                            width: logo.width || 40,
                            height: logo.height || 25
                        }, key, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this);
                    }
                }["Footer.useMemo[PaymentBadges]"])
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                lineNumber: 84,
                columnNumber: 5
            }, this)
    }["Footer.useMemo[PaymentBadges]"], []);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        // Basic validation
        if (!email || !email.includes('@')) {
            setStatus('error');
            return;
        }
        setStatus('loading');
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache' // Prevent API caching
                },
                body: JSON.stringify({
                    email,
                    timestamp: Date.now(),
                    source: 'footer'
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStatus('success');
                setEmail('');
                // Reset success message after 3 seconds
                setTimeout(()=>{
                    setStatus('idle');
                }, 3000);
            } else {
                throw new Error(data.error || 'Subscription failed');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            setStatus('error');
            // Reset error message after 3 seconds
            setTimeout(()=>{
                setStatus('idle');
            }, 3000);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$noop$2d$head$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                    rel: "preload",
                    href: LOGOS.mzlogo.src,
                    as: "image",
                    type: "image/webp",
                    fetchPriority: "high",
                    className: "jsx-e0e225c4e694392e"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                    lineNumber: 154,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "jsx-e0e225c4e694392e" + " " + "footer-one-line",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-e0e225c4e694392e" + " " + "footer-content",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e0e225c4e694392e" + " " + "footer-logo-badges",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: LOGOS.mzlogo.src,
                                        alt: LOGOS.mzlogo.alt,
                                        className: "footer-logo",
                                        width: LOGOS.mzlogo.width,
                                        height: LOGOS.mzlogo.height,
                                        priority: true
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                        lineNumber: 167,
                                        columnNumber: 13
                                    }, this),
                                    PaymentBadges
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-e0e225c4e694392e" + " " + "footer-text",
                                children: [
                                    "© ",
                                    CURRENT_YEAR,
                                    " MZPrimer LTD. All rights reserved."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-e0e225c4e694392e" + " " + "footer-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e0e225c4e694392e" + " " + "footer-column",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "jsx-e0e225c4e694392e",
                                        children: "AI Tools"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                        lineNumber: 187,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "jsx-e0e225c4e694392e",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-e0e225c4e694392e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/tools/ai-assistant",
                                                    prefetch: false,
                                                    children: "AI Assistant"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                    lineNumber: 189,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 189,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-e0e225c4e694392e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/ai-robot",
                                                    prefetch: false,
                                                    children: "Trading Robots"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                    lineNumber: 190,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 190,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-e0e225c4e694392e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/#aitrading",
                                                    prefetch: false,
                                                    children: "Automation Guide"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 191,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                        lineNumber: 188,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e0e225c4e694392e" + " " + "footer-column",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "jsx-e0e225c4e694392e",
                                        children: "Market & Learning"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                        lineNumber: 196,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "jsx-e0e225c4e694392e",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-e0e225c4e694392e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/#learning",
                                                    prefetch: false,
                                                    children: "Learning Hub"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                    lineNumber: 198,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 198,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-e0e225c4e694392e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/blog",
                                                    prefetch: false,
                                                    children: "Blog & Insights"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 199,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                        lineNumber: 197,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                lineNumber: 195,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e0e225c4e694392e" + " " + "footer-column",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "jsx-e0e225c4e694392e",
                                        children: "Company"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "jsx-e0e225c4e694392e",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-e0e225c4e694392e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/#contacts",
                                                    prefetch: false,
                                                    children: "Contact Us"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                    lineNumber: 206,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 206,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-e0e225c4e694392e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/about",
                                                    prefetch: false,
                                                    children: "About"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                    lineNumber: 207,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 207,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-e0e225c4e694392e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/faq",
                                                    prefetch: false,
                                                    children: "FAQ"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 208,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e0e225c4e694392e" + " " + "footer-column",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "jsx-e0e225c4e694392e",
                                        children: "Legal"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                        lineNumber: 213,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "jsx-e0e225c4e694392e",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-e0e225c4e694392e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/legal#privacy",
                                                    prefetch: false,
                                                    children: "Privacy Policy"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 215,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-e0e225c4e694392e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/legal#terms",
                                                    prefetch: false,
                                                    children: "Terms of Use"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 216,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-e0e225c4e694392e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/legal#disclaimer",
                                                    prefetch: false,
                                                    children: "Disclaimer"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 217,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                        lineNumber: 214,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e0e225c4e694392e" + " " + "footer-subscribe subscribe-column",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "jsx-e0e225c4e694392e" + " " + "text-sm md:text-base font-semibold text-white mb-3",
                                        children: "Subscribe to Updates"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                        lineNumber: 222,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleSubmit,
                                        className: "jsx-e0e225c4e694392e" + " " + "subscribe-form",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "email",
                                                value: email,
                                                onChange: (e)=>setEmail(e.target.value),
                                                placeholder: "Enter your email address",
                                                required: true,
                                                disabled: status === 'loading',
                                                "aria-label": "Email for newsletter subscription",
                                                className: "jsx-e0e225c4e694392e" + " " + "subscribe-input"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 227,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "submit",
                                                disabled: status === 'loading',
                                                "aria-label": status === 'loading' ? 'Subscribing...' : 'Subscribe to newsletter',
                                                className: "jsx-e0e225c4e694392e" + " " + "subscribe-button",
                                                children: status === 'loading' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-e0e225c4e694392e" + " " + "flex items-center justify-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-e0e225c4e694392e" + " " + "loading-spinner"
                                                        }, void 0, false, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                            lineNumber: 245,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-e0e225c4e694392e" + " " + "ml-2",
                                                            children: "Subscribing..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                            lineNumber: 246,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                    lineNumber: 244,
                                                    columnNumber: 19
                                                }, this) : 'Subscribe'
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 237,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                        lineNumber: 226,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-e0e225c4e694392e" + " " + "subscribe-status",
                                        children: [
                                            status === 'success' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                role: "alert",
                                                className: "jsx-e0e225c4e694392e" + " " + "subscribe-success",
                                                children: "✅ Thank you! You've been subscribed."
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 257,
                                                columnNumber: 17
                                            }, this),
                                            status === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                role: "alert",
                                                className: "jsx-e0e225c4e694392e" + " " + "subscribe-error",
                                                children: "❌ Something went wrong. Please try again."
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 262,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                        lineNumber: 255,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-e0e225c4e694392e" + " " + "mt-6 pt-4 border-t border-zinc-800",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "jsx-e0e225c4e694392e" + " " + "text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide",
                                                children: "Follow Us"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 270,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e0e225c4e694392e" + " " + "flex flex-wrap gap-3 social-buttons",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SocialButton, {
                                                        href: SOCIAL_LINKS.telegram,
                                                        label: "Telegram",
                                                        className: "btn-elegant-social btn-tg",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                viewBox: "0 0 24 24",
                                                                "aria-hidden": "true",
                                                                className: "jsx-e0e225c4e694392e",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.002.001l-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15l4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z",
                                                                    className: "jsx-e0e225c4e694392e"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                                    lineNumber: 282,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                                lineNumber: 281,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e0e225c4e694392e",
                                                                children: "Telegram"
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                                lineNumber: 284,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                        lineNumber: 276,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SocialButton, {
                                                        href: SOCIAL_LINKS.facebook,
                                                        label: "Facebook",
                                                        className: "btn-elegant-social",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                viewBox: "0 0 24 24",
                                                                "aria-hidden": "true",
                                                                className: "jsx-e0e225c4e694392e",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                                                                    className: "jsx-e0e225c4e694392e"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                                    lineNumber: 294,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                                lineNumber: 293,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e0e225c4e694392e",
                                                                children: "Facebook"
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                                lineNumber: 296,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                        lineNumber: 288,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SocialButton, {
                                                        href: SOCIAL_LINKS.instagram,
                                                        label: "Instagram",
                                                        className: "btn-elegant-social",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                viewBox: "0 0 24 24",
                                                                "aria-hidden": "true",
                                                                className: "jsx-e0e225c4e694392e",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.36-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.361-2.62-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.163 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                                                                    className: "jsx-e0e225c4e694392e"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                                    lineNumber: 306,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                                lineNumber: 305,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e0e225c4e694392e",
                                                                children: "Instagram"
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                                lineNumber: 308,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                        lineNumber: 300,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                                lineNumber: 273,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                        lineNumber: 269,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "e0e225c4e694392e",
                children: ".loading-spinner.jsx-e0e225c4e694392e{border:2px solid #f3f3f3;border-top-color:#3498db;border-radius:50%;width:16px;height:16px;animation:1s linear infinite spin;display:inline-block}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.subscribe-input.jsx-e0e225c4e694392e:disabled,.subscribe-button.jsx-e0e225c4e694392e:disabled{opacity:.7;cursor:not-allowed}.trust-logo.jsx-e0e225c4e694392e{image-rendering:-webkit-optimize-contrast;image-rendering:crisp-edges}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true);
}
_s(Footer, "eahtReg8aHAeppZzXBK1YoS+N04=");
_c = Footer;
// Separate Social Button component for better optimization
function SocialButton({ href, label, className, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: href,
        target: "_blank",
        rel: "noopener noreferrer",
        className: className,
        "aria-label": `Follow us on ${label}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/Footer.tsx",
        lineNumber: 361,
        columnNumber: 5
    }, this);
}
_c1 = SocialButton;
var _c, _c1;
__turbopack_context__.k.register(_c, "Footer");
__turbopack_context__.k.register(_c1, "SocialButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/FBPixelEvents.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FBPixelEvents
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/navigation.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function FBPixelEvents() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FBPixelEvents.useEffect": ()=>{
            // 1. Check if FB Pixel is initialized
            if (("TURBOPACK compile-time value", "object") === 'undefined' || !window.fbq) return;
            // 2. Extract Symbol from URL
            // Supports: /trade/btcusd, /calculator/btcusd, /AIChat?symbol=BTCUSD
            let symbol = '';
            // Check URL Params (for AIChat)
            const paramSymbol = searchParams.get('symbol');
            if (paramSymbol) {
                symbol = paramSymbol.toUpperCase();
            } else {
                // Check Path (for /trade/btcusd)
                const parts = pathname.split('/');
                const lastPart = parts[parts.length - 1];
                // Simple regex to check if last part looks like a symbol (e.g., XAUUSD, BTCUSD)
                if (lastPart && lastPart.length >= 3) {
                    symbol = lastPart.toUpperCase();
                }
            }
            if (!symbol) return; // No symbol found, do nothing
            // 3. Determine Product Suffix based on Page
            let suffix = '';
            let category = '';
            if (pathname.includes('/AIChat')) {
                suffix = '-CHAT';
                category = 'Lead_Gen';
            } else if (pathname.includes('/trade/') || pathname.includes('/forecast/')) {
                suffix = '-SETUP';
                category = 'Strategy_Tool';
            } else if (pathname.includes('/calculator/') || pathname.includes('/zones/')) {
                suffix = '-RISK';
                category = 'Utility_Tool';
            }
            if (!suffix) return; // Not a product page
            // 4. Construct the Exact ID from your Catalog
            const contentID = `${symbol}${suffix}`; // e.g., "BTCUSD-CHAT"
            console.log(`📡 FB Pixel Firing: ViewContent for ${contentID}`);
            // 5. Fire the Event
            window.fbq('track', 'ViewContent', {
                content_type: 'product',
                content_ids: [
                    contentID
                ],
                content_name: `${symbol} ${category}`,
                content_category: 'Software',
                currency: 'USD',
                value: 0.00 // You can set this to 4.50 for SETUP/RISK pages
            });
        }
    }["FBPixelEvents.useEffect"], [
        pathname,
        searchParams
    ]);
    return null;
}
_s(FBPixelEvents, "h6p6PpCFmP4Mu5bIMduBzSZThBE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = FBPixelEvents;
var _c;
__turbopack_context__.k.register(_c, "FBPixelEvents");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/CookieConsent.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CookieConsent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cookie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cookie$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/cookie.js [app-client] (ecmascript) <export default as Cookie>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function CookieConsent() {
    _s();
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CookieConsent.useEffect": ()=>{
            setMounted(true);
            // Check if user choice exists
            const choice = localStorage.getItem('mz_cookie_consent');
            if (!choice) {
                setTimeout({
                    "CookieConsent.useEffect": ()=>setIsVisible(true)
                }["CookieConsent.useEffect"], 1500);
            } else {
                // Re-apply if previously granted
                applyConsentMode(choice === 'granted');
            }
        }
    }["CookieConsent.useEffect"], []);
    const applyConsentMode = (granted)=>{
        const consentState = granted ? 'granted' : 'denied';
        if ("TURBOPACK compile-time truthy", 1) {
            // @ts-ignore
            window.dataLayer = window.dataLayer || [];
            // @ts-ignore
            function gtag() {
                dataLayer.push(arguments);
            }
            // @ts-ignore
            gtag('consent', 'update', {
                'ad_storage': consentState,
                'ad_user_data': consentState,
                'ad_personalization': consentState,
                'analytics_storage': consentState
            });
        }
    };
    const handleAccept = ()=>{
        localStorage.setItem('mz_cookie_consent', 'granted');
        applyConsentMode(true);
        setIsVisible(false);
    };
    const handleDecline = ()=>{
        localStorage.setItem('mz_cookie_consent', 'denied');
        applyConsentMode(false);
        setIsVisible(false);
    };
    if (!mounted || !isVisible) return null;
    return(// Uses global 'cookie-strip-container'
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "cookie-strip-container",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "cookie-strip-inner",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "cookie-text-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cookie-icon-wrapper",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cookie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cookie$3e$__["Cookie"], {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/CookieConsent.tsx",
                                lineNumber: 62,
                                columnNumber: 21
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/CookieConsent.tsx",
                            lineNumber: 61,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "cookie-text",
                            children: "This site uses cookies to enhance your AI trading experience and analyze traffic."
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/CookieConsent.tsx",
                            lineNumber: 64,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/CookieConsent.tsx",
                    lineNumber: 60,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "cookie-actions",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleDecline,
                            className: "btn-cookie-link",
                            children: "Necessary Only"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/CookieConsent.tsx",
                            lineNumber: 71,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleAccept,
                            className: "btn-cookie-accept-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/CookieConsent.tsx",
                                    lineNumber: 75,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Accept"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/CookieConsent.tsx",
                                    lineNumber: 76,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/CookieConsent.tsx",
                            lineNumber: 74,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/CookieConsent.tsx",
                    lineNumber: 70,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/CookieConsent.tsx",
            lineNumber: 57,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/CookieConsent.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this));
}
_s(CookieConsent, "X0nfiIiIIil+/UXG+Aq7h6yprw8=");
_c = CookieConsent;
var _c;
__turbopack_context__.k.register(_c, "CookieConsent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=mzprimer-nextjs-v1%20_components_adfba818._.js.map