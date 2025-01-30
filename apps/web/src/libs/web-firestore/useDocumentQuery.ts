/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { UseQueryOptions } from "@tanstack/react-query";
import type {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { getDoc, getDocFromCache, getDocFromServer } from "firebase/firestore";

type FirestoreUseQueryOptions<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryFn"
> & {
  firestore?: {
    source?: "server" | "cache";
  };
};

export function useDocumentQuery<
  FromFirestore extends DocumentData = DocumentData,
  ToFirestore extends DocumentData = DocumentData,
>(
  documentRef: DocumentReference<FromFirestore, ToFirestore>,
  options: FirestoreUseQueryOptions<
    DocumentSnapshot<FromFirestore, ToFirestore>,
    FirestoreError
  >,
) {
  const { firestore, ...queryOptions } = options;

  return useQuery<DocumentSnapshot<FromFirestore, ToFirestore>, FirestoreError>(
    {
      ...queryOptions,
      queryFn: async () => {
        if (firestore?.source === "server") {
          return await getDocFromServer(documentRef);
        }

        if (firestore?.source === "cache") {
          return await getDocFromCache(documentRef);
        }

        return await getDoc(documentRef);
      },
    },
  );
}
