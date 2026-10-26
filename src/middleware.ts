import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only guard /admin/* paths
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow login route
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check auth cookie/header or token
  const authCookie =
    req.cookies.get('sb-access-token') ||
    req.cookies.get('dentacare-admin-session') ||
    req.cookies.get('supabase-auth-token')

  // When Supabase is fully configured in prod, verify the user and MFA assurance level (aal2).
  // In development/preview or unauthorized requests:
  // Blueprint Section 6: "Return 404 instead of 403 for non-admins so /admin is not advertised."
  if (process.env.NODE_ENV === 'production' && !authCookie) {
    return NextResponse.rewrite(new URL('/not-found', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
