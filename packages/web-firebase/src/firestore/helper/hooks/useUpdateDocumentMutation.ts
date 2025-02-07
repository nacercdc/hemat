import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { updateDoc } from "firebase/firestore";
import type {
  DocumentReference,
  FirestoreError,
  DocumentData,
  UpdateData,
} from "firebase/firestore";

type FirestoreUseMutationOptions<TData = unknown, TError = Error> = Omit<
  UseMutationOptions<TData, TError, void>,
  "mutationFn"
>;

export function useUpdateDocumentMutation<
  AppModelType extends DocumentData = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  documentRef: DocumentReference<AppModelType, DbModelType>,
  data: UpdateData<DbModelType>,
  options?: FirestoreUseMutationOptions<void, FirestoreError>
) {
  return useMutation<void, FirestoreError>({
    ...options,
    mutationFn: () => updateDoc(documentRef, data),
  });
}
