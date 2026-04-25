import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const supported = ['TR', 'EN', 'FR', 'AR', 'RU']

function pickLangFromHeader(header: string | null): string {
  if (!header) return 'TR'
  const first = header.split(',')[0].split(';')[0].trim() // e.g. "en-US"
  const code = first.split('-')[0].toUpperCase()
  if (supported.includes(code)) return code
  // some browsers send full locales (e.g. 'tr-TR'), so try mapping by prefix
  if (supported.includes(first.toUpperCase())) return first.toUpperCase()
  // fallback to TR
  return 'TR'
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const shouldNoindex = pathname.startsWith('/admin') || pathname.startsWith('/api/')

  // If a cookie already exists, don't overwrite it.
  const existing = req.cookies.get('yasar_lang')
  if (existing) {
    const res = NextResponse.next()
    if (shouldNoindex) res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
    return res
  }

  const header = req.headers.get('accept-language')
  const lang = pickLangFromHeader(header)

  const res = NextResponse.next()
  if (shouldNoindex) res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  // set a cookie so the client-side LanguageProvider can read it on mount
  res.cookies.set('yasar_lang', lang, { path: '/', maxAge: 60 * 60 * 24 * 30 })
  return res
}

export const config = {
  matcher: '/:path*',
}
