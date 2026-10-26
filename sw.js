/** @format */

const CACHE_NAME = 'mahdisalek-v1'
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/styles/fonts-minify.css',
  '/styles/index-minify.css',
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

// Install: precache essential static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate: clean up older caches
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

// Fetch: Stale-While-Revalidate for local assets, ignore third-party analytics
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Only handle GET and same-origin requests
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return
  }

  // Cache-first strategy for fonts and images
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

  // Network-first with cache fallback for pages and CSS/JS
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone()
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache))
        }
        return networkResponse
      })
      .catch(() =>
        caches.match(event.request).then((res) => res || caches.match('/'))
      )
  )
})
