/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useMutation } from "@tanstack/react-query";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await auth().signOut();
      await GoogleSignin.signOut();
    },
  });
};
