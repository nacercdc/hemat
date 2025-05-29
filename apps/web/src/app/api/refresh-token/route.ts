/* eslint-disable @typescript-eslint/no-unused-vars */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { refreshAccessToken } from "~/app/actions/refresh-token.actions";
import { getTokenExpireMilliseconds } from "@etm/utilities/date.utils";
import { clearAuthCookies, SET_COOKIE_CONFIG } from "../configs/cookie.config";
import { setAuthCookies } from "../utils";

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken || !jwt.decode(refreshToken)) {
    const response = NextResponse.json(
      { error: "No refresh token" },
      { status: 401 }
    );
    clearAuthCookies(response);
    return response;
  }

  try {
    const newTokens = await refreshAccessToken(refreshToken);
    const response = NextResponse.json({
      token: newTokens.token,
      refreshToken: newTokens.refreshToken,
      expires: getTokenExpireMilliseconds(newTokens.expires).toString(),
    });
    setAuthCookies(response, newTokens);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Refresh token failed" },
      { status: 401 }
    );
  }
}
