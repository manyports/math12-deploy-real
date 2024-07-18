import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import cookie from 'cookie';

export function middleware(request: NextRequest) {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token");

    const isAuth = !!token;
    const pathname = request.nextUrl.pathname;

    const isAuthPage = pathname === '/register' || pathname === '/login';
    const protectedRoutes = ['/dashboard', '/imagesolver', '/chats', '/test', '/special-test', '/gamification'
    ];

    if (isAuthPage && isAuth) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (protectedRoutes.includes(pathname) && !isAuth) {
        return NextResponse.redirect(new URL('/register', request.url));
    }
}

export const config = {
    matcher: ['/dashboard', '/register', '/login', '/imagesolver', '/chats', '/test', '/special-test', '/gamification'],
};