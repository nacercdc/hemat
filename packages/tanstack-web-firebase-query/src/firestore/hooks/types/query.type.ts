import type { UseQueryOptions } from "@tanstack/react-query";
import type {
  FirestoreError,
  QueryDocumentSnapshot,
  SnapshotListenOptions,
} from "firebase/firestore";
import type { IQueryOption } from "../../helpers/query-builder/types/query.type";
interface FirestoreOptionServer {
  source: "server";
}
interface FirestoreListenOption {
  source?: SnapshotListenOptions["source"];
  subscribe?: boolean;
}
type FirestoreOption = FirestoreOptionServer | FirestoreListenOption;

type UseQueryOption<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryFn"
>;

export interface QueryFirestoreOption<FromFirestore> {
  collectionName: string;
  tqQueryOptions: UseQueryOption<
    UseCollectionQueryResult<FromFirestore>,
    FirestoreError
  >;
  queryOptions?: IQueryOption<FromFirestore>;
  firestoreOptions?: FirestoreOption;
}

export interface DocumentFirestoreOption<FromFirestore> {
  collectionName: string;
  id: string;
  tqQueryOptions?: Omit<
    UseQueryOption<FromFirestore | null, FirestoreError>,
    "queryKey"
  >;
  firestoreOptions?: FirestoreOption;
}

export interface UseCollectionQueryResult<FromFirestore> {
  firstDoc?: QueryDocumentSnapshot<FromFirestore>;
  lastDoc?: QueryDocumentSnapshot<FromFirestore>;
  data: FromFirestore[];
}
