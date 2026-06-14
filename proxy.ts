import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_READY = !!(SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes('placeholder'))

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const isAppRoute =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/analytics') ||
    request.nextUrl.pathname.startsWith('/compose') ||
    request.nextUrl.pathname.startsWith('/tips') ||
    request.nextUrl.pathname.startsWith('/settings') ||
    request.nextUrl.pathname.startsWith('/upgrade')

  // If Supabase not configured, allow everything through (demo mode)
  if (!SUPABASE_READY) {
    return supabaseResponse
  }

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_KEY!, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(toSet) {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        toSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {}

  if (isAppRoute && !user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (request.nextUrl.pathname === '/' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|api).*)'],
}
