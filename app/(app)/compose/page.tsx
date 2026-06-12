'use client'

import { useState } from 'react'
import { PLATFORMS, Platform } from '@/lib/types'

const POSTABLE: Platform[] = ['instagram', 'threads', 'bluesky', 'mastodon', 'reddit']
const CHAR_LIMITS: Partial<Record<Platform, number>> = {
  threads: 500, bluesky: 300, mastodon: 500, reddit: 40000,
}

export default function ComposePage() {
  const [text, setText] = useState('')
  const [selected, setSelected] = useState<Set<Platform>>(new Set())
  const [copied, setCopied] = useState<Platform | null>(null)

  const limit = selected.size > 0 ? Math.min(...[...selected].map(p => CHAR_LIMITS[p] ?? Infinity).filter(n => isFinite(n))) : null
  const over = limit !== null && text.length > limit

  function toggle(p: Platform) {
    setSelected(prev => { const s = new Set(prev); s.has(p) ? s.delete(p) : s.add(p); return s })
  }

  async function share() {
    if (!text.trim() || selected.size === 0) return
    for (const p of selected) {
      await navigator.clipboard.writeText(text)
      setCopied(p)
      setTimeout(() => setCopied(null), 2000)

      let url = ''
      if (p === 'threads')  url = `https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`
      if (p === 'bluesky')  url = `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`
      if (p === 'mastodon') url = `https://mastodon.social/share?text=${encodeURIComponent(text)}`
      if (p === 'reddit')   url = `https://www.reddit.com/submit?title=${encodeURIComponent(text)}`
      if (url) window.open(url, '_blank')
    }
  }

  return (
    <div className="p-5 md:p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] font-bold text-white">Paylaş</h1>
        <button
          onClick={share}
          disabled={!text.trim() || selected.size === 0 || over}
          className="px-5 py-2 rounded-xl font-semibold text-[14px] text-white disabled:opacity-30 transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #1D4ED8)' }}
        >
          Paylaş
        </button>
      </div>

      {/* Text area card */}
      <div className="glass rounded-2xl p-4 mb-4">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Ne paylaşmak istiyorsun?"
          rows={6}
          className="w-full bg-transparent text-white placeholder-white/25 outline-none resize-none text-[16px] leading-relaxed"
        />
        {limit !== null && (
          <div className={`text-right text-[11px] font-mono mt-2 ${over ? 'text-red-400' : 'text-white/30'}`}>
            {text.length} / {limit}
          </div>
        )}
      </div>

      {/* Platform picker */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">Platform Seç</p>
          {selected.size > 0 && (
            <button onClick={() => setSelected(new Set())} className="text-violet-400 text-[12px]">Temizle</button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {POSTABLE.map(p => {
            const info = PLATFORMS[p]
            const sel = selected.has(p)
            return (
              <button key={p} onClick={() => toggle(p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all border ${
                  sel
                    ? 'border-violet-500/50 bg-violet-500/20 text-violet-300'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                }`}>
                <span>{info.icon}</span>
                {info.label}
                {sel && copied === p && <span className="text-emerald-400 text-[10px]">✓ kopyalandı</span>}
              </button>
            )
          })}
        </div>
        {selected.size > 0 && (
          <p className="mt-3 text-white/30 text-[11px] flex items-center gap-1">
            <span>ℹ️</span> Metin panoya kopyalanır, platform sayfası açılır.
          </p>
        )}
      </div>
    </div>
  )
}
