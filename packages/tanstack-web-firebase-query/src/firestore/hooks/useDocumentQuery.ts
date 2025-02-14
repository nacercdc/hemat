import type {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  ListenSource,
  SnapshotListenOptions,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  getDoc,
  getDocFromCache,
  getDocFromServer,
  onSnapshot,
} from "firebase/firestore";
import type { DocumentFirestoreOption } from "./types/query.type";
import { documentReference } from "../helpers/references";
import { useFirebase } from "../../providers/firebase/useFirebase";

export function useDocumentQuery<
  FromFirestore extends DocumentData = DocumentData,
  ToFirestore extends DocumentData = DocumentData,
>(options: DocumentFirestoreOption<FromFirestore>) {
  const { firestore } = useFirebase();

  const queryClient = useQueryClient();

  const docRef = documentReference<FromFirestore>(
    firestore,
    options.collectionName,
    options.id
  ) as DocumentReference<FromFirestore, ToFirestore>;

  return useQuery<FromFirestore | null, FirestoreError>({
    ...options.tqQueryOptions,
    queryKey: [options.collectionName, options.id],
    queryFn: async (context) => {
      if (options.firestoreOptions?.source === "server") {
        return serializeDocumentSnapshot(await getDocFromServer(docRef));
      }

      if (
        options.firestoreOptions?.source === "cache" &&
        !options.firestoreOptions.subscribe
      ) {
        return serializeDocumentSnapshot(await getDocFromCache(docRef));
      }

      if (options.firestoreOptions?.subscribe) {
        return new Promise((resolve, reject) => {
          const snapshotListenOptions: SnapshotListenOptions | undefined =
            options?.firestoreOptions?.source
              ? { source: options.firestoreOptions.source as ListenSource }
              : { source: "default" };

          const unsubscribe = onSnapshot(
            docRef,
            snapshotListenOptions,
            (snapshot: DocumentSnapshot<FromFirestore, ToFirestore>) => {
              const data = serializeDocumentSnapshot<FromFirestore>(snapshot);
              if (!context.signal.aborted) {
                resolve(data);
              }
              queryClient.setQueryData(context.queryKey, data);
            },
            (error) => reject(error)
          );

          context.signal.addEventListener("abort", unsubscribe);
        });
      }

      return serializeDocumentSnapshot(await getDoc(docRef));
    },
  });
}

function serializeDocumentSnapshot<T extends DocumentData>(
  snapshot: DocumentSnapshot<T>
): T | null {
  return snapshot.exists() ? snapshot.data() : null;
}
