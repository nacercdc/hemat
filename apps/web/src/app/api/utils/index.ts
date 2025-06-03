import { env } from "~/env";
import type { LoginRequestBody, LoginResponse, TokenResponse } from "../types";
import { COOKIE_KEYS, SET_COOKIE_CONFIG } from "../configs/cookie.config";
import { getTokenExpireMilliseconds } from "@etm/utilities";
import { serialize } from "cookie";
import type { NextResponse } from "next/server";

export const authenticateUser = async ({
  email,
  password,
}: LoginRequestBody): Promise<LoginResponse> => {
  const res = await fetch(`${env.NEXT_PUBLIC_HOST_URL}auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const rawResult = await res.json();
  if (!res.ok) {
    const errorMessage =
      typeof rawResult.message === "string"
        ? rawResult.message
        : "Invalid username or password";
    throw new Error(errorMessage);
  }

  return rawResult as LoginResponse;
};

export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse> {
  const url = new URL("/api/auth/refresh-token", env.NEXT_PUBLIC_HOST_URL);

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const data = (await response.json()) as TokenResponse;

    if (!response.ok) {
      console.log(data, "data");

      throw new Error("Failed to refresh token");
    }

    return {
      token: data.token,
      refreshToken: data.refreshToken,
      expires: data.expires,
    };
  } catch (err) {
    console.error("refreshAccessToken error:", err);
    throw new Error("RefreshTokenError");
  }
}

export function setAuthCookies(
  response: NextResponse,
  tokens: TokenResponse
): void {
  const cookies = [
    serialize("token", tokens.token, SET_COOKIE_CONFIG),
    serialize("refreshToken", tokens.refreshToken, SET_COOKIE_CONFIG),
    serialize(
      "expires",
      getTokenExpireMilliseconds(tokens.expires).toString(),
      SET_COOKIE_CONFIG
    ),
  ];
  response.headers.set("Set-Cookie", cookies.join(", "));
}

export const clearAuthCookies = (response: NextResponse): void => {
  const cookies = COOKIE_KEYS.map((key) =>
    serialize(key, "", { ...SET_COOKIE_CONFIG, expires: new Date(0) })
  );
  response.headers.set("Set-Cookie", cookies.join(", "));
};
