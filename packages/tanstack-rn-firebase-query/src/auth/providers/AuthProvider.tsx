import React, { useEffect, useState } from "react";
import { AuthContext } from "./auth.context";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { onAuthStateChanged, getAuth } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
interface Props {
  children: React.ReactNode;
  onInvalidToken?: () => void;
  onValidToken?: () => void;
}
export function AuthProvider({
  children,
  onInvalidToken,
  onValidToken,
}: Props) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = onAuthStateChanged(
      getAuth(),
      (userState: FirebaseAuthTypes.User | null) => {
        if (userState || GoogleSignin.hasPreviousSignIn()) {
          setUser(userState);
          onValidToken?.();
        } else {
          onInvalidToken?.();
        }
        if (initializing) setInitializing(false);
      }
    );
    return subscriber;
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
