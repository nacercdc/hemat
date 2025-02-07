import type { Firestore } from "firebase/firestore";
import { collection, doc } from "firebase/firestore";

export const getDocId = (firestore: Firestore, collectionName: string) =>
  doc(collection(firestore, collectionName)).id;
