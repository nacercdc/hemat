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
import { QueryConstraint } from "../helper/query-builder/query";
import { queryReference } from "../helper/references";
import type { QueryFirestoreOption } from "./types/query.type";

export function useCollectionQuery<
  FromFirestore extends DocumentData = DocumentData,
  ToFirestore extends DocumentData = DocumentData,
>(options: QueryFirestoreOption<FromFirestore>) {
  const queryClient = useQueryClient();
  const constraints = new QueryConstraint<FromFirestore>([])
    .filter(options?.queryOptions?.filters)
    .orderBy(options?.queryOptions?.orderBy)
    .limit(options?.queryOptions?.limit)
    .getQueryConstraint();
  const queryRef = queryReference<FromFirestore>(
    options.firestore,
    options.collectionName,
    constraints
  );

  return useQuery<FromFirestore[], FirestoreError>({
    ...options.tqQueryOptions,
    queryFn: async (context) => {
      if (options.firestoreOptions?.source === "server") {
        return serializeQuerySnapshot<FromFirestore>(
          await getDocsFromServer(queryRef)
        );
      }

      if (
        options.firestoreOptions?.source === "cache" &&
        !options.firestoreOptions.subscribe
      ) {
        return serializeQuerySnapshot<FromFirestore>(
          await getDocsFromCache(queryRef)
        );
      }

      if (options.firestoreOptions?.subscribe) {
        return new Promise((resolve, reject) => {
          const snapshotListenOptions: SnapshotListenOptions | undefined =
            options?.firestoreOptions?.source
              ? { source: options.firestoreOptions.source as ListenSource }
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
            queryRef as Query<FromFirestore, ToFirestore>,
            snapshotListenOptions,
            onNext,
            onError
          );

          context.signal.addEventListener("abort", unsubscribe);
        });
      }

      return serializeQuerySnapshot<FromFirestore>(await getDocs(queryRef));
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
