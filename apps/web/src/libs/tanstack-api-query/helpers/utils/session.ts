export interface SessionPayload {
  token: string;
  refreshToken: string;
  expires: string;
}

let cachedSession: SessionPayload | null = null;
let refreshTokenPromise: Promise<SessionPayload | null> | null = null;

export const getSession = async (): Promise<SessionPayload | null> => {
  if (cachedSession && Date.now() < +cachedSession.expires) {
    return cachedSession;
  }

  const response = await fetch("/api/session");

  if (!response.ok) {
    throw new Error("No token found");
  }

  const session = (await response.json()) as SessionPayload;

  if (!session.token || !session.refreshToken || !session.expires) {
    return null;
  }

  if (Date.now() >= +session.expires) {
    return await refreshAccessToken();
  }

  cachedSession = session;
  return session;
};

export const refreshAccessToken = async (): Promise<SessionPayload | null> => {
  if (cachedSession && Date.now() < +cachedSession.expires) {
    return cachedSession;
  }

  if (!refreshTokenPromise) {
    refreshTokenPromise = (async () => {
      try {
        const response = await fetch("/api/refresh-token", {
          credentials: "include",
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Unable to refresh token");
        }

        const session = (await response.json()) as SessionPayload;

        if (!session.token || !session.refreshToken || !session.expires) {
          return null;
        }

        cachedSession = session;
        return session;
      } catch (error) {
        console.error("Token refresh failed", error);
        return null;
      } finally {
        refreshTokenPromise = null;
      }
    })();
  }

  return refreshTokenPromise;
};
