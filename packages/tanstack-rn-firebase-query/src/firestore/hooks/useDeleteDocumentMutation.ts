import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type {
  DeleteDocumentRequest,
  UseDeleteDocumentMutation,
} from "./types/mutation.type";
import { documentReference } from "../helper/firestore.ref";
import { useMutation } from "@tanstack/react-query";

export const useDeleteDocumentMutation = <
  T extends FirebaseFirestoreTypes.DocumentData,
  D = T,
>({
  collectionName,
  options,
}: UseDeleteDocumentMutation<T, D>) => {
  return useMutation<T, Error, DeleteDocumentRequest<D>>({
    mutationFn: async (request) => {
      const docRef = documentReference<T>(collectionName, request.id);
      await docRef.delete();
      const updatedDoc = await docRef.get();
      return updatedDoc.data() as unknown as T;
    },
    ...options,
  });
};
