'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlatformIcon } from '@/components/icons/PlatformIcon'
import { PLATFORMS, type Platform } from '@/lib/types'

const BADGE_PLATFORMS: Platform[] = ['instagram', 'tiktok', 'youtube', 'facebook', 'bluesky', 'twitter', 'threads']

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendCode() {
    setError(null); setLoading(true)
    try {
      const res = await fetch('/api/auth/sms-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      if (res.ok) setStep('code')
      else if (res.status === 400) setError('Geçersiz telefon numarası.')
      else setError('Bağlantı hatası. Tekrar dene.')
    } catch {
      setError('Bağlantı hatası. Tekrar dene.')
    } finally {
      setLoading(false)
    }
  }

  async function verify() {
    setError(null); setLoading(true)
    try {
      const res = await fetch('/api/auth/sms-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      })
      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else if (res.status === 401) {
        setError('Kod hatalı veya süresi doldu.')
      } else {
        setError('Bağlantı hatası. Tekrar dene.')
      }
    } catch {
      setError('Bağlantı hatası. Tekrar dene.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(124,58,237,0.45) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 85% 85%, rgba(37,99,235,0.3) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 70%, rgba(76,29,149,0.2) 0%, transparent 60%), #06030F',
          }}
        />
      </div>

      <div className="w-full max-w-sm px-8 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-[28px] blur-2xl opacity-60"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #1D4ED8)', transform: 'scale(1.3)' }}
            />
            <div
              className="relative w-24 h-24 rounded-[28px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #A855F7, #3B82F6)' }}
            >
              <span className="text-white font-black text-4xl" style={{ fontFamily: '-apple-system, system-ui' }}>
                SP
              </span>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-[34px] font-bold text-white" style={{ letterSpacing: '-0.5px' }}>
              Social Panel
            </h1>
            <p className="text-white/50 mt-1 text-[15px]">Tüm sosyal medyan, tek ekranda</p>
          </div>
        </div>

        {/* Platform badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {BADGE_PLATFORMS.map((key) => (
            <span
              key={key}
              className="glass px-2.5 py-2 rounded-full border-white/10"
              style={{ color: PLATFORMS[key].color }}
            >
              <PlatformIcon platform={key} size={15} title={PLATFORMS[key].label} />
            </span>
          ))}
        </div>

        {/* SMS sign in */}
        <div className="w-full flex flex-col gap-3">
          <p className="text-white/60 text-[14px] text-center">
            {step === 'phone' ? 'Telefon numaranla giriş yap' : 'Telefonuna gelen kodu gir'}
          </p>

          {step === 'phone' ? (
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(null) }}
              onKeyDown={(e) => { if (e.key === 'Enter' && phone && !loading) sendCode() }}
              placeholder="+90 5xx xxx xx xx"
              disabled={loading}
              className="w-full h-[54px] rounded-2xl px-5 text-white text-[17px] glass outline-none placeholder:text-white/30 disabled:opacity-50"
            />
          ) : (
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(null) }}
              onKeyDown={(e) => { if (e.key === 'Enter' && code.length >= 4 && !loading) verify() }}
              placeholder="123456"
              disabled={loading}
              autoFocus
              className="w-full h-[54px] rounded-2xl px-5 text-white text-[20px] tracking-[0.4em] text-center glass outline-none placeholder:text-white/30 placeholder:tracking-normal disabled:opacity-50"
            />
          )}

          {error && <p className="text-red-400 text-[13px] text-center">{error}</p>}

          <button
            onClick={step === 'phone' ? sendCode : verify}
            disabled={loading || (step === 'phone' ? !phone.trim() : code.length < 4)}
            className="w-full h-[54px] rounded-2xl flex items-center justify-center gap-2.5 text-white font-semibold text-[17px] transition-all duration-200 active:scale-[0.97] disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #A855F7, #3B82F6)' }}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              step === 'phone' ? 'Kod Gönder' : 'Giriş Yap'
            )}
          </button>

          {step === 'code' && (
            <button
              onClick={() => { setStep('phone'); setCode(''); setError(null) }}
              disabled={loading}
              className="text-white/50 text-[13px] hover:text-white/70 disabled:opacity-40"
            >
              ← Numarayı değiştir
            </button>
          )}
        </div>

        <p className="text-white/25 text-[11px] text-center leading-relaxed">
          Girişin SMS ile güvenli. Verilerin numarana bağlı bulutta saklanır. Devam ederek{' '}
          <span className="underline underline-offset-2 cursor-pointer hover:text-white/50">Gizlilik Politikası</span>
          {' '}ve{' '}
          <span className="underline underline-offset-2 cursor-pointer hover:text-white/50">Kullanım Koşulları</span>
          &apos;nı kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  )
}
