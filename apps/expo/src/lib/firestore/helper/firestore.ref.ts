import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import firestore from "@react-native-firebase/firestore";

export const collectionReference = <
  T extends FirebaseFirestoreTypes.DocumentData,
>(
  collectionName: string
) => {
  return firestore().collection<T>(collectionName);
};

export const documentReference = <
  T extends FirebaseFirestoreTypes.DocumentData,
>(
  collectionName: string,
  id: string
) => collectionReference<T>(collectionName).doc(id);

export const batchReference = firestore().batch();
