import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type { DocumentId } from "./types/mutation.type";
import { collectionReference } from "../helpers/firestore.ref";

export const useDocumentId = <T extends FirebaseFirestoreTypes.DocumentData>({
  collectionName,
}: DocumentId) => collectionReference<T>(collectionName).id;
