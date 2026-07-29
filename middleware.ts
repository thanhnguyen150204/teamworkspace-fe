import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest){
    const {pathname} = request.nextUrl;
    const token = request.cookies.get('access_token')?.value;
    const isAuthPage = pathname.startsWith('/auth');
    const isDashboardPage = pathname.startsWith('/dashboard');
    if(isDashboardPage && !token ){
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if(isAuthPage && token){
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
}
export const config = {
    matcher: ['/dashboard/:path*', '/auth/:path*'],
}