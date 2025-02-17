"use client";

import React from "react";
import { FirebaseContext } from "./firebase.content";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
import type { Auth } from "firebase/auth";

interface Props {
  children: React.ReactNode;
  firestore: Firestore;
  storage: FirebaseStorage;
  auth: Auth;
}
export function FirebaseProvider({
  auth,
  firestore,
  storage,
  children,
}: Props) {
  return (
    <FirebaseContext.Provider
      value={{
        firestore,
        storage,
        auth,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}
