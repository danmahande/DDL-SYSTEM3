import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const PUBLIC_AUTH_ROUTES = [
  "/api/auth/login",
  "/api/auth/session",
  "/api/auth/logout",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth/register")) {
    if (process.env.ALLOW_PUBLIC_REGISTRATION !== "true") {
      return NextResponse.json(
        { error: "Registration is disabled" },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  if (PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/retailer-signals")) {
    const apiKey =
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const expected = process.env.RETAILER_API_KEY;

    if (!expected && process.env.NODE_ENV === "development") {
      return NextResponse.next();
    }

    if (!expected || apiKey !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE);
  if (!sessionCookie?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifySessionToken(sessionCookie.value);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
