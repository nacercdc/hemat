/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use server";

import type { Auth } from "firebase/auth";
import type { SetAuthCookiesOptions } from "next-firebase-auth-edge/lib/next/cookies";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/lib/next/cookies";
import { GetUserWithCustomTokens } from "../utils";

interface IChangePassword {
  newPassword: string;
  oldPassword: string;
  auth: Auth;
  authConfig: SetAuthCookiesOptions;
  headers: () => Promise<Headers>;
  cookies: () => Promise<unknown>;
}
export async function changePasswordAction({
  newPassword,
  oldPassword,
  auth,
  authConfig,
  headers,
  cookies,
}: IChangePassword) {
  let currentUser = auth.currentUser;
  if (!currentUser?.email) {
    currentUser = await GetUserWithCustomTokens({ auth, authConfig, cookies });
  }

  const credential = EmailAuthProvider.credential(
    currentUser.email!,
    oldPassword
  );
  const newCredential = await reauthenticateWithCredential(
    currentUser,
    credential
  );
  const idToken = await newCredential.user.getIdToken();
  await refreshCookiesWithIdToken(
    idToken,
    await headers(),
    await cookies(),
    authConfig
  );
  await updatePassword(currentUser, newPassword);
}
