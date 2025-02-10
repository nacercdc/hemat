/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { namedQuery } from "firebase/firestore";
import type {
  FirestoreError,
  Query,
  DocumentData,
  Firestore,
} from "firebase/firestore";

type FirestoreUseQueryOptions<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryFn"
>;

export function useNamedQuery<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  firestore: Firestore,
  name: string,
  options: FirestoreUseQueryOptions<Query | null, FirestoreError>
) {
  return useQuery<Query | null, FirestoreError>({
    ...options,
    queryFn: () => namedQuery(firestore, name),
  });
}
