import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCryptoCharge } from '@/lib/payments/crypto'
import { PLANS, PlanId } from '@/lib/payments/stripe'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { planId } = await request.json() as { planId: PlanId }
  const plan = PLANS[planId]
  if (!plan || plan.id === 'free') {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const charge = await createCryptoCharge({
    name: `Social Panel ${plan.name}`,
    description: `Social Panel ${plan.name} aboneliği`,
    amount: String(plan.price),
    currency: 'TRY',
    userId: user.id,
    planId,
  })

  return NextResponse.json({ url: charge.hosted_url, expiresAt: charge.expires_at })
}
