import { NextResponse } from 'next/server'
import { AUTH_SERVICE_URL, SP_TOKEN, SP_UID, SP_PHONE } from '@/lib/auth'

const MAX_AGE = 60 * 60 * 24 * 60 // 60 gün (token exp ile uyumlu)

// SMS OTP doğrular; başarıda JWT'yi çerezlere yazar.
export async function POST(request: Request) {
  const { phone, code } = await request.json() as { phone?: string; code?: string }
  const clean = (phone ?? '').replace(/\D/g, '')
  const otp = (code ?? '').trim()
  if (clean.length < 8 || otp.length < 4) {
    return NextResponse.json({ error: 'bad_input' }, { status: 400 })
  }
  try {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: clean, code: otp }),
    })
    if (res.status === 401) return NextResponse.json({ error: 'bad_code' }, { status: 401 })
    const data = await res.json().catch(() => null) as { token?: string; uid?: string; phone?: string } | null
    if (!res.ok || !data?.token || !data?.uid) {
      return NextResponse.json({ error: 'network' }, { status: 502 })
    }

    const out = NextResponse.json({ ok: true })
    // Browser JS uid/token okuyabilsin (RLS + insert için) → httpOnly DEĞİL.
    const opts = { path: '/', maxAge: MAX_AGE, sameSite: 'lax' as const, secure: true }
    out.cookies.set(SP_TOKEN, data.token, opts)
    out.cookies.set(SP_UID, data.uid, opts)
    out.cookies.set(SP_PHONE, data.phone ?? clean, opts)
    return out
  } catch {
    return NextResponse.json({ error: 'network' }, { status: 502 })
  }
}
