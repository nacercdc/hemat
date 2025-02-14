"use client";

import React from "react";
import { FirebaseContext } from "./firebase.content";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";

interface Props {
  children: React.ReactNode;
  firestore: Firestore;
  storage: FirebaseStorage;
}
export function FirebaseProvider({ firestore, storage, children }: Props) {
  return (
    <FirebaseContext.Provider
      value={{
        firestore,
        storage,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}
