import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import {
  collection,
  getFirestore,
  writeBatch,
} from "@react-native-firebase/firestore";

export const collectionReference = <
  T extends FirebaseFirestoreTypes.DocumentData,
>(
  collectionName: string
) => {
  return collection(
    getFirestore(),
    collectionName
  ) as FirebaseFirestoreTypes.CollectionReference<T>;
};

export const documentReference = <
  T extends FirebaseFirestoreTypes.DocumentData,
>(
  collectionName: string,
  id: string
) => collectionReference<T>(collectionName).doc(id);

export const batchReference = writeBatch(getFirestore());
