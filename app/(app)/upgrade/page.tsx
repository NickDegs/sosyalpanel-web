'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PLANS, PlanId } from '@/lib/payments/stripe'
import { CheckIcon } from '@/components/icons/Glyphs'

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null)
  const params = useSearchParams()
  const cancelled = params.get('payment') === 'cancelled'

  async function checkout(planId: PlanId, method: 'card' | 'crypto') {
    setLoading(`${planId}-${method}`)
    const endpoint = method === 'card' ? '/api/payments/checkout' : '/api/payments/crypto'
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ planId }) })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(null)
  }

  return (
    <div className="p-5 md:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-white">Pro&apos;ya Geç</h1>
        <p className="text-white/40 text-[14px] mt-1">Tüm özelliklerin kilidini aç</p>
        {cancelled && (
          <div className="mt-3 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[13px]">
            Ödeme iptal edildi. İstediğin zaman tekrar deneyebilirsin.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(Object.values(PLANS) as typeof PLANS[PlanId][]).map(plan => {
          const isFree = plan.id === 'free'
          return (
            <div key={plan.id}
              className={`glass rounded-2xl p-5 flex flex-col gap-4 border ${
                plan.id === 'pro' ? 'border-violet-500/40' : 'border-white/[0.06]'
              }`}>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold text-[16px]">{plan.name}</p>
                  {'badge' in plan && plan.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="text-white/60 text-[13px] mt-1">
                  {plan.price === 0 ? 'Ücretsiz' : `₺${plan.price} / ${'interval' in plan ? (plan.interval === 'month' ? 'ay' : 'yıl') : ''}`}
                </p>
              </div>

              <ul className="flex flex-col gap-1.5 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-white/60 text-[13px]">
                    <span className="text-emerald-400 flex-shrink-0"><CheckIcon size={13} /></span> {f}
                  </li>
                ))}
              </ul>

              {!isFree && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => checkout(plan.id as PlanId, 'card')}
                    disabled={!!loading}
                    className="w-full h-10 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40 transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #1D4ED8)' }}>
                    {loading === `${plan.id}-card` ? '…' : 'Kredi Kartı'}
                  </button>
                  <button
                    onClick={() => checkout(plan.id as PlanId, 'crypto')}
                    disabled={!!loading}
                    className="w-full h-10 rounded-xl text-[13px] font-semibold text-white/70 glass disabled:opacity-40 transition-all active:scale-95 border border-white/10">
                    {loading === `${plan.id}-crypto` ? '…' : '₿ Kripto'}
                  </button>
                </div>
              )}
              {isFree && (
                <div className="h-10 rounded-xl flex items-center justify-center text-[13px] text-white/30 bg-white/[0.03]">
                  Mevcut plan
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-6 text-white/25 text-[11px] text-center">
        Ödemeler Stripe ve Coinbase Commerce üzerinden güvenli şekilde işlenir.
      </p>
    </div>
  )
}
