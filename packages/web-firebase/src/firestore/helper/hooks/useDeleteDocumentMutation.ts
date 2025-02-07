import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { deleteDoc } from "firebase/firestore";
import type { FirestoreError, Firestore } from "firebase/firestore";
import { documentReference } from "../references";

type FirestoreUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useDeleteDocumentMutation(
  firestore: Firestore,
  collectionName: string,
  options?: FirestoreUseMutationOptions<void, FirestoreError, string>
) {
  return useMutation<void, FirestoreError, string>({
    ...options,
    mutationFn: async (id) => {
      const documentRef = documentReference(firestore, collectionName, id);
      await deleteDoc(documentRef);
    },
  });
}
