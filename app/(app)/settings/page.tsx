'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const FONTS: { id: string; label: string; note: string; sample: string }[] = [
  { id: 'ios26',     label: 'iOS 26',    note: 'Apple sistem fontu (varsayılan)', sample: 'font-sans-ui' },
  { id: 'editorial', label: 'Editorial', note: 'Fraunces + Newsreader serif',      sample: 'font-display' },
  { id: 'inter',     label: 'Inter',     note: 'Modern temiz sans',                sample: '' },
  { id: 'georgia',   label: 'Klasik',    note: 'Georgia serif',                    sample: '' },
  { id: 'mono',      label: 'Mono',      note: 'Teknik monospace',                 sample: '' },
]

function FontPicker() {
  const [active, setActive] = useState('ios26')
  useEffect(() => {
    try { setActive(localStorage.getItem('fontTheme') || 'ios26') } catch {}
  }, [])
  function pick(id: string) {
    setActive(id)
    try { localStorage.setItem('fontTheme', id) } catch {}
    document.documentElement.setAttribute('data-font', id)
  }
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">Yazı Tipi</p>
      </div>
      <div className="p-2 flex flex-col gap-1">
        {FONTS.map((f) => (
          <button
            key={f.id}
            onClick={() => pick(f.id)}
            className={`flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all border ${
              active === f.id
                ? 'border-violet-500/50 bg-violet-500/15'
                : 'border-transparent hover:bg-white/[0.04]'
            }`}
          >
            <span>
              <span
                className={`block text-white text-[15px] ${f.sample}`}
                style={
                  f.id === 'inter' ? { fontFamily: 'var(--font-inter), system-ui' }
                  : f.id === 'georgia' ? { fontFamily: 'Georgia, serif' }
                  : f.id === 'mono' ? { fontFamily: 'ui-monospace, monospace' }
                  : undefined
                }
              >
                {f.label}
              </span>
              <span className="block text-white/40 text-[12px] mt-0.5">{f.note}</span>
            </span>
            {active === f.id && (
              <span className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function signOut() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="p-5 md:p-8 max-w-xl">
      <h1 className="text-[28px] font-bold text-white mb-6">Ayarlar</h1>

      <div className="flex flex-col gap-4">
        {/* Font seçici */}
        <FontPicker />

        {/* App info */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">Uygulama</p>
          </div>
          <Row label="Versiyon" value="1.0.0" />
          <div className="border-t border-white/[0.06]" />
          <Row label="Platform" value="Web / PWA" />
          <div className="border-t border-white/[0.06]" />
          <Row label="Domain" value="realvirtuality.app" />
        </div>

        {/* Account */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">Hesap</p>
          </div>
          <div className="px-4 py-3">
            <button
              onClick={signOut}
              disabled={loading}
              className="w-full h-11 rounded-xl font-semibold text-[14px] text-red-400 bg-red-400/10 hover:bg-red-400/15 transition-all disabled:opacity-50"
            >
              {loading ? 'Çıkış yapılıyor…' : 'Çıkış Yap'}
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="glass rounded-2xl p-4 flex items-start gap-3">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-white/40 flex-shrink-0 mt-0.5"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinejoin="round"/></svg>
          <p className="text-white/35 text-[12px] leading-relaxed">
            Verileriniz Supabase altyapısında şifreli olarak saklanır. Üçüncü taraflarla paylaşılmaz.
          </p>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-white/60 text-[14px]">{label}</span>
      <span className="text-white/40 text-[14px]">{value}</span>
    </div>
  )
}
