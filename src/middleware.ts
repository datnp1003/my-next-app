import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;
  // Redirect "/" to "/client"
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/client', req.url));
  }

  // Cho phép các public route
  if (
    pathname.startsWith('/client') ||
    pathname.startsWith('/api/messages') ||
    pathname.startsWith('/api/product') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/auth/register') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  console.log('Token:', token);
  // Nếu chưa đăng nhập hoặc token hết hạn, chuyển hướng đến /login
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Nếu đã đăng nhập, tiếp tục
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};