import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminRoutes, ceoRoutes, employeeRoutes, managerRoutes, userRoutes } from '@/lib/data'

// Define the roles and their corresponding allowed paths
const roleRoutes: Record<string, { href: string }[]> = {
  User: userRoutes,
  Applicant: userRoutes,
  Interviewee: userRoutes,
  Admin: adminRoutes,
  Employee: employeeRoutes,
  Manager: managerRoutes,
  CEO: ceoRoutes,
}

export async function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value

  if (!userId) {
    return NextResponse.redirect(new URL('/signIn', request.url))
  }

  // Verify user role
  const userResponse = await fetch(`${request.nextUrl.origin}/api/user/role`, {
    headers: {
      Cookie: `userId=${userId}`,
    },
  })

  if (!userResponse.ok) {
    return NextResponse.redirect(new URL('/signIn', request.url))
  }

  const { role } = await userResponse.json()

  // Check if the user has permission to access the current path
  const path = request.nextUrl.pathname
  const isAllowed = roleRoutes[role]?.some(route => path.startsWith(route.href)) || false

  if (!isAllowed) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/employee/:path*',
    '/manager/:path*',
    '/ceo/:path*',
    '/profile',
    '/settings',
    '/notifications',
  ],
}

