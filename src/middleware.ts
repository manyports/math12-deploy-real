import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import cookie from 'cookie';

export function middleware(request: NextRequest) {
    const cookiesStore = cookies()
    const token = cookiesStore.get("token");

    const isAuth = !!token;
    const pathname = request.nextUrl.pathname;

    const isAuthPage = pathname === '/register' || pathname === '/login';

    if (isAuthPage && isAuth) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (request.nextUrl.pathname === '/dashboard'  && !isAuth) {
        return NextResponse.redirect(new URL('/register', request.url));
    }
        else if(request.nextUrl.pathname === '/chats' && !isAuth){
            return NextResponse.redirect(new URL('/register', request.url));
        }
            else if(request.nextUrl.pathname === '/imagesolver' && !isAuth){
                return NextResponse.redirect(new URL('/register', request.url));
            }
                else if(request.nextUrl.pathname === '/test' && !isAuth){
                    return NextResponse.redirect(new URL('/register', request.url));
                }
}

export const config = {
    matcher: ['/dashboard', '/register', '/login'],
};
