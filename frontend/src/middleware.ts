import { NextResponse, type NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from '@/types';

const publicRoutes = ['/'];
const adminRoutes = ['/admin'];

const userRoutes = ['/contato', '/livros', '/meus-favoritos'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some(
    route =>
      pathname === route || (route !== '/' && pathname.startsWith(route)),
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  let decodedToken: DecodedToken;
  try {
    decodedToken = jwtDecode(token);
    const isExpired = decodedToken.exp * 1000 < Date.now();
    if (isExpired) {
      throw new Error('Token expirado');
    }
  } catch (error) {
    console.error('Token inválido/expirado no middleware:', error);
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('authToken');
    return response;
  }

  const userRoles = decodedToken.roles || [];

  const isTryingToAccessAdminRoute = adminRoutes.some(route =>
    pathname.startsWith(route),
  );

  if (isTryingToAccessAdminRoute) {
    if (!userRoles.includes('sysadmin')) {
      return NextResponse.redirect(new URL('/404', request.url));
    }
    return NextResponse.next();
  }

  const isTryingToAccessUserRoute = userRoutes.some(route =>
    pathname.startsWith(route),
  );

  if (isTryingToAccessUserRoute) {
    if (!userRoles.includes('user') && !userRoles.includes('sysadmin')) {
      return NextResponse.redirect(new URL('/404', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.pdf$|favicon.ico).*)',
  ],
};
