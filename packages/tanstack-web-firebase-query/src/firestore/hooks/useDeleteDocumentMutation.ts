import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { deleteDoc } from "firebase/firestore";
import type { FirestoreError } from "firebase/firestore";
import { documentReference } from "../helpers/references";
import { useFirebase } from "../../providers/firebase/useFirebase";

type FirestoreUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useDeleteDocumentMutation(
  collectionName: string,
  options?: FirestoreUseMutationOptions<void, FirestoreError, string>
) {
  const { firestore } = useFirebase();

  return useMutation<void, FirestoreError, string>({
    ...options,
    mutationFn: async (id) => {
      const documentRef = documentReference(firestore, collectionName, id);
      await deleteDoc(documentRef);
    },
  });
}
