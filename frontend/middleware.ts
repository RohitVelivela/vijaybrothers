import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const adminToken = request.cookies.get('adminToken');
  const { pathname } = request.nextUrl;

  // Define public paths that do not require authentication
  const publicAdminPaths = ['/admin/login', '/admin/signup'];

  // Check if the path starts with /admin
  if (pathname.startsWith('/admin')) {
    // Block access if no admin token exists
    if (!adminToken && !publicAdminPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If admin is logged in and tries to access login/signup, redirect to dashboard
    if (adminToken && publicAdminPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Additional security: Verify token is valid (optional - can add JWT verification here)
    if (adminToken && !publicAdminPaths.includes(pathname)) {
      try {
        // Add JWT verification logic here if needed
        // For now, just check if token exists
        return NextResponse.next();
      } catch (error) {
        // Invalid token, clear it and redirect to login
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('adminToken');
        return response;
      }
    }
  }

  // Block regular users from accessing admin paths even if they manually type the URL
  if (pathname === '/admin' && !adminToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin'], // Apply middleware to all /admin paths and /admin itself
};
