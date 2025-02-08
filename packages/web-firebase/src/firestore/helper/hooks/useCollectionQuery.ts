import type { UseQueryOptions } from "@tanstack/react-query";
import type {
  DocumentData,
  FirestoreError,
  ListenSource,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  SnapshotListenOptions,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  onSnapshot,
} from "firebase/firestore";

type FirestoreUseQueryOptions<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryFn"
> & {
  firestore?: {
    source?: SnapshotListenOptions["source"] | "server";
    subscribe?: boolean;
  };
};

export function useCollectionQuery<
  FromFirestore extends DocumentData = DocumentData,
  ToFirestore extends DocumentData = DocumentData,
>(
  query: Query<FromFirestore, ToFirestore>,
  options: FirestoreUseQueryOptions<FromFirestore[], FirestoreError>
) {
  const queryClient = useQueryClient();
  const { firestore, ...queryOptions } = options;

  return useQuery<FromFirestore[], FirestoreError>({
    ...queryOptions,
    queryFn: async (context) => {
      if (firestore?.source === "server") {
        return serializeQuerySnapshot<FromFirestore>(
          await getDocsFromServer(query)
        );
      }

      if (firestore?.source === "cache" && !firestore.subscribe) {
        return serializeQuerySnapshot<FromFirestore>(
          await getDocsFromCache(query)
        );
      }

      if (firestore?.subscribe) {
        return new Promise((resolve, reject) => {
          const snapshotListenOptions: SnapshotListenOptions | undefined =
            firestore.source
              ? { source: firestore.source as ListenSource }
              : { source: "default" };

          const onNext = (
            snapshot: QuerySnapshot<FromFirestore, ToFirestore>
          ) => {
            const results = serializeQuerySnapshot<FromFirestore>(snapshot);
            if (!context.signal.aborted) {
              resolve(results);
            }

            queryClient.setQueryData(context.queryKey, results);
          };

          const onError = (error: FirestoreError) => reject(error);

          const unsubscribe = onSnapshot(
            query,
            snapshotListenOptions,
            onNext,
            onError
          );

          context.signal.addEventListener("abort", unsubscribe);
        });
      }

      return serializeQuerySnapshot<FromFirestore>(await getDocs(query));
    },
  });
}

function serializeQuerySnapshot<T extends DocumentData>(
  querySnapshot: QuerySnapshot<T>
) {
  const results: T[] = [];
  querySnapshot.docs.forEach((doc) => {
    const data = serializeDocumentSnapshot<T>(doc);
    if (data) {
      results.push(data);
    }
  });
  return results;
}

function serializeDocumentSnapshot<T extends DocumentData>(
  document: QueryDocumentSnapshot<T>
) {
  const data = document.data();

  if (!data) return;
  return data;
}
