"use client";
import type { Firestore } from "firebase/firestore";
import { createContext } from "react";

export interface FirestoreContextValue {
  firestore: Firestore;
}

export const FirestoreContext = createContext<FirestoreContextValue>(
  {} as unknown as FirestoreContextValue
);
