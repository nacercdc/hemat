/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
const getAuthErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case "auth/account-exists-with-different-credential":
      return "Account already exists with different login method";
    case "auth/popup-closed-by-user":
      return "Login cancelled by user";
    case "auth/network-request-failed":
      return "Network error - check your internet connection";
    default:
      return "Authentication failed. Please try again.";
  }
};
export const useGoogleSignin = (webClientId: string) => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId,
    });
  }, []);
  return useMutation({
    mutationFn: async () => {
      try {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
        return await GoogleSignin.signIn();
      } catch (error: unknown) {
        throw new Error(getAuthErrorMessage((error as any).code));
      }
    },
  });
};
