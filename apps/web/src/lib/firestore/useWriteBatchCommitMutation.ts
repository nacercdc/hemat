/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { UseMutationOptions } from "@tanstack/react-query";
import type { FirestoreError, WriteBatch } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";

type FirestoreUseMutationOptions<TError = Error> = Omit<
  UseMutationOptions<void, TError, WriteBatch>,
  "mutationFn"
>;

export function useWriteBatchCommitMutation(
  options?: FirestoreUseMutationOptions<FirestoreError>,
) {
  return useMutation<void, FirestoreError, WriteBatch>({
    ...options,
    mutationFn: (batch: WriteBatch) => batch.commit(),
  });
}
