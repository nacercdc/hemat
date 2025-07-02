/* eslint-disable @typescript-eslint/no-unused-vars */

export async function refreshAccessToken(refreshToken: string) {
  try {
    const url = new URL(
      "auth/refresh-token",
      "https://africa-cdc-app-hemat-api-501628761718.us-west1.run.app/api/"
    );

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
