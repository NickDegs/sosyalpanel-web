// SMS girişi (Twilio Verify → Supabase JWT) — mobil ile aynı backend.
// JWT custom servisten gelir, JWT_SECRET ile imzalı (role=authenticated, sub=uid).
// Web tarafında çerezde tutulur; RLS (auth.uid()=sub) doğrulamasını Supabase yapar.

export const SP_TOKEN = 'sp_token'
export const SP_UID = 'sp_uid'
export const SP_PHONE = 'sp_phone'

// SMS auth servisi (server'da, subdomain proxy). Vercel/server → bu adresi çağırır.
export const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL ?? 'https://sosyalpanel-auth.nickdegs.com'

export interface SessionUser {
  id: string
  phone?: string
  token: string
}

interface JwtPayload {
  sub?: string
  phone?: string
  exp?: number
  [k: string]: unknown
}

// JWT payload'unu kütüphanesiz çöz (gating için; gerçek güvenlik RLS'te imza doğrulamayla).
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const json = typeof atob === 'function'
      ? atob(b64)
      : Buffer.from(b64, 'base64').toString('utf-8')
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

export function isExpired(p: JwtPayload | null): boolean {
  if (!p) return true
  return typeof p.exp === 'number' && p.exp * 1000 < Date.now()
}

// --- Server (server component / route handler) ---
export async function getSessionUser(): Promise<SessionUser | null> {
  const { cookies } = await import('next/headers')
  const store = await cookies()
  const token = store.get(SP_TOKEN)?.value
  if (!token) return null
  const p = decodeJwt(token)
  if (!p || isExpired(p) || !p.sub) return null
  return { id: p.sub, phone: p.phone, token }
}

// --- Browser ---
export function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : null
}

export function getBrowserToken(): string | null {
  return readCookie(SP_TOKEN)
}

export function getBrowserUserId(): string | null {
  return readCookie(SP_UID)
}
