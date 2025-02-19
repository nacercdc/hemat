/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { useMutation } from "@tanstack/react-query";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import auth from "@react-native-firebase/auth";
interface UseSignInWithEmailAndPasswordData {
  email: string;
  password: string;
}

export const useSignInWithEmailAndPassword = () => {
  return useMutation<
    FirebaseAuthTypes.UserCredential,
    Error,
    UseSignInWithEmailAndPasswordData
  >({
    mutationFn: (data) => {
      return auth().signInWithEmailAndPassword(data.email, data.password);
    },
  });
};
