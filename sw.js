// LiveBet móvil: la app (HTML, iconos) se guarda para abrir sin conexión; los datos siempre se piden a la red primero.
const V='livebet-v4',SHELL=['./','index.html','padel_core.js','markets_extra.js','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  // red primero (datos y app); si no hay conexión, lo último guardado
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone(),key=u.pathname.endsWith('data.enc')?new Request(u.origin+u.pathname):e.request;caches.open(V).then(ca=>ca.put(key,c))}return r})
    .catch(()=>caches.match(u.pathname.endsWith('data.enc')?new Request(u.origin+u.pathname):e.request,{ignoreSearch:true})))});
