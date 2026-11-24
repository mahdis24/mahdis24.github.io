const themeBtn = document.getElementById('themeBtn')
const menuToggle = document.getElementById('menuToggle')
const mobileMenu = document.getElementById('mobileMenu')
const mobileBackdrop = document.getElementById('mobileBackdrop')
const luncherBadge = document.getElementById('luncherBadge')
const copyBtn = document.getElementById('copyEmailBtn')
const splash = document.getElementById('pwa-splash')

document.getElementById('year').textContent = new Date().getFullYear()

const PWATitle = 'Mahdi Salek - Product-Minded Frontend Engineer'

const isColdPWA =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true ||
  window.location.search.includes('source=pwa')

function openMobileMenu() {
  if (!mobileMenu || !menuToggle) return
  menuToggle.setAttribute('aria-expanded', 'true')
  menuToggle.setAttribute('aria-label', 'Close navigation menu')
  mobileMenu.setAttribute('aria-hidden', 'false')
  mobileMenu.classList.add('is-open')
  if (mobileBackdrop) {
    mobileBackdrop.setAttribute('aria-hidden', 'false')
    mobileBackdrop.classList.add('is-open')
  }
  document.body.classList.add('menu-open')
}

function closeMobileMenu() {
  if (!mobileMenu || !menuToggle) return
  menuToggle.setAttribute('aria-expanded', 'false')
  menuToggle.setAttribute('aria-label', 'Open navigation menu')
  mobileMenu.setAttribute('aria-hidden', 'true')
  mobileMenu.classList.remove('is-open')
  if (mobileBackdrop) {
    mobileBackdrop.setAttribute('aria-hidden', 'true')
    mobileBackdrop.classList.remove('is-open')
  }
  document.body.classList.remove('menu-open')
}

function toggleMobileMenu() {
  const isOpen = menuToggle?.getAttribute('aria-expanded') === 'true'
  if (isOpen) {
    closeMobileMenu()
  } else {
    openMobileMenu()
  }
}

if (menuToggle) {
  menuToggle.addEventListener('click', toggleMobileMenu)
}

if (mobileBackdrop) {
  mobileBackdrop.addEventListener('click', closeMobileMenu)
}

if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu)
  })
}

window.matchMedia('(min-width: 701px)').addEventListener('change', (e) => {
  if (e.matches) {
    closeMobileMenu()
  }
})

function syncThemeState() {
  if (!themeBtn) return

  const isDark = document.documentElement.dataset.theme === 'dark'

  themeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false')
  themeBtn.setAttribute(
    'aria-label',
    `Switch to ${isDark ? 'light' : 'dark'} theme`
  )

  changeBadgeTheme()
}

function changeBadgeTheme() {
  try {
    const luncherBadgeSrc = new URL(luncherBadge.src)

    if (document.documentElement.dataset.theme === 'dark') {
      luncherBadgeSrc.searchParams.set('theme', 'dark')
    } else {
      luncherBadgeSrc.searchParams.delete('theme')
    }

    luncherBadge.src = luncherBadgeSrc.toString()
  } catch {}
}

const hideSplash = () => {
  if (!splash) return
  splash.classList.add('splash-hide')
  setTimeout(() => splash.remove(), 500)
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1 }
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

if (isColdPWA) {
  document.title = PWATitle
  document.documentElement.classList.add('pwa-mode')

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      () => setTimeout(hideSplash, 300),
      { once: true }
    )
  } else {
    setTimeout(hideSplash, 600)
  }
  setTimeout(hideSplash, 1200)
} else {
  if (splash) splash.remove()
}

document
  .querySelectorAll('.reveal')
  .forEach((element) => observer.observe(element))

syncThemeState()

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    changeTheme()
    syncThemeState()
  })
}

copyBtn.addEventListener('click', async () => {
  if (copyBtn.classList.contains('copied')) return

  try {
    await navigator.clipboard.writeText('mahdi.6n@gmail.com')
    const label = copyBtn.querySelector('.copy-label')
    const originalText = label.textContent
    label.textContent = 'Copied!'
    copyBtn.classList.add('copied')
    setTimeout(() => {
      label.textContent = originalText
      copyBtn.classList.remove('copied')
    }, 2000)
  } catch {
    window.location.href = 'mailto:mahdi.6n@gmail.com'
  }
})

window.addEventListener('keydown', (e) => {
  if (
    e.key === 'Escape' &&
    menuToggle?.getAttribute('aria-expanded') === 'true'
  ) {
    closeMobileMenu()
    menuToggle.focus()
    return
  }

  if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return

  if (e.code === 'KeyT' || e.key === 't' || e.key === 'T') {
    changeTheme()
    syncThemeState()
  }
})

window
  .matchMedia('(display-mode: standalone)')
  .addEventListener('change', (e) => {
    if (e.matches) {
      document.title = PWATitle
      hideSplash()
    }
  })
