"use client";
import { useContext } from "react";
import { FirebaseContext } from "./firebase.content";

export const useFirebase = () => useContext(FirebaseContext);
