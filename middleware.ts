import { NextResponse, type NextRequest } from 'next/server'

const COOKIE = 'locale'
const ONE_YEAR = 60 * 60 * 24 * 365

/** Locale implied by the path: /ko/... is Korean, everything else English. */
function pathLocale(pathname: string) {
  return pathname === '/ko' || pathname.startsWith('/ko/') ? 'ko' : 'en'
}

function prefersKorean(req: NextRequest) {
  const header = req.headers.get('accept-language') ?? ''
  const first = header.split(',')[0]?.trim().toLowerCase() ?? ''
  return first.startsWith('ko')
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const current = pathLocale(pathname)
  const saved = req.cookies.get(COOKIE)?.value

  // First visit to an English URL from a Korean-preferring browser: send to /ko.
  if (current === 'en' && !saved && prefersKorean(req)) {
    const url = req.nextUrl.clone()
    url.pathname = pathname === '/' ? '/ko' : `/ko${pathname}`
    url.search = search
    const res = NextResponse.redirect(url)
    res.cookies.set(COOKIE, 'ko', { path: '/', maxAge: ONE_YEAR, sameSite: 'lax' })
    return res
  }

  // Remember whichever locale the visitor is actually on (explicit toggles stick).
  const res = NextResponse.next()
  if (saved !== current) {
    res.cookies.set(COOKIE, current, { path: '/', maxAge: ONE_YEAR, sameSite: 'lax' })
  }
  return res
}

export const config = {
  // Only HTML pages: skip assets, downloads, print sources, and machine-readable files.
  matcher: ['/((?!_next|downloads|print|llms|robots|sitemap|favicon|.*\\..*).*)'],
}
