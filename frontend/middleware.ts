import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Define public paths that do not require authentication
  const publicAdminPaths = ['/admin', '/admin/login', '/admin/signup'];

  // Check if the path starts with /admin
  if (pathname.startsWith('/admin')) {
    // If there is no token and the path is not a public admin path, redirect to login
    if (!token && !publicAdminPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If there is a token and the user tries to access login or signup, redirect to dashboard
    // This prevents logged-in users from seeing the login/signup pages
    if (token && (pathname === '/admin/login' || pathname === '/admin/signup')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin'], // Apply middleware to all /admin paths and /admin itself
};
