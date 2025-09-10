import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the main page and login page without auth
  if (pathname === "/" || pathname === "/login") {
    return NextResponse.next();
  }

  // Check session via Better Auth endpoint
  const sessionRes = await fetch(new URL("/api/auth/session", request.url), {
    method: "GET",
    headers: {
      cookie: request.headers.get("cookie") ?? "",
    },
  });

  if (sessionRes.ok) {
    const sessionData = await sessionRes.json();
    // Check if we have a valid session with user data
    if (sessionData?.user) {
      return NextResponse.next();
    }
  }

  // Not authenticated: redirect to main page
  const url = new URL("/", request.url);
  url.searchParams.set("redirect", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Protect everything except API routes, Next static/image, favicon, and assets
    "/((?!api|_next/static|_next/image|favicon.ico|assets/).*)",
  ],
};


