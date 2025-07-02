/* eslint-disable no-restricted-properties */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const SET_COOKIE_CONFIG: any = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
};

export const CLEAR_COOKIE_CONFIG = {
  ...SET_COOKIE_CONFIG,
  expires: new Date(0),
};
