/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Auth } from "firebase/auth";
import { signInWithCustomToken } from "firebase/auth";
import type { SetAuthCookiesOptions } from "next-firebase-auth-edge/next/cookies";
import { getTokens } from "next-firebase-auth-edge/next/tokens";

interface IGetUserWithCustomTokens {
  auth: Auth;
  authConfig: SetAuthCookiesOptions;
  cookies: () => Promise<unknown>;
}

export async function GetUserWithCustomTokens({
  auth,
  authConfig,
  cookies,
}: IGetUserWithCustomTokens) {
  const tokens = await getTokens((await cookies()) as any, {
    apiKey: authConfig.apiKey,
    cookieName: authConfig.cookieName,
    cookieSignatureKeys: authConfig.cookieSignatureKeys,
    serviceAccount: authConfig.serviceAccount,
  });

  if (!tokens) {
    throw new Error("Token error");
  }

  const { customToken } = tokens;

  const { user } = await signInWithCustomToken(auth, customToken || "");

  if (!user?.email) {
    throw new Error("Token error");
  }

  return user;
}
