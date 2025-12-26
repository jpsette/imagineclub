import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'pt']
const defaultLocale = 'pt'

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    if (pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
        return
    }

    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    if (pathnameIsMissingLocale) {
        const locale = defaultLocale
        return NextResponse.redirect(
            new URL(`/${locale}${pathname}`, request.url)
        )
    }
}

export const config = {
    matcher: [
        '/((?!_next).*)',
    ],
}
