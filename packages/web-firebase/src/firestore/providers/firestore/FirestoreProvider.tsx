"use client";

import React from "react";
import { FirestoreContext } from "./firestore.content";
import type { Firestore } from "firebase/firestore";

interface Props {
  children: React.ReactNode;
  firestore: Firestore;
}
export function FirestoreProvider({ firestore, children }: Props) {
  return (
    <FirestoreContext.Provider
      value={{
        firestore,
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
}
