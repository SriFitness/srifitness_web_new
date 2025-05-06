import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Allow Socket.IO connections without authentication
  if (request.nextUrl.pathname.startsWith('/api/socket')) {
    return NextResponse.next()
  }

  const authToken = request.cookies.get("firebaseIdToken")?.value
  const tokenExpiration = request.cookies.get("tokenExpiration")?.value

  // Check if token is expired
  if (!authToken || !tokenExpiration || new Date().getTime() > parseInt(tokenExpiration)) {
    // Clear expired cookies
    const response = NextResponse.redirect(new URL('/sign-in', request.url))
    response.cookies.delete("firebaseIdToken")
    response.cookies.delete("tokenExpiration")
    return response
  }

  // For admin routes, verify admin or subadmin access
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      // Verify admin status using an API route
      const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify-admin-subadmin`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      if (!verifyResponse.ok) {
        // Generate a temporary token for the unauthorized redirect
        const tempToken = crypto.randomUUID()
        
        // Create a response that redirects
        const response = NextResponse.redirect(
          new URL(`/unauthorized?token=${tempToken}`, request.url)
        )
        
        // Set the token as a cookie
        response.cookies.set('unauthorizedRedirectToken', tempToken, { 
          maxAge: 60,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })

        return response
      }

      const { role } = await verifyResponse.json()

      // Check for restricted subadmin routes
      if (role === 'subadmin') {
        const restrictedRoutes = ['/admin/workout', '/admin/marketplace']
        if (restrictedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
          return NextResponse.redirect(new URL('/admin/unauthorized', request.url))
        }
      }

      return NextResponse.next()
    } catch (error) {
      console.error("Error in middleware:", error)
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  // For user profile routes
  if (request.nextUrl.pathname.startsWith('/user/')) {
    try {
      const userId = request.nextUrl.pathname.split('/')[2]
      const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify-user`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'X-Requested-User-Id': userId
        }
      })

      if (!verifyResponse.ok) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      return NextResponse.next()
    } catch (error) {
      console.error("Error in middleware:", error)
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }
  
  // For settings page - require authentication
  if (request.nextUrl.pathname.startsWith('/settings')) {
    return NextResponse.next()
  }

  // For non-admin routes, continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/socket',
    '/admin/:path*',
    '/user/:path*',
    '/unauthorized',
    '/settings'
  ]
}

