/** @format */

const CACHE_NAME = 'mahdisalek-v4.4'
const PRECACHE_ASSETS = [
  '/',
  '/?source=pwa',
  '/index.html',
  '/manifest.webmanifest',
  '/scripts/webmcp-minify.js',
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
  '/assets/icons/github.svg',
  '/assets/icons/i18n.svg',
  '/assets/icons/linkedin.svg',
  '/assets/icons/nuxt.svg',
  '/assets/icons/pinia.svg',
  '/assets/icons/stack_overflow.svg',
  '/assets/icons/telegram.svg',
  '/assets/icons/typescript.svg',
  '/assets/icons/vue.svg',
  '/assets/icons/vuetify.svg',
  '/assets/icons/whatsapp.svg',
  '/assets/icons/x.svg',
  '/assets/images/avatar.webp',
  '/assets/images/avatar-appbar.webp',
  '/assets/Mahdi_Salek_Front_End_Developer.pdf'
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

  if (url.pathname.startsWith('/assets/')) {
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

        return cachedResponse || fetchPromise
      })
  )
})
