import { NextResponse } from "next/server";
import { getSessionCookieOptions } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set({
    ...getSessionCookieOptions(),
    value: "",
    maxAge: 0,
  });
  return response;
}
