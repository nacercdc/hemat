/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-properties */
export async function refreshAccessToken(refreshToken: string) {
  try {
    const url = new URL("auth/refresh-token", process.env.NEXT_PUBLIC_HOST_URL);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${refreshToken}` },
      method: "POST",
    });
    const newToken = await response.json();

    if (!response.ok) {
      throw new Error("RefreshTokenError");
    }

    return {
      token: newToken.token,
      refreshToken: newToken.refreshToken,
      expires: newToken.expires,
    };
  } catch (error) {
    throw new Error("RefreshTokenError");
  }
}
