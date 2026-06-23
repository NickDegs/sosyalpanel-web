import { NextResponse } from 'next/server'
import { SP_TOKEN, SP_UID, SP_PHONE } from '@/lib/auth'

// Çıkış — SMS oturum çerezlerini temizler.
export async function POST() {
  const out = NextResponse.json({ ok: true })
  for (const name of [SP_TOKEN, SP_UID, SP_PHONE]) {
    out.cookies.set(name, '', { path: '/', maxAge: 0 })
  }
  return out
}
