import { NextResponse } from "next/server";
import { serialize } from "cookie";

import { CLEAR_COOKIE_CONFIG } from "../configs";

export function GET() {
  const response = NextResponse.json({ success: true });

  response.headers.set(
    "Set-Cookie",
    [
      serialize("token", "", CLEAR_COOKIE_CONFIG),
      serialize("refreshToken", "", CLEAR_COOKIE_CONFIG),
      serialize("expires", "", CLEAR_COOKIE_CONFIG),
    ].join(", ")
  );

  return response;
}
