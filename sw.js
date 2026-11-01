importScripts('version.js');
const V='afl23-v'+APP_VERSION,F=['./','version.js','index.html','eps-core.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'];
// Installation : chaque fichier est chargé depuis le réseau (sans cache HTTP) ; un fichier manquant ne bloque pas l'installation.
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(F.map(u=>fetch(u,{cache:'reload'}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('afl23-v')&&x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
// Réseau d'abord (dernière version en ligne), cache en secours (hors ligne).
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{if(r.ok&&new URL(e.request.url).origin===location.origin){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
