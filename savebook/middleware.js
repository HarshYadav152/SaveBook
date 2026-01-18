import { NextResponse } from 'next/server';
import { verifyJwtToken } from './lib/utils/JWT';

export default async function middleware(request) {
  const protectedPaths = ['/api/notes', '/notes'];
  const path = request.nextUrl.pathname;

  const isProtectedPath = protectedPaths.some(
    prefix => path === prefix || path.startsWith(`${prefix}/`)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify the token (async)
  const tokenInfo = await verifyJwtToken(token);

  if (!tokenInfo.success) {
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: tokenInfo.error },
        { status: 401 }
      );
    }

    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('authToken');
    return response;
  }

  // Add user info to headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', tokenInfo.userId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/api/notes/:path*', '/notes/:path*'],
};