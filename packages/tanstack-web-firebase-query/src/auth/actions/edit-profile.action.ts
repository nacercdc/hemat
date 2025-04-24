/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import type { Auth } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";
import type { SetAuthCookiesOptions } from "next-firebase-auth-edge/lib/next/cookies";
import { updateProfile } from "firebase/auth";
import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/lib/next/cookies";
import { GetUserWithCustomTokens } from "../utils";

interface IEditProfile {
  name: string;
  profilePic?: File;
  auth: Auth;
  storage: FirebaseStorage;
  authConfig: SetAuthCookiesOptions;
  headers: () => Promise<Headers>;
  cookies: () => Promise<unknown>;
}
export async function editProfileAction({
  name,
  profilePic,
  auth,
  storage,
  authConfig,
  headers,
  cookies,
}: IEditProfile) {
  let currentUser = auth.currentUser;
  if (!currentUser?.email) {
    currentUser = await GetUserWithCustomTokens({ auth, authConfig, cookies });
  }

  if (profilePic) {
    const storageRef = ref(
      storage,
      `uploads/users/${currentUser.uid}/avatars/${Math.random().toString(36).substring(2, 12)}`
    );
    await uploadBytes(storageRef, profilePic);
    const downloadURL = await getDownloadURL(storageRef);
    await updateProfile(currentUser, { photoURL: downloadURL });
  }

  await updateProfile(currentUser, { displayName: name });
  await refreshCookiesWithIdToken(
    await currentUser.getIdToken(),
    await headers(),
    (await cookies()) as any,
    authConfig
  );
}
