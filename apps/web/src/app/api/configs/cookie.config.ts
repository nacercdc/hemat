export const COOKIE_KEYS = ["token", "refreshToken", "expires"] as const;

export const SET_COOKIE_CONFIG = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7,
};

export const CLEAR_COOKIE_CONFIG = {
  ...SET_COOKIE_CONFIG,
  expires: new Date(0),
};
