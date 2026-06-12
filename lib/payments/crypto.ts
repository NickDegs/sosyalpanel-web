// Coinbase Commerce — kripto ödeme (BTC, ETH, USDC, vs.)
// Docs: https://docs.cdp.coinbase.com/commerce/docs

export async function createCryptoCharge(params: {
  name: string
  description: string
  amount: string
  currency: string
  userId: string
  planId: string
}) {
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY
  if (!apiKey) throw new Error('COINBASE_COMMERCE_API_KEY not set')

  const res = await fetch('https://api.commerce.coinbase.com/charges', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CC-Api-Key': apiKey,
      'X-CC-Version': '2018-03-22',
    },
    body: JSON.stringify({
      name: params.name,
      description: params.description,
      pricing_type: 'fixed_price',
      local_price: { amount: params.amount, currency: params.currency },
      metadata: { user_id: params.userId, plan_id: params.planId },
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?payment=success`,
      cancel_url:   `${process.env.NEXT_PUBLIC_APP_URL}/upgrade?payment=cancelled`,
    }),
  })

  if (!res.ok) throw new Error('Coinbase Commerce charge creation failed')
  const { data } = await res.json()
  return data as { id: string; hosted_url: string; expires_at: string }
}
