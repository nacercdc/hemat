/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { Query } from "./query";
import firestore from "@react-native-firebase/firestore";
import type { UseFirestoreQuery } from "./types/query.type";

export default function useFirestoreQuery<
  T extends FirebaseFirestoreTypes.DocumentData,
>({ firestoreOptions, collectionName, queryOptions }: UseFirestoreQuery<T>) {
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

function serialize<T extends FirebaseFirestoreTypes.DocumentData>(
  document: FirebaseFirestoreTypes.QueryDocumentSnapshot<T>
) {
  const data = document.data();

  if (!data) return;
  return data;
}
