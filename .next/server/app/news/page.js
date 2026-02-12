(()=>{var a={};a.id=324,a.ids=[324],a.modules={221:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>d});let d=(0,c(77943).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /app/news/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /app/news/page.tsx","default")},261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10316:(a,b,c)=>{"use strict";c.d(b,{A:()=>d});let d=(0,c(76773).A)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]])},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},25324:(a,b,c)=>{Promise.resolve().then(c.bind(c,221))},26713:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/is-bot")},28354:a=>{"use strict";a.exports=require("util")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},31724:(a,b,c)=>{"use strict";c.d(b,{A:()=>d});let d=(0,c(76773).A)("arrow-right",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]])},32451:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>j});var d=c(48249),e=c(67484),f=c(10316),g=c(41023),h=c(31724),i=c(56287);function j(){let[a,b]=(0,e.useState)([]),[c,j]=(0,e.useState)([]),[k,l]=(0,e.useState)(""),[m,n]=(0,e.useState)(null),[o,p]=(0,e.useState)(!0);return o?(0,d.jsx)("div",{className:"news-page-wrapper pt-40 text-center text-zinc-500 uppercase tracking-widest",children:"Loading Intelligence..."}):(0,d.jsxs)("div",{className:"news-page-wrapper",children:[(0,d.jsxs)("header",{className:"news-header-section",children:[(0,d.jsx)("span",{className:"news-sub-label",children:"Fundamental Analysis"}),(0,d.jsx)("h1",{className:"news-main-title",children:"Intelligence Feed"})]}),(0,d.jsxs)("div",{className:"news-search-container",children:[(0,d.jsx)(f.A,{size:18,className:"text-zinc-600 ml-2"}),(0,d.jsx)("input",{type:"text",placeholder:"Filter intel feed...",className:"news-search-input",value:k,onChange:a=>l(a.target.value)})]}),(0,d.jsx)("div",{className:"news-grid-layout",children:c.map(a=>{var b;let c;return(0,d.jsxs)("div",{className:"pro-news-card",onClick:()=>n(a),children:[(0,d.jsxs)("div",{className:"pro-card-header",children:[(0,d.jsxs)("div",{className:`pro-card-symbol ${(c=(a.category||"").toLowerCase()).includes("forex")?"cat-forex":c.includes("crypto")?"cat-crypto":c.includes("commodities")||c.includes("gold")||c.includes("oil")?"cat-commodities":c.includes("macro")||c.includes("geopolitics")?"cat-macro":c.includes("stock")||c.includes("equities")?"cat-stocks":"cat-tag"}`,children:[(0,d.jsx)(g.A,{size:10}),a.symbol]}),a.date&&(0,d.jsx)("div",{className:"pro-card-date",children:(b=a.date)?new Date(b).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}).toUpperCase():""})]}),(0,d.jsx)("h2",{className:"pro-card-headline",children:a.headline}),(0,d.jsxs)("div",{className:"pro-card-footer",children:[(0,d.jsx)("div",{className:"pro-card-meta",children:a.category||"MARKET"}),(0,d.jsxs)("div",{className:"pro-card-action flex items-center gap-1 uppercase",children:["Analysis ",(0,d.jsx)(h.A,{size:12})]})]})]},a.id)})}),m&&(0,d.jsx)(i.A,{data:m,onClose:()=>n(null)})]})}},33873:a=>{"use strict";a.exports=require("path")},41023:(a,b,c)=>{"use strict";c.d(b,{A:()=>d});let d=(0,c(76773).A)("globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]])},41025:a=>{"use strict";a.exports=require("next/dist/server/app-render/dynamic-access-async-storage.external.js")},43954:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/interception-routes")},56287:(a,b,c)=>{"use strict";c.d(b,{A:()=>j});var d=c(48249),e=c(67484),f=c(46674),g=c(99160);let h=(0,c(76773).A)("chart-no-axes-column",[["line",{x1:"18",x2:"18",y1:"20",y2:"10",key:"1xfpm4"}],["line",{x1:"12",x2:"12",y1:"20",y2:"4",key:"be30l9"}],["line",{x1:"6",x2:"6",y1:"20",y2:"14",key:"1r4le6"}]]);var i=c(66865);function j({data:a,onClose:b}){let[c,j]=(0,e.useState)({low:0,medium:0,high:0,total:0}),[l,m]=(0,e.useState)(!1),[n,o]=(0,e.useState)(!1),p=async b=>{if(!l&&!n){o(!0);try{let c=localStorage.getItem("cf_user"),d="",e="Anonymous";if(c){let a=JSON.parse(c);d=a.id,e=a.display_name||a.email?.split("@")[0]}else d=localStorage.getItem("mz_visitor_id")||"v_"+Math.random().toString(36).substring(2,12),localStorage.setItem("mz_visitor_id",d);let f=await fetch(`/api/polls/${a.id}/vote`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({vote:b,userId:d,userName:e})}),g=await f.json();g.success?(localStorage.setItem(`voted_${a.id}`,"true"),m(!0),j({low:g.poll.votes.low,medium:g.poll.votes.medium,high:g.poll.votes.high,total:g.poll.total_votes}),i.Ay.success("Vote recorded! Thank you.")):i.Ay.error(g.error||"Failed to vote")}catch(a){i.Ay.error("Connection error")}finally{o(!1)}}},q=a=>0===c.total?0:Math.round(a/c.total*100);return(0,d.jsx)("div",{className:"poll-overlay",children:(0,d.jsxs)("div",{className:"poll-card",children:[(0,d.jsx)("button",{onClick:b,className:"poll-close",children:(0,d.jsx)(f.A,{size:20})}),(0,d.jsxs)("div",{className:"poll-content",children:[(0,d.jsxs)("div",{className:"poll-meta",children:[(0,d.jsx)("span",{className:"poll-symbol",children:a.symbol}),(0,d.jsx)("span",{className:"poll-category",children:"Impact Analysis"})]}),(0,d.jsx)("h2",{className:"poll-question",children:a.question}),(0,d.jsxs)("div",{className:"ai-context-box",children:[(0,d.jsxs)("div",{className:"ai-label",children:[(0,d.jsx)(g.A,{size:14})," AI Perspective"]}),(0,d.jsx)("p",{className:"ai-text",children:a.aiContext})]}),l?(0,d.jsxs)("div",{className:"results-container",children:[(0,d.jsxs)("div",{className:"results-header",children:[(0,d.jsx)("span",{children:"Community Sentiment"}),(0,d.jsxs)("span",{className:"flex items-center gap-1",children:[(0,d.jsx)(h,{size:12})," ",c.total," votes"]})]}),(0,d.jsx)(k,{label:"High Impact",percent:q(c.high),barClass:"fill-high",votes:c.high}),(0,d.jsx)(k,{label:"Moderate",percent:q(c.medium),barClass:"fill-mid",votes:c.medium}),(0,d.jsx)(k,{label:"Low Impact",percent:q(c.low),barClass:"fill-low",votes:c.low}),(0,d.jsx)("div",{className:"thank-you-note",children:"✓ Thank you for participating!"})]}):(0,d.jsx)("div",{className:"voting-section",children:(0,d.jsxs)("div",{className:"vote-grid",children:[(0,d.jsx)("button",{onClick:()=>p("low"),className:"vote-btn vote-low",disabled:n,children:"Low"}),(0,d.jsx)("button",{onClick:()=>p("medium"),className:"vote-btn vote-mid",disabled:n,children:"Medium"}),(0,d.jsx)("button",{onClick:()=>p("high"),className:"vote-btn vote-high",disabled:n,children:"High"})]})})]})]})})}function k({label:a,percent:b,barClass:c,votes:e}){return(0,d.jsxs)("div",{className:"bar-wrapper",children:[(0,d.jsxs)("div",{className:"bar-label-row",children:[(0,d.jsx)("span",{children:a}),(0,d.jsxs)("div",{className:"bar-stats",children:[(0,d.jsxs)("span",{children:[e," votes"]}),(0,d.jsxs)("span",{className:"ml-2 font-bold",children:[b,"%"]})]})]}),(0,d.jsx)("div",{className:"bar-track",children:(0,d.jsx)("div",{className:`bar-fill ${c}`,style:{width:`${b}%`}})})]})}},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},66865:(a,b,c)=>{"use strict";let d;c.d(b,{Ay:()=>M});var e,f=c(67484);let g={data:""},h=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,i=/\/\*[^]*?\*\/|  +/g,j=/\n+/g,k=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?k(g,f):f+"{"+k(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=k(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f=/^--/.test(f)?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=k.p?k.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},l={},m=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+m(a[c]);return b}return a};function n(a){let b,c,d=this||{},e=a.call?a(d.p):a;return((a,b,c,d,e)=>{var f;let g=m(a),n=l[g]||(l[g]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(g));if(!l[n]){let b=g!==a?a:(a=>{let b,c,d=[{}];for(;b=h.exec(a.replace(i,""));)b[4]?d.shift():b[3]?(c=b[3].replace(j," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(j," ").trim();return d[0]})(a);l[n]=k(e?{["@keyframes "+n]:b}:b,c?"":"."+n)}let o=c&&l.g?l.g:null;return c&&(l.g=l[n]),f=l[n],o?b.data=b.data.replace(o,f):-1===b.data.indexOf(f)&&(b.data=d?f+b.data:b.data+f),n})(e.unshift?e.raw?(b=[].slice.call(arguments,1),c=d.p,e.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":k(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):e.reduce((a,b)=>Object.assign(a,b&&b.call?b(d.p):b),{}):e,(a=>{if("object"==typeof window){let b=(a?a.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return b.nonce=window.__nonce__,b.parentNode||(a||document.head).appendChild(b),b.firstChild}return a||g})(d.target),d.g,d.o,d.k)}n.bind({g:1});let o,p,q,r=n.bind({k:1});function s(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:p&&p()},h),c.o=/ *go\d+/.test(i),h.className=n.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),q&&j[0]&&q(h),o(j,h)}return b?b(e):e}}var t=(a,b)=>"function"==typeof a?a(b):a,u=(d=0,()=>(++d).toString()),v="default",w=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return w(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},x=[],y={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},z={},A=(a,b=v)=>{z[b]=w(z[b]||y,a),x.forEach(([a,c])=>{a===b&&c(z[b])})},B=a=>Object.keys(z).forEach(b=>A(a,b)),C=(a=v)=>b=>{A(b,a)},D=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||u()}))(b,a,c);return C(e.toasterId||(d=e.id,Object.keys(z).find(a=>z[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},E=(a,b)=>D("blank")(a,b);E.error=D("error"),E.success=D("success"),E.loading=D("loading"),E.custom=D("custom"),E.dismiss=(a,b)=>{let c={type:3,toastId:a};b?C(b)(c):B(c)},E.dismissAll=a=>E.dismiss(void 0,a),E.remove=(a,b)=>{let c={type:4,toastId:a};b?C(b)(c):B(c)},E.removeAll=a=>E.remove(void 0,a),E.promise=(a,b,c)=>{let d=E.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?t(b.success,a):void 0;return e?E.success(e,{id:d,...c,...null==c?void 0:c.success}):E.dismiss(d),a}).catch(a=>{let e=b.error?t(b.error,a):void 0;e?E.error(e,{id:d,...c,...null==c?void 0:c.error}):E.dismiss(d)}),a};var F=r`
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
`;var M=E},69684:(a,b,c)=>{"use strict";c.r(b),c.d(b,{GlobalError:()=>D.a,__next_app__:()=>L,handler:()=>N,routeModule:()=>M});var d=c(7553),e=c(84006),f=c(67798),g=c(34775),h=c(99373),i=c(73461),j=c(1020),k=c(26349),l=c(54365),m=c(16023),n=c(63747),o=c(24235),p=c(23938),q=c(261),r=c(66758),s=c(77243),t=c(26713),u=c(37527),v=c(22820),w=c(88216),x=c(47929),y=c(79551),z=c(89125),A=c(86439),B=c(77068),C=c(95547),D=c.n(C),E=c(61287),F=c(81494),G=c(70722),H=c(70753),I=c(43954),J={};for(let a in E)0>["default","GlobalError","__next_app__","routeModule","handler"].indexOf(a)&&(J[a]=()=>E[a]);c.d(b,J);let K={children:["",{children:["news",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(c.bind(c,221)),"/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /app/news/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(c.bind(c,32056)),"/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /app/layout.tsx"],"global-error":[()=>Promise.resolve().then(c.t.bind(c,95547,23)),"next/dist/client/components/builtin/global-error.js"],"not-found":[()=>Promise.resolve().then(c.t.bind(c,55091,23)),"next/dist/client/components/builtin/not-found.js"],forbidden:[()=>Promise.resolve().then(c.t.bind(c,45270,23)),"next/dist/client/components/builtin/forbidden.js"],unauthorized:[()=>Promise.resolve().then(c.t.bind(c,28193,23)),"next/dist/client/components/builtin/unauthorized.js"]}]}.children,L={require:c,loadChunk:()=>Promise.resolve()},M=new d.AppPageRouteModule({definition:{kind:e.RouteKind.APP_PAGE,page:"/news/page",pathname:"/news",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:K},distDir:".next",relativeProjectDir:""});async function N(a,b,d){var C;M.isDev&&(0,h.addRequestMeta)(a,"devRequestTimingInternalsEnd",process.hrtime.bigint());let J=!!(0,h.getRequestMeta)(a,"minimalMode"),O="/news/page";"/index"===O&&(O="/");let P=await M.prepare(a,b,{srcPage:O,multiZoneDraftMode:!1});if(!P)return b.statusCode=400,b.end("Bad Request"),null==d.waitUntil||d.waitUntil.call(d,Promise.resolve()),null;let{buildId:Q,query:R,params:S,pageIsDynamic:T,buildManifest:U,nextFontManifest:V,reactLoadableManifest:W,serverActionsManifest:X,clientReferenceManifest:Y,subresourceIntegrityManifest:Z,prerenderManifest:$,isDraftMode:_,resolvedPathname:aa,revalidateOnlyGenerated:ab,routerServerContext:ac,nextConfig:ad,parsedUrl:ae,interceptionRoutePatterns:af,deploymentId:ag}=P,ah=(0,q.normalizeAppPath)(O),{isOnDemandRevalidate:ai}=P,aj=ad.experimental.ppr&&!ad.cacheComponents&&(0,I.isInterceptionRouteAppPath)(aa)?null:M.match(aa,$),ak=!!$.routes[aa],al=a.headers["user-agent"]||"",am=(0,t.getBotType)(al),an=(0,p.isHtmlBotRequest)(a),ao=(0,h.getRequestMeta)(a,"isPrefetchRSCRequest")??"1"===a.headers[s.NEXT_ROUTER_PREFETCH_HEADER],ap=(0,h.getRequestMeta)(a,"isRSCRequest")??!!a.headers[s.RSC_HEADER],aq=(0,r.getIsPossibleServerAction)(a),ar=(0,m.checkIsAppPPREnabled)(ad.experimental.ppr);if(!(0,h.getRequestMeta)(a,"postponed")&&ar&&"1"===a.headers[x.NEXT_RESUME_HEADER]&&"POST"===a.method){let b=[];for await(let c of a)b.push(c);let c=Buffer.concat(b).toString("utf8");(0,h.addRequestMeta)(a,"postponed",c)}let as=ar&&(null==(C=$.routes[ah]??$.dynamicRoutes[ah])?void 0:C.renderingMode)==="PARTIALLY_STATIC",at=!1,au=!1,av=as?(0,h.getRequestMeta)(a,"postponed"):void 0,aw=as&&ap&&!ao;J&&(aw=aw&&!!av);let ax=(0,h.getRequestMeta)(a,"segmentPrefetchRSCRequest"),ay=(!an||!as)&&(!al||(0,p.shouldServeStreamingMetadata)(al,ad.htmlLimitedBots)),az=!!((aj||ak||$.routes[ah])&&!(an&&as)),aA=as&&!0===ad.cacheComponents,aB=!0===M.isDev||!az||"string"==typeof av||(aA&&(0,h.getRequestMeta)(a,"onCacheEntryV2")?aw&&!J:aw),aC=an&&as,aD=null;_||!az||aB||aq||av||aw||(aD=aa);let aE=aD;!aE&&M.isDev&&(aE=aa),M.isDev||_||!az||!ap||aw||(0,k.d)(a.headers);let aF={...E,tree:K,GlobalError:D(),handler:N,routeModule:M,__next_app__:L};X&&Y&&(0,o.setManifestsSingleton)({page:O,clientReferenceManifest:Y,serverActionsManifest:X});let aG=a.method||"GET",aH=(0,g.getTracer)(),aI=aH.getActiveScopeSpan(),aJ=async()=>((null==ac?void 0:ac.render404)?await ac.render404(a,b,ae,!1):b.end("This page could not be found"),null);try{let f=M.getVaryHeader(aa,af);b.setHeader("Vary",f);let k=async(c,d)=>{let e=new l.NodeNextRequest(a),f=new l.NodeNextResponse(b);return M.render(e,f,d).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let a=aH.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==i.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let d=a.get("next.route");if(d){let a=`${aG} ${d}`;c.setAttributes({"next.route":d,"http.route":d,"next.span_name":a}),c.updateName(a)}else c.updateName(`${aG} ${O}`)})},m=(0,h.getRequestMeta)(a,"incrementalCache"),o=async({span:e,postponed:f,fallbackRouteParams:g,forceStaticRender:i})=>{let l={query:R,params:S,page:ah,sharedContext:{buildId:Q},serverComponentsHmrCache:(0,h.getRequestMeta)(a,"serverComponentsHmrCache"),fallbackRouteParams:g,renderOpts:{App:()=>null,Document:()=>null,pageConfig:{},ComponentMod:aF,Component:(0,j.T)(aF),params:S,routeModule:M,page:O,postponed:f,shouldWaitOnAllReady:aC,serveStreamingMetadata:ay,supportsDynamicResponse:"string"==typeof f||aB,buildManifest:U,nextFontManifest:V,reactLoadableManifest:W,subresourceIntegrityManifest:Z,setCacheStatus:null==ac?void 0:ac.setCacheStatus,setIsrStatus:null==ac?void 0:ac.setIsrStatus,setReactDebugChannel:null==ac?void 0:ac.setReactDebugChannel,sendErrorsToBrowser:null==ac?void 0:ac.sendErrorsToBrowser,dir:c(33873).join(process.cwd(),M.relativeProjectDir),isDraftMode:_,botType:am,isOnDemandRevalidate:ai,isPossibleServerAction:aq,assetPrefix:ad.assetPrefix,nextConfigOutput:ad.output,crossOrigin:ad.crossOrigin,trailingSlash:ad.trailingSlash,images:ad.images,previewProps:$.preview,deploymentId:ag,enableTainting:ad.experimental.taint,htmlLimitedBots:ad.htmlLimitedBots,reactMaxHeadersLength:ad.reactMaxHeadersLength,multiZoneDraftMode:!1,incrementalCache:m,cacheLifeProfiles:ad.cacheLife,basePath:ad.basePath,serverActions:ad.experimental.serverActions,...at||au?{nextExport:!0,supportsDynamicResponse:!1,isStaticGeneration:!0,isDebugDynamicAccesses:at}:{},cacheComponents:!!ad.cacheComponents,experimental:{isRoutePPREnabled:as,expireTime:ad.expireTime,staleTimes:ad.experimental.staleTimes,dynamicOnHover:!!ad.experimental.dynamicOnHover,inlineCss:!!ad.experimental.inlineCss,authInterrupts:!!ad.experimental.authInterrupts,clientTraceMetadata:ad.experimental.clientTraceMetadata||[],clientParamParsingOrigins:ad.experimental.clientParamParsingOrigins,maxPostponedStateSizeBytes:(0,B.parseMaxPostponedStateSize)(ad.experimental.maxPostponedStateSize)},waitUntil:d.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:()=>{},onInstrumentationRequestError:(b,c,d,e)=>M.onRequestError(a,b,d,e,ac),err:(0,h.getRequestMeta)(a,"invokeError"),dev:M.isDev}};at&&(l.renderOpts.nextExport=!0,l.renderOpts.supportsDynamicResponse=!1,l.renderOpts.isDebugDynamicAccesses=at),i&&(l.renderOpts.supportsDynamicResponse=!1);let n=await k(e,l),{metadata:o}=n,{cacheControl:p,headers:q={},fetchTags:r,fetchMetrics:s}=o;if(r&&(q[x.NEXT_CACHE_TAGS_HEADER]=r),a.fetchMetrics=s,az&&(null==p?void 0:p.revalidate)===0&&!M.isDev&&!as){let a=o.staticBailoutInfo,b=Object.defineProperty(Error(`Page changed from static to dynamic at runtime ${aa}${(null==a?void 0:a.description)?`, reason: ${a.description}`:""}
see more here https://nextjs.org/docs/messages/app-static-to-dynamic-error`),"__NEXT_ERROR_CODE",{value:"E132",enumerable:!1,configurable:!0});if(null==a?void 0:a.stack){let c=a.stack;b.stack=b.message+c.substring(c.indexOf("\n"))}throw b}return{value:{kind:u.CachedRouteKind.APP_PAGE,html:n,headers:q,rscData:o.flightData,postponed:o.postponed,status:o.statusCode,segmentData:o.segmentData},cacheControl:p}},p=async({hasResolved:c,previousCacheEntry:f,isRevalidating:g,span:i,forceStaticRender:j=!1})=>{let k,l=!1===M.isDev,q=c||b.writableEnded;if(ai&&ab&&!f&&!J)return(null==ac?void 0:ac.render404)?await ac.render404(a,b):(b.statusCode=404,b.end("This page could not be found")),null;if(aj&&(k=(0,v.parseFallbackField)(aj.fallback)),k===v.FallbackMode.PRERENDER&&(0,t.isBot)(al)&&(!as||an)&&(k=v.FallbackMode.BLOCKING_STATIC_RENDER),(null==f?void 0:f.isStale)===-1&&(ai=!0),ai&&(k!==v.FallbackMode.NOT_FOUND||f)&&(k=v.FallbackMode.BLOCKING_STATIC_RENDER),!J&&k!==v.FallbackMode.BLOCKING_STATIC_RENDER&&aE&&!q&&!_&&T&&(l||!ak)){if((l||aj)&&k===v.FallbackMode.NOT_FOUND){if(ad.experimental.adapterPath)return await aJ();throw new A.NoFallbackError}if(as&&(ad.cacheComponents?!aw:!ap)){let b=l&&"string"==typeof(null==aj?void 0:aj.fallback)?aj.fallback:ah,c=l&&(null==aj?void 0:aj.fallbackRouteParams)?(0,n.createOpaqueFallbackRouteParams)(aj.fallbackRouteParams):au?(0,n.getFallbackRouteParams)(ah,M):null,f=await M.handleResponse({cacheKey:b,req:a,nextConfig:ad,routeKind:e.RouteKind.APP_PAGE,isFallback:!0,prerenderManifest:$,isRoutePPREnabled:as,responseGenerator:async()=>o({span:i,postponed:void 0,fallbackRouteParams:c,forceStaticRender:!1}),waitUntil:d.waitUntil,isMinimalMode:J});if(null===f)return null;if(f)return delete f.cacheControl,f}}let r=ai||g||!av?void 0:av;if(aA&&!J&&m&&aw&&!j){let b=await m.get(aa,{kind:u.IncrementalCacheKind.APP_PAGE,isRoutePPREnabled:!0,isFallback:!1});b&&b.value&&b.value.kind===u.CachedRouteKind.APP_PAGE&&(r=b.value.postponed,b&&(-1===b.isStale||!0===b.isStale)&&(0,H.scheduleOnNextTick)(async()=>{let b=M.getResponseCache(a);try{await b.revalidate(aa,m,as,!1,a=>p({...a,forceStaticRender:!0}),null,c,d.waitUntil)}catch(a){console.error("Error revalidating the page in the background",a)}}))}if(at&&void 0!==r)return{cacheControl:{revalidate:1,expire:void 0},value:{kind:u.CachedRouteKind.PAGES,html:w.default.EMPTY,pageData:{},headers:void 0,status:void 0}};let s=l&&(null==aj?void 0:aj.fallbackRouteParams)&&(0,h.getRequestMeta)(a,"renderFallbackShell")?(0,n.createOpaqueFallbackRouteParams)(aj.fallbackRouteParams):au?(0,n.getFallbackRouteParams)(ah,M):null;return o({span:i,postponed:r,fallbackRouteParams:s,forceStaticRender:j})},q=async c=>{var f,g,i,j,k;let l,m=await M.handleResponse({cacheKey:aD,responseGenerator:a=>p({span:c,...a}),routeKind:e.RouteKind.APP_PAGE,isOnDemandRevalidate:ai,isRoutePPREnabled:as,req:a,nextConfig:ad,prerenderManifest:$,waitUntil:d.waitUntil,isMinimalMode:J});if(_&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate"),M.isDev&&b.setHeader("Cache-Control","no-store, must-revalidate"),!m){if(aD)throw Object.defineProperty(Error("invariant: cache entry required but not generated"),"__NEXT_ERROR_CODE",{value:"E62",enumerable:!1,configurable:!0});return null}if((null==(f=m.value)?void 0:f.kind)!==u.CachedRouteKind.APP_PAGE)throw Object.defineProperty(Error(`Invariant app-page handler received invalid cache entry ${null==(i=m.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E707",enumerable:!1,configurable:!0});let n="string"==typeof m.value.postponed;az&&!aw&&(!n||ao)&&(J||b.setHeader("x-nextjs-cache",ai?"REVALIDATED":m.isMiss?"MISS":m.isStale?"STALE":"HIT"),b.setHeader(s.NEXT_IS_PRERENDER_HEADER,"1"));let{value:q}=m;if(av)l={revalidate:0,expire:void 0};else if(aw)l={revalidate:0,expire:void 0};else if(!M.isDev)if(_)l={revalidate:0,expire:void 0};else if(az){if(m.cacheControl)if("number"==typeof m.cacheControl.revalidate){if(m.cacheControl.revalidate<1)throw Object.defineProperty(Error(`Invalid revalidate configuration provided: ${m.cacheControl.revalidate} < 1`),"__NEXT_ERROR_CODE",{value:"E22",enumerable:!1,configurable:!0});l={revalidate:m.cacheControl.revalidate,expire:(null==(j=m.cacheControl)?void 0:j.expire)??ad.expireTime}}else l={revalidate:x.CACHE_ONE_YEAR,expire:void 0}}else b.getHeader("Cache-Control")||(l={revalidate:0,expire:void 0});if(m.cacheControl=l,"string"==typeof ax&&(null==q?void 0:q.kind)===u.CachedRouteKind.APP_PAGE&&q.segmentData){b.setHeader(s.NEXT_DID_POSTPONE_HEADER,"2");let c=null==(k=q.headers)?void 0:k[x.NEXT_CACHE_TAGS_HEADER];J&&az&&c&&"string"==typeof c&&b.setHeader(x.NEXT_CACHE_TAGS_HEADER,c);let d=q.segmentData.get(ax);return void 0!==d?(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:w.default.fromStatic(d,s.RSC_CONTENT_TYPE_HEADER),cacheControl:m.cacheControl}):(b.statusCode=204,(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:w.default.EMPTY,cacheControl:m.cacheControl}))}let r=aA?(0,h.getRequestMeta)(a,"onCacheEntryV2")??(0,h.getRequestMeta)(a,"onCacheEntry"):(0,h.getRequestMeta)(a,"onCacheEntry");if(r&&await r(m,{url:(0,h.getRequestMeta)(a,"initURL")??a.url}))return null;if(q.headers){let a={...q.headers};for(let[c,d]of(J&&az||delete a[x.NEXT_CACHE_TAGS_HEADER],Object.entries(a)))if(void 0!==d)if(Array.isArray(d))for(let a of d)b.appendHeader(c,a);else"number"==typeof d&&(d=d.toString()),b.appendHeader(c,d)}let t=null==(g=q.headers)?void 0:g[x.NEXT_CACHE_TAGS_HEADER];if(J&&az&&t&&"string"==typeof t&&b.setHeader(x.NEXT_CACHE_TAGS_HEADER,t),!q.status||ap&&as||(b.statusCode=q.status),!J&&q.status&&F.RedirectStatusCode[q.status]&&ap&&(b.statusCode=200),n&&!aw&&b.setHeader(s.NEXT_DID_POSTPONE_HEADER,"1"),ap&&!_){if(void 0===q.rscData){if(q.html.contentType!==s.RSC_CONTENT_TYPE_HEADER)if(ad.cacheComponents)return b.statusCode=404,(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:w.default.EMPTY,cacheControl:m.cacheControl});else throw Object.defineProperty(new G.InvariantError(`Expected RSC response, got ${q.html.contentType}`),"__NEXT_ERROR_CODE",{value:"E789",enumerable:!1,configurable:!0});return(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:q.html,cacheControl:m.cacheControl})}return(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:w.default.fromStatic(q.rscData,s.RSC_CONTENT_TYPE_HEADER),cacheControl:m.cacheControl})}let v=q.html;if(!n||J||ap)return(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:v,cacheControl:m.cacheControl});if(at)return v.push(new ReadableStream({start(a){a.enqueue(y.ENCODED_TAGS.CLOSED.BODY_AND_HTML),a.close()}})),(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:v,cacheControl:{revalidate:0,expire:void 0}});let A=new TransformStream;return v.push(A.readable),o({span:c,postponed:q.postponed,fallbackRouteParams:null,forceStaticRender:!1}).then(async a=>{var b,c;if(!a)throw Object.defineProperty(Error("Invariant: expected a result to be returned"),"__NEXT_ERROR_CODE",{value:"E463",enumerable:!1,configurable:!0});if((null==(b=a.value)?void 0:b.kind)!==u.CachedRouteKind.APP_PAGE)throw Object.defineProperty(Error(`Invariant: expected a page response, got ${null==(c=a.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E305",enumerable:!1,configurable:!0});await a.value.html.pipeTo(A.writable)}).catch(a=>{A.writable.abort(a).catch(a=>{console.error("couldn't abort transformer",a)})}),(0,z.sendRenderResult)({req:a,res:b,generateEtags:ad.generateEtags,poweredByHeader:ad.poweredByHeader,result:v,cacheControl:{revalidate:0,expire:void 0}})};if(!aI)return await aH.withPropagatedContext(a.headers,()=>aH.trace(i.BaseServerSpan.handleRequest,{spanName:`${aG} ${O}`,kind:g.SpanKind.SERVER,attributes:{"http.method":aG,"http.target":a.url}},q));await q(aI)}catch(b){throw b instanceof A.NoFallbackError||await M.onRequestError(a,b,{routerKind:"App Router",routePath:O,routeType:"render",revalidateReason:(0,f.c)({isStaticGeneration:az,isOnDemandRevalidate:ai})},!1,ac),b}}},70722:a=>{"use strict";a.exports=require("next/dist/shared/lib/invariant-error")},77068:a=>{"use strict";a.exports=require("next/dist/shared/lib/size-limit")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},88876:(a,b,c)=>{Promise.resolve().then(c.bind(c,32451))},99160:(a,b,c)=>{"use strict";c.d(b,{A:()=>d});let d=(0,c(76773).A)("brain-circuit",[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M9 13a4.5 4.5 0 0 0 3-4",key:"10igwf"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M12 13h4",key:"1ku699"}],["path",{d:"M12 18h6a2 2 0 0 1 2 2v1",key:"105ag5"}],["path",{d:"M12 8h8",key:"1lhi5i"}],["path",{d:"M16 8V5a2 2 0 0 1 2-2",key:"u6izg6"}],["circle",{cx:"16",cy:"13",r:".5",key:"ry7gng"}],["circle",{cx:"18",cy:"3",r:".5",key:"1aiba7"}],["circle",{cx:"20",cy:"21",r:".5",key:"yhc1fs"}],["circle",{cx:"20",cy:"8",r:".5",key:"1e43v0"}]])}};var b=require("../../webpack-runtime.js");b.C(a);var c=b.X(0,[179,471,961,684],()=>b(b.s=69684));module.exports=c})();