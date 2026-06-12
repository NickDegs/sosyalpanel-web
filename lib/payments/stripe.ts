import Stripe from 'stripe'

// Server-side Stripe client — only used in API routes / server actions
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY not set')
  return new Stripe(key, { apiVersion: '2026-05-27.dahlia' })
}

export const PLANS = {
  free: {
    id: 'free',
    name: 'Ücretsiz',
    price: 0,
    currency: 'try',
    features: ['3 hesap', 'Son 30 veri', 'Temel analiz'],
    stripePriceId: null,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 99,
    currency: 'try',
    interval: 'month' as const,
    features: ['Sınırsız hesap', 'Son 90 veri', 'Gelişmiş analiz', 'CSV dışa aktarma'],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
  },
  yearly: {
    id: 'yearly',
    name: 'Pro Yıllık',
    price: 799,
    currency: 'try',
    interval: 'year' as const,
    features: ['Pro\'nun tüm özellikleri', '2 ay ücretsiz'],
    stripePriceId: process.env.STRIPE_YEARLY_PRICE_ID ?? null,
    badge: '%33 indirim',
  },
} as const

export type PlanId = keyof typeof PLANS
