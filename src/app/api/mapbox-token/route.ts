import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
  return NextResponse.json({ token });
}
