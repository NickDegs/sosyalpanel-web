const CACHE = 'sp-v1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)

  if (e.request.method !== 'GET') return
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return
  if (url.hostname !== self.location.hostname) return

  // Cache-first for Next.js static bundles (immutable content-addressed files)
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached =>
          cached ?? fetch(e.request).then(res => {
            cache.put(e.request, res.clone())
            return res
          })
        )
      )
    )
    return
  }

  // Network-first for pages; fall back to cached version when offline
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone()
        caches.open(CACHE).then(c => c.put(e.request, clone))
        return res
      })
      .catch(() => caches.match(e.request))
  )
})
