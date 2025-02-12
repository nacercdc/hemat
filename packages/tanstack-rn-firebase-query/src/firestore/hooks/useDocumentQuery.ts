import type {
  FirebaseFirestoreTypes,
  FirestoreError,
} from "@react-native-firebase/firestore";
import type { DocumentFirestoreOption } from "./types/query.type";
import { documentReference } from "../helper/firestore.ref";
import { useQuery, useQueryClient } from "@tanstack/react-query";
export function useDocumentQuery<
  T extends FirebaseFirestoreTypes.DocumentData,
>({
  id,
  collectionName,
  tqQueryOptions,
  firestoreOptions,
}: DocumentFirestoreOption<T>) {
  const queryClient = useQueryClient();

  return useQuery<T | null, FirestoreError>({
    ...tqQueryOptions,
    queryKey: [collectionName, id],
    queryFn: async (context) => {
      const documentRef = documentReference<T>(collectionName, id);

      if (firestoreOptions?.subscribe) {
        return new Promise<T | null>((resolve, reject) => {
          const unsubscribe = documentRef.onSnapshot({
            next: (snapshot: FirebaseFirestoreTypes.DocumentSnapshot<T>) => {
              const results = serializeDocumentSnapshot<T>(snapshot);
              if (!context.signal.aborted) {
                resolve(results);
              }
              queryClient.setQueryData(context.queryKey, results);
            },
            error: (error: FirestoreError) => reject(error),
          });

          context.signal.addEventListener("abort", unsubscribe);
        });
      }
      return serializeDocumentSnapshot<T>(
        await documentRef.get(firestoreOptions?.source)
      );
    },
  });
}

function serializeDocumentSnapshot<
  T extends FirebaseFirestoreTypes.DocumentData,
>(document: FirebaseFirestoreTypes.DocumentSnapshot<T>) {
  const data = document.data();

  if (!data) return null;
  return data;
}
