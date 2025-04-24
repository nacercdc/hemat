"use client";

import { createContext } from "react";
import type { UserInfo } from "firebase/auth";
import type { Claims } from "next-firebase-auth-edge/lib/auth/claims";

export interface User extends UserInfo {
  idToken: string;
  customToken?: string;
  emailVerified: boolean;
  customClaims: Claims;
}

export interface AuthContextValue {
  user: User | null;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
});
