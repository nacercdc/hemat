import { serialize } from "cookie";
import type { NextResponse } from "next/server";
export const COOKIE_KEYS = ["token", "refreshToken", "expires"] as const;

export const BASE_COOKIE_CONFIG = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export const SET_COOKIE_CONFIG = {
  ...BASE_COOKIE_CONFIG,
  secure: true,
  expires: new Date(0),
};

export const clearAuthCookies = (response: NextResponse): void => {
  const cookies = COOKIE_KEYS.map((key) =>
    serialize(key, "", { ...BASE_COOKIE_CONFIG, expires: new Date(0) })
  );
  response.headers.set("Set-Cookie", cookies.join(", "));
};
