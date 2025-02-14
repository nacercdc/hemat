"use client";
import type { Firestore } from "firebase/firestore";
import { createContext } from "react";
import type { FirebaseStorage } from "firebase/storage";

export interface FirebaseContextValue {
  firestore: Firestore;
  storage: FirebaseStorage;
}

export const FirebaseContext = createContext<FirebaseContextValue>(
  {} as unknown as FirebaseContextValue
);
