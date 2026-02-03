(()=>{var a={};a.id=953,a.ids=[953],a.modules={108:(a,b,c)=>{"use strict";Object.defineProperty(b,"__esModule",{value:!0}),Object.defineProperty(b,"unstable_rethrow",{enumerable:!0,get:function(){return function a(b){if((0,g.isNextRouterError)(b)||(0,f.isBailoutToCSRError)(b)||(0,i.isDynamicServerError)(b)||(0,h.isDynamicPostpone)(b)||(0,e.isPostpone)(b)||(0,d.isHangingPromiseRejectionError)(b)||(0,h.isPrerenderInterruptedError)(b))throw b;b instanceof Error&&"cause"in b&&a(b.cause)}}});let d=c(48894),e=c(64491),f=c(62880),g=c(76484),h=c(23445),i=c(43449);("function"==typeof b.default||"object"==typeof b.default&&null!==b.default)&&void 0===b.default.__esModule&&(Object.defineProperty(b.default,"__esModule",{value:!0}),Object.assign(b.default,b),a.exports=b.default)},261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},2485:(a,b,c)=>{Promise.resolve().then(c.t.bind(c,23318,23))},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},7904:(a,b,c)=>{"use strict";function d(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(d=function(a){return a?c:b})(a)}function e(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var c=d(b);if(c&&c.has(a))return c.get(a);var e={__proto__:null},f=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var g in a)if("default"!==g&&Object.prototype.hasOwnProperty.call(a,g)){var h=f?Object.getOwnPropertyDescriptor(a,g):null;h&&(h.get||h.set)?Object.defineProperty(e,g,h):e[g]=a[g]}return e.default=a,c&&c.set(a,e),e}c.r(b),c.d(b,{_:()=>e})},10381:(a,b)=>{"use strict";Object.defineProperty(b,"__esModule",{value:!0}),Object.defineProperty(b,"ReadonlyURLSearchParams",{enumerable:!0,get:function(){return d}});class c extends Error{constructor(){super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams")}}class d extends URLSearchParams{append(){throw new c}delete(){throw new c}set(){throw new c}sort(){throw new c}}("function"==typeof b.default||"object"==typeof b.default&&null!==b.default)&&void 0===b.default.__esModule&&(Object.defineProperty(b.default,"__esModule",{value:!0}),Object.assign(b.default,b),a.exports=b.default)},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},16053:(a,b,c)=>{Promise.resolve().then(c.t.bind(c,2116,23))},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},23318:(a,b,c)=>{let{createProxy:d}=c(78830);a.exports=d("/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /node_modules/next/dist/client/app-dir/link.js")},26298:(a,b,c)=>{"use strict";c.r(b),c.d(b,{GlobalError:()=>D.a,__next_app__:()=>L,handler:()=>N,routeModule:()=>M});var d=c(7553),e=c(84006),f=c(67798),g=c(34775),h=c(99373),i=c(73461),j=c(1020),k=c(26349),l=c(54365),m=c(16023),n=c(63747),o=c(24235),p=c(23938),q=c(261),r=c(66758),s=c(77243),t=c(26713),u=c(37527),v=c(22820),w=c(88216),x=c(47929),y=c(79551),z=c(89125),A=c(86439),B=c(77068),C=c(95547),D=c.n(C),E=c(61287),F=c(81494),G=c(70722),H=c(70753),I=c(43954),J={};for(let a in E)0>["default","GlobalError","__next_app__","routeModule","handler"].indexOf(a)&&(J[a]=()=>E[a]);c.d(b,J);let K={children:["",{children:["blog",{children:["[slug]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(c.bind(c,55788)),"/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /app/blog/[slug]/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(c.bind(c,32056)),"/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /app/layout.tsx"],"global-error":[()=>Promise.resolve().then(c.t.bind(c,95547,23)),"next/dist/client/components/builtin/global-error.js"],"not-found":[()=>Promise.resolve().then(c.t.bind(c,55091,23)),"next/dist/client/components/builtin/not-found.js"],forbidden:[()=>Promise.resolve().then(c.t.bind(c,45270,23)),"next/dist/client/components/builtin/forbidden.js"],unauthorized:[()=>Promise.resolve().then(c.t.bind(c,28193,23)),"next/dist/client/components/builtin/unauthorized.js"]}]}.children,L={require:c,loadChunk:()=>Promise.resolve()},M=new d.AppPageRouteModule({definition:{kind:e.RouteKind.APP_PAGE,page:"/blog/[slug]/page",pathname:"/blog/[slug]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:K},distDir:".next",relativeProjectDir:""});async function N(a,b,d){var C;M.isDev&&(0,h.addRequestMeta)(a,"devRequestTimingInternalsEnd",process.hrtime.bigint());let J=!!(0,h.getRequestMeta)(a,"minimalMode"),O="/blog/[slug]/page";"/index"===O&&(O="/");let P=await M.prepare(a,b,{srcPage:O,multiZoneDraftMode:!1});if(!P)return b.statusCode=400,b.end("Bad Request"),null==d.waitUntil||d.waitUntil.call(d,Promise.resolve()),null;let{buildId:Q,query:R,params:S,pageIsDynamic:T,buildManifest:U,nextFontManifest:V,reactLoadableManifest:W,serverActionsManifest:X,clientReferenceManifest:Y,subresourceIntegrityManifest:Z,prerenderManifest:$,isDraftMode:_,resolvedPathname:aa,revalidateOnlyGenerated:ab,routerServerContext:ac,nextConfig:ad,parsedUrl:ae,interceptionRoutePatterns:af,deploymentId:ag}=P,ah=(0,q.normalizeAppPath)(O),{isOnDemandRevalidate:ai}=P,aj=ad.experimental.ppr&&!ad.cacheComponents&&(0,I.isInterceptionRouteAppPath)(aa)?null:M.match(aa,$),ak=!!$.routes[aa],al=a.headers["user-agent"]||"",am=(0,t.getBotType)(al),an=(0,p.isHtmlBotRequest)(a),ao=(0,h.getRequestMeta)(a,"isPrefetchRSCRequest")??"1"===a.headers[s.NEXT_ROUTER_PREFETCH_HEADER],ap=(0,h.getRequestMeta)(a,"isRSCRequest")??!!a.headers[s.RSC_HEADER],aq=(0,r.getIsPossibleServerAction)(a),ar=(0,m.checkIsAppPPREnabled)(ad.experimental.ppr);if(!(0,h.getRequestMeta)(a,"postponed")&&ar&&"1"===a.headers[x.NEXT_RESUME_HEADER]&&"POST"===a.method){let b=[];for await(let c of a)b.push(c);let c=Buffer.concat(b).toString("utf8");(0,h.addRequestMeta)(a,"postponed",c)}let as=ar&&(null==(C=$.routes[ah]??$.dynamicRoutes[ah])?void 0:C.renderingMode)==="PARTIALLY_STATIC",at=!1,au=!1,av=as?(0,h.getRequestMeta)(a,"postponed"):void 0,aw=as&&ap&&!ao;J&&(aw=aw&&!!av);let ax=(0,h.getRequestMeta)(a,"segmentPrefetchRSCRequest"),ay=(!an||!as)&&(!al||(0,p.shouldServeStreamingMetadata)(al,ad.htmlLimitedBots)),az=!!((aj||ak||$.routes[ah])&&!(an&&as)),aA=as&&!0===ad.cacheComponents,aB=!0===M.isDev||!az||"string"==typeof av||(aA&&(0,h.getRequestMeta)(a,"onCacheEntryV2")?aw&&!J:aw),aC=an&&as,aD=null;_||!az||aB||aq||av||aw||(aD=aa);let aE=aD;!aE&&M.isDev&&(aE=aa),M.isDev||_||!az||!ap||aw||(0,k.d)(a.headers);let aF={...E,tree:K,GlobalError:D(),handler:N,routeModule:M,__next_app__:L};X&&Y&&(0,o.setManifestsSingleton)({page:O,clientReferenceManifest:Y,serverActionsManifest:X});let aG=a.method||"GET",aH=(0,g.getTracer)(),aI=aH.getActiveScopeSpan(),aJ=async()=>((null==ac?void 0:ac.render404)?await ac.render404(a,b,ae,!1):b.end("This page could not be found"),null);try{let f=M.getVaryHeader(aa,af);b.setHeader("Vary",f);let k=async(c,d)=>{let e=new l.NodeNextRequest(a),f=new l.NodeNextResponse(b);return M.render(e,f,d).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let a=aH.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==i.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let d=a.get("next.route");if(d){let a=`${aG} ${d}`;c.setAttributes({"next.route":d,"http.route":d,"next.span_name":a}),c.updateName(a)}else c.updateName(`${aG} ${O}`)})},m=(0,h.getRequestMeta)(a,"incrementalCache"),o=async({span:e,postponed:f,fallbackRouteParams:g,forceStaticRender:i})=>{let l={query:R,params:S,page:ah,sharedContext:{buildId:Q},serverComponentsHmrCache:(0,h.getRequestMeta)(a,"serverComponentsHmrCache"),fallbackRouteParams:g,renderOpts:{App:()=>null,Document:()=>null,pageConfig:{},ComponentMod:aF,Component:(0,j.T)(aF),params:S,routeModule:M,page:O,postponed:f,shouldWaitOnAllReady:aC,serveStreamingMetadata:ay,supportsDynamicResponse:"string"==typeof f||aB,buildManifest:U,nextFontManifest:V,reactLoadableManifest:W,subresourceIntegrityManifest:Z,setCacheStatus:null==ac?void 0:ac.setCacheStatus,setIsrStatus:null==ac?void 0:ac.setIsrStatus,setReactDebugChannel:null==ac?void 0:ac.setReactDebugChannel,sendErrorsToBrowser:null==ac?void 0:ac.sendErrorsToBrowser,dir:c(33873).join(process.cwd(),M.relativeProjectDir),isDraftMode:_,botType:am,isOnDemandRevalidate:ai,isPossibleServerAction:aq,assetPrefix:ad.assetPrefix,nextConfigOutput:ad.output,crossOrigin:ad.crossOrigin,trailingSlash:ad.trailingSlash,images:ad.images,previewProps:$.preview,deploymentId:ag,enableTainting:ad.experimental.taint,htmlLimitedBots:ad.htmlLimitedBots,reactMaxHeadersLength:ad.reactMaxHeadersLength,multiZoneDraftMode:!1,incrementalCache:m,cacheLifeProfiles:ad.cacheLife,basePath:ad.basePath,serverActions:ad.experimental.serverActions,...at||au?{nextExport:!0,supportsDynamicResponse:!1,isStaticGeneration:!0,isDebugDynamicAccesses:at}:{},cacheComponents:!!ad.cacheComponents,experimental:{isRoutePPREnabled:as,expireTime:ad.expireTime,staleTimes:ad.experimental.staleTimes,dynamicOnHover:!!ad.experimental.dynamicOnHover,inlineCss:!!ad.experimental.inlineCss,authInterrupts:!!ad.experimental.authInterrupts,clientTraceMetadata:ad.experimental.clientTraceMetadata||[],clientParamParsingOrigins:ad.experimental.clientParamParsingOrigins,maxPostponedStateSizeBytes:(0,B.parseMaxPostponedStateSize)(ad.experimental.maxPostponedStateSize)},waitUntil:d.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:()=>{},onInstrumentationRequestError:(b,c,d,e)=>M.onRequestError(a,b,d,e,ac),err:(0,h.getRequestMeta)(a,"invokeError"),dev:M.isDev}};at&&(l.renderOpts.nextExport=!0,l.renderOpts.supportsDynamicResponse=!1,l.renderOpts.isDebugDynamicAccesses=at),i&&(l.renderOpts.supportsDynamicResponse=!1);let n=await k(e,l),{metadata:o}=n,{cacheControl:p,headers:q={},fetchTags:r,fetchMetrics:s}=o;if(r&&(q[x.NEXT_CACHE_TAGS_HEADER]=r),a.fetchMetrics=s,az&&(null==p?void 0:p.revalidate)===0&&!M.isDev&&!as){let a=o.staticBailoutInfo,b=Object.defineProperty(Error(`Page changed from static to dynamic at runtime ${aa}${(null==a?void 0:a.description)?`, reason: ${a.description}`:""}
see more here https://nextjs.org/docs/messages/app-static-to-dynamic-error`),"__NEXT_ERROR_CODE",{value:"E132",enumerable:!1,configurable:!0});if(null==a?void 0:a.stack){let c=a.stack;b.stack=b.message+c.substring(c.indexOf("\n"))}throw b}return{value:{kind:u.CachedRouteKind.APP_PAGE,html:n,headers:q,rscData:o.flightData,postponed:o.postponed,status:o.statusCode,segmentData:o.segmentData},cacheControl:p}},p=async({hasResolved:c,previousCacheEntry:f,isRevalidating:g,span:i,forceStaticRender:j=!1})=>{let k,l=!1===M.isDev,q=c||b.writableEnded;if(ai&&ab&&!f&&!J)return(null==ac?void 0:ac.render404)?await ac.render404(a,b):(b.statusCode=404,b.end("This page could not be found")),null;if(aj&&(k=(0,v.parseFallbackField)(aj.fallback)),k===v.FallbackMode.PRERENDER&&(0,t.isBot)(al)&&(!as||an)&&(k=v.FallbackMode.BLOCKING_STATIC_RENDER),(null==f?void 0:f.isStale)===-1&&(ai=!0),ai&&(k!==v.FallbackMode.NOT_FOUND||f)&&(k=v.FallbackMode.BLOCKING_STATIC_RENDER),!J&&k!==v.FallbackMode.BLOCKING_STATIC_RENDER&&aE&&!q&&!_&&T&&(l||!ak)){if((l||aj)&&k===v.FallbackMode.NOT_FOUND){if(ad.experimental.adapterPath)return await aJ();throw new A.NoFallbackError}if(as&&(ad.cacheComponents?!aw:!ap)){let b=l&&"string"==typeof(null==aj?void 0:aj.fallback)?aj.fallback:ah,c=l&&(null==aj?void 0:aj.fallbackRouteParams)?(0,n.createOpaqueFallbackRouteParams)(aj.fallbackRouteParams):au?(0,n.getFallbackRouteParams)(ah,M):null,f=await M.handleResponse({cacheKey:b,req:a,nextConfig:ad,routeKind:e.RouteKind.APP_PAGE,isFallback:!0,prerenderManifest:$,isRoutePPREnabled:as,responseGenerator:async()=>o({span:i,postponed:void 0,fallbackRouteParams:c,forceStaticRender:!1}),waitUntil:d.waitUntil,isMinimalMode:J});if(null===f)return null;if(f)return delete f.cacheControl,f}}let r=ai||g||!av?void 0:av;if(aA&&!J&&m&&aw&&!j){let b=await m.get(aa,{kind:u.IncrementalCacheKind.APP_PAGE,isRoutePPREnabled:!0,isFallback:!1});b&&b.value&&b.value.kind===u.CachedRouteKind.APP_PAGE&&(r=b.value.postponed,b&&(-1===b.isStale||!0===b.isStale)&&(0,H.scheduleOnNextTick)(async()=>{let b=M.getResponseCache(a);try{await b.revalidate(aa,m,as,!1,a=>p({...a,forceStaticRender:!0}),null,c,d.waitUntil)}catch(a){console.error("Error revalidating the page in the background",a)}}))}if(at&&void 0!==r)return{cacheControl:{revalidate:1,expire:void 0},value:{kind:u.CachedRouteKind.PAGES,html:w.default.EMPTY,pageData:{},headers:void 0,status:void 0}};let s=l&&(null==aj?void 0:aj.fallbackRouteParams)&&(0,h.getRequestMeta)(a,"renderFallbackShell")?(0,n.createOpaqueFallbackRouteParams)(aj.fallbackRouteParams):au?(0,n.getFallbackRouteParams)(ah,M):null;return o({span:i,postponed:r,fallbackRouteParams:s,forceStaticRender:j})},q=async c=>{var f,g,i,j,k;let l,m=await M.handleResponse({cacheKey:aD,responseGenerator:a=>p({span:c,...a}),routeKind:e.RouteKind.APP_PAGE,isOnDemandRevalidate:ai,isRoutePPREnabled:as,req:a,nextConfig:ad,prerenderManifest:$,waitUntil:d.waitUntil,isMinimalMode:J});if(_&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate"),M.isDev&&b.setHeader("Cache-Control","no-store, must-revalidate"),!m){if(aD)throw Object.defineProperty(Error("invariant: cache entry required but not generated"),"__NEXT_ERROR_CODE",{value:"E62",enumerable:!1,configurable:!0});return null}if((null==(f=m.value)?void 0:f.kind)!==u.CachedRouteKind.APP_PAGE)throw Object.defineProperty(Error(`Invariant app-page handler received invalid cache entry ${null==(i=m.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E707",enumerable:!1,configurable:!0});let n="string"==typeof m.value.postponed;az&&!aw&&(!n||ao)&&(J||b.setHeader("x-nextjs-cache",ai?"REVALIDATED":m.isMiss?"MISS":m.isStale?"STALE":"HIT"),b.setHeader(s.NEXT_IS_PRERENDER_HEADER,"1"));let{value:q}=m;if(av)l={revalidate:0,expire:void 0};else if(aw)l={revalidate:0,expire:void 0};else if(!M.isDev)if(_)l={revalidate:0,expire:void 0};else if(az){if(m.cacheControl)if("number"==typeof m.cacheControl.revalidate){if(m.cacheControl.revalidate<1)throw Object.defineProperty(Error(`Invalid revalidate configuration provided: ${m.cacheControl.revalidate} < 1`),"__NEXT_ERROR_CODE",{value:"E22",enumerable:!1,configurable:!0});l={revalidate:m.cacheControl.revalidate,expire:(null==(j=m.cacheControl)?void 0:j.expire)??ad.expireTime}}else l={revalidate:x.CACHE_ONE_YEAR,expire:void 0}}else b.getHeader("Cache-Control")||(l={revalidate:0,expire:void 0});if(m.cacheControl=l,"string"==typeof ax&&(null==q?void 0:q.kind)===u.CachedRouteKind.APP_PAGE&&q.segmentData){b.setHeader(s.NEXT_DID_POSTPONE_HEADER,"2");let c=null==(k=q.headers)?void 0:k[x.NEXT_CACHE_TAGS_HEADER];J&&az&&c&&"string"==typeof c&&b.setHeader(x.NEXT_CACHE_TAGS_HEADER,c);let d=q.segmentData.get(ax);return void 0!==d?(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:w.default.fromStatic(d,s.RSC_CONTENT_TYPE_HEADER),cacheControl:m.cacheControl}):(b.statusCode=204,(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:w.default.EMPTY,cacheControl:m.cacheControl}))}let r=aA?(0,h.getRequestMeta)(a,"onCacheEntryV2")??(0,h.getRequestMeta)(a,"onCacheEntry"):(0,h.getRequestMeta)(a,"onCacheEntry");if(r&&await r(m,{url:(0,h.getRequestMeta)(a,"initURL")??a.url}))return null;if(q.headers){let a={...q.headers};for(let[c,d]of(J&&az||delete a[x.NEXT_CACHE_TAGS_HEADER],Object.entries(a)))if(void 0!==d)if(Array.isArray(d))for(let a of d)b.appendHeader(c,a);else"number"==typeof d&&(d=d.toString()),b.appendHeader(c,d)}let t=null==(g=q.headers)?void 0:g[x.NEXT_CACHE_TAGS_HEADER];if(J&&az&&t&&"string"==typeof t&&b.setHeader(x.NEXT_CACHE_TAGS_HEADER,t),!q.status||ap&&as||(b.statusCode=q.status),!J&&q.status&&F.RedirectStatusCode[q.status]&&ap&&(b.statusCode=200),n&&!aw&&b.setHeader(s.NEXT_DID_POSTPONE_HEADER,"1"),ap&&!_){if(void 0===q.rscData){if(q.html.contentType!==s.RSC_CONTENT_TYPE_HEADER)if(ad.cacheComponents)return b.statusCode=404,(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:w.default.EMPTY,cacheControl:m.cacheControl});else throw Object.defineProperty(new G.InvariantError(`Expected RSC response, got ${q.html.contentType}`),"__NEXT_ERROR_CODE",{value:"E789",enumerable:!1,configurable:!0});return(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:q.html,cacheControl:m.cacheControl})}return(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:w.default.fromStatic(q.rscData,s.RSC_CONTENT_TYPE_HEADER),cacheControl:m.cacheControl})}let v=q.html;if(!n||J||ap)return(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:v,cacheControl:m.cacheControl});if(at)return v.push(new ReadableStream({start(a){a.enqueue(y.ENCODED_TAGS.CLOSED.BODY_AND_HTML),a.close()}})),(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:v,cacheControl:{revalidate:0,expire:void 0}});let A=new TransformStream;return v.push(A.readable),o({span:c,postponed:q.postponed,fallbackRouteParams:null,forceStaticRender:!1}).then(async a=>{var b,c;if(!a)throw Object.defineProperty(Error("Invariant: expected a result to be returned"),"__NEXT_ERROR_CODE",{value:"E463",enumerable:!1,configurable:!0});if((null==(b=a.value)?void 0:b.kind)!==u.CachedRouteKind.APP_PAGE)throw Object.defineProperty(Error(`Invariant: expected a page response, got ${null==(c=a.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E305",enumerable:!1,configurable:!0});await a.value.html.pipeTo(A.writable)}).catch(a=>{A.writable.abort(a).catch(a=>{console.error("couldn't abort transformer",a)})}),(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:v,cacheControl:{revalidate:0,expire:void 0}})};if(!aI)return await aH.withPropagatedContext(a.headers,()=>aH.trace(i.BaseServerSpan.handleRequest,{spanName:`${aG} ${O}`,kind:g.SpanKind.SERVER,attributes:{"http.method":aG,"http.target":a.url}},q));await q(aI)}catch(b){throw b instanceof A.NoFallbackError||await M.onRequestError(a,b,{routerKind:"App Router",routePath:O,routeType:"render",revalidateReason:(0,f.c)({isStaticGeneration:az,isOnDemandRevalidate:ai})},!1,ac),b}}},26713:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/is-bot")},28354:a=>{"use strict";a.exports=require("util")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},32171:(a,b,c)=>{"use strict";Object.defineProperty(b,"__esModule",{value:!0});var d={getRedirectError:function(){return i},getRedirectStatusCodeFromError:function(){return n},getRedirectTypeFromError:function(){return m},getURLFromRedirectError:function(){return l},permanentRedirect:function(){return k},redirect:function(){return j}};for(var e in d)Object.defineProperty(b,e,{enumerable:!0,get:d[e]});let f=c(81494),g=c(52220),h=c(19121).actionAsyncStorage;function i(a,b,c=f.RedirectStatusCode.TemporaryRedirect){let d=Object.defineProperty(Error(g.REDIRECT_ERROR_CODE),"__NEXT_ERROR_CODE",{value:"E394",enumerable:!1,configurable:!0});return d.digest=`${g.REDIRECT_ERROR_CODE};${b};${a};${c};`,d}function j(a,b){throw i(a,b??=h?.getStore()?.isAction?g.RedirectType.push:g.RedirectType.replace,f.RedirectStatusCode.TemporaryRedirect)}function k(a,b=g.RedirectType.replace){throw i(a,b,f.RedirectStatusCode.PermanentRedirect)}function l(a){return(0,g.isRedirectError)(a)?a.digest.split(";").slice(2,-2).join(";"):null}function m(a){if(!(0,g.isRedirectError)(a))throw Object.defineProperty(Error("Not a redirect error"),"__NEXT_ERROR_CODE",{value:"E260",enumerable:!1,configurable:!0});return a.digest.split(";",2)[1]}function n(a){if(!(0,g.isRedirectError)(a))throw Object.defineProperty(Error("Not a redirect error"),"__NEXT_ERROR_CODE",{value:"E260",enumerable:!1,configurable:!0});return Number(a.digest.split(";").at(-2))}("function"==typeof b.default||"object"==typeof b.default&&null!==b.default)&&void 0===b.default.__esModule&&(Object.defineProperty(b.default,"__esModule",{value:!0}),Object.assign(b.default,b),a.exports=b.default)},33873:a=>{"use strict";a.exports=require("path")},41025:a=>{"use strict";a.exports=require("next/dist/server/app-render/dynamic-access-async-storage.external.js")},43954:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/interception-routes")},44057:(a,b,c)=>{"use strict";function d(){throw Object.defineProperty(Error("`unauthorized()` is experimental and only allowed to be used when `experimental.authInterrupts` is enabled."),"__NEXT_ERROR_CODE",{value:"E411",enumerable:!1,configurable:!0})}Object.defineProperty(b,"__esModule",{value:!0}),Object.defineProperty(b,"unauthorized",{enumerable:!0,get:function(){return d}}),c(7638).HTTP_ERROR_FALLBACK_ERROR_CODE,("function"==typeof b.default||"object"==typeof b.default&&null!==b.default)&&void 0===b.default.__esModule&&(Object.defineProperty(b.default,"__esModule",{value:!0}),Object.assign(b.default,b),a.exports=b.default)},52283:(a,b,c)=>{"use strict";Object.defineProperty(b,"__esModule",{value:!0}),Object.defineProperty(b,"notFound",{enumerable:!0,get:function(){return f}});let d=c(7638),e=`${d.HTTP_ERROR_FALLBACK_ERROR_CODE};404`;function f(){let a=Object.defineProperty(Error(e),"__NEXT_ERROR_CODE",{value:"E394",enumerable:!1,configurable:!0});throw a.digest=e,a}("function"==typeof b.default||"object"==typeof b.default&&null!==b.default)&&void 0===b.default.__esModule&&(Object.defineProperty(b.default,"__esModule",{value:!0}),Object.assign(b.default,b),a.exports=b.default)},55788:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>l,dynamic:()=>j,generateMetadata:()=>k,generateStaticParams:()=>i});var d=c(5735),e=c(66610);let f=[{title:"What is Lot Size in Forex?",slug:"lot-size-guide",description:"Understand how lot size impacts your position size, pip value, and overall risk in forex trading.",content:`
<div style="text-align: left;">
  <p>In Forex trading, a <strong>lot</strong> refers to the volume of currency units you're trading in a single order. It's one of the most important factors in managing risk, calculating profit potential, and designing your strategy. Every trade you place is sized in lots — and understanding how to use them wisely separates beginners from pros.</p>

  <h3>📐 Lot Size Types</h3>
  <p>The Forex market offers several standard lot sizes:</p>
  <ul>
    <li><strong>Standard Lot</strong> = 100,000 units</li>
    <li><strong>Mini Lot</strong> = 10,000 units</li>
    <li><strong>Micro Lot</strong> = 1,000 units</li>
    <li><strong>Nano Lot</strong> = 100 units (rare, but offered by some brokers)</li>
  </ul>
  <p>Each size controls how much each pip movement is worth. For example, a 1-pip change in a standard lot usually equals $10 (on most USD pairs), while in a micro lot it equals $0.10.</p>

  <h3>🧮 Lot Size & Pip Value</h3>
  <p>Pip value changes depending on the lot size, currency pair, and whether you're trading a USD-based pair or not.</p>
  <p>To calculate pip value for 1 lot:</p>
  <pre style="background:#1e1e1e; padding: 10px; border-radius: 6px; color: #f1f1f1;">
Pip Value = (1 pip \xf7 Exchange Rate) \xd7 Lot Size
  </pre>
  <p>Example: If EUR/USD = 1.1000 and you’re trading 1 standard lot (100,000), your pip value is:</p>
  <pre style="background:#1e1e1e; padding: 10px; border-radius: 6px; color: #f1f1f1;">
Pip Value = (0.0001 \xf7 1.1000) \xd7 100,000 = $9.09
  </pre>

  <h3>📊 Lot Size & Account Balance</h3>
  <p>Your lot size should match your account size and risk profile. Most professionals recommend risking only <strong>1–2%</strong> of your capital per trade.</p>
  <p>Example: If your account balance is $1,000 and you want to risk 2%, your max loss per trade is $20. If your stop loss is 50 pips, your position size must be:</p>
  <pre style="background:#1e1e1e; padding: 10px; border-radius: 6px; color: #f1f1f1;">
Lot Size = ($20 \xf7 50 pips) \xf7 pip value
  </pre>
  <p>This often leads to using a <strong>micro lot</strong> or smaller — the hallmark of disciplined trading.</p>

  <h3>💡 Margin, Leverage & Lot Size</h3>
  <p>The bigger your lot, the more margin you use. For instance, trading 1 standard lot with 1:100 leverage on EUR/USD (1.1000):</p>
  <ul>
    <li>Required Margin = (100,000 \xd7 1.1000) \xf7 100 = $1,100</li>
  </ul>
  <p>Too much margin use increases the risk of a margin call. Always balance lot size with available equity.</p>

  <h3>🎯 Strategic Uses of Lot Size</h3>
  <p>Advanced traders often adjust lot size dynamically based on:</p>
  <ul>
    <li>Trade confidence level (larger size for higher probability setups)</li>
    <li>Volatility of the pair (smaller size for volatile pairs like GBP/JPY)</li>
    <li>Account drawdown phase (reduce size during recovery)</li>
    <li>Scaling in/out (partial positions to manage exposure)</li>
  </ul>

  <h3>🧠 Psychology: Lot Size and Emotion</h3>
  <p>If your lot size is too large, your emotional risk rises. Most traders overtrade and panic not because of poor entries — but because the position size is too large for them to manage calmly. Always match lot size to your psychological tolerance, not just your account balance.</p>

  <h3>✅ Summary</h3>
  <ul>
    <li>Lot size defines your pip value and risk exposure.</li>
    <li>Always align lot size with your risk management rules.</li>
    <li>Use micro/mini lots if you're just starting or trading small accounts.</li>
  </ul>

  <p><small>📅 Published: June 16, 2025 — by MZPrimer</small></p>
</div>
`},{title:"توترات إيران وإسرائيل: تأثيرها على أسعار النفط والذهب والعملات",slug:"iran-israel-tensions-ar",description:"تحليل شامل لتأثير التوترات الجيوسياسية بين إيران وإسرائيل على الذهب والنفط وسوق العملات.",content:`
<div dir="rtl" style="text-align: right;">
  <p><strong>التاريخ:</strong> 17 يونيو 2025، الساعة 23:33</p>

  <h3>📌 الخلفية الجيوسياسية الحالية</h3>
  <p>في الأيام القليلة الماضية، تصاعدت التوترات بشكل خطير بين إيران وإسرائيل، بعد تنفيذ إسرائيل ضربات جوية دقيقة استهدفت منشآت نووية ومراكز قيادية تابعة للحرس الثوري الإيراني...</p>

  <h3> الذهب: ملاذ آمن يعود بقوة</h3>
  <p>مع تصاعد التوترات، شهدت أسعار الذهب ارتفاعًا ملحوظًا حيث تجاوزت حاجز 3,400 دولار للأونصة...</p>
  <p><strong>من الناحية الفنية:</strong></p>
  <ul>
    <li><strong>الدعم القوي:</strong> 3,380 – 3,390 دولار</li>
    <li><strong>المقاومة المقبلة:</strong> 3,430 – 3,450 دولار</li>
  </ul>

  <h3>🛢️ النفط: بين التصعيد والمخزون الاستراتيجي</h3>
  <p>أسعار النفط ارتفعت بشكل حاد نتيجة الخوف من تعطل الإمدادات، خصوصًا مع احتمالية إغلاق مضيق هرمز...</p>
  <ul>
    <li>الطلب العالمي ما زال قويًا مع دخول موسم الصيف.</li>
    <li>عدم كفاية المخزونات الاستراتيجية للسيطرة على أي أزمة إمداد طويلة الأمد.</li>
    <li>أسعار الشحن والتأمين البحري ارتفعت بشكل ملحوظ.</li>
  </ul>

  <h3>💱 تأثير مباشر على سوق العملات</h3>
  <p>الدولار الأمريكي والين الياباني يستفيدان من تدفق رؤوس الأموال إلى الأصول الآمنة...</p>

  <h3>📊 التوقعات والاستراتيجيات المقترحة</h3>
  <h4>🔹 الذهب:</h4>
  <ul>
    <li>الشراء عند مستويات الدعم 3,390 مع وقف خسارة تحت 3,380.</li>
    <li>أهداف قصيرة المدى: 3,430 ثم 3,450.</li>
  </ul>

  <h4>🔹 النفط:</h4>
  <ul>
    <li>الدخول عند ارتدادات نحو 72–73 دولار مع وقف خسارة تحت 71.</li>
    <li>الأهداف: 76 ثم 80 إذا استمر التوتر.</li>
  </ul>

  <h4>🔹 العملات:</h4>
  <ul>
    <li>الشراء على الدولار/ين في حال اختراق 145.20 نحو أهداف 146.50–147.</li>
    <li>التحفظ على التداول ضد الدولار في ظل استمرار حالة الذعر العالمي.</li>
  </ul>

  <h3>🧠 الخلاصة:</h3>
  <p>السوق لا يتعامل مع مجرد أزمة عابرة، بل مع تهديد استراتيجي طويل المدى قد يعيد تشكيل موازين العرض والطلب في الطاقة والمعادن...</p>

  <p style="margin-top: 20px;"><small>📅 نُشر بتاريخ: 17 يونيو 2025 — إعداد فريق MZPrimer</small></p>
</div>
`},{title:"تحليل استراتيجي: موانئ إيران النفطية وتهديد أسعار النفط العالمية",slug:"iran-ports-analysis-ar",description:"تحليل شامل لأهمية الموانئ الإيرانية مثل جزيرة خارك وتأثيرها على أسعار النفط العالمية والتوترات الجيوسياسية.",content:`
<div dir="rtl" style="text-align: right;">
  <p><strong>📅 التاريخ:</strong> 18 يونيو 2025 • <strong> التوقيت:</strong> 00:28</p>

  <hr />

  <h3>⚓ 1. لماذا الموانئ الإيرانية مهمة؟</h3>
  <p>تعتمد صادرات النفط الإيرانية بشكل رئيسي على عدد قليل من الموانئ البحرية الاستراتيجية:</p>
  <ul>
    <li><strong>جزيرة خارك:</strong> تصدر حوالي 90٪ من النفط الإيراني الخام.</li>
    <li><strong>ميناء جاسك:</strong> منفذ جديد على خليج عمان، تم إنشاؤه لتجاوز مضيق هرمز.</li>
    <li><strong>بندر عباس:</strong> ميناء تجاري وداعم للطاقة، ولكن لا يمتلك نفس القدرة التصديرية لخارك.</li>
  </ul>

  <hr />

  <h3>🚨 2. جزيرة خارك: نقطة الضعف الأخطر</h3>
  <p><strong>🇮🇷 الدور الاستراتيجي:</strong></p>
  <ul>
    <li>تحتوي على خزانات ضخمة وأنابيب مرتبطة بحقول النفط البرية.</li>
    <li>تسمح منصاتها البحرية بشحن أكثر من ناقلة في الوقت ذاته.</li>
    <li>طاقتها التصديرية تتجاوز 1.5 مليون برميل يوميًا.</li>
  </ul>

  <p><strong>🎯 نقاط الضعف:</strong></p>
  <ul>
    <li>من السهل استهدافها جغرافيًا سواء من البحر أو الجو.</li>
    <li>صور الأقمار الصناعية تشير إلى تعزيزات عسكرية إيرانية في آخر 72 ساعة.</li>
    <li>أي ضرر سيتطلب أشهرًا من الإصلاح، ولا يوجد بديل يعوضها بالكامل.</li>
  </ul>

  <hr />

  <h3>🌍 3. حساسية السوق العالمي</h3>
  <p>أسواق النفط تتفاعل بسرعة كبيرة مع التهديدات في البنية التحتية بالشرق الأوسط:</p>
  <ul>
    <li>أي تعطيل لخارك قد يحذف أكثر من مليون برميل يوميًا من المعروض.</li>
    <li>قد يدفع ذلك بأسعار برنت نحو 85–90 دولارًا خلال أيام.</li>
    <li>في حال تصعيد أكبر (ضرر + تهديد هرمز)، قد تصل الأسعار إلى 110–120 دولارًا.</li>
  </ul>

  <h4>📈 تقديرات رد فعل الأسعار:</h4>
  <table style="width: 100%; border-collapse: collapse;">
    <thead style="background: #f5f5f5;">
      <tr>
        <th style="border: 1px solid #ccc; padding: 10px;">السيناريو</th>
        <th style="border: 1px solid #ccc; padding: 10px;">نقص الإمداد</th>
        <th style="border: 1px solid #ccc; padding: 10px;">رد الفعل السعري المتوقع</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #ccc; padding: 10px;">ضرر طفيف لجزيرة خارك</td>
        <td style="border: 1px solid #ccc; padding: 10px;">300–500 ألف برميل/يوميًا</td>
        <td style="border: 1px solid #ccc; padding: 10px;">+4–6 دولار للبرميل</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 10px;">توقف كامل</td>
        <td style="border: 1px solid #ccc; padding: 10px;">1–1.3 مليون برميل/يوميًا</td>
        <td style="border: 1px solid #ccc; padding: 10px;">+10–15 دولار للبرميل</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 10px;">مع إغلاق مضيق هرمز</td>
        <td style="border: 1px solid #ccc; padding: 10px;">أكثر من 4 ملايين برميل/يوميًا</td>
        <td style="border: 1px solid #ccc; padding: 10px;">ارتفاع مؤقت 110–130 دولار</td>
      </tr>
    </tbody>
  </table>

  <hr />

  <h3>💡 4. تداعيات استراتيجية وسياسية</h3>
  <ul>
    <li>الصين والهند ستطلبان ضمانات فورية لتأمين الشحنات.</li>
    <li>أسعار التأمين البحري سترتفع حتى على صادرات السعودية والإمارات.</li>
    <li>القوات البحرية الأمريكية قد تعزز وجودها لحماية الممرات.</li>
    <li>إيران قد ترد بزرع ألغام أو تهديد الملاحة في هرمز.</li>
    <li>دول الخليج أو إسرائيل قد تضرب منشآت بديلة مثل جاسك.</li>
  </ul>

  <hr />

  <h3>📊 النظرة قصيرة الأجل للتداول</h3>
  <ul>
    <li><strong>WTI:</strong> راقب دعم 73.50$ — مع تصاعد الأخبار، قد يصل إلى 78$.</li>
    <li><strong>برنت:</strong> تجاوز 76.20$ يعني احتمالية صعود نحو 82$.</li>
    <li><strong>OVX:</strong> قد يرتفع بنسبة 10–15٪.</li>
  </ul>

  <p><strong>الاستراتيجية:</strong></p>
  <ul>
    <li>شراء النفط عند الانخفاضات، مع وقف خسارة قريب من الدعم.</li>
    <li>متابعة صور الأقمار الصناعية وتحركات الناقلات.</li>
    <li>تجنب الروافع العالية بسبب المخاطر السياسية.</li>
  </ul>

  <hr />

  <h3>🧠 الخلاصة</h3>
  <p>ميناء جزيرة خارك ليس مجرد منشأة إيرانية — بل هو ركيزة توازن لوجستي عالمي في سوق الطاقة.</p>
  <p>أي خلل في عملياته قد يفاقم التضخم، ويرفع تكاليف الطاقة، ويغير خريطة التحالفات الجيوسياسية.</p>
  <p>إذا استمر التصعيد، فقد تدخل أسعار النفط مرحلة “التسعير الاستراتيجي”.</p>

  <p><small>📅 نُشر بتاريخ: 18 يونيو 2025 — بواسطة MZPrimer</small></p>
</div>
`},{title:"How to Use Stop Loss & Take Profit Like a Pro",slug:"stop-loss-take-profit",description:"Master risk management by learning exactly where and how to place SL and TP levels like professional traders.",content:`
<div style="text-align: left;">
  <p>Stop Loss (SL) and Take Profit (TP) are the foundation of any trading risk management plan. Without them, trades are left vulnerable to emotional decisions and excessive losses. Here’s how to master both like a professional trader.</p>

  <h3>🔒 What is a Stop Loss?</h3>
  <p>A <strong>Stop Loss</strong> is a predefined price at which your trade is automatically closed to prevent further loss. It acts as a safety net when the market moves against you.</p>

  <h4>📌 Where to place it:</h4>
  <ul>
    <li>Below support (if buying)</li>
    <li>Above resistance (if selling)</li>
    <li>Outside of the recent swing high/low</li>
  </ul>

  <h3>💰 What is a Take Profit?</h3>
  <p>A <strong>Take Profit</strong> is the price level at which your trade closes in profit. It ensures your gains are secured before the market can reverse.</p>

  <h4>📌 Ideal TP placements:</h4>
  <ul>
    <li>Next resistance/support area</li>
    <li>Fibonacci extensions (1.272, 1.618)</li>
    <li>Fixed Risk/Reward target (e.g. 1:2 or 1:3)</li>
  </ul>

  <h3>📊 Pro Risk/Reward Tip</h3>
  <p>Using a 1:2 ratio (risking $50 to gain $100) allows you to be profitable even if only 50% of your trades win. For example, if your SL is 50 pips, then your TP should be at least 100 pips away.</p>

  <h3>🧠 Common Mistakes</h3>
  <ul>
    <li>Placing SLs too tight (leads to premature exits)</li>
    <li>Using TPs that are too far away (rarely triggered)</li>
    <li>Trading without a SL — this exposes you to unlimited loss</li>
  </ul>

  <h3>📌 How to Calculate SL & TP Levels</h3>
  <p>Use ATR (Average True Range) indicator to adapt to market volatility:</p>
  <pre style="background: #1e1e1e; padding: 1rem; border-radius: 8px; color: #f1f1f1;">
SL = Entry Price - (1.5 \xd7 ATR)
TP = Entry Price + (3 \xd7 ATR)</pre>
  <p>This keeps your risk/reward structured, and adapts dynamically to current volatility.</p>

  <h3>🛠️ Tools That Help</h3>
  <ul>
    <li>Use <strong>position size calculators</strong> to determine lot size based on SL</li>
    <li>Enable <strong>trailing stop</strong> to protect profits during trend moves</li>
    <li>Backtest different SL/TP strategies to optimize performance</li>
  </ul>

  <h3>🧠 Psychological Tips</h3>
  <ul>
    <li>Set your SL and TP before entering the trade — never change it impulsively</li>
    <li>Accept small losses as part of the game</li>
    <li>Don’t move your SL further away “hoping” the trade will come back</li>
  </ul>

  <h3>✅ Summary</h3>
  <ul>
    <li>SL protects your capital — TP locks in your success</li>
    <li>Combine both with proper position sizing and consistent rules</li>
    <li>Most professional traders prioritize risk control over profit hunting</li>
  </ul>

  <p><small>📅 Published: June 16, 2025 — by MZPrimer</small></p>
</div>
`},{title:"Middle East Tensions: How It Impacts Gold, Oil & Forex",slug:"middle-east-tensions",description:"A deep breakdown of how the geopolitical conflict between Iran and Israel is shaking global markets, with a focus on gold, oil, and forex.",content:`
<div style="text-align: left;">
  <p><strong>Date:</strong> June 17, 2025</p>

  <h3>⚠️ Geopolitical Context</h3>
  <ul>
    <li>On June 13, Israel struck Iranian nuclear and IRGC military sites, reportedly killing senior commanders, including IRGC chief Salami.</li>
    <li>Between June 14–16, Iran fired over 150 ballistic missiles and drones targeting Israel; most were intercepted, but civilian casualties occurred.</li>
    <li>Iran has renewed its threat to close the Strait of Hormuz, through which ~20% of global oil transits.</li>
  </ul>

  <h3>🪙 Gold: Surging on Safe-Haven Demand</h3>
  <p>Gold prices jumped to a nearly two-month high. Although it briefly eased to ~$3,393, bullion remains elevated above $3,400 as investors react to geopolitical uncertainty and fears of inflation pressure.</p>
  <p><strong>Outlook:</strong></p>
  <ul>
    <li>Support zone: $3,300–$3,400 (50-day EMA)</li>
    <li>Resistance: ~$3,500 — watch for consolidation or breakout based on coming news</li>
  </ul>

  <h3>🛢️ Oil: Flash Volatility Amid Supply Risk</h3>
  <p>Following the June 13 strikes, Brent surged ~11% to ~$74 before stabilizing near $73–74, while WTI rose ~7% to ~$70–72. Analysts warn oil may reach $100–150 if the Strait sees disruption, although current sanctions and supply boosters could ease pressure later this year.</p>
  <p><strong>Outlook:</strong></p>
  <ul>
    <li>Key support: WTI $70–71, Brent $73–74</li>
    <li>Scalpers can target tight trades when markets react to news, with stops just outside support zones</li>
  </ul>

  <h3>💱 Forex: Safe-Haven Flow Strengthens USD and JPY</h3>
  <p>The U.S. Dollar has strengthened with USD/JPY up ~0.4% to ~144.65 and EUR/USD down to ~1.1532 as investors de-risk. The Federal Reserve’s likely pause on rate cuts is reinforcing dollar demand amid elevated oil prices and inflation risk.</p>
  <p><strong>Key Levels:</strong></p>
  <ul>
    <li>USD/JPY support: 143.90–145.00</li>
    <li>EUR/USD resistance: ~1.1575, support: ~1.1530</li>
  </ul>

  <h3>📊 Trading Strategies</h3>
  <p><strong>Short-Term:</strong></p>
  <ul>
    <li><strong>Gold:</strong> Buy near $3,400 with stop just below $3,300; target $3,500–$3,550</li>
    <li><strong>Oil:</strong> Long WTI on dips to $70–71; tight stop under $68</li>
    <li><strong>FX:</strong> Go long USD/JPY with stop under 143.9; avoid leverage spikes</li>
  </ul>

  <p><strong>Mid-Term:</strong></p>
  <ul>
    <li>Watch diplomatic developments around the Strait of Hormuz</li>
    <li>Monitor central bank tone — Fed, ECB — to assess inflation impact</li>
    <li>Look for gold pullbacks if tensions ease; oil vulnerable to overbought retracement</li>
  </ul>

  <h3>🧠 Summary</h3>
  <p>This is not just a temporary reaction — markets are beginning to price in sustained strategic risk. Safe-haven demand is up, inflation hedging is back, and volatility is surging.</p>
  <p>Traders should focus on solid technical zones, avoid emotional entries, and size positions according to risk — not fear.</p>

  <p><small>📅 Published: June 17, 2025 — by MZPrimer</small></p>
</div>
`}];var g=c(63059),h=c.n(g);async function i(){return f.map(a=>({slug:a.slug}))}let j="force-static";async function k({params:a}){let{slug:b}=await a,c=f.find(a=>a.slug===b);return c?{title:`${c.title} - MZPrimer Blog`,description:c.description,openGraph:{title:c.title,description:c.description,type:"article",publishedTime:c.date,authors:["MZPrimer"],images:c.image?[{url:`https://mzprimer.com${c.image}`,width:1200,height:630,alt:c.title}]:void 0},twitter:{card:"summary_large_image",title:c.title,description:c.description,images:c.image?[`https://mzprimer.com${c.image}`]:void 0}}:{title:"Blog Post Not Found - MZPrimer",description:"This blog article could not be found."}}async function l({params:a}){var b;let{slug:c}=await a,g=f.find(a=>a.slug===c);g||(0,e.notFound)();let i=g.date?new Date(g.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):"Recent";return(0,d.jsxs)("main",{className:"max-w-4xl mx-auto px-4 py-12 bg-black text-white min-h-screen",children:[(0,d.jsx)("div",{className:"mb-8",children:(0,d.jsx)(h(),{href:"/blog",className:"text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2",children:"← Back to Blog"})}),(0,d.jsxs)("header",{className:"mb-10",children:[g.image&&(0,d.jsx)("div",{className:"mb-8 rounded-xl overflow-hidden",children:(0,d.jsx)("img",{src:g.image,alt:g.title,className:"w-full h-64 object-cover"})}),(0,d.jsx)("h1",{className:"text-4xl md:text-5xl font-black mb-6 leading-tight",children:g.title}),(0,d.jsxs)("div",{className:"flex flex-wrap gap-4 text-sm text-zinc-500 mb-8",children:[(0,d.jsxs)("div",{className:"flex items-center gap-2",children:[(0,d.jsx)("span",{className:"text-zinc-600",children:"\uD83D\uDCC5"}),(0,d.jsx)("span",{children:i})]}),(0,d.jsxs)("div",{className:"flex items-center gap-2",children:[(0,d.jsx)("span",{className:"text-zinc-600",children:"\uD83D\uDC64"}),(0,d.jsx)("span",{children:"MZPrimer Team"})]}),(0,d.jsxs)("div",{className:"flex items-center gap-2",children:[(0,d.jsx)("span",{className:"text-zinc-600",children:"⏱️"}),(0,d.jsxs)("span",{children:[Math.max(1,Math.ceil(g.content.split(/\s+/).length/200))," min read"]})]}),g.lang&&(0,d.jsxs)("div",{className:"flex items-center gap-2",children:[(0,d.jsx)("span",{className:"text-zinc-600",children:"\uD83C\uDF10"}),(0,d.jsx)("span",{className:"uppercase",children:(b=g.lang)?"en"===b?"English":"العربية":"English"})]})]}),(0,d.jsx)("div",{className:"text-lg text-zinc-300 italic border-l-4 border-blue-500 pl-4 py-2 mb-8",children:g.description})]}),(0,d.jsx)("article",{className:"prose prose-invert prose-lg max-w-none",dangerouslySetInnerHTML:{__html:g.content}}),(0,d.jsxs)("div",{className:"mt-12 pt-8 border-t border-zinc-800",children:[(0,d.jsx)("h3",{className:"text-xl font-bold mb-4",children:"Enjoyed this article?"}),(0,d.jsx)("p",{className:"text-zinc-400 mb-6",children:"Check out more trading guides and market analysis."}),(0,d.jsx)(h(),{href:"/blog",className:"inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-full transition",children:"Explore More Articles →"})]}),(0,d.jsx)("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify({"@context":"https://schema.org","@type":"BlogPosting",headline:g.title,description:g.description,datePublished:g.date||new Date().toISOString(),dateModified:g.date||new Date().toISOString(),author:{"@type":"Person",name:"MZPrimer Team"},publisher:{"@type":"Organization",name:"MZPrimer",logo:{"@type":"ImageObject",url:"https://mzprimer.com/logo.png"}},image:g.image?`https://mzprimer.com${g.image}`:void 0,mainEntityOfPage:{"@type":"WebPage","@id":`https://mzprimer.com/blog/${g.slug}`}})}})]})}},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},63059:(a,b,c)=>{"use strict";Object.defineProperty(b,"__esModule",{value:!0});var d={default:function(){return i},useLinkStatus:function(){return h.useLinkStatus}};for(var e in d)Object.defineProperty(b,e,{enumerable:!0,get:d[e]});let f=c(7904),g=c(5735),h=f._(c(23318));function i(a){let b=a.legacyBehavior,c="string"==typeof a.children||"number"==typeof a.children||"string"==typeof a.children?.type,d=a.children?.type?.$$typeof===Symbol.for("react.client.reference");return!b||c||d||(a.children?.type?.$$typeof===Symbol.for("react.lazy")?console.error("Using a Lazy Component as a direct child of `<Link legacyBehavior>` from a Server Component is not supported. If you need legacyBehavior, wrap your Lazy Component in a Client Component that renders the Link's `<a>` tag."):console.error("Using a Server Component as a direct child of `<Link legacyBehavior>` is not supported. If you need legacyBehavior, wrap your Server Component in a Client Component that renders the Link's `<a>` tag.")),(0,g.jsx)(h.default,{...a})}("function"==typeof b.default||"object"==typeof b.default&&null!==b.default)&&void 0===b.default.__esModule&&(Object.defineProperty(b.default,"__esModule",{value:!0}),Object.assign(b.default,b),a.exports=b.default)},66610:(a,b,c)=>{"use strict";Object.defineProperty(b,"__esModule",{value:!0});var d={ReadonlyURLSearchParams:function(){return f.ReadonlyURLSearchParams},RedirectType:function(){return h.RedirectType},forbidden:function(){return j.forbidden},notFound:function(){return i.notFound},permanentRedirect:function(){return g.permanentRedirect},redirect:function(){return g.redirect},unauthorized:function(){return k.unauthorized},unstable_isUnrecognizedActionError:function(){return m},unstable_rethrow:function(){return l.unstable_rethrow}};for(var e in d)Object.defineProperty(b,e,{enumerable:!0,get:d[e]});let f=c(10381),g=c(32171),h=c(52220),i=c(52283),j=c(92606),k=c(44057),l=c(98621);function m(){throw Object.defineProperty(Error("`unstable_isUnrecognizedActionError` can only be used on the client."),"__NEXT_ERROR_CODE",{value:"E776",enumerable:!1,configurable:!0})}("function"==typeof b.default||"object"==typeof b.default&&null!==b.default)&&void 0===b.default.__esModule&&(Object.defineProperty(b.default,"__esModule",{value:!0}),Object.assign(b.default,b),a.exports=b.default)},70722:a=>{"use strict";a.exports=require("next/dist/shared/lib/invariant-error")},77068:a=>{"use strict";a.exports=require("next/dist/shared/lib/size-limit")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},92606:(a,b,c)=>{"use strict";function d(){throw Object.defineProperty(Error("`forbidden()` is experimental and only allowed to be enabled when `experimental.authInterrupts` is enabled."),"__NEXT_ERROR_CODE",{value:"E488",enumerable:!1,configurable:!0})}Object.defineProperty(b,"__esModule",{value:!0}),Object.defineProperty(b,"forbidden",{enumerable:!0,get:function(){return d}}),c(7638).HTTP_ERROR_FALLBACK_ERROR_CODE,("function"==typeof b.default||"object"==typeof b.default&&null!==b.default)&&void 0===b.default.__esModule&&(Object.defineProperty(b.default,"__esModule",{value:!0}),Object.assign(b.default,b),a.exports=b.default)},98621:(a,b,c)=>{"use strict";Object.defineProperty(b,"__esModule",{value:!0}),Object.defineProperty(b,"unstable_rethrow",{enumerable:!0,get:function(){return d}});let d=c(108).unstable_rethrow;("function"==typeof b.default||"object"==typeof b.default&&null!==b.default)&&void 0===b.default.__esModule&&(Object.defineProperty(b.default,"__esModule",{value:!0}),Object.assign(b.default,b),a.exports=b.default)}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[179,471,961,684],()=>b(b.s=26298));module.exports=c})();