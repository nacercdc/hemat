/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { serverTimestamp, setDoc } from "firebase/firestore";
import type {
  FirestoreError,
  WithFieldValue,
  DocumentData,
  Firestore,
} from "firebase/firestore";
import { documentReference } from "../helper/references";

type FirestoreUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
export function useSetDocumentMutation<
  AppModelType extends DocumentData = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  firestore: Firestore,
  collectionName: string,
  options?: FirestoreUseMutationOptions<
    void,
    FirestoreError,
    WithFieldValue<DbModelType>
  >
) {
  return useMutation<void, FirestoreError, WithFieldValue<DbModelType>>({
    ...options,
    mutationFn: async (data) => {
      const documentRef = documentReference(firestore, collectionName, data.id);
      await setDoc(documentRef, {
        ...data,
        updatedAt: serverTimestamp(),
      } as WithFieldValue<AppModelType>);
    },
  });
}
