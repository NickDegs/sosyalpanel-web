import { NextResponse } from 'next/server'
import { AUTH_SERVICE_URL } from '@/lib/auth'

// SMS OTP gönderir (auth servisine proxy).
export async function POST(request: Request) {
  const { phone } = await request.json() as { phone?: string }
  const clean = (phone ?? '').replace(/\D/g, '')
  if (clean.length < 8) {
    return NextResponse.json({ error: 'bad_number' }, { status: 400 })
  }
  try {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: clean }),
    })
    if (res.status === 400) return NextResponse.json({ error: 'bad_number' }, { status: 400 })
    if (!res.ok) return NextResponse.json({ error: 'network' }, { status: 502 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'network' }, { status: 502 })
  }
}
