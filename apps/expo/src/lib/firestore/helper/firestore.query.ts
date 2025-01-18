/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Query } from "./query";
import firestore from "@react-native-firebase/firestore";
import type {
  Page,
  UseFirestoreInfiniteQuery,
  UseFirestoreQuery,
} from "./types/query.type";
import { collectionReference } from "./firestore.ref";

export function useFirestoreQuery<
  T extends FirebaseFirestoreTypes.DocumentData,
>({
  firestoreOptions,
  collectionName,
  queryOptions,
}: UseFirestoreQuery<T, T[]>) {
  return useQuery<T[], Error>({
    ...firestoreOptions,
    queryFn: async () => {
      const collectionRef = firestore().collection<T>(collectionName);
      const query = new Query<T>(collectionRef);
      const collectionSnapshot = await query
        .filter(queryOptions?.filters)
        .orderBy(queryOptions?.orderBy)
        .limit(queryOptions?.limit)
        .get();

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
  firestoreOptions,
  collectionName,
  queryOptions,
}: UseFirestoreQuery<T, number>) {
  return useQuery<number, Error>({
    ...firestoreOptions,
    queryFn: async () => {
      const collectionRef = collectionReference<T>(collectionName);
      const query = new Query<T>(collectionRef);
      const snapshot = await query
        .filter(queryOptions?.filters)
        .orderBy(queryOptions?.orderBy)
        .limit(queryOptions?.limit)
        .count()
        .get();
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
      let query = new Query<T>(collectionRef);

      query.filter(queryOptions?.filters).orderBy(queryOptions?.orderBy);

      if (pageParam) {
        query = query.startAfter(pageParam);
      }
      query = query.limit(queryOptions?.limit);

      const snapshot = await query.get();

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
