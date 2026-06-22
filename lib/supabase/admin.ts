import { createClient } from '@supabase/supabase-js'

// Service-role Supabase client — RLS bypass (yalnızca sunucu tarafı admin işlemleri).
export function adminDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

// Admin Hub secret doğrulama. Yanlışsa false → çağıran 403 döner.
export function checkAdminSecret(secret: unknown): boolean {
  const expected = process.env.ADMIN_HUB_SECRET
  return typeof secret === 'string' && !!expected && secret === expected
}
