"use client";
import { useContext } from "react";
import { FirestoreContext } from "./firestore.content";

export const useFirestore = () => useContext(FirestoreContext);
