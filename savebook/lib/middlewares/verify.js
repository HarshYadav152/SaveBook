import { NextResponse } from 'next/server';
import { verifyJwtToken } from '../utils/JWT';

export function middleware(request) {
  // Paths that require authentication
  const protectedPaths = ['/api/notes', '/notes'];
  const path = request.nextUrl.pathname;
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(prefix => 
    path === prefix || path.startsWith(`${prefix}/`)
  );
  
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Get auth token from cookie
  const token = request.cookies.get('authtoken')?.value;
  
  if (!token) {
    // If accessing API route, return error response
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }
    // For page routes, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify the token
   // Verify the token
  const tokenInfo = verifyJwtToken(authToken);
  if (!tokenInfo.success) {
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: tokenInfo.error },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/notes/:path*', '/notes/:path*'],
};