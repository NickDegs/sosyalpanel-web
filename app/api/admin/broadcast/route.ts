import { NextResponse } from 'next/server'
import { adminDb, checkAdminSecret } from '@/lib/supabase/admin'

// NickDegs Admin Hub — push bildirim yayını.
// {secret, title, body} → {ok, sent}
export async function POST(request: Request) {
  const { secret, title, body } = await request.json().catch(() => ({}))
  if (!checkAdminSecret(secret)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  if (!title) return NextResponse.json({ error: 'title gerekli' }, { status: 400 })

  const db = adminDb()
  await db.from('admin_broadcasts').insert({ title, body: body ?? null })
  // Kayıtlı push token sayısı (push altyapısı eklenince gerçek gönderim buraya).
  const { count } = await db.from('push_tokens').select('*', { count: 'exact', head: true })

  return NextResponse.json({ ok: true, sent: count ?? 0 })
}
