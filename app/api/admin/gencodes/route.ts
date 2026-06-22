import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { adminDb, checkAdminSecret } from '@/lib/supabase/admin'

// NickDegs Admin Hub — premium/erişim kodu üretimi.
// {secret, count} → {codes:[...]}
function genCode(): string {
  // SP-XXXX-XXXX (karışık olmayan karakterler)
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const b = randomBytes(8)
  let s = ''
  for (let i = 0; i < 8; i++) {
    s += alphabet[b[i] % alphabet.length]
    if (i === 3) s += '-'
  }
  return 'SP-' + s
}

export async function POST(request: Request) {
  const { secret, count } = await request.json().catch(() => ({}))
  if (!checkAdminSecret(secret)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const n = Math.min(Math.max(parseInt(String(count ?? 1), 10) || 1, 1), 500)
  const codes = Array.from({ length: n }, genCode)

  const db = adminDb()
  const { error } = await db.from('admin_codes').insert(codes.map((code) => ({ code })))
  if (error) return NextResponse.json({ error: 'kod kaydedilemedi' }, { status: 500 })

  return NextResponse.json({ codes })
}
