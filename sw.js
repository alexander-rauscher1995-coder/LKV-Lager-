const CACHE='fitness-coach-v6';
const CORE=[
 './','./index.html','./manifest.json','./icon.svg',
 './cloud/sync-adapter.js','./cloud/snapshot.js'
];

self.addEventListener('install',event=>{
 event.waitUntil(
  caches.open(CACHE)
   .then(c=>c.addAll(CORE))
   .then(()=>self.skipWaiting())
 );
});

self.addEventListener('activate',event=>{
 event.waitUntil(
  caches.keys()
   .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
   .then(()=>self.clients.claim())
 );
});

self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 event.respondWith(
  fetch(event.request).then(response=>{
   if(response&&response.ok){
    const copy=response.clone();
    caches.open(CACHE).then(c=>c.put(event.request,copy));
   }
   return response;
  }).catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html')))
 );
});