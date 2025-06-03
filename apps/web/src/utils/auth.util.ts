import type { LoginResponse } from "~/app/api/types";

const fetchJSON = async <T>(url: string, errorMessage: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
};

let refreshTokenPromise: Promise<LoginResponse> | null = null;

export const refreshAccessToken = async (): Promise<LoginResponse> => {
  if (!refreshTokenPromise) {
    refreshTokenPromise = (async () => {
      try {
        const refreshed = await fetchJSON<LoginResponse>(
          "/api/refresh-token",
          "Unable to refresh token."
        );
        return refreshed;
      } catch (error) {
        console.error("Token refresh error:", error);
        throw new Error("Token refresh failed.");
      } finally {
        refreshTokenPromise = null;
      }
    })();
  }

  return refreshTokenPromise;
};

export const getSession = async (): Promise<LoginResponse> => {
  try {
    let session = await fetchJSON<LoginResponse>(
      "/api/session",
      "No session found."
    );

    if (Date.now() >= Number(session.expires)) {
      session = await refreshAccessToken();
    }

    return session;
  } catch (error) {
    console.error("Session retrieval error:", error);
    throw new Error("Invalid session.");
  }
};
