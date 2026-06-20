const CACHE="edogawa-v2";
const ASSETS=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const u=e.request.url;
  if(u.includes("api.anthropic.com")||u.includes("unpkg.com")||u.includes("workers.dev")||u.includes("googleapis")){return;}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const cp=resp.clone();caches.open(CACHE).then(c=>{try{c.put(e.request,cp);}catch(x){}});return resp;}).catch(()=>caches.match("./index.html"))));
});
