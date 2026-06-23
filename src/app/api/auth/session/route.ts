import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  verifySessionToken,
  toPublicSessionUser,
} from "@/lib/session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const sessionData = await verifySessionToken(sessionCookie.value);

    if (!sessionData) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: toPublicSessionUser(sessionData) });
  } catch {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
