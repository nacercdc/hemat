/* eslint-disable @typescript-eslint/no-unused-vars */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getTokenExpireMilliseconds } from "@etm/utilities/date.utils";
import { clearAuthCookies, refreshAccessToken, setAuthCookies } from "../utils";

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
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
