import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("ddl-session");
  return NextResponse.json({ message: "Logged out" });
}
