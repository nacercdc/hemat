import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type { UseDocumentCountQuery } from "./types/query.type";
import { useQuery } from "@tanstack/react-query";
import { collectionReference } from "../helpers/firestore.ref";
import { Query } from "../helpers/query";

export function useDocumentCountQuery<
  T extends FirebaseFirestoreTypes.DocumentData,
>({
  tqOptions,
  collectionName,
  queryOptions,
  firestoreOptions,
}: UseDocumentCountQuery<T, number>) {
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
      if (firestoreOptions?.countFromServer) {
        snapshot = await queryRef.countFromServer().get();
      } else {
        snapshot = await queryRef.count().get();
      }
      return snapshot.data().count as number;
    },
  });
}
