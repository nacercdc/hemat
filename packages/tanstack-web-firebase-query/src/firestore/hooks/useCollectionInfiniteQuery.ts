/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import type {
  FirestoreError,
  ListenSource,
  Query,
  QuerySnapshot,
  SnapshotListenOptions,
} from "@firebase/firestore";
import {
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  onSnapshot,
} from "@firebase/firestore";
import type { DocumentData } from "@firebase/firestore";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import type {
  InfiniteQueryFirestoreOption,
  InfiniteQueryFnReturn,
} from "./types/query.type";
import { useFirebase } from "../../providers/firebase/useFirebase";
import { QueryConstraint } from "../helpers/query-builder/query";
import { queryReference } from "../helpers/references";
import { serializeQuerySnapshot } from "../helpers/serialize-snapshot";

export function useCollectionInfiniteQuery<
  FromFirestore extends DocumentData = DocumentData,
  ToFirestore extends DocumentData = DocumentData,
>(options: InfiniteQueryFirestoreOption<FromFirestore>) {
  const { firestore } = useFirebase();
  const queryClient = useQueryClient();
  const constraints = new QueryConstraint<FromFirestore>([]);
  constraints
    .filter(options?.queryOptions?.filters)
    .orderBy(options?.queryOptions?.orderBy)
    .limit(options?.queryOptions?.limit);

  return useInfiniteQuery<
    InfiniteQueryFnReturn<FromFirestore>,
    FirestoreError,
    FromFirestore[][],
    string[],
    unknown
  >({
    ...options.tqQueryOptions,
    initialPageParam: undefined,
    queryFn: async (context) => {
      const queryRef = queryReference<FromFirestore>(
        firestore,
        options.collectionName,
        constraints.startAfter(context?.pageParam).getQueryConstraint()
      );

      if (options.firestoreOptions?.source === "server") {
        const snapshot = await getDocsFromServer(queryRef);
        return {
          firstDoc: snapshot.docs[0],
          lastDoc: snapshot.docs[snapshot.size - 1],
          data: serializeQuerySnapshot<FromFirestore>(snapshot),
        };
      }

      if (
        options.firestoreOptions?.source === "cache" &&
        !options.firestoreOptions.subscribe
      ) {
        const snapshot = await getDocsFromCache(queryRef);
        return {
          lastDoc: snapshot.docs[snapshot.size - 1],
          data: serializeQuerySnapshot<FromFirestore>(snapshot),
        };
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
              resolve({
                firstDoc: snapshot.docs[0],
                lastDoc: snapshot.docs[snapshot.size - 1],
                data: serializeQuerySnapshot<FromFirestore>(snapshot),
              });
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

      const snapshot = await getDocs(queryRef);
      return {
        firstDoc: snapshot.docs[0],
        lastDoc: snapshot.docs[snapshot.size - 1],
        data: serializeQuerySnapshot<FromFirestore>(snapshot),
      };
    },
    select: (data) => {
      return data.pages.map((page) => page.data);
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.lastDoc;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.firstDoc;
    },
  });
}
