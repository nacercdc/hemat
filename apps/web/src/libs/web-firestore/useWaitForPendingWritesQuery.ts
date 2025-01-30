/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { UseQueryOptions } from "@tanstack/react-query";
import type { Firestore, FirestoreError } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { waitForPendingWrites } from "firebase/firestore";

type FirestoreUseQueryOptions<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError, void>,
  "queryFn"
>;

export function useWaitForPendingWritesQuery(
  firestore: Firestore,
  options: FirestoreUseQueryOptions<void, FirestoreError>,
) {
  return useQuery<void, FirestoreError, void>({
    ...options,
    queryFn: () => waitForPendingWrites(firestore),
  });
}
