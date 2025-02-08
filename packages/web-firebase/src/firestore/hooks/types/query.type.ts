import type { UseQueryOptions } from "@tanstack/react-query";
import type {
  Firestore,
  FirestoreError,
  SnapshotListenOptions,
} from "firebase/firestore";
import type { IQueryOption } from "../../helper/query-builder/types/query.type";

interface FirestoreOption {
  source?: SnapshotListenOptions["source"] | "server";
  subscribe?: boolean;
}
type UseQueryOption<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryFn"
>;

export interface QueryFirestoreOption<FromFirestore> {
  firestore: Firestore;
  collectionName: string;
  tqQueryOptions: UseQueryOption<FromFirestore[], FirestoreError>;
  queryOptions?: IQueryOption<FromFirestore>;
  firestoreOptions?: FirestoreOption;
}
