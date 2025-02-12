import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useMutation } from "@tanstack/react-query";

import { documentReference } from "../helper/firestore.ref";
import type {
  UpdateDocumentRequest,
  UseUpdateDocumentMutation,
} from "./types/mutation.type";

export const useUpdateDocumentMutation = <
  T extends FirebaseFirestoreTypes.DocumentData,
  U = T,
>({
  collectionName,
  options,
}: UseUpdateDocumentMutation<T, U>) => {
  return useMutation<T, Error, UpdateDocumentRequest<U>>({
    mutationFn: async (request) => {
      const docRef = documentReference<T>(collectionName, request.id);
      await docRef.update(
        request.data as Partial<FirebaseFirestoreTypes.SetValue<T>>
      );
      const updatedDoc = await docRef.get();
      return updatedDoc.data() as unknown as T;
    },
    ...options,
  });
};
