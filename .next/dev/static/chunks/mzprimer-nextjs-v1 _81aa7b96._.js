(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/mzprimer-nextjs-v1 /app/lib/push-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/lib/push-utils.ts
// Utility function for converting URL-safe base64 to Uint8Array
__turbopack_context__.s([
    "VAPID_PUBLIC_KEY",
    ()=>VAPID_PUBLIC_KEY,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getCurrentSubscription",
    ()=>getCurrentSubscription,
    "getPushPermission",
    ()=>getPushPermission,
    "hasValidSubscription",
    ()=>hasValidSubscription,
    "isPushSupported",
    ()=>isPushSupported,
    "requestPushPermission",
    ()=>requestPushPermission,
    "sendPushNotification",
    ()=>sendPushNotification,
    "subscribeToPush",
    ()=>subscribeToPush,
    "subscriptionToJSON",
    ()=>subscriptionToJSON,
    "unsubscribeFromPush",
    ()=>unsubscribeFromPush,
    "urlBase64ToUint8Array",
    ()=>urlBase64ToUint8Array
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for(let i = 0; i < rawData.length; ++i){
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
const VAPID_PUBLIC_KEY = __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
// Type-safe function to get applicationServerKey
function getApplicationServerKey() {
    if (!VAPID_PUBLIC_KEY) return null;
    try {
        // Convert to ArrayBuffer (not Uint8Array) for compatibility
        const padding = '='.repeat((4 - VAPID_PUBLIC_KEY.length % 4) % 4);
        const base64 = (VAPID_PUBLIC_KEY + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = atob(base64);
        const buffer = new ArrayBuffer(rawData.length);
        const view = new Uint8Array(buffer);
        for(let i = 0; i < rawData.length; ++i){
            view[i] = rawData.charCodeAt(i);
        }
        return buffer;
    } catch (error) {
        console.error('Error converting VAPID key:', error);
        return null;
    }
}
async function subscribeToPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported');
        return {
            success: false
        };
    }
    try {
        const applicationServerKey = getApplicationServerKey();
        if (!applicationServerKey) {
            console.warn('VAPID public key not configured');
            return {
                success: false
            };
        }
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        });
        return {
            success: true,
            subscription
        };
    } catch (error) {
        console.error('Error subscribing to push:', error);
        return {
            success: false
        };
    }
}
async function unsubscribeFromPush() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            await subscription.unsubscribe();
            return {
                success: true
            };
        }
        return {
            success: false
        };
    } catch (error) {
        console.error('Error unsubscribing from push:', error);
        return {
            success: false
        };
    }
}
async function sendPushNotification(subscription, title, body, data) {
    try {
        const response = await fetch('/api/push/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subscription,
                title,
                body,
                data
            })
        });
        return {
            success: response.ok
        };
    } catch (error) {
        console.error('Error sending push:', error);
        return {
            success: false
        };
    }
}
async function getCurrentSubscription() {
    try {
        const registration = await navigator.serviceWorker.ready;
        return await registration.pushManager.getSubscription();
    } catch (error) {
        console.error('Error getting subscription:', error);
        return null;
    }
}
function isPushSupported() {
    return ("TURBOPACK compile-time value", "object") !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
}
async function getPushPermission() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return Notification.permission;
}
async function requestPushPermission() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Handle Safari which doesn't support async Notification.requestPermission
    if (typeof Notification !== 'undefined' && Notification.permission === 'default' && typeof Notification.requestPermission === 'function') {
        return new Promise((resolve)=>{
            Notification.requestPermission((permission)=>resolve(permission));
        });
    }
    return await Notification.requestPermission();
}
function subscriptionToJSON(subscription) {
    if (!subscription) return null;
    return {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: {
            p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
            auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth'))))
        }
    };
}
async function hasValidSubscription() {
    if (!isPushSupported()) return false;
    try {
        const subscription = await getCurrentSubscription();
        return subscription !== null;
    } catch (error) {
        console.error('Error checking subscription:', error);
        return false;
    }
}
const __TURBOPACK__default__export__ = {
    urlBase64ToUint8Array,
    VAPID_PUBLIC_KEY,
    subscribeToPush,
    unsubscribeFromPush,
    sendPushNotification,
    getCurrentSubscription,
    isPushSupported,
    getPushPermission,
    requestPushPermission,
    hasValidSubscription
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /app/hooks/usePush.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePush",
    ()=>usePush,
    "usePushStatus",
    ()=>usePushStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// app/hooks/usePush.ts - CLOUDFLARE VERSION
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$push$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/lib/push-utils.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
function usePush() {
    _s();
    const [isSupported, setIsSupported] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [subscription, setSubscription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userLoading, setUserLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // 1. Get current user from localStorage (Cloudflare auth)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePush.useEffect": ()=>{
            const getUserSession = {
                "usePush.useEffect.getUserSession": ()=>{
                    try {
                        const userStr = localStorage.getItem("cf_user");
                        if (userStr) {
                            const userData = JSON.parse(userStr);
                            setUser(userData);
                        }
                        setUserLoading(false);
                    } catch (error) {
                        console.error("Error reading user session:", error);
                        setUserLoading(false);
                    }
                }
            }["usePush.useEffect.getUserSession"];
            getUserSession();
            // Listen for auth changes (login/logout)
            const handleStorageChange = {
                "usePush.useEffect.handleStorageChange": (e)=>{
                    if (e.key === "cf_user") {
                        getUserSession();
                    }
                }
            }["usePush.useEffect.handleStorageChange"];
            window.addEventListener("storage", handleStorageChange);
            return ({
                "usePush.useEffect": ()=>window.removeEventListener("storage", handleStorageChange)
            })["usePush.useEffect"];
        }
    }["usePush.useEffect"], []);
    // 2. BROWSER CHECK + RESTORE STATE
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePush.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
                setIsSupported(true);
                // Check for existing subscription
                navigator.serviceWorker.ready.then({
                    "usePush.useEffect": (reg)=>{
                        reg.pushManager.getSubscription().then({
                            "usePush.useEffect": (sub)=>{
                                if (sub) {
                                    setSubscription(sub);
                                    // Sync with server if we have a user
                                    if (user?.id) {
                                        syncSubscriptionWithServer(sub, user);
                                    }
                                }
                            }
                        }["usePush.useEffect"]);
                    }
                }["usePush.useEffect"]).catch({
                    "usePush.useEffect": (e)=>console.log("SW check error", e)
                }["usePush.useEffect"]);
            }
        }
    }["usePush.useEffect"], [
        user?.id
    ]);
    // 3. SYNC SUBSCRIPTION WITH SERVER (when user logs in)
    const syncSubscriptionWithServer = async (sub, currentUser)=>{
        try {
            console.log("🔄 Syncing push subscription with server...");
            const response = await fetch('/api/push/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('cf_token') || ''}`
                },
                body: JSON.stringify({
                    userId: currentUser.id,
                    subscription: JSON.parse(JSON.stringify(sub)),
                    userData: {
                        email: currentUser.email,
                        displayName: currentUser.displayName || currentUser.email?.split('@')[0]
                    }
                })
            });
            if (response.ok) {
                console.log("✅ Push subscription synced with server");
            }
        } catch (error) {
            console.error("Error syncing subscription:", error);
        }
    };
    // 4. CHECK AND REGISTER SERVICE WORKER
    const registerServiceWorker = async ()=>{
        if ('serviceWorker' in navigator) {
            try {
                // Register service worker
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
                return registration;
            } catch (error) {
                console.error('Service Worker registration failed:', error);
                throw error;
            }
        }
        throw new Error('Service Workers not supported');
    };
    // 5. SUBSCRIBE TO PUSH NOTIFICATIONS
    const subscribeToPush = async ()=>{
        if (!isSupported) {
            console.log("Push notifications not supported in this browser");
            alert("Push notifications are not supported in your browser. Please try a modern browser like Chrome or Firefox.");
            return;
        }
        setLoading(true);
        try {
            // Get current user (check localStorage)
            let currentUser = user;
            const userStr = localStorage.getItem("cf_user");
            if (userStr && !currentUser) {
                currentUser = JSON.parse(userStr);
                setUser(currentUser);
            }
            // Get VAPID public key
            const vapidKey = __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!vapidKey) {
                throw new Error("VAPID public key is not configured");
            }
            // Register service worker
            const registration = await registerServiceWorker();
            // Check if already subscribed
            let existingSub = await registration.pushManager.getSubscription();
            if (existingSub) {
                console.log("Already subscribed to push notifications");
                setSubscription(existingSub);
                // Sync with server if we have a user
                if (currentUser?.id) {
                    await syncSubscriptionWithServer(existingSub, currentUser);
                }
                // Send welcome notification
                await sendWelcomeNotification(currentUser?.id);
                setLoading(false);
                return;
            }
            // Subscribe to push
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$push$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["urlBase64ToUint8Array"])(vapidKey)
            });
            // Save subscription to server
            const saveResponse = await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('cf_token') || ''}`
                },
                body: JSON.stringify({
                    subscription: JSON.parse(JSON.stringify(sub)),
                    userData: currentUser ? {
                        userId: currentUser.id,
                        email: currentUser.email,
                        displayName: currentUser.displayName || currentUser.email?.split('@')[0]
                    } : null,
                    deviceInfo: navigator.userAgent
                })
            });
            if (!saveResponse.ok) {
                throw new Error('Failed to save subscription to server');
            }
            // Update local state
            setSubscription(sub);
            // Send welcome notification if user is logged in
            if (currentUser?.id) {
                await sendWelcomeNotification(currentUser.id);
            }
            console.log("✅ Successfully subscribed to push notifications");
            // Show success message
            alert("🎉 Push notifications activated! You'll now receive signal alerts.");
        } catch (error) {
            console.error("Subscribe Error:", error);
            // User-friendly error messages
            if (error.message.includes('denied') || error.message.includes('permission')) {
                alert("⚠️ Permission denied. Please allow notifications in your browser settings.");
            } else if (error.message.includes('VAPID')) {
                alert("⚠️ Push notifications are not properly configured.");
            } else {
                alert("Activation failed: " + error.message);
            }
        } finally{
            setLoading(false);
        }
    };
    // 6. SEND WELCOME NOTIFICATION
    const sendWelcomeNotification = async (userId)=>{
        try {
            const response = await fetch('/api/push/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('cf_token') || ''}`
                },
                body: JSON.stringify({
                    targetUserId: userId,
                    title: "✅ Signal Alert Active",
                    message: "AI monitoring activated. You'll receive real-time trade signals!",
                    icon: "/icons/icon-192x192.png",
                    badge: "/icons/badge-72x72.png",
                    tag: "welcome",
                    data: {
                        url: "/client/dashboard",
                        timestamp: new Date().toISOString()
                    }
                })
            });
            if (!response.ok) {
                console.warn("Failed to send welcome notification");
            }
        } catch (error) {
            console.error("Error sending welcome notification:", error);
        }
    };
    // 7. UNSUBSCRIBE FROM PUSH NOTIFICATIONS
    const unsubscribeFromPush = async ()=>{
        if (!subscription) return;
        try {
            // Unsubscribe from push service
            const success = await subscription.unsubscribe();
            if (success) {
                console.log("Successfully unsubscribed from push notifications");
                setSubscription(null);
                // Notify server
                await fetch('/api/push/unsubscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('cf_token') || ''}`
                    },
                    body: JSON.stringify({
                        endpoint: subscription.endpoint
                    })
                });
                alert("Push notifications disabled.");
            }
        } catch (error) {
            console.error("Error unsubscribing:", error);
            alert("Failed to unsubscribe from push notifications.");
        }
    };
    // 8. CHECK PERMISSION STATUS
    const checkPermission = ()=>{
        if (!isSupported) return 'unsupported';
        if (Notification.permission === 'granted') {
            return 'granted';
        } else if (Notification.permission === 'denied') {
            return 'denied';
        } else {
            return 'default';
        }
    };
    const isLoading = loading || userLoading;
    return {
        isSupported,
        subscription,
        subscribeToPush,
        unsubscribeFromPush,
        checkPermission,
        loading: isLoading,
        permissionStatus: checkPermission(),
        user
    };
}
_s(usePush, "4aFvZb65+vYpIDNwFFxrqrGHAnU=");
function usePushStatus() {
    _s1();
    const { isSupported, subscription, permissionStatus, loading, user } = usePush();
    return {
        isPushEnabled: !!subscription,
        isSupported,
        permissionStatus,
        isLoading: loading,
        hasPermission: permissionStatus === 'granted',
        isLoggedIn: !!user?.id,
        canEnablePush: isSupported && permissionStatus !== 'denied' && !subscription
    };
}
_s1(usePushStatus, "zMoY7kuty9oEncS82iIBH+otQjE=", false, function() {
    return [
        usePush
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NotificationButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$usePush$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/hooks/usePush.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// Required Icons
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$ring$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BellRing$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/bell-ring.js [app-client] (ecmascript) <export default as BellRing>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/share.js [app-client] (ecmascript) <export default as Share>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusSquare$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/square-plus.js [app-client] (ecmascript) <export default as PlusSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/arrow-down.js [app-client] (ecmascript) <export default as ArrowDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-client] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const TELEGRAM_LINK = "https://t.me/mzprimer";
function NotificationButton() {
    _s();
    const { isSupported, subscription, subscribeToPush, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$usePush$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePush"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Logic State
    const [showIOSMenu, setShowIOSMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAppMode, setIsAppMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [iosBrowserType, setIosBrowserType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('safari');
    // --- DETECTION HELPERS ---
    const getMobileOS = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const ua = navigator.userAgent || navigator.vendor;
        if (/android/i.test(ua)) return 'android';
        if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'ios';
        return 'desktop';
    };
    const checkPWA = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return window.matchMedia('(display-mode: standalone)').matches;
    };
    // --- LIFECYCLE ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationButton.useEffect": ()=>{
            setMounted(true);
            setIsAppMode(checkPWA());
            // Detect Chrome on iOS
            if ("TURBOPACK compile-time truthy", 1) {
                const ua = navigator.userAgent;
                if (ua.match('CriOS')) setIosBrowserType('chrome');
                else setIosBrowserType('safari');
            }
        }
    }["NotificationButton.useEffect"], []);
    // --- CLICK HANDLER ---
    const handleMainClick = async ()=>{
        const os = getMobileOS();
        const isInstalled = checkPWA();
        // 1. IOS Browser -> Show Guide Overlay
        if (os === 'ios' && !isInstalled) {
            setShowIOSMenu(true);
            return;
        }
        // 2. Standard -> Subscribe
        await subscribeToPush();
    };
    // Prevent Hydration mismatch
    if (!mounted) return null;
    // --- RENDER IOS OVERLAY (If triggered) ---
    const renderIOSOverlay = ()=>{
        if (!showIOSMenu) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "ios-guide-overlay",
            onClick: ()=>setShowIOSMenu(false),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "ios-guide-card",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowIOSMenu(false),
                            className: "absolute top-4 right-4 text-zinc-600 p-1 hover:text-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center mb-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-white font-bold text-xl mb-1",
                                            children: "Enable Signals"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                            lineNumber: 81,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-zinc-500 text-xs uppercase tracking-wide",
                                            children: "Choose a Method"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                            lineNumber: 82,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                    lineNumber: 80,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ios-pwa-box",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center mb-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-bold text-zinc-500 uppercase",
                                                        children: "Best Performance"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                        lineNumber: 89,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                    lineNumber: 88,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "ios-step-row",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "ios-icon-circle text-blue-500",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share$3e$__["Share"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                                lineNumber: 92,
                                                                columnNumber: 66
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                            lineNumber: 92,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                "Tap ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Share"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                                    lineNumber: 93,
                                                                    columnNumber: 29
                                                                }, this),
                                                                " ",
                                                                iosBrowserType === 'chrome' ? '(Top Right)' : 'below'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                            lineNumber: 93,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                    lineNumber: 91,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "ios-step-row",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "ios-icon-circle text-zinc-400",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusSquare$3e$__["PlusSquare"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                                lineNumber: 96,
                                                                columnNumber: 66
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                            lineNumber: 96,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                "Tap ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Add to Home Screen"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                                    lineNumber: 97,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                            lineNumber: 97,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                    lineNumber: 95,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                            lineNumber: 87,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex items-center opacity-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-grow border-t border-zinc-800"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 18
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex-shrink mx-2 text-[9px] text-zinc-600 uppercase font-bold",
                                                    children: "OR"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 18
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-grow border-t border-zinc-800"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                    lineNumber: 104,
                                                    columnNumber: 18
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                            lineNumber: 101,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: TELEGRAM_LINK,
                                            target: "_blank",
                                            className: "btn-telegram",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                                    lineNumber: 109,
                                                    columnNumber: 17
                                                }, this),
                                                " Join Telegram"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                            lineNumber: 108,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                    lineNumber: 85,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                iosBrowserType === 'chrome' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "ios-pointer-container ios-pos-chrome",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                            size: 48,
                            className: "arrow-animated mb-2 text-yellow-500"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "arrow-label-capsule",
                            children: "Menu ↑"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                            lineNumber: 119,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                    lineNumber: 117,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "ios-pointer-container ios-pos-safari",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "arrow-label-capsule",
                            children: "Browser Menu ↓"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                            lineNumber: 123,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"], {
                            size: 48,
                            className: "arrow-animated mt-1 text-yellow-500"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                    lineNumber: 122,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
            lineNumber: 71,
            columnNumber: 7
        }, this);
    };
    // --- MAIN BUTTON RENDERING ---
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            renderIOSOverlay(),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "floating-notify-wrapper",
                children: subscription ? // STATE: SUBSCRIBED
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "btn-float-bell btn-float-active",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                            lineNumber: 141,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Signals Active"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                            lineNumber: 142,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                    lineNumber: 140,
                    columnNumber: 11
                }, this) : // STATE: NOT SUBSCRIBED (CLICKABLE)
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleMainClick,
                    disabled: loading,
                    className: "btn-float-bell animate-bell-shiver",
                    title: "Enable AI Signal Alerts",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "float-icon-box",
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                size: 20,
                                className: "animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                lineNumber: 154,
                                columnNumber: 21
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$ring$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BellRing$3e$__["BellRing"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                                lineNumber: 156,
                                columnNumber: 21
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                            lineNumber: 152,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: loading ? 'Connecting...' : 'Get AI Signals'
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                            lineNumber: 161,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                    lineNumber: 146,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(NotificationButton, "wC/90+Q4yHqrXs3xlMUFPxQyZVM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$usePush$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePush"]
    ];
});
_c = NotificationButton;
var _c;
__turbopack_context__.k.register(_c, "NotificationButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/Hero.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Hero() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Hero.useEffect": ()=>{}
    }["Hero.useEffect"], []);
    const handleClick = ()=>{
        const el = document.getElementById("aiassistant");
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "hero",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: "/logos/mzlogo.webp",
                alt: "MZPrimer Logo",
                width: 224,
                height: 224,
                className: "w-40 md:w-56",
                priority: true,
                quality: 85,
                sizes: "(max-width: 768px) 160px, 224px"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Hero.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                children: [
                    "Enhance Your Trading with",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/Hero.tsx",
                        lineNumber: 32,
                        columnNumber: 34
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hero-gold",
                        children: "AI-Driven Tools"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/Hero.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Hero.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Unlock insights, test strategies, and grow your edge with advanced AI solutions tailored for traders."
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Hero.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleClick,
                className: "btn-primary",
                style: {
                    maxWidth: "220px",
                    fontSize: "1.1rem",
                    padding: "16px 32px",
                    marginTop: "1rem"
                },
                "aria-label": "Start using AI assistant for trading",
                children: "Start Now"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/Hero.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/Hero.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(Hero, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = Hero;
var _c;
__turbopack_context__.k.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LiveMarketFeed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
// --- HELPER: HANDLES SCROLL, PAUSE & SUB-PIXEL PRECISION ---
const MobileScrollRow = ({ children, direction = "left", speed = 1 })=>{
    _s();
    const scrollerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isPaused = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const reqRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scrollPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0); // NEW: Tracks precise float value
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MobileScrollRow.useEffect": ()=>{
            const el = scrollerRef.current;
            if (!el) return;
            // Initialize Position
            const startPos = direction === "right" ? el.scrollWidth / 2 : 0;
            el.scrollLeft = startPos;
            scrollPos.current = startPos;
            const animate = {
                "MobileScrollRow.useEffect.animate": ()=>{
                    if (!el) return;
                    if (!isPaused.current) {
                        // 1. Detect Manual Swipe: If DOM drifts far from our tracker, user moved it.
                        if (Math.abs(el.scrollLeft - scrollPos.current) > 5) {
                            scrollPos.current = el.scrollLeft;
                        }
                        // 2. Move exact amount
                        const move = direction === "left" ? speed : -speed;
                        scrollPos.current += move;
                        el.scrollLeft = scrollPos.current;
                        // 3. Infinite Loop Logic
                        const halfWidth = el.scrollWidth / 2;
                        if (direction === "left" && scrollPos.current >= halfWidth) {
                            scrollPos.current = 0;
                            el.scrollLeft = 0;
                        } else if (direction === "right" && scrollPos.current <= 0) {
                            scrollPos.current = halfWidth;
                            el.scrollLeft = halfWidth;
                        }
                    }
                    reqRef.current = requestAnimationFrame(animate);
                }
            }["MobileScrollRow.useEffect.animate"];
            reqRef.current = requestAnimationFrame(animate);
            return ({
                "MobileScrollRow.useEffect": ()=>{
                    if (reqRef.current !== null) cancelAnimationFrame(reqRef.current);
                }
            })["MobileScrollRow.useEffect"];
        }
    }["MobileScrollRow.useEffect"], [
        direction,
        speed
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: scrollerRef,
        className: "manual-scroll-container",
        style: {
            maxWidth: "100%",
            width: "100%"
        },
        onMouseEnter: ()=>isPaused.current = true,
        onMouseLeave: ()=>isPaused.current = false,
        onTouchStart: ()=>isPaused.current = true,
        onTouchEnd: ()=>setTimeout(()=>isPaused.current = false, 1000),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "scroll-content",
            children: children
        }, void 0, false, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
            lineNumber: 83,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(MobileScrollRow, "jI1IQjlSamWZa2n7TzMQMXZhsnI=");
_c = MobileScrollRow;
function LiveMarketFeed() {
    _s1();
    const [signals, setSignals] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // In your LiveMarketFeed component's useEffect:
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveMarketFeed.useEffect": ()=>{
            const fetchData = {
                "LiveMarketFeed.useEffect.fetchData": async ()=>{
                    try {
                        const res = await fetch("/api/livemarketfeed");
                        const data = await res.json();
                        // Get signals from the response object
                        setSignals(data?.signals || []); // ← This is the fix
                    } catch (err) {
                        console.error("Failed to load feed", err);
                    } finally{
                        setLoading(false);
                    }
                }
            }["LiveMarketFeed.useEffect.fetchData"];
            fetchData();
        }
    }["LiveMarketFeed.useEffect"], []);
    const renderCard = (item, index, keyPrefix)=>{
        const isBuy = item.action === "BUY";
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "terminal-slat",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "slat-timestamp",
                    children: [
                        "[",
                        new Date().toLocaleTimeString([], {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        "]"
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "slat-symbol",
                    children: item.symbol
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                    lineNumber: 117,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `slat-action ${isBuy ? "up" : "down"}`,
                    children: isBuy ? "▲ LONG" : "▼ SHORT"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                    lineNumber: 118,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "slat-price",
                    children: item.current_price.toFixed(2)
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "slat-conf",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "gold-text",
                            children: [
                                item.confidence,
                                "%"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "conf-bar-bg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "conf-bar-fill",
                                style: {
                                    width: `${item.confidence}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                                lineNumber: 124,
                                columnNumber: 40
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                    lineNumber: 122,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "slat-lock",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "slat-blur",
                            children: "TARGET_HIDDEN"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/client/register",
                            className: "slat-unlock",
                            children: "TRADE"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this)
            ]
        }, `${keyPrefix}-${item.symbol}-${index}`, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
            lineNumber: 115,
            columnNumber: 7
        }, this);
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "feed-container",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feed-loading",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pulse-bar"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                    lineNumber: 136,
                    columnNumber: 37
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Calibrating AI Feed..."
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                    lineNumber: 136,
                    columnNumber: 70
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
            lineNumber: 136,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
    if (signals.length === 0) return null;
    // Split signals for two rows
    const displaySignals = signals.slice(0, 6);
    const row1 = displaySignals.slice(0, 3);
    const row2 = displaySignals.slice(3, 6);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "feed-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "feed-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "live-badge",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "blink-dot"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                                lineNumber: 150,
                                columnNumber: 37
                            }, this),
                            " LIVE FEED"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: "Real-time market opportunities detected by MZPrimer AI Trading Expert"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "terminal-scroll-view",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileScrollRow, {
                        direction: "left",
                        speed: 0.8,
                        children: [
                            ...row1,
                            ...row1,
                            ...row1,
                            ...row1
                        ].map((item, index)=>renderCard(item, index, "r1"))
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileScrollRow, {
                        direction: "left",
                        speed: 0.8,
                        children: [
                            ...row2,
                            ...row2,
                            ...row2,
                            ...row2
                        ].map((item, index)=>renderCard(item, index, "r2"))
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
_s1(LiveMarketFeed, "QJseVvGPJdbW4+sL8eILKe+TbL8=");
_c1 = LiveMarketFeed;
var _c, _c1;
__turbopack_context__.k.register(_c, "MobileScrollRow");
__turbopack_context__.k.register(_c1, "LiveMarketFeed");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TradingAssistantBridge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$usePush$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/hooks/usePush.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$ring$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BellRing$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/bell-ring.js [app-client] (ecmascript) <export default as BellRing>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/trophy.js [app-client] (ecmascript) <export default as Trophy>");
;
var _s = __turbopack_context__.k.signature();
// components/TradingAssistantBridge.tsx
'use client';
;
;
;
// --- LINKS ---
const TELEGRAM_LINK = "https://t.me/mzprimer";
// CONFIG
const CACHE_KEY = 'mz_popup_market_data';
const CACHE_DURATION_MS = 5 * 60 * 10000;
const API_URL = '/api/livemarketfeed';
function TradingAssistantBridge() {
    _s();
    const { subscription, subscribeToPush, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$usePush$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePush"])();
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [bestTrade, setBestTrade] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // --- PWA DETECTION ---
    const checkPWA = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const isStandard = window.matchMedia('(display-mode: standalone)').matches;
        const isApple = window.navigator.standalone === true;
        return isStandard || isApple;
    };
    // --- TIME FORMATTING ---
    function getTimeAgo(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        if (date > now) return 'Just now';
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diff < 60) return 'Just now';
        const min = Math.floor(diff / 60);
        if (min < 60) return `${min}m ago`;
        return '1d ago';
    }
    // --- LOAD LOGIC ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TradingAssistantBridge.useEffect": ()=>{
            setMounted(true);
            if (subscription) return;
            const loadData = {
                "TradingAssistantBridge.useEffect.loadData": async ()=>{
                    let activeSignal = null;
                    const cached = localStorage.getItem(CACHE_KEY);
                    if (cached) {
                        try {
                            const { data, timestamp } = JSON.parse(cached);
                            if (Date.now() - timestamp < CACHE_DURATION_MS) {
                                activeSignal = getBestSignal(data);
                            }
                        } catch (e) {
                            localStorage.removeItem(CACHE_KEY);
                        }
                    }
                    if (!activeSignal) {
                        try {
                            const res = await fetch(API_URL);
                            if (res.ok) {
                                const rawData = await res.json();
                                localStorage.setItem(CACHE_KEY, JSON.stringify({
                                    timestamp: Date.now(),
                                    data: rawData
                                }));
                                activeSignal = getBestSignal(rawData);
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    if (activeSignal) {
                        setBestTrade(activeSignal);
                        const delay = checkPWA() ? 50 : 7000;
                        setTimeout({
                            "TradingAssistantBridge.useEffect.loadData": ()=>setIsVisible(true)
                        }["TradingAssistantBridge.useEffect.loadData"], delay);
                    }
                }
            }["TradingAssistantBridge.useEffect.loadData"];
            loadData();
        }
    }["TradingAssistantBridge.useEffect"], [
        subscription
    ]);
    const getBestSignal = (data)=>{
        if (!data.signals || data.signals.length === 0) return null;
        return data.signals.sort((a, b)=>b.confidence - a.confidence)[0];
    };
    const handleClose = ()=>{
        setIsVisible(false);
        sessionStorage.setItem('tradePopupClosed', 'true');
    };
    // --- NAVIGATE TO SPECIFIC ASSISTANT ---
    const navigateToAssistant = async (type)=>{
        const isInstalled = checkPWA();
        // Redirect to specific pages
        const targetPath = type === 'prop' ? '/prop-firm' : '/AIChat';
        window.location.href = targetPath;
        // Subscribe to push notifications
        await subscribeToPush();
        setIsVisible(false);
    };
    // RENDER SAFEGUARD
    if (!mounted || !isVisible || subscription || !bestTrade) return null;
    // ===============================================================
    // MAIN POPUP WITH TRADING TYPE SELECTION
    // ===============================================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "popup-container",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `popup-card ${checkPWA() ? 'ring-2 ring-green-500/50' : ''}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "popup-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "popup-header-title",
                            children: checkPWA() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-green-400 flex items-center gap-2 font-bold animate-pulse",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$ring$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BellRing$3e$__["BellRing"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                        lineNumber: 142,
                                        columnNumber: 19
                                    }, this),
                                    " SELECT TRADING ASSISTANT"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                lineNumber: 141,
                                columnNumber: 16
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "live-dot"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                        lineNumber: 146,
                                        columnNumber: 18
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-zinc-400",
                                        children: "AI TRADING SIGNAL"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                        lineNumber: 146,
                                        columnNumber: 48
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-px h-3 bg-white/10 mx-2"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                        lineNumber: 147,
                                        columnNumber: 18
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-yellow-500 font-bold",
                                        children: "LIVE"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                        lineNumber: 147,
                                        columnNumber: 70
                                    }, this)
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "header-time-text",
                                    children: getTimeAgo(bestTrade.timestamp)
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                    lineNumber: 152,
                                    columnNumber: 14
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleClose,
                                    className: "btn-popup-close",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                        lineNumber: 153,
                                        columnNumber: 72
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                    lineNumber: 153,
                                    columnNumber: 14
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                    lineNumber: 138,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "popup-body",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "popup-symbol-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "popup-symbol flex items-center gap-2",
                                    children: [
                                        bestTrade.symbol,
                                        bestTrade.action === 'BUY' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                            size: 20,
                                            className: "text-emerald-400 drop-shadow-md"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                            lineNumber: 163,
                                            columnNumber: 47
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                            size: 20,
                                            className: "text-red-400 rotate-180 drop-shadow-md"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                            lineNumber: 163,
                                            columnNumber: 117
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `popup-badge ${bestTrade.action === 'BUY' ? 'popup-badge-buy' : 'popup-badge-sell'}`,
                                    children: bestTrade.action
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                    lineNumber: 165,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 mt-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "popup-label mb-1",
                                        children: "Entry Price"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                        lineNumber: 173,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "effect-price-glow text-2xl font-bold",
                                        children: bestTrade.entry.toLocaleString(undefined, {
                                            maximumFractionDigits: 5
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                        lineNumber: 174,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                            lineNumber: 171,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-white font-bold text-lg mb-2",
                                    children: "Which AI Assistant do you need?"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                    lineNumber: 182,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-zinc-400 text-sm",
                                    children: "Choose based on your account type"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                            lineNumber: 181,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3 mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>navigateToAssistant('prop'),
                                    disabled: loading,
                                    className: "btn-cta btn-cta-prop",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "btn-content",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "icon-container",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                                                        size: 18,
                                                        className: "text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                                        lineNumber: 200,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-container",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "btn-title",
                                                            children: "PROP FIRM"
                                                        }, void 0, false, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                                            lineNumber: 203,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "btn-subtitle",
                                                            children: "FTMO, FundedNext, MFF, The5%ers"
                                                        }, void 0, false, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                                            lineNumber: 204,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                                    lineNumber: 202,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                            lineNumber: 198,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "checkmark",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                                lineNumber: 208,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                            lineNumber: 207,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                    lineNumber: 193,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>navigateToAssistant('trader'),
                                    disabled: loading,
                                    className: "btn-cta btn-cta-trader",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "btn-content",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "icon-container",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                        size: 18,
                                                        className: "text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                                        lineNumber: 220,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-container",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "btn-title",
                                                            children: "TRADER"
                                                        }, void 0, false, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                                            lineNumber: 223,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "btn-subtitle",
                                                            children: "Personal account, investor"
                                                        }, void 0, false, {
                                                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                                            lineNumber: 224,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                                    lineNumber: 222,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                            lineNumber: 218,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "checkmark",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                                lineNumber: 228,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                            lineNumber: 227,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                    lineNumber: 213,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this),
                        !checkPWA() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: TELEGRAM_LINK,
                            target: "_blank",
                            className: "block text-center mt-3 text-[10px] text-zinc-500 hover:text-blue-400 transition",
                            children: [
                                "Or join ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "underline",
                                    children: "Telegram Channel"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                                    lineNumber: 240,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                            lineNumber: 235,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
            lineNumber: 136,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
_s(TradingAssistantBridge, "9ePY027kXnvtjmotJhVndWw4xzI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$usePush$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePush"]
    ];
});
_c = TradingAssistantBridge;
var _c;
__turbopack_context__.k.register(_c, "TradingAssistantBridge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$AiChatBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const AiChatSection = ({ onLaunch })=>{
    _s();
    // Internal state for modal
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedSymbol, setSelectedSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Internal modal handlers
    const openModal = (symbol = null)=>{
        console.log('🔵 Opening AI modal with symbol:', symbol);
        setSelectedSymbol(symbol);
        setShowModal(true);
        document.body.style.overflow = 'hidden';
    };
    const closeModal = ()=>{
        setShowModal(false);
        setSelectedSymbol(null);
        document.body.style.overflow = 'auto';
    };
    const handleSymbolClick = (symbol)=>{
        if (onLaunch && typeof onLaunch === 'function') {
            onLaunch(symbol);
        } else {
            console.log('Using internal AI modal logic for symbol:', symbol);
            openModal(symbol);
        }
    };
    const handleTerminalLaunch = ()=>{
        if (onLaunch && typeof onLaunch === 'function') {
            onLaunch(""); // Empty string for full terminal launch
        } else {
            console.log('Using internal AI modal logic for full terminal');
            openModal(null);
        }
    };
    // Quick symbols array
    const quickSymbols = [
        "XAUUSD",
        "BTCUSD",
        "EURUSD",
        "USDJPY"
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "aiassistant",
                className: "ai-chat-section",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "ai-chat-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "ai-chat-title",
                            children: "AI Intel Terminal"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "ai-chat-subtitle",
                            children: "Direct access to institutional technical analysis. Select an asset to begin."
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "symbol-launch-grid mb-6",
                            children: quickSymbols.map((sym)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "symbol-launch-btn ai-style",
                                    onClick: ()=>handleSymbolClick(sym),
                                    type: "button",
                                    "aria-label": `Launch AI analysis for ${sym}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "launch-pill-icon",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                size: 20,
                                                strokeWidth: 1.5
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                                lineNumber: 67,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                            lineNumber: 66,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sym-name",
                                            children: sym
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                            lineNumber: 69,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sym-status",
                                            children: "Analyze"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                            lineNumber: 70,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, sym, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "launch-terminal-card ai-accent",
                            onClick: handleTerminalLaunch,
                            role: "button",
                            tabIndex: 0,
                            onKeyDown: (e)=>{
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleTerminalLaunch();
                                    e.preventDefault();
                                }
                            },
                            "aria-label": "Launch full AI Intel Terminal",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "launch-header",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pulse-indicator ai"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "System Status: Online"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                            lineNumber: 91,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "launch-icon-box",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                        size: 48
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "launch-terminal-btn ai",
                                    type: "button",
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        handleTerminalLaunch();
                                    },
                                    children: "Launch AI Intel Terminal"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                    lineNumber: 96,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "launch-footer-text",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                            lineNumber: 107,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " Instant technical analysis available"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                lineNumber: 49,
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
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        "AI Intelligence Terminal"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                    lineNumber: 118,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: closeModal,
                                    className: "immersive-close-btn",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 24
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                            lineNumber: 123,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "CLOSE"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                            lineNumber: 123,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                    lineNumber: 122,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                            lineNumber: 117,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "immersive-content",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$AiChatBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                mode: "section",
                                onClose: closeModal,
                                autoStart: true,
                                preselectedSymbol: selectedSymbol
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                                lineNumber: 128,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                            lineNumber: 127,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                    lineNumber: 116,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx",
                lineNumber: 115,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)), document.body)
        ]
    }, void 0, true);
};
_s(AiChatSection, "muYD6kDV4tTW2dqPhlwXZjSGDWY=");
_c = AiChatSection;
const __TURBOPACK__default__export__ = AiChatSection;
var _c;
__turbopack_context__.k.register(_c, "AiChatSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/LicenseModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LicenseModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function LicenseModal({ open, value, onChange, onClose, onSave }) {
    _s();
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LicenseModal.useEffect": ()=>{
            if (!open) return;
            const onEsc = {
                "LicenseModal.useEffect.onEsc": (e)=>{
                    if (e.key === 'Escape') onClose();
                }
            }["LicenseModal.useEffect.onEsc"];
            window.addEventListener('keydown', onEsc);
            return ({
                "LicenseModal.useEffect": ()=>window.removeEventListener('keydown', onEsc)
            })["LicenseModal.useEffect"];
        }
    }["LicenseModal.useEffect"], [
        open,
        onClose
    ]);
    if (!open) return null;
    async function handleActivate() {
        const key = value.trim();
        if (!key) {
            alert('Please paste your license key first.');
            return;
        }
        try {
            setSubmitting(true);
            // ⬇️ Dynamic import so server never evaluates the fingerprint file
            const { getDeviceFingerprint } = await __turbopack_context__.A("[project]/mzprimer-nextjs-v1 /app/utils/fingerprint.client.ts [app-client] (ecmascript, async loader)");
            const fp = await getDeviceFingerprint();
            const r = await fetch('/api/license/activate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    key,
                    fingerprint: fp
                })
            });
            const j = await r.json().catch(()=>({}));
            if (!r.ok || !j?.ok) {
                alert(j?.error || 'Activation failed');
                return;
            }
            localStorage.setItem('mz_license_key', key);
            alert('License activated ✅');
            onSave?.();
            onClose();
        } catch (e) {
            alert(e?.message || 'Activation error');
        } finally{
            setSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "ta-lic-overlay",
        role: "dialog",
        "aria-modal": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ta-lic-backdrop",
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/LicenseModal.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ta-lic-modal",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "ta-lic-title",
                        children: "Enter License Key"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/LicenseModal.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "ta-lic-text",
                        children: "Paste the license code sent to your email after payment."
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/LicenseModal.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: "ta-input ta-lic-input",
                        placeholder: "XXXX-XXXX-XXXX-XXXX",
                        value: value,
                        onChange: (e)=>onChange(e.target.value),
                        autoFocus: true
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/LicenseModal.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ta-lic-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "ta-link-btn",
                                onClick: onClose,
                                disabled: submitting,
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/LicenseModal.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "ta-btn",
                                onClick: handleActivate,
                                disabled: !value.trim() || submitting,
                                children: submitting ? 'Activating…' : 'Activate'
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/LicenseModal.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/LicenseModal.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/LicenseModal.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/LicenseModal.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_s(LicenseModal, "isa3J6MfgBZyBRgdh+0Vw6HuRlI=");
_c = LicenseModal;
var _c;
__turbopack_context__.k.register(_c, "LicenseModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /app/lib/license-local.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/license-local.ts
__turbopack_context__.s([
    "isValidLicenseFormat",
    ()=>isValidLicenseFormat,
    "readLocalLicense",
    ()=>readLocalLicense,
    "writeLocalLicense",
    ()=>writeLocalLicense
]);
function isValidLicenseFormat(k) {
    return /^[A-Z0-9-]{10,}$/i.test(k.trim());
}
function readLocalLicense() {
    try {
        return localStorage.getItem('mz_ai_license');
    } catch  {
        return null;
    }
}
function writeLocalLicense(key) {
    try {
        localStorage.setItem('mz_ai_license', key);
        localStorage.setItem('mz_ai_subscribed', '1');
    } catch  {}
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /app/utils/fingerprint.client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDeviceFingerprint",
    ()=>getDeviceFingerprint
]);
'use client';
async function getDeviceFingerprint() {
    try {
        const hasWindow = ("TURBOPACK compile-time value", "object") !== 'undefined' && typeof document !== 'undefined';
        const ua = hasWindow ? navigator.userAgent || '' : '';
        const lang = hasWindow ? navigator.language || '' : '';
        const plat = hasWindow ? navigator.platform || '' : '';
        const cores = hasWindow ? String(navigator.hardwareConcurrency || '') : '';
        const mem = hasWindow ? String(navigator.deviceMemory || '') : '';
        const scrWidth = hasWindow && typeof window.screen !== 'undefined' ? String(window.screen.width || '') : '';
        const scrHeight = hasWindow && typeof window.screen !== 'undefined' ? String(window.screen.height || '') : '';
        const colorDepth = hasWindow && typeof window.screen !== 'undefined' ? String(window.screen.colorDepth || '') : '';
        let tz = '';
        try {
            tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        } catch  {}
        const parts = [
            ua,
            lang,
            plat,
            cores,
            mem,
            scrWidth,
            scrHeight,
            colorDepth,
            tz
        ].join('|');
        // Stable per-browser salt
        const SALT_KEY = 'mz_fp_salt';
        let salt = 'nosalt';
        if (hasWindow) {
            try {
                salt = localStorage.getItem(SALT_KEY) || '';
                if (!salt) {
                    salt = Math.random().toString(36).slice(2);
                    localStorage.setItem(SALT_KEY, salt);
                }
            } catch  {}
        }
        const raw = parts + '|' + salt;
        // Use WebCrypto only if truly available in secure context
        const subtle = hasWindow && window.isSecureContext && window.crypto?.subtle && typeof window.crypto.subtle.digest === 'function' ? window.crypto.subtle : null;
        if (subtle) {
            try {
                const data = new TextEncoder().encode(raw);
                const buf = await subtle.digest('SHA-256', data);
                return Array.from(new Uint8Array(buf)).map((b)=>b.toString(16).padStart(2, '0')).join('');
            } catch  {
            // fall through
            }
        }
        // Fallback: FNV-1a
        let h = 0x811c9dc5;
        for(let i = 0; i < raw.length; i++){
            h ^= raw.charCodeAt(i);
            h = h * 0x01000193 >>> 0;
        }
        return `fnv1a-${h.toString(16).padStart(8, '0')}`;
    } catch  {
        return 'fp-unknown';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TraderAssistantLite
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$LicenseModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/LicenseModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$license$2d$local$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/lib/license-local.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$utils$2f$fingerprint$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/utils/fingerprint.client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/lib/fetchPrice.ts [app-client] (ecmascript)"); // adjust path as needed
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
// === Shared storage keys (global across pages) ===
const USAGE_KEY = 'mz_ai_uses_global_v1';
const SUB_KEY = 'mz_ai_subscribed_global_v1';
const LIC_KEY = 'mz_ai_license_global_v1';
const LEGACY_USAGE_KEYS = [
    'mz_ai_uses',
    'mz_ai_uses_lite',
    'ai_uses'
];
const LEGACY_SUB_KEYS = [
    'mz_ai_subscribed'
];
const LEGACY_LIC_KEYS = [
    'mz_ai_license'
];
// Accepts string | {key, expiresAt} | null/undefined and normalizes it
function normalizeLicense(input) {
    if (!input) return {
        key: ''
    };
    if (typeof input === 'string') return {
        key: input.trim()
    };
    if (typeof input === 'object') {
        const maybe = input;
        const key = (typeof maybe.key === 'string' ? maybe.key : '').trim();
        const expiresAt = typeof maybe.expiresAt === 'number' ? maybe.expiresAt : undefined;
        return {
            key,
            expiresAt
        };
    }
    return {
        key: ''
    };
}
const DISPLAY_NAMES = {
    select: 'Select Symbol',
    EURUSD: 'EURUSD (Euro / US Dollar)',
    GBPUSD: 'GBPUSD (British Pound / US Dollar)',
    USDJPY: 'USDJPY (US Dollar / Japanese Yen)',
    USDCAD: 'USDCAD (US Dollar / Canadian Dollar)',
    AUDUSD: 'AUDUSD (Australian Dollar / US Dollar)',
    NZDUSD: 'NZDUSD (NZ Dollar / US Dollar)',
    USDCHF: 'USDCHF (US Dollar / Swiss Franc)',
    XAUUSD: 'XAUUSD (Gold / US Dollar)',
    XAUEUR: 'XAUEUR (Gold / Euro)',
    XAGUSD: 'XAGUSD (Silver / US Dollar)',
    PLATINUM: 'PLATINUM (Platinum / US Dollar)',
    BRENT: 'BRENT (Crude Oil)',
    BTCUSD: 'BTCUSD (Bitcoin)',
    ETHUSD: 'ETHUSD (Ethereum)',
    XRPUSD: 'XRPUSD (Ripple)',
    DOGEUSD: 'DOGEUSD (Dogecoin)',
    LTCUSD: 'LTCUSD (Litecoin)',
    US500: 'US500 (S&P 500 Index (US))',
    USTEC: 'USTEC (NASDAQ 100 Index (US))',
    US30: 'YM (Dow Jones 30 Index (US).com)',
    HK50: 'HK50 (Hong Kong 50 stock index)',
    FRANCE40: 'CAC (FRANCE40 Index (France))',
    CHINA50: 'FDAX (German DAX Index)',
    UK100: 'FTSE (UK 100 Index)',
    EURJPY: 'EURJPY (Euro / Japanese Yen)',
    EURGBP: 'EURGBP (Euro / British Pound)',
    GBPJPY: 'GBPJPY (British Pound / Japanese Yen)',
    GBPCHF: 'GBPCHF (British Pound / Swiss Franc)'
};
const CONTRACT = {
    select: {
        contract: 100000,
        pip: 0.0001
    },
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
    BTCUSD: {
        contract: 1,
        pip: 0.5
    },
    ETHUSD: {
        contract: 1,
        pip: 0.1
    },
    XRPUSD: {
        contract: 1,
        pip: 0.0001
    },
    DOGEUSD: {
        contract: 1,
        pip: 0.0001
    },
    LTCUSD: {
        contract: 1,
        pip: 0.01
    },
    US500: {
        contract: 1,
        pip: 0.1
    },
    USTEC: {
        contract: 1,
        pip: 0.1
    },
    US30: {
        contract: 1,
        pip: 0.1
    },
    HK50: {
        contract: 1,
        pip: 0.1
    },
    FRANCE40: {
        contract: 1,
        pip: 0.1
    },
    CHINA50: {
        contract: 1,
        pip: 1
    },
    UK100: {
        contract: 1,
        pip: 1
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
    }
};
const DECIMALS = {
    select: 4,
    EURUSD: 5,
    GBPUSD: 5,
    USDJPY: 3,
    USDCAD: 5,
    AUDUSD: 5,
    NZDUSD: 5,
    USDCHF: 5,
    XAUUSD: 2,
    XAUEUR: 2,
    XAGUSD: 3,
    PLATINUM: 2,
    BRENT: 2,
    BTCUSD: 1,
    ETHUSD: 2,
    XRPUSD: 4,
    DOGEUSD: 4,
    LTCUSD: 2,
    US500: 2,
    USTEC: 2,
    US30: 2,
    HK50: 2,
    FRANCE40: 2,
    CHINA50: 1,
    UK100: 1,
    EURJPY: 3,
    EURGBP: 5,
    GBPJPY: 3,
    GBPCHF: 5
};
const LEVERAGES = [
    25,
    50,
    100,
    200,
    500,
    1000
];
const ACCOUNT_TYPES = [
    'Standard',
    'ECN',
    'Classic'
];
const ACCOUNT_CCY = [
    'USD',
    'EUR',
    'GBP'
];
const ASSET_GROUPS = [
    {
        key: 'fx',
        label: 'Forex - Major Currency Pairs',
        symbols: [
            'select',
            'EURUSD',
            'GBPUSD',
            'USDJPY',
            'USDCAD',
            'AUDUSD',
            'NZDUSD',
            'USDCHF',
            'EURJPY',
            'EURGBP',
            'GBPJPY',
            'GBPCHF'
        ]
    },
    {
        key: 'metals',
        label: 'Metals & Energy',
        symbols: [
            'XAUUSD',
            'XAUEUR',
            'XAGUSD',
            'PLATINUM',
            'BRENT'
        ]
    },
    {
        key: 'crypto',
        label: 'Cryptocurrencies',
        symbols: [
            'BTCUSD',
            'ETHUSD',
            'XRPUSD',
            'DOGEUSD',
            'LTCUSD'
        ]
    },
    {
        key: 'indices',
        label: 'Indices',
        symbols: [
            'US500',
            'USTEC',
            'US30',
            'HK50',
            'FRANCE40',
            'CHINA50',
            'UK100'
        ]
    }
];
function styleParams(style) {
    if (style === 'scalper') return {
        name: 'Scalper',
        slPips: 10,
        rr: 1.5
    };
    if (style === 'aggressive') return {
        name: 'Aggressive',
        slPips: 15,
        rr: 2.5
    };
    if (style === 'swing') return {
        name: 'Swing',
        slPips: 60,
        rr: 2.0
    };
    return {
        name: 'Balanced',
        slPips: 20,
        rr: 2.0
    };
}
function fmt(sUS30, v) {
    return v.toFixed(DECIMALS[sym] ?? 2);
}
function TraderAssistantLite() {
    _s();
    const FREE_USES = 3; // two free tries before paywall
    // License modal state
    const [licenseOpen, setLicenseOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [licenseKey, setLicenseKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    /* ---------- Subscription / usage (NEW) ---------- */ const [usageCount, setUsageCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isSubscribed, setIsSubscribed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // load counters & subscription on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TraderAssistantLite.useEffect": ()=>{
            // 1) sync bits (counter)
            try {
                const raw = localStorage.getItem('mz_ai_uses');
                let u = Number.parseInt(raw ?? '0', 10);
                if (!Number.isFinite(u) || u < 0 || u > 1000) u = 0; // clamp
                setUsageCount(u);
            } catch  {}
            let mounted = true;
            // 2) async bits (license + fingerprint)
            ({
                "TraderAssistantLite.useEffect": async ()=>{
                    try {
                        const subFlag = localStorage.getItem('mz_ai_subscribed') === '1';
                        // license from localStorage (string)
                        const stored = (localStorage.getItem('mz_ai_license') || '').trim();
                        const storedValid = stored.length >= 10;
                        // license from helper (could be string or {key, expiresAt})
                        let helper = null;
                        try {
                            helper = await (typeof __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$license$2d$local$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readLocalLicense"] === 'function' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$license$2d$local$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readLocalLicense"])() : null);
                        } catch  {}
                        const helperKey = typeof helper === 'string' ? helper : helper?.key;
                        const helperExp = typeof helper === 'object' ? helper?.expiresAt : undefined;
                        const now = Date.now();
                        const helperValid = !!helperKey && (!helperExp || Number(helperExp) > now);
                        if (mounted) setIsSubscribed(Boolean(subFlag || storedValid || helperValid));
                        // optional soft device fingerprint
                        try {
                            const fp = await (typeof __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$utils$2f$fingerprint$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeviceFingerprint"] === 'function' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$utils$2f$fingerprint$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeviceFingerprint"])() : Promise.resolve(''));
                            if (fp) localStorage.setItem('mz_ai_device', fp);
                        } catch  {}
                    } catch  {}
                }
            })["TraderAssistantLite.useEffect"]();
            return ({
                "TraderAssistantLite.useEffect": ()=>{
                    mounted = false;
                }
            })["TraderAssistantLite.useEffect"];
        }
    }["TraderAssistantLite.useEffect"], []);
    // persist usage counter
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TraderAssistantLite.useEffect": ()=>{
            try {
                localStorage.setItem(USAGE_KEY, String(usageCount));
                for (const k of LEGACY_USAGE_KEYS)localStorage.setItem(k, String(usageCount));
            } catch  {}
        }
    }["TraderAssistantLite.useEffect"], [
        usageCount
    ]);
    // persist subscription flag
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TraderAssistantLite.useEffect": ()=>{
            try {
                const v = isSubscribed ? '1' : '0';
                localStorage.setItem(SUB_KEY, v);
                for (const k of LEGACY_SUB_KEYS)localStorage.setItem(k, v);
            } catch  {}
        }
    }["TraderAssistantLite.useEffect"], [
        isSubscribed
    ]);
    // Auto-open license modal if coming from email with ?activate=1
    const sp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TraderAssistantLite.useEffect": ()=>{
            if (sp.get('activate') === '1') {
                setLicenseOpen(true);
                // Optional: prefill from ?key=... if you ever include it in emails
                const keyFromUrl = sp.get('key');
                if (keyFromUrl) setLicenseKey(keyFromUrl.trim());
            }
        }
    }["TraderAssistantLite.useEffect"], [
        sp
    ]);
    const [symbol, setSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('select');
    const [price, setPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1.0850);
    const [autoPriceLoading, setAutoPriceLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [style, setStyle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('balanced');
    const [isPriceLoading, setIsPriceLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TraderAssistantLite.useEffect": ()=>{
            if (symbol === 'select') return;
            console.log("🔁 useEffect triggered for symbol:", symbol);
            const updatePrice = {
                "TraderAssistantLite.useEffect.updatePrice": async ()=>{
                    setIsPriceLoading(true);
                    try {
                        const newPrice = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$lib$2f$fetchPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCurrentPrice"])(symbol);
                        console.log("📈 newPrice fetched:", newPrice);
                        if (newPrice !== null && !isNaN(newPrice)) {
                            setPrice(Number(newPrice.toFixed(DECIMALS[symbol] ?? 2)));
                        }
                    } catch (err) {
                        console.error('Error fetching price:', err);
                    }
                    setIsPriceLoading(false);
                }
            }["TraderAssistantLite.useEffect.updatePrice"];
            updatePrice();
        }
    }["TraderAssistantLite.useEffect"], [
        symbol
    ]);
    // quick activation via prompt (keeps UI unchanged)
    const activateLicense = ()=>{
        const key = window.prompt('Enter your license key to unlock the AI Assistant:')?.trim();
        if (!key) return;
        // simple client-side check; you’ll replace with server validation later
        if (!/^[A-Z0-9-]{10,}$/i.test(key)) {
            alert('Please enter a valid license key.');
            return;
        }
        try {
            localStorage.setItem('mz_ai_license', key);
            localStorage.setItem('mz_ai_subscribed', '1');
        } catch  {}
        setIsSubscribed(true);
        alert('License activated. Enjoy unlimited access!');
    };
    /* ---------- Inputs ---------- */ const [balance, setBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1000);
    const [accountType, setAccountType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('ECN');
    const [accountCcy, setAccountCcy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('USD');
    const [leverage, setLeverage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(100);
    const [assetGroup, setAssetGroup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('fx');
    const [dir, setDir] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('buy');
    const [lot, setLot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0.10);
    const [scenario, setScenario] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('tp');
    const [showResults, setShowResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    /* ---------- Derived ---------- */ const spec = CONTRACT[symbol];
    const { name: styleName, slPips, rr } = styleParams(style);
    const tpPips = slPips * rr;
    const slPrice = dir === 'buy' ? price - slPips * spec.pip : price + slPips * spec.pip;
    const tpPrice = dir === 'buy' ? price + tpPips * spec.pip : price - tpPips * spec.pip;
    const pipValuePerLot = symbol.startsWith('XAU') || symbol.startsWith('XAG') || symbol.startsWith('BTC') || symbol.startsWith('ETH') ? spec.pip * spec.contract : spec.contract * spec.pip;
    const estLoss = slPips * pipValuePerLot * lot;
    const estWin = tpPips * pipValuePerLot * lot;
    const positionUnits = lot * spec.contract;
    const marginReq = positionUnits * price / leverage;
    const marginPctOfBal = balance > 0 ? marginReq / balance * 100 : 0;
    const riskPctAuto = balance > 0 ? estLoss / balance * 100 : 0;
    const targetMarginPct = style === 'scalper' ? 5 : style === 'balanced' ? 8 : style === 'aggressive' ? 12 : 6;
    const suggestedLot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TraderAssistantLite.useMemo[suggestedLot]": ()=>{
            if (balance <= 0 || price <= 0) return lot;
            const targetMargin = targetMarginPct / 100 * balance;
            const units = targetMargin * leverage / price;
            const lots = units / spec.contract;
            return Math.max(0.01, Math.round(lots * 100) / 100);
        }
    }["TraderAssistantLite.useMemo[suggestedLot]"], [
        balance,
        price,
        leverage,
        spec.contract,
        targetMarginPct,
        lot
    ]);
    /* ---------- Actions ---------- */ const onGetAssistant = ()=>{
        setShowResults(true);
        if (isSubscribed) return;
        // increment AFTER showing, so current click is never blurred
        setUsageCount((prev)=>{
            const next = prev + 1;
            try {
                localStorage.setItem('mz_ai_uses', String(next));
            } catch  {}
            return next;
        });
    };
    // derive paywall from current state
    const needsPaywall = !isSubscribed && usageCount >= FREE_USES;
    async function handleActivateLicense() {
        try {
            // optional: device fingerprint if you have it
            let fingerprint;
            try {
                const maybeFp = window.getDeviceFingerprint?.() || null;
                fingerprint = typeof maybeFp === 'string' ? maybeFp : undefined;
            } catch  {}
            const res = await fetch('/api/license/activate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    key: licenseKey.trim(),
                    fingerprint
                })
            });
            const json = await res.json().catch(()=>({}));
            if (!res.ok || !json?.ok) {
                alert(json?.error || 'Activation failed. Please check your key and try again.');
                return;
            }
            // persist locally so user stays unlocked
            try {
                localStorage.setItem('mz_ai_license', json.license?.key || licenseKey.trim());
                localStorage.setItem('mz_ai_subscribed', '1');
            } catch  {}
            setIsSubscribed(true);
            setLicenseOpen(false);
            setLicenseKey('');
        } catch (e) {
            alert(e?.message || 'Network error while activating license');
        }
    }
    /* ---------- Render ---------- */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "ai-assistant",
        className: "ta-anchor-offset ta-home-block ai-assistant-section",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ta-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "ta-title",
                        children: "AI Trader Assistant"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                        lineNumber: 368,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "ta-subtitle",
                        children: "AI-powered trading assistant: set your balance, symbol, leverage, and style to instantly calculate SL/TP levels, margin requirements, risk metrics, and view a simulated M5 price path — all in one clean, beginner-friendly tool."
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                        lineNumber: 369,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                lineNumber: 367,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ta-wrap scroll-fade-up",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ta-deck",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ta-card ta-card--account",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "ta-card-title",
                                        children: "Account"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 378,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ta-bar",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ta-field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Account type"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 382,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        className: "ta-input",
                                                        value: accountType,
                                                        onChange: (e)=>setAccountType(e.target.value),
                                                        children: ACCOUNT_TYPES.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: t,
                                                                children: t
                                                            }, t, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 385,
                                                                columnNumber: 41
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 383,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 381,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ta-field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Account currency"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 390,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        className: "ta-input",
                                                        value: accountCcy,
                                                        onChange: (e)=>setAccountCcy(e.target.value),
                                                        children: ACCOUNT_CCY.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: c,
                                                                children: c
                                                            }, c, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 393,
                                                                columnNumber: 39
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 391,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 389,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ta-field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Leverage"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 398,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        className: "ta-input",
                                                        value: leverage,
                                                        onChange: (e)=>setLeverage(Number(e.target.value)),
                                                        children: LEVERAGES.map((lv)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: lv,
                                                                children: [
                                                                    "1:",
                                                                    lv
                                                                ]
                                                            }, lv, true, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 401,
                                                                columnNumber: 38
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 399,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 397,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 380,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ta-field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Balance ($)"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 407,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: "ta-input",
                                                type: "number",
                                                value: balance,
                                                onChange: (e)=>setBalance(Number(e.target.value || 0)),
                                                min: 0
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 408,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 406,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                lineNumber: 377,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ta-card ta-card--asset",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "ta-card-title",
                                        children: "Trading Asset"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 415,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ta-field ta-span-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Asset group"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 418,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "ta-input",
                                                value: assetGroup,
                                                onChange: (e)=>{
                                                    const g = e.target.value;
                                                    setAssetGroup(g);
                                                    const group = ASSET_GROUPS.find((x)=>x.key === g);
                                                    if (!group.symbols.includes(symbol)) setSymbol(group.symbols[0]);
                                                },
                                                children: ASSET_GROUPS.map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: g.key,
                                                        children: g.label
                                                    }, g.key, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 429,
                                                        columnNumber: 17
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 419,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 417,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ta-field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Symbol"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 435,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "ta-input",
                                                value: symbol,
                                                onChange: (e)=>setSymbol(e.target.value),
                                                children: ASSET_GROUPS.find((g)=>g.key === assetGroup).symbols.map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: k,
                                                        children: DISPLAY_NAMES[k]
                                                    }, k, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 439,
                                                        columnNumber: 17
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 436,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 434,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ta-field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Position"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 445,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "ta-input",
                                                value: dir,
                                                onChange: (e)=>setDir(e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "buy",
                                                        children: "Buy"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 448,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "sell",
                                                        children: "Sell"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 449,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 446,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 444,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ta-field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Lot Size"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 454,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: "ta-input",
                                                type: "number",
                                                value: lot,
                                                onChange: (e)=>setLot(Number(e.target.value || 0)),
                                                min: 0.01,
                                                step: 0.01
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 455,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ta-hint",
                                                children: [
                                                    "Suggested: ",
                                                    suggestedLot.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 457,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 453,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                lineNumber: 414,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ta-card ta-card--exec",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "ta-card-title ta-center",
                                        children: "Execution Settings"
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 463,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ta-field ta-span-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Current Price"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 466,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: "ta-input",
                                                type: "number",
                                                value: price,
                                                onChange: (e)=>setPrice(Number(e.target.value || 0)),
                                                step: spec.pip,
                                                disabled: autoPriceLoading
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 467,
                                                columnNumber: 13
                                            }, this),
                                            autoPriceLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400 mt-1",
                                                children: "Fetching live price…"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 476,
                                                columnNumber: 3
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 465,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ta-field ta-span-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Trading Style"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 481,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "ta-input",
                                                value: style,
                                                onChange: (e)=>setStyle(e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "scalper",
                                                        children: "Scalper (very tight)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 484,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "balanced",
                                                        children: "Balanced"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 485,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "aggressive",
                                                        children: "Aggressive (wider TP)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 486,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "swing",
                                                        children: "Swing (wider SL)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 487,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 482,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ta-hint",
                                                children: [
                                                    "RR ≈ ",
                                                    rr,
                                                    ":1 • SL ≈ ",
                                                    slPips,
                                                    " pips"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 489,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 480,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ta-actions",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "ta-btn",
                                            onClick: onGetAssistant,
                                            children: "Get AI Assistant"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                            lineNumber: 493,
                                            columnNumber: 13
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 492,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                lineNumber: 462,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                        lineNumber: 375,
                        columnNumber: 7
                    }, this),
                    showResults && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ta-results-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `ta-results ${needsPaywall ? 'blurred' : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ta-panels",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ta-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "ta-card-title",
                                                        children: "Levels"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 504,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "ta-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Entry"
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 505,
                                                                columnNumber: 35
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                children: fmt(symbol, price)
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 505,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 505,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "ta-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Stop Loss"
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 506,
                                                                columnNumber: 35
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                children: fmt(symbol, slPrice)
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 506,
                                                                columnNumber: 57
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 506,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "ta-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Take Profit"
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 507,
                                                                columnNumber: 35
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                children: fmt(symbol, tpPrice)
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 507,
                                                                columnNumber: 59
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 507,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "ta-tip",
                                                        children: [
                                                            "Style: ",
                                                            styleName,
                                                            " • RR ≈ ",
                                                            rr,
                                                            ":1 • SL ≈ ",
                                                            slPips,
                                                            " pips"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 508,
                                                        columnNumber: 11
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 503,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ta-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "ta-card-title",
                                                        children: [
                                                            "Outcome (Lot ",
                                                            lot.toFixed(2),
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 512,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "ta-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Est. Loss @ SL"
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 513,
                                                                columnNumber: 35
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                children: [
                                                                    "$",
                                                                    estLoss.toFixed(2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 513,
                                                                columnNumber: 62
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 513,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "ta-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Est. Win @ TP"
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 514,
                                                                columnNumber: 35
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                children: [
                                                                    "$",
                                                                    estWin.toFixed(2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 514,
                                                                columnNumber: 61
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 514,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "ta-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Margin (1:",
                                                                    leverage,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 516,
                                                                columnNumber: 13
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                children: [
                                                                    "$",
                                                                    marginReq.toFixed(2),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "ta-sub",
                                                                        children: [
                                                                            "(",
                                                                            marginPctOfBal.toFixed(1),
                                                                            "% of balance)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                        lineNumber: 517,
                                                                        columnNumber: 40
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 517,
                                                                columnNumber: 13
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 515,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "ta-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Risk on Trade"
                                                            }, void 0, false, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 520,
                                                                columnNumber: 13
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                children: [
                                                                    riskPctAuto.toFixed(2),
                                                                    "% ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "ta-sub",
                                                                        children: [
                                                                            "($",
                                                                            estLoss.toFixed(2),
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                        lineNumber: 521,
                                                                        columnNumber: 42
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                                lineNumber: 521,
                                                                columnNumber: 13
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 519,
                                                        columnNumber: 11
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 511,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 502,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ta-chart-wrap",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ta-chart-controls",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: `ta-chip ${scenario === 'tp' ? 'active' : ''}`,
                                                        onClick: ()=>setScenario('tp'),
                                                        children: "Scenario 1 (TP)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 528,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: `ta-chip ${scenario === 'sl' ? 'active' : ''}`,
                                                        onClick: ()=>setScenario('sl'),
                                                        children: "Scenario 2 (SL)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                        lineNumber: 535,
                                                        columnNumber: 11
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 527,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ta-chart-title",
                                                children: "Scenario paths (time 0 → 1)"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 543,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScenarioChart, {
                                                symbol: symbol,
                                                entry: price,
                                                sl: slPrice,
                                                tp: tpPrice,
                                                direction: dir,
                                                scenario: scenario
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                lineNumber: 544,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 526,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Suggestions, {
                                        balance: balance,
                                        lot: lot,
                                        rr: rr,
                                        marginPct: marginPctOfBal,
                                        style: style,
                                        estWin: estWin,
                                        riskPct: riskPctAuto
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                        lineNumber: 554,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                lineNumber: 501,
                                columnNumber: 5
                            }, this),
                            needsPaywall && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ta-overlay",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "ta-overlay-box",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "ta-overlay-title",
                                            children: "Unlock AI Assistant"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                            lineNumber: 568,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "ta-overlay-text",
                                            children: "You’ve reached the free limit. Get unlimited scenarios & full access."
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                            lineNumber: 569,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ta-overlay-actions",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "ta-btn",
                                                    onClick: ()=>window.location.href = '/checkout',
                                                    children: "Subscribe – $6 / month"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                    lineNumber: 573,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "ta-link-btn",
                                                    onClick: ()=>setLicenseOpen(true),
                                                    children: "I have a license"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                    lineNumber: 579,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "ta-link-btn",
                                                    onClick: ()=>window.location.href = '/checkout?plan=pro',
                                                    children: "Go Pro – $30 / month"
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                                    lineNumber: 585,
                                                    columnNumber: 13
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                            lineNumber: 572,
                                            columnNumber: 11
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                    lineNumber: 567,
                                    columnNumber: 9
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                                lineNumber: 566,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                        lineNumber: 500,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$LicenseModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        open: licenseOpen,
                        value: licenseKey,
                        onChange: setLicenseKey,
                        onClose: ()=>setLicenseOpen(false),
                        onSave: handleActivateLicense
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                        lineNumber: 599,
                        columnNumber: 1
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                lineNumber: 373,
                columnNumber: 2
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
        lineNumber: 366,
        columnNumber: 5
    }, this);
}
_s(TraderAssistantLite, "mfBu7AyQGPDYDwf0S0tJl13HzO0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = TraderAssistantLite;
/* =========================
   Suggestions
========================= */ function Suggestions({ balance, lot, rr, marginPct, style, estWin, riskPct }) {
    const tips = [];
    if (riskPct > 2.0) {
        const target = 1.0;
        const scale = target / Math.max(0.01, riskPct);
        const suggestedLotAt1 = Math.max(0.01, lot * scale);
        tips.push(`⚠️ Risk is ${riskPct.toFixed(2)}% of balance. Reduce lot to ~${suggestedLotAt1.toFixed(2)} to keep risk near 1%.`);
    } else if (riskPct < 0.3 && estWin > 0) {
        const target = 1.0;
        const scale = target / Math.max(0.01, riskPct);
        const suggestedLotNear1 = Math.max(0.01, lot * Math.min(scale, 2));
        tips.push(`ℹ️ Risk is only ${riskPct.toFixed(2)}%. You can increase lot up to ~${suggestedLotNear1.toFixed(2)} if comfortable with ~1% risk.`);
    } else {
        tips.push(`✅ Risk ~${riskPct.toFixed(2)}% is reasonable for consistent growth.`);
    }
    if (marginPct > 30) {
        tips.push(`⚠️ Margin use is ${marginPct.toFixed(1)}%. Consider smaller lot (e.g. ${(lot * 0.6).toFixed(2)}) or higher leverage to avoid margin stress.`);
    } else if (marginPct < 5) {
        tips.push(`ℹ️ Margin use is ${marginPct.toFixed(1)}%. Sizing is conservative; OK to scale slightly if needed.`);
    }
    if (rr < 2) tips.push(`⚠️ R:R = ${rr}:1. Aim ≥ 2:1 → tighten SL or widen TP (keep SL within structure).`);
    else tips.push(`✅ R:R = ${rr}:1 supports positive expectancy if win rate is maintained.`);
    if (style === 'scalper') tips.push(`Scalper: trade liquid sessions (London/NY overlap), keep SL tight, avoid high spreads/slippage.`);
    else if (style === 'aggressive') tips.push(`Aggressive: expect larger swings. Pre-define max daily loss and stop after reaching it.`);
    else if (style === 'swing') tips.push(`Swing: hold longer. Check upcoming news; widen buffers around major levels.`);
    else tips.push(`Balanced: steady approach. Focus on consistency and clear invalidation levels.`);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "ta-suggestions",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ta-card-title",
                children: "AI Suggestions"
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                lineNumber: 658,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ta-suggestion-list",
                children: tips.map((t, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ta-suggestion-item",
                        children: t
                    }, i, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                        lineNumber: 661,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
                lineNumber: 659,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
        lineNumber: 657,
        columnNumber: 5
    }, this);
}
_c1 = Suggestions;
/* =========================
   ScenarioChart (Canvas)
========================= */ function ScenarioChart({ symbol, entry, sl, tp, direction, scenario }) {
    _s1();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScenarioChart.useEffect": ()=>{
            const cvs = ref.current;
            if (!cvs) return;
            const ctx = cvs.getContext('2d');
            if (!ctx) return;
            const W = cvs.width, H = cvs.height;
            const padL = 16, padR = 70, padB = 36, padT = 12;
            const spec = CONTRACT[symbol];
            const pip = spec.pip;
            const digits = Math.max(0, Math.round(-Math.log10(pip)));
            const fmtPrice = {
                "ScenarioChart.useEffect.fmtPrice": (v)=>v.toFixed(digits)
            }["ScenarioChart.useEffect.fmtPrice"];
            const M5 = 5 * 60 * 1000;
            const PRE = 8, POST = 24, N = PRE + POST;
            const towardTP = direction === 'buy';
            const target = scenario === 'tp' ? towardTP ? tp : sl : towardTP ? sl : tp;
            const trendUp = target > entry;
            const trendGreenProb = 0.7;
            const coreRange = Math.max(Math.abs(tp - sl), Math.abs(target - entry)) || pip * 100;
            const avgBody = coreRange / POST * 1.1;
            const avgWick = avgBody * 0.9;
            const candles = [];
            let lastClose = entry;
            for(let i = 0; i < PRE; i++){
                const noiseDir = Math.random() < 0.5 ? -1 : 1;
                const body = avgBody * (0.4 + Math.random() * 0.8) * noiseDir;
                const wickUp = avgWick * (0.5 + Math.random() * 1.2);
                const wickDn = avgWick * (0.5 + Math.random() * 1.2);
                const o = lastClose;
                const c = o + body * 0.5;
                const hi = Math.max(o, c) + wickUp;
                const lo = Math.min(o, c) - wickDn;
                candles.push({
                    o,
                    h: hi,
                    l: lo,
                    c,
                    i
                });
                lastClose = c;
            }
            for(let j = 0; j < POST; j++){
                const i = PRE + j;
                const t = j / Math.max(1, POST - 1);
                const toward = target - lastClose;
                const pull = toward * (0.08 + 0.55 * Math.pow(t, 1.35));
                const bodyUp = Math.random() < (trendUp ? trendGreenProb : 1 - trendGreenProb);
                const bodyDir = bodyUp ? 1 : -1;
                const bodySize = avgBody * (0.6 + Math.random() * 1.4) * bodyDir;
                const wickUp = avgWick * (0.5 + Math.random() * 1.4);
                const wickDn = avgWick * (0.5 + Math.random() * 1.4);
                const o = lastClose;
                let c = o + pull + bodySize;
                if (j === POST - 1) c = target;
                const hi = Math.max(o, c) + wickUp;
                const lo = Math.min(o, c) - wickDn;
                candles.push({
                    o,
                    h: hi,
                    l: lo,
                    c,
                    i
                });
                lastClose = c;
            }
            const all = [
                entry,
                sl,
                tp,
                ...candles.flatMap({
                    "ScenarioChart.useEffect": (k)=>[
                            k.h,
                            k.l
                        ]
                }["ScenarioChart.useEffect"])
            ];
            const minRaw = Math.min(...all);
            const maxRaw = Math.max(...all);
            const padY = (maxRaw - minRaw) * 0.14 || pip * 40;
            const minP = minRaw - padY;
            const maxP = maxRaw + padY;
            const range = maxP - minP;
            const y = {
                "ScenarioChart.useEffect.y": (p)=>padT + (1 - (p - minP) / range) * (H - padT - padB)
            }["ScenarioChart.useEffect.y"];
            const x = {
                "ScenarioChart.useEffect.x": (idx)=>padL + idx / (N - 1) * (W - padL - padR)
            }["ScenarioChart.useEffect.x"];
            function axes() {
                ctx.strokeStyle = '#3a3a3a';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(padL, H - padB);
                ctx.lineTo(W - padR, H - padB);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(W - padR, padT);
                ctx.lineTo(W - padR, H - padB);
                ctx.stroke();
                ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto';
                ctx.fillStyle = '#bbb';
                const ticks = 7;
                for(let i = 0; i < ticks; i++){
                    const tt = i / (ticks - 1);
                    const p = minP + tt * range;
                    const yy = y(p);
                    ctx.strokeStyle = '#2f2f2f';
                    ctx.beginPath();
                    ctx.moveTo(padL, yy);
                    ctx.lineTo(W - padR, yy);
                    ctx.stroke();
                    ctx.fillText(fmtPrice(p), W - padR + 6, yy + 4);
                }
                const now = new Date();
                const startTime = new Date(now.getTime() - PRE * M5);
                const midTime = new Date(startTime.getTime() + Math.floor((N - 1) / 2) * M5);
                const endTime = new Date(startTime.getTime() + (N - 1) * M5);
                const fmtTime = {
                    "ScenarioChart.useEffect.axes.fmtTime": (d)=>d.toLocaleString(undefined, {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })
                }["ScenarioChart.useEffect.axes.fmtTime"];
                ctx.fillStyle = '#aaa';
                ctx.textAlign = 'left';
                ctx.fillText(fmtTime(startTime), padL, H - padB + 16);
                ctx.textAlign = 'center';
                ctx.fillText(fmtTime(midTime), (padL + (W - padR)) / 2, H - padB + 16);
                ctx.textAlign = 'right';
                ctx.fillText(fmtTime(endTime), W - padR, H - padB + 16);
                ctx.textAlign = 'left';
                const drawH = {
                    "ScenarioChart.useEffect.axes.drawH": (p, label, col, dashed = true)=>{
                        if (dashed) ctx.setLineDash([
                            6,
                            6
                        ]);
                        ctx.strokeStyle = col;
                        ctx.beginPath();
                        ctx.moveTo(padL, y(p));
                        ctx.lineTo(W - padR, y(p));
                        ctx.stroke();
                        ctx.setLineDash([]);
                        ctx.fillStyle = col;
                        ctx.fillText(`${label} ${fmtPrice(p)}`, padL + 6, y(p) - 16);
                    }
                }["ScenarioChart.useEffect.axes.drawH"];
                drawH(tp, 'TP', '#22c55e', true);
                drawH(sl, 'SL', '#ef4444', true);
                drawH(entry, 'Entry', '#e5e7eb', false);
            }
            function drawCandle(k, cx, w) {
                const up = k.c >= k.o;
                const bodyColor = up ? '#22c55e' : '#ef4444';
                const wickColor = up ? '#86efac' : '#fca5a5';
                ctx.strokeStyle = wickColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(cx, y(k.h));
                ctx.lineTo(cx, y(k.l));
                ctx.stroke();
                const top = Math.min(y(k.o), y(k.c));
                const bot = Math.max(y(k.o), y(k.c));
                const bw = Math.max(3, Math.min(12, w * 0.6));
                const bh = Math.max(1, bot - top);
                ctx.fillStyle = bodyColor;
                ctx.fillRect(cx - bw / 2, top, bw, bh);
            }
            let prog = 0;
            let raf = 0;
            function loop() {
                ctx.clearRect(0, 0, W, H);
                axes();
                const colW = (W - padL - padR) / (N - 1);
                const maxIndex = Math.min(N - 1, Math.floor(prog));
                for(let i = 0; i <= maxIndex; i++){
                    drawCandle(candles[i], x(i), colW);
                }
                prog += 0.22;
                if (prog > N - 1 + 0.999) prog = N - 1 + 0.999;
                raf = requestAnimationFrame(loop);
            }
            prog = 0;
            loop();
            return ({
                "ScenarioChart.useEffect": ()=>cancelAnimationFrame(raf)
            })["ScenarioChart.useEffect"];
        }
    }["ScenarioChart.useEffect"], [
        symbol,
        entry,
        sl,
        tp,
        direction,
        scenario
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: ref,
        className: "ta-chart-canvas",
        width: 640,
        height: 320
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx",
        lineNumber: 856,
        columnNumber: 10
    }, this);
}
_s1(ScenarioChart, "8uVE59eA/r6b92xF80p7sH8rXLk=");
_c2 = ScenarioChart;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "TraderAssistantLite");
__turbopack_context__.k.register(_c1, "Suggestions");
__turbopack_context__.k.register(_c2, "ScenarioChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LearningHub
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const TABS = {
    basics: {
        title: 'Trading Basics 👣',
        bullets: [
            'What are pips, lots & leverage?',
            'Bid/Ask & spread explained in 60s',
            'Margin vs. free margin'
        ],
        ctaText: 'Start with the Forex Calculator →',
        ctaHref: 'https://www.mzprimer.com/tools/ai-assistant',
        ctaName: 'Start with the Forex Calculator',
        adsSendTo: 'AW-16927724463/n3hlCNmcy6oaEK-n4oc_'
    },
    strategies: {
        title: 'Simple Strategies ⚙️',
        bullets: [
            'Breakout vs. Pullback — when to use',
            'Support/Resistance the right way',
            'How to map confluence fast'
        ],
        ctaText: 'See Analysts’ Insights →',
        ctaHref: 'https://www.mzprimer.com/tools/ai-assistant',
        ctaName: 'See Analysts Insights',
        adsSendTo: 'AW-16927724463/n3hlCNmcy6oaEK-n4oc_'
    },
    risk: {
        title: 'Risk & Money Management 🛡️',
        bullets: [
            '2% rule, position sizing in 1 min',
            'Set SL/TP with structure, not hope',
            'Win-rate vs. R:R — what actually matters'
        ],
        ctaText: 'Position Size Helper →',
        ctaHref: 'https://www.mzprimer.com/tools/ai-assistant',
        ctaName: 'Position Size Helper',
        adsSendTo: 'AW-16927724463/n3hlCNmcy6oaEK-n4oc_'
    }
};
function LearningHub() {
    _s();
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('basics');
    const tab = TABS[active];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "learning",
        className: "learn-hub",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "learn-wrap",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "learn-head",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "learn-title",
                            children: "Learn Faster, Trade Smarter"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "learn-sub",
                            children: "Three mini tracks. Zero fluff. Pick one to begin."
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "learn-tabs",
                    role: "tablist",
                    "aria-label": "Learning tracks",
                    children: [
                        'basics',
                        'strategies',
                        'risk'
                    ].map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            role: "tab",
                            "aria-selected": active === k,
                            className: `learn-tab ${active === k ? 'is-active' : ''}`,
                            onClick: ()=>setActive(k),
                            children: TABS[k].title
                        }, k, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                            lineNumber: 64,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "learn-card",
                    role: "tabpanel",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "learn-points",
                            children: tab.bullets.map((b, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "learn-point",
                                    children: [
                                        "• ",
                                        b
                                    ]
                                }, i, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                                    lineNumber: 80,
                                    columnNumber: 7
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                            lineNumber: 78,
                            columnNumber: 3
                        }, this),
                        tab.ctaHref.startsWith('#') ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "learn-cta",
                            onClick: ()=>{
                                document.getElementById(tab.ctaHref.slice(1))?.scrollIntoView({
                                    behavior: 'smooth'
                                });
                            },
                            // tracking hooks
                            "data-cta": "true",
                            "data-cta-name": tab.ctaName || tab.ctaText,
                            "data-ads-send-to": "AW-16927724463/n3hlCNmcy6oaEK-n4oc_",
                            "data-value": "1.0",
                            "data-currency": "MAD",
                            children: tab.ctaText
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                            lineNumber: 85,
                            columnNumber: 5
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: tab.ctaHref,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "learn-cta",
                            // tracking hooks
                            "data-cta": "true",
                            "data-cta-name": tab.ctaName || tab.ctaText,
                            "data-ads-send-to": "AW-16927724463/n3hlCNmcy6oaEK-n4oc_",
                            "data-value": "1.0",
                            "data-currency": "MAD",
                            children: tab.ctaText
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                            lineNumber: 101,
                            columnNumber: 5
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "learn-notes",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mini",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mini-k",
                                            children: "Tip"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                                            lineNumber: 120,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mini-v",
                                            children: "Use demo first; move to real after 20 consistent trades."
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                                            lineNumber: 121,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mini",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mini-k",
                                            children: "Reminder"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                                            lineNumber: 124,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mini-v",
                                            children: "One setup, one timeframe, one risk model — keep it boring."
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                                            lineNumber: 125,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                            lineNumber: 118,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                    lineNumber: 77,
                    columnNumber: 1
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "learn-shortcuts",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "#aitrading",
                            className: "chip",
                            children: "AI Trading"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                            lineNumber: 132,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "#accounts",
                            className: "chip",
                            children: "Open Account"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                            lineNumber: 133,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/ai-robot",
                            className: "chip",
                            children: "Buy Trading Robot"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
                    lineNumber: 131,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_s(LearningHub, "Jk6L//T4fLTpMlfAujXeCg9K4zY=");
_c = LearningHub;
var _c;
__turbopack_context__.k.register(_c, "LearningHub");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AiToolsSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
'use client';
;
;
function AiToolsSection() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "aitrading",
        className: "bg-black text-white py-20 px-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-3xl md:text-5xl font-bold mb-6",
                    children: "AI-Powered Trading Tools"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                    lineNumber: 9,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-300 text-lg md:text-xl mb-12",
                    children: "Optimize your decisions using predictive models, automation, and machine learning–enhanced strategies."
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "ai-why-card scroll-fade-up",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-2xl md:text-3xl font-bold mb-4 text-white",
                            children: "Why Trade with AI?"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                            lineNumber: 19,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400 text-base md:text-lg leading-relaxed mb-4",
                            children: "AI-based systems can monitor markets 24/7, eliminate emotional bias, and adapt to fast-changing conditions in real time. With access to large datasets, machine learning models can detect subtle trends and hidden patterns that manual traders often miss."
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400 text-base md:text-lg leading-relaxed",
                            children: "Whether you’re new to trading or managing multiple strategies, AI tools can support your process, reduce decision fatigue, and improve timing with automated execution and optimization."
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid md:grid-cols-3 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ai-tool-card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "tool-title",
                                    children: "Signal Bot"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                                    lineNumber: 33,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "tool-description",
                                    children: "Get instant alerts based on AI-detected price action patterns and volatility shifts. Perfect for traders who need timely market updates."
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/ai-robot",
                                    className: "ai-cta-button",
                                    "data-cta": "true",
                                    "data-cta-name": "Explore Signal Bot",
                                    "data-ads-send-to": "AW-16927724463/n3hlCNmcy6oaEK-n4oc_",
                                    "data-value": "1.0",
                                    "data-currency": "MAD",
                                    children: "Explore Signal Bot →"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ai-tool-card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "tool-title",
                                    children: "Backtesting Engine"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "tool-description",
                                    children: "Simulate and validate your strategy across historical data. Adjust parameters and discover performance trends before risking real capital."
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/ai-robot",
                                    className: "ai-cta-button",
                                    "data-cta": "true",
                                    "data-cta-name": "Try Backtesting Tool",
                                    "data-ads-send-to": "AW-16927724463/n3hlCNmcy6oaEK-n4oc_",
                                    "data-value": "1.0",
                                    "data-currency": "MAD",
                                    children: "Try Backtesting Tool →"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ai-tool-card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "tool-title",
                                    children: "AI Advisor"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "tool-description",
                                    children: "Let AI analyze market conditions and recommend trading ideas that align with your style — from swing trades to scalping."
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/ai-robot",
                                    className: "ai-cta-button",
                                    "data-cta": "true",
                                    "data-cta-name": "Meet Your AI Advisor",
                                    "data-ads-send-to": "AW-16927724463/n3hlCNmcy6oaEK-n4oc_",
                                    "data-value": "1.0",
                                    "data-currency": "MAD",
                                    children: "Meet Your AI Advisor →"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-300 text-sm italic",
                            children: "⚡ Automate. Adapt. Advance — all with AI."
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
            lineNumber: 8,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = AiToolsSection;
var _c;
__turbopack_context__.k.register(_c, "AiToolsSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AIRobotCards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$StickyLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/StickyLogo.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function AIRobotCards() {
    _s();
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const robots = [
        {
            id: 'ai-assistant-monthly',
            name: 'AI Assistant — Monthly',
            short: 'Unlimited Assistant scenarios & updates.',
            description: 'Get full access to the AI Assistant with all features, regular updates, and priority improvements every month.',
            price: '$6/mo',
            available: true,
            href: '/checkout?product=ai-assistant-monthly',
            badge: 'Subscription',
            features: [
                'Unlimited scenarios',
                'Priority improvements',
                'Works across web app'
            ]
        },
        {
            id: 'scalper',
            name: 'Scalper X1',
            short: 'Ultra-fast scalping built for tight spreads.',
            description: 'Scalper X1 is designed to capture quick, frequent moves on liquid pairs. It uses volatility filters, spread checks, and time-of-day rules to avoid dead sessions. Works best on low-spread brokers (ECN), M5–M15 charts. Use sensible risk per trade and avoid news spikes.',
            price: '$15',
            available: true,
            href: '/checkout?bot=scalper',
            features: [
                'MT5 Ready',
                '0.01–1.0 Lot Supported',
                'Auto TP/SL',
                'Backtested'
            ],
            stats: {
                riskReward: '1:1.2 – 1:1.8',
                winRate: '55–62%',
                avgMonthlyReturn: '3–8% (typical with sensible risk)',
                timeframe: 'M5 / M15',
                accountMin: '$100'
            }
        },
        {
            id: 'fibonacci',
            name: 'Fibonacci Pro',
            short: 'Retracement & extension confluence entries.',
            description: 'Fibonacci Pro looks for swing structure and confluence zones, with confirmation logic to reduce false starts. Suits swing–intra trades with moderate risk and clear targets.',
            price: '$149',
            available: false,
            href: '/checkout?bot=fibonacci',
            features: [
                'Fibonacci-Based Logic',
                'Auto Risk Management',
                'Breakout Detection',
                'Multi-Pair Compatible'
            ],
            stats: {
                riskReward: '1:1.5 – 1:2.5',
                winRate: '48–58%',
                avgMonthlyReturn: '2–6%',
                timeframe: 'M15 / H1',
                accountMin: '$150'
            }
        },
        {
            id: 'hedge',
            name: 'Hedge Matrix',
            short: 'Paired entries to smooth equity in chop.',
            description: 'Hedge Matrix uses balanced Buy/Sell logic across correlated behavior to reduce pure directional exposure and smooth equity during choppy sessions.',
            price: '$119',
            available: false,
            href: '/checkout?bot=hedge-matrix',
            features: [
                'Hedge Detection',
                'Low Risk',
                'Drawdown Control',
                'Multiple Asset Use'
            ],
            stats: {
                riskReward: 'Variable',
                winRate: '60–70%',
                avgMonthlyReturn: '2–5%',
                timeframe: 'M15 / H1',
                accountMin: '$200'
            }
        },
        {
            id: 'trendbot',
            name: 'Trend Seeker AI',
            short: 'Adaptive trend-following with filters.',
            description: 'Trend Seeker AI rides medium-term trends with trailing logic and volatility gates to avoid whipsaws. Works best on trending pairs and higher timeframes.',
            price: '$139',
            available: false,
            href: '/checkout?bot=trend-seeker-ai',
            features: [
                'Trend Logic',
                'Dynamic Trailing Stop',
                'AI Signal Filters',
                'Risk/Reward Balanced'
            ],
            stats: {
                riskReward: '1:2 – 1:3',
                winRate: '40–52%',
                avgMonthlyReturn: '3–7%',
                timeframe: 'M30 / H1',
                accountMin: '$150'
            }
        },
        {
            id: 'ai-assistant-pro',
            name: 'AI Assistant — Pro Monthly',
            short: 'Pro tier for power users.',
            description: 'Everything in Monthly plus higher limits and extras designed for power users.',
            price: '$30/mo',
            available: false,
            href: '/checkout?product=ai-assistant-pro',
            badge: 'Subscription',
            features: [
                'Higher limits',
                'Priority support',
                'All Monthly features'
            ]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "ai-robots",
        className: "ai-robot-section",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "section-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$StickyLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "section-title",
                        children: "🤖 AI Robots Marketplace"
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "section-description",
                        children: "Choose your trading assistant and receive it instantly via email after payment."
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "robot-card-grid",
                children: robots.map((bot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "robot-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "robot-name",
                                children: bot.name
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this),
                            bot.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 inline-flex items-center rounded-full border border-emerald-800 bg-emerald-900/40 px-2 py-0.5 text-xs text-emerald-200",
                                children: bot.badge
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                lineNumber: 147,
                                columnNumber: 3
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "robot-short",
                                children: bot.short
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "robot-features",
                                children: bot.features.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "✅ ",
                                            f
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                        lineNumber: 154,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "robot-card-footer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "robot-price",
                                        children: bot.price
                                    }, void 0, false, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                        lineNumber: 158,
                                        columnNumber: 3
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "robot-actions",
                                        children: [
                                            bot.available ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: bot.href,
                                                className: "robot-buy-button",
                                                "data-cta": "true",
                                                "data-cta-name": `Buy Now – ${bot.name}`,
                                                "data-ads-send-to": "AW-16927724463/n3hlCNmcy6oaEK-n4oc_",
                                                "data-value": bot.price?.replace(/[^0-9.]/g, '') || '0',
                                                "data-currency": "USD",
                                                children: "Buy Now"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                                lineNumber: 161,
                                                columnNumber: 3
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "robot-buy-button coming-soon",
                                                disabled: true,
                                                children: "Coming Soon"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                                lineNumber: 173,
                                                columnNumber: 3
                                            }, this),
                                            bot.id.startsWith('ai-assistant') ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "/tools/ai-assistant",
                                                className: "robot-readmore-button",
                                                "data-cta": "true",
                                                "data-cta-name": `Read More – ${bot.name}`,
                                                children: "Read More"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                                lineNumber: 179,
                                                columnNumber: 3
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "robot-readmore-button",
                                                "data-cta": "true",
                                                "data-cta-name": `Read More – ${bot.name}`,
                                                onClick: ()=>setSelected(bot),
                                                "aria-haspopup": "dialog",
                                                "aria-controls": "robot-modal",
                                                children: "Read More"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                                lineNumber: 188,
                                                columnNumber: 3
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                        lineNumber: 159,
                                        columnNumber: 3
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this)
                        ]
                    }, bot.id, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                        lineNumber: 144,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "robot-modal",
                className: "modal-backdrop",
                role: "dialog",
                "aria-modal": "true",
                "aria-labelledby": "modal-title",
                onClick: (e)=>{
                    if (e.target === e.currentTarget) setSelected(null);
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    id: "modal-title",
                                    className: "modal-title",
                                    children: selected.name
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                    lineNumber: 220,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "modal-close",
                                    "aria-label": "Close",
                                    onClick: ()=>setSelected(null),
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                    lineNumber: 223,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                            lineNumber: 219,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-body",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "modal-desc",
                                    children: selected.description
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                    lineNumber: 233,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-stats",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                            label: "Risk/Reward",
                                            value: selected.stats?.riskReward
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                            lineNumber: 237,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                            label: "Win Rate",
                                            value: selected.stats?.winRate
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                            lineNumber: 238,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                            label: "Avg Monthly Return",
                                            value: selected.stats?.avgMonthlyReturn
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                            lineNumber: 239,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                            label: "Timeframe",
                                            value: selected.stats?.timeframe
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                            lineNumber: 240,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                            label: "Min Account",
                                            value: selected.stats?.accountMin
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                            lineNumber: 241,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                    lineNumber: 236,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-note",
                                    children: "Past performance does not guarantee future results. Use appropriate risk management."
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                    lineNumber: 244,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                            lineNumber: 232,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-footer",
                            children: [
                                selected.available ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: `/checkout?bot=${selected.id}`,
                                    className: "pc-btn pc-primary",
                                    children: [
                                        "Get ",
                                        selected.name
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                    lineNumber: 251,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "pc-btn",
                                    disabled: true,
                                    children: "Unavailable"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                    lineNumber: 255,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "pc-btn",
                                    onClick: ()=>setSelected(null),
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                                    lineNumber: 257,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                            lineNumber: 249,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                    lineNumber: 218,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                lineNumber: 208,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
_s(AIRobotCards, "PVKrpNrydW4BpnDEq9OT3cVmCk4=");
_c = AIRobotCards;
function Stat({ label, value }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "stat-item",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "stat-label",
                children: label
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "stat-value",
                children: value || '-'
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx",
        lineNumber: 270,
        columnNumber: 5
    }, this);
}
_c1 = Stat;
var _c, _c1;
__turbopack_context__.k.register(_c, "AIRobotCards");
__turbopack_context__.k.register(_c1, "Stat");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContactSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function ContactSection() {
    _s();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [hp, setHp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(''); // honeypot (should stay empty)
    const [sending, setSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    async function onSubmit(e) {
        e.preventDefault();
        setSending(true);
        setResult(null);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    hp
                })
            });
            const data = await res.json();
            if (data.ok) {
                setResult({
                    ok: true
                });
                setName('');
                setEmail('');
                setMessage('');
            } else {
                setResult({
                    ok: false,
                    error: data.error || 'Failed to send'
                });
            }
        } catch (err) {
            setResult({
                ok: false,
                error: 'Network error'
            });
        } finally{
            setSending(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "contacts",
        className: "bg-black text-white py-24 px-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-4xl md:text-5xl font-bold mb-6",
                    children: "Get in Touch"
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-400 text-lg md:text-xl mb-10",
                    children: "For support, collaboration, or inquiries, contact us and our team will respond shortly."
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: onSubmit,
                    className: "contact-form space-y-6 text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: hp,
                            onChange: (e)=>setHp(e.target.value),
                            style: {
                                display: 'none'
                            },
                            tabIndex: -1,
                            autoComplete: "off"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "name",
                                    className: "block mb-2 text-sm font-medium",
                                    children: "Your Name"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    id: "name",
                                    placeholder: "John Doe",
                                    className: "w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-md p-3 placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition",
                                    required: true,
                                    value: name,
                                    onChange: (e)=>setName(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "email",
                                    className: "block mb-2 text-sm font-medium",
                                    children: "Your Email"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                                    lineNumber: 69,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    id: "email",
                                    placeholder: "you@example.com",
                                    className: "w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-md p-3 placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition",
                                    required: true,
                                    value: email,
                                    onChange: (e)=>setEmail(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "message",
                                    className: "block mb-2 text-sm font-medium",
                                    children: "Your Message"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    id: "message",
                                    rows: 5,
                                    placeholder: "Write your message here...",
                                    className: "w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-md p-3 placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition",
                                    required: true,
                                    value: message,
                                    onChange: (e)=>setMessage(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center pt-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: sending,
                                className: "btn-primary text-sm md:text-base disabled:opacity-60",
                                children: sending ? 'Sending…' : 'Send Message'
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this),
                        result && result.ok && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-green-400 text-center mt-2",
                            children: "Message sent successfully!"
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                            lineNumber: 105,
                            columnNumber: 13
                        }, this),
                        result && !result.ok && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-red-400 text-center mt-2",
                            children: result.error
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                            lineNumber: 108,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_s(ContactSection, "9nuzkvVivPDUhdWCiyyUO0CueF8=");
_c = ContactSection;
var _c;
__turbopack_context__.k.register(_c, "ContactSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /app/hooks/useNews.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useNews",
    ()=>useNews
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useNews() {
    _s();
    const [news, setNews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useNews.useEffect": ()=>{
            const fetchNews = {
                "useNews.useEffect.fetchNews": async ()=>{
                    try {
                        // Fetch from our local proxy API
                        const res = await fetch('/api/news');
                        if (res.ok) {
                            const data = await res.json();
                            // Safety check: ensure it's an array
                            if (Array.isArray(data)) {
                                setNews(data);
                            }
                        }
                    } catch (e) {
                        console.error("News hook error", e);
                    } finally{
                        setLoading(false);
                    }
                }
            }["useNews.useEffect.fetchNews"];
            fetchNews();
        }
    }["useNews.useEffect"], []);
    return {
        news,
        loading
    };
}
_s(useNews, "F6yDZrO2rMZs5jzX1Q2MMfiqj9g=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MarketPollModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart2$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/chart-no-axes-column.js [app-client] (ecmascript) <export default as BarChart2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2d$circuit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BrainCircuit$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/brain-circuit.js [app-client] (ecmascript) <export default as BrainCircuit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function MarketPollModal({ data, onClose }) {
    _s();
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        low: 0,
        medium: 0,
        high: 0,
        total: 0,
        question: data.question,
        symbol: data.symbol,
        category: data.category
    });
    const [hasVoted, setHasVoted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [polling, setPolling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 1. Fetch and Subscribe to Live Votes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MarketPollModal.useEffect": ()=>{
            // Initial fetch
            fetchPollStats();
            // Set up polling for real-time updates
            const interval = setInterval(fetchPollStats, 5000);
            setPolling(interval);
            // Check if user has already voted
            if (localStorage.getItem(`voted_${data.id}`)) {
                setHasVoted(true);
            }
            return ({
                "MarketPollModal.useEffect": ()=>{
                    if (polling) {
                        clearInterval(polling);
                    }
                }
            })["MarketPollModal.useEffect"];
        }
    }["MarketPollModal.useEffect"], [
        data.id
    ]);
    const fetchPollStats = async ()=>{
        try {
            const response = await fetch(`/api/polls/${data.id}`);
            if (response.ok) {
                const pollData = await response.json();
                if (pollData.success) {
                    setStats({
                        low: pollData.poll.votes?.low || 0,
                        medium: pollData.poll.votes?.medium || 0,
                        high: pollData.poll.votes?.high || 0,
                        total: pollData.poll.total_votes || 0,
                        question: pollData.poll.question || data.question,
                        symbol: pollData.poll.symbol || data.symbol,
                        category: pollData.poll.category || data.category
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching poll stats:', error);
        }
    };
    // 2. Handle Voting
    const handleVote = async (vote)=>{
        if (hasVoted) {
            __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("You've already voted on this poll!");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('cf_token');
            const userData = localStorage.getItem('cf_user');
            if (!token || !userData) {
                __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Please log in to vote");
                return;
            }
            const user = JSON.parse(userData);
            const response = await fetch(`/api/polls/${data.id}/vote`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vote,
                    userId: user.id,
                    userName: user.email?.split('@')[0] || 'Anonymous'
                })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to vote');
            }
            const result = await response.json();
            if (result.success) {
                // Update local stats immediately
                setStats((prev)=>({
                        ...prev,
                        [vote]: prev[vote] + 1,
                        total: prev.total + 1
                    }));
                localStorage.setItem(`voted_${data.id}`, 'true');
                setHasVoted(true);
                __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Vote recorded! Thank you for participating.");
                // Refresh stats to get latest from server
                fetchPollStats();
            }
        } catch (error) {
            console.error('Voting error:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(error.message || "Failed to submit vote. Please try again.");
        } finally{
            setLoading(false);
        }
    };
    // 3. Share Function
    const handleShare = ()=>{
        const text = `📊 MZPrimer Intel: ${data.question}\n\n🤖 AI View: ${data.aiContext}\n\nCheck the stats here: https://mzprimer.com\n\nCurrent Results:\nHigh: ${getPercent(stats.high)}%\nMedium: ${getPercent(stats.medium)}%\nLow: ${getPercent(stats.low)}%`;
        if (navigator.share && navigator.canShare?.()) {
            navigator.share({
                title: 'MZPrimer Market Poll',
                text: text,
                url: `https://mzprimer.com/polls/${data.id}`
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text);
            __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Copied to clipboard!");
        }
    };
    const getPercent = (val)=>stats.total === 0 ? 0 : Math.round(val / stats.total * 100);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "poll-overlay",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "poll-card",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "poll-close",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                        size: 20
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                        lineNumber: 167,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "poll-content",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "poll-meta",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "poll-symbol",
                                    children: data.symbol
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                    lineNumber: 174,
                                    columnNumber: 14
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "poll-category",
                                    children: data.category
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                    lineNumber: 175,
                                    columnNumber: 14
                                }, this),
                                polling && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "poll-live-indicator",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "live-dot"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                            lineNumber: 178,
                                            columnNumber: 18
                                        }, this),
                                        " LIVE"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                    lineNumber: 177,
                                    columnNumber: 16
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                            lineNumber: 173,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "poll-question",
                            children: data.question
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ai-context-box",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "ai-label",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2d$circuit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BrainCircuit$3e$__["BrainCircuit"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                            lineNumber: 191,
                                            columnNumber: 16
                                        }, this),
                                        " AI Fundamental Take"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                    lineNumber: 190,
                                    columnNumber: 14
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "ai-text",
                                    children: data.aiContext
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                    lineNumber: 193,
                                    columnNumber: 14
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                            lineNumber: 189,
                            columnNumber: 11
                        }, this),
                        !hasVoted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "voting-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "vote-label",
                                    children: "What is your impact projection?"
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                    lineNumber: 201,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "vote-grid",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleVote('low'),
                                            disabled: loading,
                                            className: "vote-btn vote-low",
                                            children: loading ? 'Submitting...' : 'Low'
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                            lineNumber: 203,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleVote('medium'),
                                            disabled: loading,
                                            className: "vote-btn vote-mid",
                                            children: loading ? 'Submitting...' : 'Medium'
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                            lineNumber: 210,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleVote('high'),
                                            disabled: loading,
                                            className: "vote-btn vote-high",
                                            children: loading ? 'Submitting...' : 'High'
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                            lineNumber: 217,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                    lineNumber: 202,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "vote-note",
                                    children: "Your vote will be recorded anonymously. One vote per user."
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                    lineNumber: 225,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                            lineNumber: 200,
                            columnNumber: 13
                        }, this) : /* --- VIEW B: RESULTS --- */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "results-container",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "results-header",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Community Sentiment"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                            lineNumber: 233,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart2$3e$__["BarChart2"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 19
                                                }, this),
                                                " ",
                                                stats.total,
                                                " votes"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                            lineNumber: 234,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                    lineNumber: 232,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBar, {
                                    label: "High Impact",
                                    percent: getPercent(stats.high),
                                    barClass: "fill-high",
                                    textClass: "text-high",
                                    votes: stats.high
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                    lineNumber: 239,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBar, {
                                    label: "Medium Impact",
                                    percent: getPercent(stats.medium),
                                    barClass: "fill-mid",
                                    textClass: "text-mid",
                                    votes: stats.medium
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                    lineNumber: 246,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBar, {
                                    label: "Low Impact",
                                    percent: getPercent(stats.low),
                                    barClass: "fill-low",
                                    textClass: "text-low",
                                    votes: stats.low
                                }, void 0, false, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                    lineNumber: 253,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "share-section",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleShare,
                                            className: "share-btn",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                                    lineNumber: 263,
                                                    columnNumber: 19
                                                }, this),
                                                " Share Intel"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                            lineNumber: 262,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                // Allow user to change vote
                                                localStorage.removeItem(`voted_${data.id}`);
                                                setHasVoted(false);
                                            },
                                            className: "change-vote-btn",
                                            children: "Change Vote"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                            lineNumber: 265,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                    lineNumber: 261,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                            lineNumber: 231,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
            lineNumber: 163,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
        lineNumber: 162,
        columnNumber: 5
    }, this);
}
_s(MarketPollModal, "xGgPIPQkSVwSrRyeInJelO+PhLs=");
_c = MarketPollModal;
// Helper Component for Bars
function ResultBar({ label, percent, barClass, textClass, votes }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bar-wrapper",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bar-label-row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: textClass,
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bar-stats",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-zinc-400 mr-2",
                                children: [
                                    votes,
                                    " votes"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                lineNumber: 292,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-zinc-300 font-medium",
                                children: [
                                    percent,
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                                lineNumber: 293,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                lineNumber: 289,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bar-track",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `bar-fill ${barClass}`,
                    style: {
                        width: `${percent}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                    lineNumber: 297,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
                lineNumber: 296,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx",
        lineNumber: 288,
        columnNumber: 5
    }, this);
}
_c1 = ResultBar;
var _c, _c1;
__turbopack_context__.k.register(_c, "MarketPollModal");
__turbopack_context__.k.register(_c1, "ResultBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SlimScrollingTicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useNews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /app/hooks/useNews.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$news$2f$MarketPollModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/news/MarketPollModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function SlimScrollingTicker() {
    _s();
    const { news, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useNews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNews"])();
    const [selectedNews, setSelectedNews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isPaused, setIsPaused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const trackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const animationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const [scrollPosition, setScrollPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [trackWidth, setTrackWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SlimScrollingTicker.useEffect": ()=>{
            if (!loading && news.length > 0 && trackRef.current) {
                const updateDimensions = {
                    "SlimScrollingTicker.useEffect.updateDimensions": ()=>{
                        if (trackRef.current) {
                            setTrackWidth(trackRef.current.scrollWidth / 3);
                        }
                    }
                }["SlimScrollingTicker.useEffect.updateDimensions"];
                updateDimensions();
                window.addEventListener('resize', updateDimensions);
                return ({
                    "SlimScrollingTicker.useEffect": ()=>window.removeEventListener('resize', updateDimensions)
                })["SlimScrollingTicker.useEffect"];
            }
        }
    }["SlimScrollingTicker.useEffect"], [
        loading,
        news
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SlimScrollingTicker.useEffect": ()=>{
            if (loading || news.length === 0 || isPaused || trackWidth === 0) {
                if (animationRef.current !== undefined) {
                    cancelAnimationFrame(animationRef.current);
                }
                return;
            }
            let lastTime = 0;
            const speed = 50;
            const animate = {
                "SlimScrollingTicker.useEffect.animate": (currentTime)=>{
                    if (!lastTime) lastTime = currentTime;
                    const deltaTime = (currentTime - lastTime) / 1000;
                    lastTime = currentTime;
                    setScrollPosition({
                        "SlimScrollingTicker.useEffect.animate": (prev)=>{
                            let newPos = prev - speed * deltaTime;
                            if (Math.abs(newPos) >= trackWidth) newPos = 0;
                            return newPos;
                        }
                    }["SlimScrollingTicker.useEffect.animate"]);
                    animationRef.current = requestAnimationFrame(animate);
                }
            }["SlimScrollingTicker.useEffect.animate"];
            animationRef.current = requestAnimationFrame(animate);
            return ({
                "SlimScrollingTicker.useEffect": ()=>{
                    if (animationRef.current !== undefined) cancelAnimationFrame(animationRef.current);
                }
            })["SlimScrollingTicker.useEffect"];
        }
    }["SlimScrollingTicker.useEffect"], [
        loading,
        news.length,
        isPaused,
        trackWidth
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "slim-ticker-container",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "slim-ticker-track",
                children: [
                    1,
                    2,
                    3
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "news-terminal-slat loading-skeleton",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "slat-timestamp skeleton"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                                lineNumber: 67,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "news-symbol-tag skeleton"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                                lineNumber: 68,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "news-headline-text skeleton"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                                lineNumber: 69,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "news-action-hint skeleton"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                                lineNumber: 70,
                                columnNumber: 15
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                        lineNumber: 66,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                lineNumber: 64,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
            lineNumber: 63,
            columnNumber: 7
        }, this);
    }
    if (!news || news.length === 0) return null;
    const duplicatedNews = [
        ...news,
        ...news,
        ...news
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "slim-ticker-container",
                onMouseEnter: ()=>setIsPaused(true),
                onMouseLeave: ()=>setIsPaused(false),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "slim-ticker-bar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: trackRef,
                                className: "slim-ticker-track",
                                style: {
                                    transform: `translateX(${scrollPosition}px)`
                                },
                                children: duplicatedNews.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedNews(item),
                                        className: "news-terminal-slat",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "slat-timestamp",
                                                children: [
                                                    "[",
                                                    new Date().toLocaleTimeString([], {
                                                        hour12: false,
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }),
                                                    "]"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                                                lineNumber: 101,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "news-symbol-tag",
                                                children: item.symbol
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                                                lineNumber: 104,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "news-headline-text",
                                                children: item.headline
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                                                lineNumber: 105,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "news-action-hint",
                                                children: "READ_INTEL"
                                            }, void 0, false, {
                                                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                                                lineNumber: 106,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, `${item.id}-${idx}`, true, {
                                        fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                                        lineNumber: 96,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "slim-fade-left"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "slim-fade-right"
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsPaused(!isPaused),
                        className: "slim-pause-btn",
                        children: isPaused ? '▶' : '⏸'
                    }, void 0, false, {
                        fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            selectedNews && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$news$2f$MarketPollModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                data: selectedNews,
                onClose: ()=>setSelectedNews(null)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx",
                lineNumber: 123,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(SlimScrollingTicker, "hpkWLM/vnbqUGhRR/vjIl8BfhDg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$app$2f$hooks$2f$useNews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNews"]
    ];
});
_c = SlimScrollingTicker;
var _c;
__turbopack_context__.k.register(_c, "SlimScrollingTicker");
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
"[project]/mzprimer-nextjs-v1 /app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$StickyLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/StickyLogo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/Navbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$NotificationButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/NotificationButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/Hero.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$MobileMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/MobileMenu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$LiveMarketFeed$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/LiveMarketFeed.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$WelcomeTradePopup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/WelcomeTradePopup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$AiChatSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/AiChatSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$TraderAssistantLite$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/TraderAssistantLite.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$LearningHub$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/LearningHub.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$AiToolsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/AiToolsSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$AIRobotCards$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/AIRobotCards.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$ContactSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/ContactSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$news$2f$FundamentalTicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/news/FundamentalTicker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$PropFirmChatSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/PropFirmChatSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$AiChatBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/AiChatBox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$PropFirmChat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mzprimer-nextjs-v1 /components/PropFirmChat.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// app/page.tsx
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
;
;
;
;
;
;
;
;
;
;
;
function Home() {
    _s();
    const [activeTool, setActiveTool] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [startSymbol, setStartSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const openTool = (tool, symbol = null)=>{
        setStartSymbol(symbol);
        setActiveTool(tool);
        document.body.style.overflow = 'hidden';
    };
    const closeTool = ()=>{
        setActiveTool(null);
        setStartSymbol(null);
        document.body.style.overflow = 'auto';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$StickyLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$news$2f$FundamentalTicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$NotificationButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$LiveMarketFeed$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$WelcomeTradePopup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$MobileMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$AiChatSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onLaunch: (sym)=>openTool('ai', sym)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$PropFirmChatSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onLaunch: (sym)=>openTool('prop', sym)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "py-10 text-center opacity-50",
                    children: "Loading Assistant..."
                }, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                    lineNumber: 59,
                    columnNumber: 27
                }, void 0),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$TraderAssistantLite$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$LearningHub$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$AiToolsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$AIRobotCards$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$ContactSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            activeTool && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                                            lineNumber: 73,
                                            columnNumber: 17
                                        }, this),
                                        activeTool === 'ai' ? 'Intelligence Terminal' : 'Prop Firm Security Protocol'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                                    lineNumber: 72,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: closeTool,
                                    className: "immersive-close-btn",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 24
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                                            lineNumber: 77,
                                            columnNumber: 17
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "CLOSE"
                                        }, void 0, false, {
                                            fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                                            lineNumber: 77,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                                    lineNumber: 76,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                            lineNumber: 71,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "immersive-content",
                            children: activeTool === 'ai' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$AiChatBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                mode: "section",
                                onClose: closeTool,
                                autoStart: true,
                                preselectedSymbol: startSymbol
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                                lineNumber: 83,
                                columnNumber: 18
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$mzprimer$2d$nextjs$2d$v1__$2f$components$2f$PropFirmChat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onClose: closeTool,
                                preselectedSymbol: startSymbol
                            }, void 0, false, {
                                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                                lineNumber: 90,
                                columnNumber: 18
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                            lineNumber: 81,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                    lineNumber: 70,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/mzprimer-nextjs-v1 /app/page.tsx",
                lineNumber: 69,
                columnNumber: 9
            }, this), document.body)
        ]
    }, void 0, true);
}
_s(Home, "gqH97jqke94jAeBULS+z3kdNegs=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=mzprimer-nextjs-v1%20_81aa7b96._.js.map