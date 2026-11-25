/* Service worker Stickman One Zero: game berjalan penuh OFFLINE.
   Hanya file milik game sendiri yang di-cache. Permintaan ke situs lain
   (ntfy.sh, Google Fonts untuk Multiplayer) tidak disentuh. */
var CACHE='one-zero-v2';
var FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(FILES.map(function(f){return c.add(f).catch(function(){})}))
  }).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))
  }).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==self.location.origin)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(hit){
    if(hit)return hit;
    return fetch(r).then(function(res){
      if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}
      return res
    }).catch(function(){return caches.match('index.html')})
  }))});
