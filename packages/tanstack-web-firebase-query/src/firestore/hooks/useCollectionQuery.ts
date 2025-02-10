import type {
  DocumentData,
  FirestoreError,
  ListenSource,
  Query,
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
import { QueryConstraint } from "../helpers/query-builder/query";
import { queryReference } from "../helpers/references";
import type { QueryFirestoreOption } from "./types/query.type";
import { useFirestore } from "../providers/firestore/useFirestore";
import { serializeQuerySnapshot } from "../helpers/serialize-snapshot";

export function useCollectionQuery<
  FromFirestore extends DocumentData = DocumentData,
  ToFirestore extends DocumentData = DocumentData,
>(options: QueryFirestoreOption<FromFirestore>) {
  const { firestore } = useFirestore();
  const queryClient = useQueryClient();
  const constraints = new QueryConstraint<FromFirestore>([])
    .filter(options?.queryOptions?.filters)
    .orderBy(options?.queryOptions?.orderBy)
    .limit(options?.queryOptions?.limit)
    .getQueryConstraint();
  const queryRef = queryReference<FromFirestore>(
    firestore,
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
