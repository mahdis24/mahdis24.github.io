/** @format */

const CACHE_NAME = 'mahdisalek-v2'
const PRECACHE_ASSETS = [
  '/',
  '/?source=pwa',
  '/index.html',
  '/manifest.webmanifest',
  '/styles/fonts-minify.css',
  '/styles/index-minify.css',
  '/scripts/webmcp-minify.js',
  '/assets/fonts/dm-sans.woff2',
  '/assets/fonts/space-grotesk.woff2',
  '/assets/favicon.ico',
  '/assets/icons/favicon-32x32.png',
  '/assets/icons/favicon-16x16.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/assets/icons/maskable-icon-512x512.png',
  '/assets/images/avatar.webp',
  '/assets/images/avatar-appbar.webp'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key)
            }
          })
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return
  }

  if (
    url.pathname.startsWith('/assets/fonts/') ||
    url.pathname.startsWith('/assets/icons/') ||
    url.pathname.startsWith('/assets/images/')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone()
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache))
          }
          return networkResponse
        })
      })
    )
    return
  }

  event.respondWith(
    caches
      .match(event.request, { ignoreSearch: true })
      .then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone()
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache))
            }
            return networkResponse
          })
          .catch(() => {
            if (cachedResponse) return cachedResponse
            if (event.request.mode === 'navigate') {
              return caches.match('/', { ignoreSearch: true })
            }
          })

        return (
          cachedResponse ||
          fetchPromise ||
          caches.match('/', { ignoreSearch: true })
        )
      })
  )
})
