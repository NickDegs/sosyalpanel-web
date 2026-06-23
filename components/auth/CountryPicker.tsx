'use client'

import { useEffect, useRef, useState } from 'react'
import { COUNTRIES, type Country } from '@/lib/countries'

// WhatsApp tarzı ülke kodu seçici (bayrak + arama kodu, aranabilir açılır liste).
export function CountryPicker({
  value,
  onChange,
  disabled,
}: {
  value: Country
  onChange: (c: Country) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const q = query.trim().toLowerCase()
  const list = q
    ? COUNTRIES.filter(
        (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q),
      )
    : COUNTRIES

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className="h-[54px] px-3 rounded-2xl flex items-center gap-1.5 text-white text-[16px] glass disabled:opacity-50 whitespace-nowrap"
      >
        <span className="text-[20px] leading-none">{value.flag}</span>
        <span className="font-medium">+{value.dial}</span>
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white/50">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[280px] max-h-[340px] rounded-2xl overflow-hidden glass border border-white/10 flex flex-col">
          <div className="p-2 border-b border-white/10">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ülke ara"
              className="w-full h-10 px-3 rounded-xl bg-white/5 text-white text-[14px] outline-none placeholder:text-white/30"
            />
          </div>
          <div className="overflow-y-auto">
            {list.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c)
                  setOpen(false)
                  setQuery('')
                }}
                className="w-full px-3 py-2.5 flex items-center gap-3 text-left hover:bg-white/10 transition-colors"
              >
                <span className="text-[20px] leading-none">{c.flag}</span>
                <span className="flex-1 text-white text-[14px] truncate">{c.name}</span>
                <span className="text-white/50 text-[13px]">+{c.dial}</span>
                {c.code === value.code && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-violet-400">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </button>
            ))}
            {list.length === 0 && (
              <p className="px-3 py-4 text-white/40 text-[13px] text-center">Sonuç yok</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
