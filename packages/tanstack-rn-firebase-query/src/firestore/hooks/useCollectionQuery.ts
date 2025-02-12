import type {
  FirebaseFirestoreTypes,
  FirestoreError,
} from "@react-native-firebase/firestore";
import type { QueryFirestoreOption } from "./types/query.type";
import { collectionReference } from "../helpers/firestore.ref";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Query } from "../helpers/query";

export function useCollectionQuery<
  T extends FirebaseFirestoreTypes.DocumentData,
>({
  collectionName,
  tqQueryOptions,
  queryOptions,
  firestoreOptions,
}: QueryFirestoreOption<T>) {
  const queryClient = useQueryClient();

  return useQuery<T[], FirestoreError>({
    ...tqQueryOptions,
    queryKey: tqQueryOptions?.queryKey ?? [collectionName], // Ensure a default queryKey
    queryFn: async (context) => {
      const collectionRef = collectionReference<T>(collectionName);
      const queryRef = new Query<T>(collectionRef);
      const query = queryRef
        .filter(queryOptions?.filters)
        .orderBy(queryOptions?.orderBy)
        .limit(queryOptions?.limit);
      if (firestoreOptions?.subscribe) {
        return new Promise<T[]>((resolve, reject) => {
          const unsubscribe = query.getQuery().onSnapshot({
            next: (snapshot) => {
              const data = serializeQuerySnapshot<T>(snapshot);
              queryClient.setQueryData(context.queryKey, data);
              if (!context.signal.aborted) resolve(data);
            },
            error: (error) => {
              reject(error);
            },
          });

          context.signal.addEventListener("abort", unsubscribe);
        });
      } else {
        const snapshot = await query.get(firestoreOptions?.source);
        return serializeQuerySnapshot<T>(snapshot);
      }
    },
  });
}
function serializeQuerySnapshot<T extends FirebaseFirestoreTypes.DocumentData>(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot<T>
) {
  const results: T[] = [];

  snapshot.docs.forEach((doc) => {
    const data = serializeDocumentSnapshot<T>(doc);
    if (data) {
      results.push(data);
    }
  });
  return results;
}

function serializeDocumentSnapshot<
  T extends FirebaseFirestoreTypes.DocumentData,
>(document: FirebaseFirestoreTypes.QueryDocumentSnapshot<T>) {
  const data = document.data();

  if (!data) return;
  return data;
}
