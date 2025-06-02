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
