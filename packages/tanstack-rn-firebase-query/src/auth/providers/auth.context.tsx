/* eslint-disable @typescript-eslint/no-empty-function */
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createContext } from "react";

export interface AuthContextValue {
  user: FirebaseAuthTypes.User | null;
  setUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
});
