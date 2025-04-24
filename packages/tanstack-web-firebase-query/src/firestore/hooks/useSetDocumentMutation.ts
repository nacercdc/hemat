import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { serverTimestamp, setDoc } from "firebase/firestore";
import type {
  FirestoreError,
  WithFieldValue,
  DocumentData,
} from "firebase/firestore";
import { documentReference } from "../helpers/references";
import { useFirebase } from "../../providers/firebase/useFirebase";
import { getDocId } from "../helpers/doc-id";

type FirestoreUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
export function useSetDocumentMutation<
  AppModelType extends DocumentData = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  collectionName: string,
  options?: FirestoreUseMutationOptions<
    void,
    FirestoreError,
    WithFieldValue<DbModelType>
  >
) {
  const { firestore } = useFirebase();

  return useMutation<void, FirestoreError, WithFieldValue<DbModelType>>({
    ...options,
    mutationFn: async (data) => {
      const docId = getDocId(firestore, collectionName);
      const id = (data?.id as string) ?? docId;
      const documentRef = documentReference(firestore, collectionName, id);
      await setDoc(documentRef, {
        ...data,
        id,
        updatedAt: serverTimestamp(),
      } as WithFieldValue<AppModelType>);
    },
  });
}
