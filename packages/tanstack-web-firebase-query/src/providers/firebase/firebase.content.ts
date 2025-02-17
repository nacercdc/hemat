"use client";
import type { Firestore } from "firebase/firestore";
import { createContext } from "react";
import type { FirebaseStorage } from "firebase/storage";
import type { Auth } from "firebase/auth";

export interface FirebaseContextValue {
  firestore: Firestore;
  storage: FirebaseStorage;
  auth: Auth;
}

export const FirebaseContext = createContext<FirebaseContextValue>(
  {} as unknown as FirebaseContextValue
);
