import { NextResponse } from 'next/server'
import { adminDb, checkAdminSecret } from '@/lib/supabase/admin'

// NickDegs Admin Hub — uygulama-içi banner/duyuru.
// {secret, title, body, url, active} → {ok, sent}
export async function POST(request: Request) {
  const { secret, title, body, url, active } = await request.json().catch(() => ({}))
  if (!checkAdminSecret(secret)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const db = adminDb()
  // Tek aktif duyuru: önce mevcut aktifleri pasifle.
  await db.from('admin_announcements').update({ active: false }).eq('active', true)

  if (active === false) {
    return NextResponse.json({ ok: true, sent: 0 })
  }
  if (!title) return NextResponse.json({ error: 'title gerekli' }, { status: 400 })

  await db.from('admin_announcements').insert({
    title,
    body: body ?? null,
    url: url ?? null,
    active: true,
  })
  return NextResponse.json({ ok: true, sent: 1 })
}

// Uygulama-içi banner okuma (aktif duyuru). Public — client'lar çeker.
export async function GET() {
  const db = adminDb()
  const { data } = await db
    .from('admin_announcements')
    .select('title, body, url, created_at')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return NextResponse.json({ announcement: data ?? null })
}
