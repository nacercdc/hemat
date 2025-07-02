/* eslint-disable @typescript-eslint/no-unused-vars */
import { env } from "~/env";

export async function refreshAccessToken(refreshToken: string) {
  try {
    const url = new URL("auth/refresh-token", env.NEXT_PUBLIC_HOST_URL);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${refreshToken}` },
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("RefreshTokenError");
    }

    const newToken = await response.json();

    return {
      token: newToken.token,
      refreshToken: newToken.refreshToken,
      expires: newToken.expires,
    };
  } catch (error) {
    throw new Error("RefreshTokenError");
  }
}
