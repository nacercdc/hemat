import type { UseQueryOptions } from "@tanstack/react-query";
import type {
  DocumentData,
  FirestoreError,
  Query,
  QuerySnapshot,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import {
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
} from "firebase/firestore";

type FirestoreUseQueryOptions<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryFn"
> & {
  firestore?: {
    source?: "server" | "cache";
  };
};

export function useCollectionQuery<
  FromFirestore extends DocumentData = DocumentData,
  ToFirestore extends DocumentData = DocumentData,
>(
  query: Query<FromFirestore, ToFirestore>,
  options: FirestoreUseQueryOptions<
    QuerySnapshot<FromFirestore, ToFirestore>,
    FirestoreError
  >,
) {
  const { firestore, ...queryOptions } = options;

  return useQuery<QuerySnapshot<FromFirestore, ToFirestore>, FirestoreError>({
    ...queryOptions,
    queryFn: async () => {
      if (firestore?.source === "server") {
        return await getDocsFromServer(query);
      }

      if (firestore?.source === "cache") {
        return await getDocsFromCache(query);
      }

      return await getDocs(query);
    },
  });
}
