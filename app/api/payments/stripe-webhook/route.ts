import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/payments/stripe'
import { createClient } from '@/lib/supabase/server'

// Stripe webhook — update user plan in Supabase after successful payment
export async function POST(request: Request) {
  const body = await request.text()
  const sig  = request.headers.get('stripe-signature') ?? ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) return NextResponse.json({ error: 'Webhook secret not set' }, { status: 500 })

  let event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.client_reference_id
    const planId = (session.metadata as Record<string, string> | null)?.plan_id
    if (userId && planId) {
      const supabase = await createClient()
      await supabase.from('user_subscriptions').upsert({ user_id: userId, plan: planId, active: true })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object
    const userId = (sub.metadata as Record<string, string> | null)?.user_id
    if (userId) {
      const supabase = await createClient()
      await supabase.from('user_subscriptions').update({ active: false }).eq('user_id', userId)
    }
  }

  return NextResponse.json({ received: true })
}
