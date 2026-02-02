(()=>{var a={};a.id=714,a.ids=[714],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},5118:(a,b,c)=>{Promise.resolve().then(c.bind(c,49841))},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},15273:(a,b,c)=>{"use strict";c.d(b,{A:()=>d});let d=(0,c(76773).A)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]])},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},25988:(a,b,c)=>{"use strict";c.r(b),c.d(b,{GlobalError:()=>D.a,__next_app__:()=>L,handler:()=>N,routeModule:()=>M});var d=c(7553),e=c(84006),f=c(67798),g=c(34775),h=c(99373),i=c(73461),j=c(1020),k=c(26349),l=c(54365),m=c(16023),n=c(63747),o=c(24235),p=c(23938),q=c(261),r=c(66758),s=c(77243),t=c(26713),u=c(37527),v=c(22820),w=c(88216),x=c(47929),y=c(79551),z=c(89125),A=c(86439),B=c(77068),C=c(95547),D=c.n(C),E=c(61287),F=c(81494),G=c(70722),H=c(70753),I=c(43954),J={};for(let a in E)0>["default","GlobalError","__next_app__","routeModule","handler"].indexOf(a)&&(J[a]=()=>E[a]);c.d(b,J);let K={children:["",{children:["client",{children:["dashboard",{children:["refer",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(c.bind(c,40119)),"/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /app/client/dashboard/refer/page.tsx"]}]},{}]},{}]},{}]},{layout:[()=>Promise.resolve().then(c.bind(c,32056)),"/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /app/layout.tsx"],"global-error":[()=>Promise.resolve().then(c.t.bind(c,95547,23)),"next/dist/client/components/builtin/global-error.js"],"not-found":[()=>Promise.resolve().then(c.t.bind(c,55091,23)),"next/dist/client/components/builtin/not-found.js"],forbidden:[()=>Promise.resolve().then(c.t.bind(c,45270,23)),"next/dist/client/components/builtin/forbidden.js"],unauthorized:[()=>Promise.resolve().then(c.t.bind(c,28193,23)),"next/dist/client/components/builtin/unauthorized.js"]}]}.children,L={require:c,loadChunk:()=>Promise.resolve()},M=new d.AppPageRouteModule({definition:{kind:e.RouteKind.APP_PAGE,page:"/client/dashboard/refer/page",pathname:"/client/dashboard/refer",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:K},distDir:".next",relativeProjectDir:""});async function N(a,b,d){var C;M.isDev&&(0,h.addRequestMeta)(a,"devRequestTimingInternalsEnd",process.hrtime.bigint());let J=!!(0,h.getRequestMeta)(a,"minimalMode"),O="/client/dashboard/refer/page";"/index"===O&&(O="/");let P=await M.prepare(a,b,{srcPage:O,multiZoneDraftMode:!1});if(!P)return b.statusCode=400,b.end("Bad Request"),null==d.waitUntil||d.waitUntil.call(d,Promise.resolve()),null;let{buildId:Q,query:R,params:S,pageIsDynamic:T,buildManifest:U,nextFontManifest:V,reactLoadableManifest:W,serverActionsManifest:X,clientReferenceManifest:Y,subresourceIntegrityManifest:Z,prerenderManifest:$,isDraftMode:_,resolvedPathname:aa,revalidateOnlyGenerated:ab,routerServerContext:ac,nextConfig:ad,parsedUrl:ae,interceptionRoutePatterns:af,deploymentId:ag}=P,ah=(0,q.normalizeAppPath)(O),{isOnDemandRevalidate:ai}=P,aj=ad.experimental.ppr&&!ad.cacheComponents&&(0,I.isInterceptionRouteAppPath)(aa)?null:M.match(aa,$),ak=!!$.routes[aa],al=a.headers["user-agent"]||"",am=(0,t.getBotType)(al),an=(0,p.isHtmlBotRequest)(a),ao=(0,h.getRequestMeta)(a,"isPrefetchRSCRequest")??"1"===a.headers[s.NEXT_ROUTER_PREFETCH_HEADER],ap=(0,h.getRequestMeta)(a,"isRSCRequest")??!!a.headers[s.RSC_HEADER],aq=(0,r.getIsPossibleServerAction)(a),ar=(0,m.checkIsAppPPREnabled)(ad.experimental.ppr);if(!(0,h.getRequestMeta)(a,"postponed")&&ar&&"1"===a.headers[x.NEXT_RESUME_HEADER]&&"POST"===a.method){let b=[];for await(let c of a)b.push(c);let c=Buffer.concat(b).toString("utf8");(0,h.addRequestMeta)(a,"postponed",c)}let as=ar&&(null==(C=$.routes[ah]??$.dynamicRoutes[ah])?void 0:C.renderingMode)==="PARTIALLY_STATIC",at=!1,au=!1,av=as?(0,h.getRequestMeta)(a,"postponed"):void 0,aw=as&&ap&&!ao;J&&(aw=aw&&!!av);let ax=(0,h.getRequestMeta)(a,"segmentPrefetchRSCRequest"),ay=(!an||!as)&&(!al||(0,p.shouldServeStreamingMetadata)(al,ad.htmlLimitedBots)),az=!!((aj||ak||$.routes[ah])&&!(an&&as)),aA=as&&!0===ad.cacheComponents,aB=!0===M.isDev||!az||"string"==typeof av||(aA&&(0,h.getRequestMeta)(a,"onCacheEntryV2")?aw&&!J:aw),aC=an&&as,aD=null;_||!az||aB||aq||av||aw||(aD=aa);let aE=aD;!aE&&M.isDev&&(aE=aa),M.isDev||_||!az||!ap||aw||(0,k.d)(a.headers);let aF={...E,tree:K,GlobalError:D(),handler:N,routeModule:M,__next_app__:L};X&&Y&&(0,o.setManifestsSingleton)({page:O,clientReferenceManifest:Y,serverActionsManifest:X});let aG=a.method||"GET",aH=(0,g.getTracer)(),aI=aH.getActiveScopeSpan(),aJ=async()=>((null==ac?void 0:ac.render404)?await ac.render404(a,b,ae,!1):b.end("This page could not be found"),null);try{let f=M.getVaryHeader(aa,af);b.setHeader("Vary",f);let k=async(c,d)=>{let e=new l.NodeNextRequest(a),f=new l.NodeNextResponse(b);return M.render(e,f,d).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let a=aH.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==i.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let d=a.get("next.route");if(d){let a=`${aG} ${d}`;c.setAttributes({"next.route":d,"http.route":d,"next.span_name":a}),c.updateName(a)}else c.updateName(`${aG} ${O}`)})},m=(0,h.getRequestMeta)(a,"incrementalCache"),o=async({span:e,postponed:f,fallbackRouteParams:g,forceStaticRender:i})=>{let l={query:R,params:S,page:ah,sharedContext:{buildId:Q},serverComponentsHmrCache:(0,h.getRequestMeta)(a,"serverComponentsHmrCache"),fallbackRouteParams:g,renderOpts:{App:()=>null,Document:()=>null,pageConfig:{},ComponentMod:aF,Component:(0,j.T)(aF),params:S,routeModule:M,page:O,postponed:f,shouldWaitOnAllReady:aC,serveStreamingMetadata:ay,supportsDynamicResponse:"string"==typeof f||aB,buildManifest:U,nextFontManifest:V,reactLoadableManifest:W,subresourceIntegrityManifest:Z,setCacheStatus:null==ac?void 0:ac.setCacheStatus,setIsrStatus:null==ac?void 0:ac.setIsrStatus,setReactDebugChannel:null==ac?void 0:ac.setReactDebugChannel,sendErrorsToBrowser:null==ac?void 0:ac.sendErrorsToBrowser,dir:c(33873).join(process.cwd(),M.relativeProjectDir),isDraftMode:_,botType:am,isOnDemandRevalidate:ai,isPossibleServerAction:aq,assetPrefix:ad.assetPrefix,nextConfigOutput:ad.output,crossOrigin:ad.crossOrigin,trailingSlash:ad.trailingSlash,images:ad.images,previewProps:$.preview,deploymentId:ag,enableTainting:ad.experimental.taint,htmlLimitedBots:ad.htmlLimitedBots,reactMaxHeadersLength:ad.reactMaxHeadersLength,multiZoneDraftMode:!1,incrementalCache:m,cacheLifeProfiles:ad.cacheLife,basePath:ad.basePath,serverActions:ad.experimental.serverActions,...at||au?{nextExport:!0,supportsDynamicResponse:!1,isStaticGeneration:!0,isDebugDynamicAccesses:at}:{},cacheComponents:!!ad.cacheComponents,experimental:{isRoutePPREnabled:as,expireTime:ad.expireTime,staleTimes:ad.experimental.staleTimes,dynamicOnHover:!!ad.experimental.dynamicOnHover,inlineCss:!!ad.experimental.inlineCss,authInterrupts:!!ad.experimental.authInterrupts,clientTraceMetadata:ad.experimental.clientTraceMetadata||[],clientParamParsingOrigins:ad.experimental.clientParamParsingOrigins,maxPostponedStateSizeBytes:(0,B.parseMaxPostponedStateSize)(ad.experimental.maxPostponedStateSize)},waitUntil:d.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:()=>{},onInstrumentationRequestError:(b,c,d,e)=>M.onRequestError(a,b,d,e,ac),err:(0,h.getRequestMeta)(a,"invokeError"),dev:M.isDev}};at&&(l.renderOpts.nextExport=!0,l.renderOpts.supportsDynamicResponse=!1,l.renderOpts.isDebugDynamicAccesses=at),i&&(l.renderOpts.supportsDynamicResponse=!1);let n=await k(e,l),{metadata:o}=n,{cacheControl:p,headers:q={},fetchTags:r,fetchMetrics:s}=o;if(r&&(q[x.NEXT_CACHE_TAGS_HEADER]=r),a.fetchMetrics=s,az&&(null==p?void 0:p.revalidate)===0&&!M.isDev&&!as){let a=o.staticBailoutInfo,b=Object.defineProperty(Error(`Page changed from static to dynamic at runtime ${aa}${(null==a?void 0:a.description)?`, reason: ${a.description}`:""}
see more here https://nextjs.org/docs/messages/app-static-to-dynamic-error`),"__NEXT_ERROR_CODE",{value:"E132",enumerable:!1,configurable:!0});if(null==a?void 0:a.stack){let c=a.stack;b.stack=b.message+c.substring(c.indexOf("\n"))}throw b}return{value:{kind:u.CachedRouteKind.APP_PAGE,html:n,headers:q,rscData:o.flightData,postponed:o.postponed,status:o.statusCode,segmentData:o.segmentData},cacheControl:p}},p=async({hasResolved:c,previousCacheEntry:f,isRevalidating:g,span:i,forceStaticRender:j=!1})=>{let k,l=!1===M.isDev,q=c||b.writableEnded;if(ai&&ab&&!f&&!J)return(null==ac?void 0:ac.render404)?await ac.render404(a,b):(b.statusCode=404,b.end("This page could not be found")),null;if(aj&&(k=(0,v.parseFallbackField)(aj.fallback)),k===v.FallbackMode.PRERENDER&&(0,t.isBot)(al)&&(!as||an)&&(k=v.FallbackMode.BLOCKING_STATIC_RENDER),(null==f?void 0:f.isStale)===-1&&(ai=!0),ai&&(k!==v.FallbackMode.NOT_FOUND||f)&&(k=v.FallbackMode.BLOCKING_STATIC_RENDER),!J&&k!==v.FallbackMode.BLOCKING_STATIC_RENDER&&aE&&!q&&!_&&T&&(l||!ak)){if((l||aj)&&k===v.FallbackMode.NOT_FOUND){if(ad.experimental.adapterPath)return await aJ();throw new A.NoFallbackError}if(as&&(ad.cacheComponents?!aw:!ap)){let b=l&&"string"==typeof(null==aj?void 0:aj.fallback)?aj.fallback:ah,c=l&&(null==aj?void 0:aj.fallbackRouteParams)?(0,n.createOpaqueFallbackRouteParams)(aj.fallbackRouteParams):au?(0,n.getFallbackRouteParams)(ah,M):null,f=await M.handleResponse({cacheKey:b,req:a,nextConfig:ad,routeKind:e.RouteKind.APP_PAGE,isFallback:!0,prerenderManifest:$,isRoutePPREnabled:as,responseGenerator:async()=>o({span:i,postponed:void 0,fallbackRouteParams:c,forceStaticRender:!1}),waitUntil:d.waitUntil,isMinimalMode:J});if(null===f)return null;if(f)return delete f.cacheControl,f}}let r=ai||g||!av?void 0:av;if(aA&&!J&&m&&aw&&!j){let b=await m.get(aa,{kind:u.IncrementalCacheKind.APP_PAGE,isRoutePPREnabled:!0,isFallback:!1});b&&b.value&&b.value.kind===u.CachedRouteKind.APP_PAGE&&(r=b.value.postponed,b&&(-1===b.isStale||!0===b.isStale)&&(0,H.scheduleOnNextTick)(async()=>{let b=M.getResponseCache(a);try{await b.revalidate(aa,m,as,!1,a=>p({...a,forceStaticRender:!0}),null,c,d.waitUntil)}catch(a){console.error("Error revalidating the page in the background",a)}}))}if(at&&void 0!==r)return{cacheControl:{revalidate:1,expire:void 0},value:{kind:u.CachedRouteKind.PAGES,html:w.default.EMPTY,pageData:{},headers:void 0,status:void 0}};let s=l&&(null==aj?void 0:aj.fallbackRouteParams)&&(0,h.getRequestMeta)(a,"renderFallbackShell")?(0,n.createOpaqueFallbackRouteParams)(aj.fallbackRouteParams):au?(0,n.getFallbackRouteParams)(ah,M):null;return o({span:i,postponed:r,fallbackRouteParams:s,forceStaticRender:j})},q=async c=>{var f,g,i,j,k;let l,m=await M.handleResponse({cacheKey:aD,responseGenerator:a=>p({span:c,...a}),routeKind:e.RouteKind.APP_PAGE,isOnDemandRevalidate:ai,isRoutePPREnabled:as,req:a,nextConfig:ad,prerenderManifest:$,waitUntil:d.waitUntil,isMinimalMode:J});if(_&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate"),M.isDev&&b.setHeader("Cache-Control","no-store, must-revalidate"),!m){if(aD)throw Object.defineProperty(Error("invariant: cache entry required but not generated"),"__NEXT_ERROR_CODE",{value:"E62",enumerable:!1,configurable:!0});return null}if((null==(f=m.value)?void 0:f.kind)!==u.CachedRouteKind.APP_PAGE)throw Object.defineProperty(Error(`Invariant app-page handler received invalid cache entry ${null==(i=m.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E707",enumerable:!1,configurable:!0});let n="string"==typeof m.value.postponed;az&&!aw&&(!n||ao)&&(J||b.setHeader("x-nextjs-cache",ai?"REVALIDATED":m.isMiss?"MISS":m.isStale?"STALE":"HIT"),b.setHeader(s.NEXT_IS_PRERENDER_HEADER,"1"));let{value:q}=m;if(av)l={revalidate:0,expire:void 0};else if(aw)l={revalidate:0,expire:void 0};else if(!M.isDev)if(_)l={revalidate:0,expire:void 0};else if(az){if(m.cacheControl)if("number"==typeof m.cacheControl.revalidate){if(m.cacheControl.revalidate<1)throw Object.defineProperty(Error(`Invalid revalidate configuration provided: ${m.cacheControl.revalidate} < 1`),"__NEXT_ERROR_CODE",{value:"E22",enumerable:!1,configurable:!0});l={revalidate:m.cacheControl.revalidate,expire:(null==(j=m.cacheControl)?void 0:j.expire)??ad.expireTime}}else l={revalidate:x.CACHE_ONE_YEAR,expire:void 0}}else b.getHeader("Cache-Control")||(l={revalidate:0,expire:void 0});if(m.cacheControl=l,"string"==typeof ax&&(null==q?void 0:q.kind)===u.CachedRouteKind.APP_PAGE&&q.segmentData){b.setHeader(s.NEXT_DID_POSTPONE_HEADER,"2");let c=null==(k=q.headers)?void 0:k[x.NEXT_CACHE_TAGS_HEADER];J&&az&&c&&"string"==typeof c&&b.setHeader(x.NEXT_CACHE_TAGS_HEADER,c);let d=q.segmentData.get(ax);return void 0!==d?(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:w.default.fromStatic(d,s.RSC_CONTENT_TYPE_HEADER),cacheControl:m.cacheControl}):(b.statusCode=204,(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:w.default.EMPTY,cacheControl:m.cacheControl}))}let r=aA?(0,h.getRequestMeta)(a,"onCacheEntryV2")??(0,h.getRequestMeta)(a,"onCacheEntry"):(0,h.getRequestMeta)(a,"onCacheEntry");if(r&&await r(m,{url:(0,h.getRequestMeta)(a,"initURL")??a.url}))return null;if(q.headers){let a={...q.headers};for(let[c,d]of(J&&az||delete a[x.NEXT_CACHE_TAGS_HEADER],Object.entries(a)))if(void 0!==d)if(Array.isArray(d))for(let a of d)b.appendHeader(c,a);else"number"==typeof d&&(d=d.toString()),b.appendHeader(c,d)}let t=null==(g=q.headers)?void 0:g[x.NEXT_CACHE_TAGS_HEADER];if(J&&az&&t&&"string"==typeof t&&b.setHeader(x.NEXT_CACHE_TAGS_HEADER,t),!q.status||ap&&as||(b.statusCode=q.status),!J&&q.status&&F.RedirectStatusCode[q.status]&&ap&&(b.statusCode=200),n&&!aw&&b.setHeader(s.NEXT_DID_POSTPONE_HEADER,"1"),ap&&!_){if(void 0===q.rscData){if(q.html.contentType!==s.RSC_CONTENT_TYPE_HEADER)if(ad.cacheComponents)return b.statusCode=404,(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:w.default.EMPTY,cacheControl:m.cacheControl});else throw Object.defineProperty(new G.InvariantError(`Expected RSC response, got ${q.html.contentType}`),"__NEXT_ERROR_CODE",{value:"E789",enumerable:!1,configurable:!0});return(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:q.html,cacheControl:m.cacheControl})}return(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:w.default.fromStatic(q.rscData,s.RSC_CONTENT_TYPE_HEADER),cacheControl:m.cacheControl})}let v=q.html;if(!n||J||ap)return(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:v,cacheControl:m.cacheControl});if(at)return v.push(new ReadableStream({start(a){a.enqueue(y.ENCODED_TAGS.CLOSED.BODY_AND_HTML),a.close()}})),(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:v,cacheControl:{revalidate:0,expire:void 0}});let A=new TransformStream;return v.push(A.readable),o({span:c,postponed:q.postponed,fallbackRouteParams:null,forceStaticRender:!1}).then(async a=>{var b,c;if(!a)throw Object.defineProperty(Error("Invariant: expected a result to be returned"),"__NEXT_ERROR_CODE",{value:"E463",enumerable:!1,configurable:!0});if((null==(b=a.value)?void 0:b.kind)!==u.CachedRouteKind.APP_PAGE)throw Object.defineProperty(Error(`Invariant: expected a page response, got ${null==(c=a.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E305",enumerable:!1,configurable:!0});await a.value.html.pipeTo(A.writable)}).catch(a=>{A.writable.abort(a).catch(a=>{console.error("couldn't abort transformer",a)})}),(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:v,cacheControl:{revalidate:0,expire:void 0}})};if(!aI)return await aH.withPropagatedContext(a.headers,()=>aH.trace(i.BaseServerSpan.handleRequest,{spanName:`${aG} ${O}`,kind:g.SpanKind.SERVER,attributes:{"http.method":aG,"http.target":a.url}},q));await q(aI)}catch(b){throw b instanceof A.NoFallbackError||await M.onRequestError(a,b,{routerKind:"App Router",routePath:O,routeType:"render",revalidateReason:(0,f.c)({isStaticGeneration:az,isOnDemandRevalidate:ai})},!1,ac),b}}},26713:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/is-bot")},28354:a=>{"use strict";a.exports=require("util")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:a=>{"use strict";a.exports=require("path")},40119:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>f,dynamic:()=>e});var d=c(77943);let e=(0,d.registerClientReference)(function(){throw Error("Attempted to call dynamic() from the server but dynamic is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /app/client/dashboard/refer/page.tsx","dynamic"),f=(0,d.registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /app/client/dashboard/refer/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /app/client/dashboard/refer/page.tsx","default")},41025:a=>{"use strict";a.exports=require("next/dist/server/app-render/dynamic-access-async-storage.external.js")},43954:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/interception-routes")},49841:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>p,dynamic:()=>o});var d=c(48249),e=c(67484),f=c(19099),g=c(76773);let h=(0,g.A)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]),i=(0,g.A)("gift",[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]]);var j=c(15273),k=c(61686);let l=(0,g.A)("users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]);var m=c(95801),n=c(66865);let o="force-dynamic";function p(){let a=(0,f.useRouter)(),[b,c]=(0,e.useState)(null),[g,o]=(0,e.useState)(""),[p,q]=(0,e.useState)({count:0,earned:0}),[r,s]=(0,e.useState)(!0),[t,u]=(0,e.useState)(""),[v,w]=(0,e.useState)(!1),x=async a=>{try{let b=await fetch(`/api/user/referral-stats?userId=${a}`);if(b.ok){let a=await b.json();a.success&&q({count:a.referralCount||0,earned:5*(a.referralCount||0)})}}catch(a){console.error("Error fetching referral stats:",a)}},y=`https://mzprimer.com/register?ref=${g}`,z=()=>{navigator.clipboard.writeText(y),n.Ay.success("Link copied!")},A=async()=>{if(navigator.share)try{await navigator.share({title:"MZPrimer AI Trading",text:"Join me on MZPrimer and get free AI trading setups!",url:y})}catch(a){console.log("Share failed",a)}else z()},B=async()=>{if(!t||t.length<5)return n.Ay.error("Invalid code");if(!b)return n.Ay.error("You must be logged in");w(!0);try{let a=await fetch("/api/referral/redeem",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("cf_token")}`},body:JSON.stringify({userId:b.id,referralCode:t.trim()})}),c=await a.json();a.ok?(n.Ay.success("\uD83C\uDF89 Referral Redeemed!"),x(b.id)):n.Ay.error(c.error||"Failed to redeem")}catch(a){n.Ay.error("Network error")}finally{w(!1)}};return r?(0,d.jsx)("div",{className:"min-h-[50vh] flex items-center justify-center text-zinc-500",children:"Loading..."}):(0,d.jsxs)("div",{className:"referral-container relative",children:[(0,d.jsx)("div",{className:"referral-back-wrapper",children:(0,d.jsxs)("button",{onClick:()=>a.push("/client/dashboard"),className:"btn-referral-back",children:[(0,d.jsx)(h,{size:18}),(0,d.jsx)("span",{className:"back-text",children:"Dashboard"})]})}),(0,d.jsxs)("div",{className:"referral-header mt-12 md:mt-0",children:[(0,d.jsxs)("h1",{className:"referral-title",children:[(0,d.jsx)(i,{className:"text-yellow-500",size:32}),"Refer & Earn"]}),(0,d.jsxs)("p",{className:"referral-subtitle",children:["Invite friends. Get ",(0,d.jsx)("span",{className:"text-green-400 font-bold",children:"+5 Setups"})," for each join."]})]}),(0,d.jsxs)("div",{className:"referral-hero-card",children:[(0,d.jsx)("h3",{className:"referral-hero-label",children:"Your Unique Referral Link"}),(0,d.jsxs)("div",{className:"referral-link-box",children:[(0,d.jsx)("div",{className:"referral-input-readonly",children:y}),(0,d.jsxs)("div",{className:"flex gap-2 w-full md:w-auto",children:[(0,d.jsxs)("button",{onClick:z,className:"btn-referral-copy",children:[(0,d.jsx)(j.A,{size:18})," ",(0,d.jsx)("span",{className:"hidden md:inline",children:"Copy Link"}),(0,d.jsx)("span",{className:"md:hidden",children:"Copy"})]}),(0,d.jsx)("button",{onClick:A,className:"btn-referral-share",children:(0,d.jsx)(k.A,{size:18})})]})]})]}),(0,d.jsxs)("div",{className:"referral-stats-grid",children:[(0,d.jsxs)("div",{className:"stat-card",children:[(0,d.jsxs)("div",{children:[(0,d.jsx)("p",{className:"stat-label",children:"Friends Joined"}),(0,d.jsx)("h2",{className:"stat-value",children:p.count})]}),(0,d.jsx)("div",{className:"stat-icon-circle icon-blue",children:(0,d.jsx)(l,{size:32})})]}),(0,d.jsxs)("div",{className:"stat-card",children:[(0,d.jsxs)("div",{children:[(0,d.jsx)("p",{className:"stat-label",children:"Credits Earned"}),(0,d.jsxs)("h2",{className:"stat-value highlight",children:["+",p.earned]})]}),(0,d.jsx)("div",{className:"stat-icon-circle icon-green",children:(0,d.jsx)(m.A,{size:32})})]})]}),(0,d.jsxs)("div",{className:"referral-redeem-card",children:[(0,d.jsx)("h3",{className:"redeem-title",children:"Received a code from a friend?"}),(0,d.jsxs)("div",{className:"redeem-form",children:[(0,d.jsx)("input",{type:"text",placeholder:"Enter Referral Code",className:"referral-input-field",value:t,onChange:a=>u(a.target.value)}),(0,d.jsx)("button",{onClick:B,disabled:v||!b,className:"btn-redeem",children:v?"...":"Redeem"})]}),!b&&(0,d.jsx)("p",{className:"text-sm text-zinc-500 mt-2 text-center",children:"You need to be logged in to redeem a referral code."})]})]})}},58262:(a,b,c)=>{Promise.resolve().then(c.bind(c,40119))},61686:(a,b,c)=>{"use strict";c.d(b,{A:()=>d});let d=(0,c(76773).A)("share-2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]])},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},66865:(a,b,c)=>{"use strict";let d;c.d(b,{Ay:()=>M});var e,f=c(67484);let g={data:""},h=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,i=/\/\*[^]*?\*\/|  +/g,j=/\n+/g,k=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?k(g,f):f+"{"+k(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=k(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f=/^--/.test(f)?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=k.p?k.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},l={},m=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+m(a[c]);return b}return a};function n(a){let b,c,d=this||{},e=a.call?a(d.p):a;return((a,b,c,d,e)=>{var f;let g=m(a),n=l[g]||(l[g]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(g));if(!l[n]){let b=g!==a?a:(a=>{let b,c,d=[{}];for(;b=h.exec(a.replace(i,""));)b[4]?d.shift():b[3]?(c=b[3].replace(j," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(j," ").trim();return d[0]})(a);l[n]=k(e?{["@keyframes "+n]:b}:b,c?"":"."+n)}let o=c&&l.g?l.g:null;return c&&(l.g=l[n]),f=l[n],o?b.data=b.data.replace(o,f):-1===b.data.indexOf(f)&&(b.data=d?f+b.data:b.data+f),n})(e.unshift?e.raw?(b=[].slice.call(arguments,1),c=d.p,e.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":k(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):e.reduce((a,b)=>Object.assign(a,b&&b.call?b(d.p):b),{}):e,(a=>{if("object"==typeof window){let b=(a?a.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return b.nonce=window.__nonce__,b.parentNode||(a||document.head).appendChild(b),b.firstChild}return a||g})(d.target),d.g,d.o,d.k)}n.bind({g:1});let o,p,q,r=n.bind({k:1});function s(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:p&&p()},h),c.o=/ *go\d+/.test(i),h.className=n.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),q&&j[0]&&q(h),o(j,h)}return b?b(e):e}}var t=(a,b)=>"function"==typeof a?a(b):a,u=(d=0,()=>(++d).toString()),v="default",w=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return w(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},x=[],y={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},z={},A=(a,b=v)=>{z[b]=w(z[b]||y,a),x.forEach(([a,c])=>{a===b&&c(z[b])})},B=a=>Object.keys(z).forEach(b=>A(a,b)),C=(a=v)=>b=>{A(b,a)},D=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||u()}))(b,a,c);return C(e.toasterId||(d=e.id,Object.keys(z).find(a=>z[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},E=(a,b)=>D("blank")(a,b);E.error=D("error"),E.success=D("success"),E.loading=D("loading"),E.custom=D("custom"),E.dismiss=(a,b)=>{let c={type:3,toastId:a};b?C(b)(c):B(c)},E.dismissAll=a=>E.dismiss(void 0,a),E.remove=(a,b)=>{let c={type:4,toastId:a};b?C(b)(c):B(c)},E.removeAll=a=>E.remove(void 0,a),E.promise=(a,b,c)=>{let d=E.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?t(b.success,a):void 0;return e?E.success(e,{id:d,...c,...null==c?void 0:c.success}):E.dismiss(d),a}).catch(a=>{let e=b.error?t(b.error,a):void 0;e?E.error(e,{id:d,...c,...null==c?void 0:c.error}):E.dismiss(d)}),a};var F=r`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,G=r`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,H=r`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`;s("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${F} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${G} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${a=>a.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${H} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`;var I=r`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;s("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${a=>a.secondary||"#e0e0e0"};
  border-right-color: ${a=>a.primary||"#616161"};
  animation: ${I} 1s linear infinite;
`;var J=r`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,K=r`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`;s("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${J} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${K} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${a=>a.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,s("div")`
  position: absolute;
`,s("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`;var L=r`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`;s("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${L} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,s("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,s("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,e=f.createElement,k.p=void 0,o=e,p=void 0,q=void 0,n`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var M=E},70722:a=>{"use strict";a.exports=require("next/dist/shared/lib/invariant-error")},77068:a=>{"use strict";a.exports=require("next/dist/shared/lib/size-limit")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},95801:(a,b,c)=>{"use strict";c.d(b,{A:()=>d});let d=(0,c(76773).A)("zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]])}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[179,471,961,684],()=>b(b.s=25988));module.exports=c})();