import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SP_TOKEN } from '@/lib/auth'

export async function createClient() {
  const cookieStore = await cookies()
  // SMS JWT'si varsa RLS bunu kullanır (auth.uid()=sub). Yoksa anon.
  const token = cookieStore.get(SP_TOKEN)?.value
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL    ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder',
    {
      global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      cookies: {
        getAll()         { return cookieStore.getAll() },
        setAll(toSet)    { try { toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} },
      },
    }
  )
}
