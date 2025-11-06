import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = [
  '/signin',
  '/signup'
]

// Admin-only routes
const adminRoutes = [
  '/admin',
  '/admin/dashboard',
  '/admin/orders',
  '/admin/products',
  '/admin/customers',
  '/admin/messages'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if this is a public route
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Check if this is an admin route
  const isAdminRoute = adminRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Get tokens from cookies
  const adminToken = request.cookies.get('admin_token')?.value
  const userToken = request.cookies.get('user')?.value

  // Allow public routes without authentication
  if (isPublicRoute) {
    // If user is already authenticated, redirect to appropriate page
    if (adminToken) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    if (userToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // For admin routes, check admin token
  if (isAdminRoute) {
    if (!adminToken) {
      return NextResponse.redirect(new URL(`/signin?redirect=${pathname}`, request.url))
    }
    return NextResponse.next()
  }

  // For all other routes, require authentication (either admin or user)
  if (!adminToken && !userToken) {
    return NextResponse.redirect(new URL(`/signin?redirect=${pathname}`, request.url))
  }

  // If admin tries to access regular user routes, allow it (they can browse the site)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}