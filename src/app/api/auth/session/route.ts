import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("ddl-session");

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const sessionData = JSON.parse(atob(sessionCookie.value));
    
    if (sessionData.exp < Date.now()) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: sessionData });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
