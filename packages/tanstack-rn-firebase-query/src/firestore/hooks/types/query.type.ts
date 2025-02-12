import type {
  FirebaseFirestoreTypes,
  FirestoreError,
} from "@react-native-firebase/firestore";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { Filter, OrderBy } from "../../types/filter.type";
interface QueryOption<T> {
  filters?: Filter<T>;
  orderBy?: OrderBy<T>;
  limit?: number;
}

interface FirestoreOption {
  source?: FirebaseFirestoreTypes.GetOptions;
  subscribe?: boolean;
}

type UseQueryOption<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
> = Omit<UseQueryOptions<TData, TError, TData>, "queryFn">;

export interface QueryFirestoreOption<T> {
  collectionName: string;
  tqQueryOptions: UseQueryOption<T[], FirestoreError>;
  queryOptions?: QueryOption<T>;
  firestoreOptions?: FirestoreOption;
}

export interface DocumentFirestoreOption<T> {
  collectionName: string;
  id: string;
  tqQueryOptions?: Omit<UseQueryOption<T | null, FirestoreError>, "queryKey">;
  firestoreOptions?: FirestoreOption;
}
