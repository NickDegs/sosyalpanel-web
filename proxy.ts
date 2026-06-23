import { NextResponse, type NextRequest } from 'next/server'
import { SP_TOKEN, decodeJwt, isExpired } from '@/lib/auth'

// SMS oturumu (custom JWT) çerezini kontrol eder. Gotrue oturumu kullanılmaz.
export async function proxy(request: NextRequest) {
  const isAppRoute =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/analytics') ||
    request.nextUrl.pathname.startsWith('/compose') ||
    request.nextUrl.pathname.startsWith('/tips') ||
    request.nextUrl.pathname.startsWith('/settings') ||
    request.nextUrl.pathname.startsWith('/upgrade')

  const token = request.cookies.get(SP_TOKEN)?.value
  const payload = token ? decodeJwt(token) : null
  const loggedIn = !!payload && !isExpired(payload) && !!payload.sub

  // Giriş gerektiren sayfaya girişsiz erişim → login'e
  if (isAppRoute && !loggedIn) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Girişliyken login sayfası → dashboard'a
  if (request.nextUrl.pathname === '/' && loggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|api).*)'],
}
