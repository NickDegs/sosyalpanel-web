import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { getStripe, PLANS, PlanId } from '@/lib/payments/stripe'

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { planId } = await request.json() as { planId: PlanId }
  const plan = PLANS[planId]
  if (!plan || plan.id === 'free' || !plan.stripePriceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    client_reference_id: user.id,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?payment=success`,
    cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/upgrade?payment=cancelled`,
    metadata: { user_id: user.id, plan_id: planId },
  })

  return NextResponse.json({ url: session.url })
}
