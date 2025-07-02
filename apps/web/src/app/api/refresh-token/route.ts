/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { serialize } from "cookie";

import { CLEAR_COOKIE_CONFIG, SET_COOKIE_CONFIG } from "../configs";
import { refreshAccessToken } from "../utils/refresh-token.utils";
import { getTokenExpireMilliseconds } from "@etm/utilities";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = (cookieStore as any).get("refreshToken")?.value;
  if (!refreshToken) {
    const res = NextResponse.json(
      { error: "No refresh token" },
      { status: 401 }
    );

    res.headers.set(
      "Set-Cookie",
      [
        serialize("token", "", CLEAR_COOKIE_CONFIG),
        serialize("refreshToken", "", CLEAR_COOKIE_CONFIG),
        serialize("expires", "", CLEAR_COOKIE_CONFIG),
      ].join(", ")
    );

    return res;
  }

  try {
    const newTokens = await refreshAccessToken(refreshToken);

    const res = NextResponse.json({
      token: newTokens.token,
      refreshToken: newTokens.refreshToken,
      expires: getTokenExpireMilliseconds(newTokens.expires).toString(),
    });

    res.headers.set(
      "Set-Cookie",
      [
        serialize("token", newTokens.token, SET_COOKIE_CONFIG),
        serialize("refreshToken", newTokens.refreshToken, SET_COOKIE_CONFIG),
        serialize(
          "expires",
          getTokenExpireMilliseconds(newTokens.expires).toString(),
          SET_COOKIE_CONFIG
        ),
      ].join(", ")
    );

    return res;
  } catch (error) {
    const res = NextResponse.json(
      { error: "Refresh token failed" },
      { status: 401 }
    );

    res.headers.set(
      "Set-Cookie",
      [
        serialize("token", "", CLEAR_COOKIE_CONFIG),
        serialize("refreshToken", "", CLEAR_COOKIE_CONFIG),
        serialize("expires", "", CLEAR_COOKIE_CONFIG),
      ].join(", ")
    );

    return res;
  }
}
