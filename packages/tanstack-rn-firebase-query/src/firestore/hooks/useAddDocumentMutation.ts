import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type {
  MutationCreateRequest,
  UseCreateMutationDocument,
} from "../types/mutation.type";
import { useMutation } from "@tanstack/react-query";
import { collectionReference } from "../helper/firestore.ref";

export const useAddDocumentMutation = <
  T extends FirebaseFirestoreTypes.DocumentData,
  C = T,
>({
  collectionName,
  options,
}: UseCreateMutationDocument<T, C>) => {
  return useMutation<T, Error, MutationCreateRequest<C>>({
    mutationFn: async (request) => {
      const collectionRef = collectionReference<T>(collectionName);
      const docId = request.docId ?? collectionRef.id;
      const docRef = await collectionRef.add({
        id: docId,
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
