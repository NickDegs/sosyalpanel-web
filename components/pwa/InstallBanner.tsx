'use client'

import { useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let deferredPrompt: any = null

export function InstallBanner() {
  const [mode, setMode] = useState<'android' | 'ios' | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(display-mode: standalone)').matches) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window.navigator as any).standalone) return
    if (localStorage.getItem('pwa-dismissed')) return

    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt = e
      setMode('android')
    }
    window.addEventListener('beforeinstallprompt', handler)

    const isIOS =
      /iPhone|iPad|iPod/.test(navigator.userAgent) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      !(window.navigator as any).standalone
    if (isIOS) setMode('ios')

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    localStorage.setItem('pwa-dismissed', '1')
    setMode(null)
  }

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      deferredPrompt = null
      setMode(null)
    }
  }

  if (!mode) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 z-40">
      <div className="glass rounded-2xl p-4 border border-white/10 flex items-center gap-3 shadow-2xl shadow-black/40">
        <div
          className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #A855F7, #3B82F6)' }}
        >
          <span className="text-white font-black text-sm">SP</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-[14px]">Uygulamayı Yükle</p>
          {mode === 'ios' && (
            <p className="text-white/50 text-[12px]">Safari → Paylaş → Ana Ekrana Ekle</p>
          )}
          {mode === 'android' && (
            <p className="text-white/50 text-[12px]">Cihazına yükle, çevrimdışı çalışır</p>
          )}
        </div>
        {mode === 'android' && (
          <button
            onClick={install}
            className="px-3 py-1.5 rounded-xl font-semibold text-[12px] text-white flex-shrink-0 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #1D4ED8)' }}
          >
            Yükle
          </button>
        )}
        <button
          onClick={dismiss}
          className="p-1.5 text-white/30 hover:text-white/60 flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
