import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  verifySessionToken,
  type SessionUser,
} from "@/lib/session";

export const ADMIN_ROLES = ["admin", "super_admin"];

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie?.value) return null;
  return verifySessionToken(sessionCookie.value);
}

export async function requireSession(): Promise<SessionUser | NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export async function requireRole(
  roles: string[]
): Promise<SessionUser | NextResponse> {
  const result = await requireSession();
  if (result instanceof NextResponse) return result;
  if (!roles.includes(result.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return result;
}

export function requireRetailerApiKey(request: Request): NextResponse | null {
  const apiKey =
    request.headers.get("x-api-key") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  const expected = process.env.RETAILER_API_KEY;
  if (!expected) {
    if (process.env.NODE_ENV === "development") return null;
    return NextResponse.json(
      { error: "RETAILER_API_KEY is not configured" },
      { status: 500 }
    );
  }

  if (apiKey !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export function getCorsHeaders(request?: Request) {
  const allowed = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = request?.headers.get("origin") || "";

  let allowOrigin = "*";
  if (allowed.length > 0) {
    allowOrigin = allowed.includes(requestOrigin)
      ? requestOrigin
      : allowed[0];
  } else if (process.env.NODE_ENV === "production") {
    allowOrigin = requestOrigin || "null";
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
  };
}

export function isRegistrationEnabled(): boolean {
  return process.env.ALLOW_PUBLIC_REGISTRATION === "true";
}

export function jsonWithCors(
  data: unknown,
  request: Request,
  init?: ResponseInit
) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...getCorsHeaders(request),
      ...(init?.headers || {}),
    },
  });
}
