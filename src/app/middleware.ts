import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import cookie from 'cookie';

export function middleware(request: NextRequest) {
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    const token = cookies.token;

    if (request.nextUrl.pathname === '/dashboard' && !token) {
        return NextResponse.redirect(new URL('/register', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/register'],
};
