/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const allCookies: Record<string, string> = {};

  (cookieStore as any)
    .getAll()
    .forEach((cookie: { name: string | number; value: string }) => {
      allCookies[cookie.name] = cookie.value;
    });

  return NextResponse.json({ ...allCookies });
}
