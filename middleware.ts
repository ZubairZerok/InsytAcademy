// middleware.ts
// Open access middleware for INSYT.BAU Academic OS.

import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    return NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};
