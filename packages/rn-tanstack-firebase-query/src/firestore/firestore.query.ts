/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type { InfiniteData } from "@tanstack/react-query";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Query } from "./helper/query";
import { useEffect } from "react";
import type {
  Page,
  UseFirestoreInfiniteQuery,
  UseFirestoreQuery,
  UseFirestoreQueryCount,
  UseFirestoreQueryGet,
} from "./types/query.type";
import { collectionReference } from "./helper/firestore.ref";

export function useFirestoreQueryRealTime<
  T extends FirebaseFirestoreTypes.DocumentData,
>({ tqOptions, collectionName, queryOptions }: UseFirestoreQuery<T, T[]>) {
  const queryClient = useQueryClient();
  const query = useQuery<T[], Error>({
    queryFn: () => [],
    ...tqOptions,
  });

  useEffect(() => {
    const collectionRef = collectionReference<T>(collectionName);
    const queryRef = new Query<T>(collectionRef);
    const unsubscribe = queryRef
      .filter(queryOptions?.filters)
      .orderBy(queryOptions?.orderBy)
      .limit(queryOptions?.limit)
      .getQuery()
      .onSnapshot((snapshot) => {
        if (snapshot.empty) {
          queryClient.setQueryData(tqOptions.queryKey, []);
          return;
        }
        const results: T[] = [];

        snapshot.docs.forEach((doc) => {
          const data = serialize<T>(doc);
          if (data) {
            results.push(data);
          }
        });
        queryClient.setQueryData(tqOptions.queryKey, results);
      });

    return () => unsubscribe();
  }, [collectionName, queryOptions, queryClient]);

  return query;
}

export function useFirestoreQuery<
  T extends FirebaseFirestoreTypes.DocumentData,
>({ tqOptions, collectionName, queryOptions }: UseFirestoreQueryGet<T, T[]>) {
  return useQuery<T[], Error>({
    ...tqOptions,
    queryFn: async () => {
      const collectionRef = collectionReference<T>(collectionName);
      const queryRef = new Query<T>(collectionRef);
      const collectionSnapshot = await queryRef
        .filter(queryOptions?.filters)
        .orderBy(queryOptions?.orderBy)
        .limit(queryOptions?.limit)
        .get(queryOptions?.source);

      if (collectionSnapshot.empty) {
        return [];
      }

      const results: T[] = [];

      collectionSnapshot.docs.forEach((doc) => {
        const data = serialize<T>(doc);
        if (data) {
          results.push(data);
        }
      });
      return results;
    },
  });
}

export function useFirestoreQueryCount<
  T extends FirebaseFirestoreTypes.DocumentData,
>({
  tqOptions,
  collectionName,
  queryOptions,
}: UseFirestoreQueryCount<T, number>) {
  return useQuery<number, Error>({
    ...tqOptions,
    queryFn: async () => {
      const collectionRef = collectionReference<T>(collectionName);
      const queryRef = new Query<T>(collectionRef);
      let snapshot;
      queryRef
        .filter(queryOptions?.filters)
        .orderBy(queryOptions?.orderBy)
        .limit(queryOptions?.limit);
      if (queryOptions?.countFromServer) {
        snapshot = await queryRef.countFromServer().get();
      } else {
        snapshot = await queryRef.count().get();
      }
      return snapshot.data().count as number;
    },
  });
}

export default function useFirestoreInfiniteQuery<
  T extends FirebaseFirestoreTypes.DocumentData,
>({
  collectionName,
  queryOptions,
  tqOptions: { queryKey, ...rest },
}: UseFirestoreInfiniteQuery<T>) {
  return useInfiniteQuery<
    Page<T>,
    Error,
    InfiniteData<T, FirebaseFirestoreTypes.QueryDocumentSnapshot<T>>,
    string[],
    FirebaseFirestoreTypes.QueryDocumentSnapshot<T> | undefined
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const collectionRef = collectionReference<T>(collectionName);
      let queryRef = new Query<T>(collectionRef);

      queryRef.filter(queryOptions?.filters).orderBy(queryOptions?.orderBy);

      if (pageParam) {
        queryRef = queryRef.startAfter(pageParam);
      }
      queryRef = queryRef.limit(queryOptions?.limit);

      const snapshot = await queryRef.get();

      const results = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      return {
        data: results,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
      } as Page<T>;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.lastDoc,
    ...rest,
  });
}

function serialize<T extends FirebaseFirestoreTypes.DocumentData>(
  document: FirebaseFirestoreTypes.QueryDocumentSnapshot<T>
) {
  const data = document.data();

  if (!data) return;
  return data;
}
