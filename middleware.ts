import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // Lấy token từ request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Lấy đường dẫn hiện tại
  const { pathname } = req.nextUrl;

  // Nếu đã đăng nhập, tiếp tục
  if (token) {
    return NextResponse.next();
  }

  // Nếu chưa đăng nhập và không ở trang login/register
  if (pathname !== '/login' && pathname !== '/register') {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Cho phép truy cập các trang không cần bảo vệ
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};