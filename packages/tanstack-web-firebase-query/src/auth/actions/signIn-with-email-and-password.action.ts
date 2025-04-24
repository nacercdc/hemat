"use server";

import type { Auth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { SetAuthCookiesOptions } from "next-firebase-auth-edge/lib/next/cookies";
import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/lib/next/cookies";
interface ISignInWithEmailAndPassword {
  auth: Auth;
  username: string;
  password: string;
  authConfig: SetAuthCookiesOptions;
  redirectTo?: string;
  headers: () => Promise<Headers>;
  cookies: () => Promise<unknown>;
  onSignedIn?: () => void;
}
export async function signInWithEmailAndPasswordAction({
  auth,
  username,
  password,
  authConfig,
  headers,
  cookies,
  onSignedIn,
}: ISignInWithEmailAndPassword) {
  const credential = await signInWithEmailAndPassword(auth, username, password);
  const idToken = await credential.user.getIdToken();
  await refreshCookiesWithIdToken(
    idToken,
    await headers(),
    await cookies(),
    authConfig
  );
  onSignedIn?.();
}
