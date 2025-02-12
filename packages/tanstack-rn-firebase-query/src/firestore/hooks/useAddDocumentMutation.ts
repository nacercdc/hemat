import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

import { useMutation } from "@tanstack/react-query";
import { collectionReference } from "../helper/firestore.ref";
import type {
  AddDocumentRequest,
  UseAddDocumentMutation,
} from "./types/mutation.type";

export const useAddDocumentMutation = <
  T extends FirebaseFirestoreTypes.DocumentData,
  C = T,
>({
  collectionName,
  options,
}: UseAddDocumentMutation<T, C>) => {
  return useMutation<T, Error, AddDocumentRequest<C>>({
    mutationFn: async (request) => {
      const collectionRef = collectionReference<T>(collectionName);
      const id = request.id ?? collectionRef.id;
      const docRef = await collectionRef.add({
        id,
        ...request.data,
      } as unknown as T);
      const docSnapshot = await docRef.get();

      const docData = docSnapshot.data();
      if (!docData) {
        throw new Error("Document data not found");
      }

      return docData;
    },
    ...options,
  });
};
