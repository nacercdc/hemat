/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { addDoc, serverTimestamp } from "firebase/firestore";
import type {
  DocumentReference,
  FirestoreError,
  WithFieldValue,
  DocumentData,
} from "firebase/firestore";
import { collectionReference } from "../helpers/references";
import { getDocId } from "../helpers/doc-id";
import { useFirestore } from "../providers/firestore/useFirestore";

type FirestoreUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
export function useAddDocumentMutation<
  AppModelType extends DocumentData = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  collectionName: string,
  options?: FirestoreUseMutationOptions<
    DocumentReference<AppModelType, DbModelType>,
    FirestoreError,
    WithFieldValue<DbModelType>
  >
) {
  const { firestore } = useFirestore();

  const collectionRef = collectionReference<AppModelType, DbModelType>(
    firestore,
    collectionName
  );
  const docId = getDocId(firestore, collectionName);
  return useMutation<
    DocumentReference<AppModelType, DbModelType>,
    FirestoreError,
    WithFieldValue<DbModelType>
  >({
    ...options,
    mutationFn: (data) =>
      addDoc(collectionRef, {
        ...data,
        id: data.id ?? docId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      } as WithFieldValue<AppModelType>),
  });
}
