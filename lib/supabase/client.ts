import { createBrowserClient } from '@supabase/ssr'
import { getBrowserToken } from '@/lib/auth'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'
  // SMS JWT'si çerezde varsa RLS bunu kullanır (auth.uid()=sub).
  const token = getBrowserToken()
  return createBrowserClient(url, key, {
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  })
}
