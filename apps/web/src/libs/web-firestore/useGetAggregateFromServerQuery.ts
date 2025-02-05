import type { UseQueryOptions } from "@tanstack/react-query";
import type {
  AggregateQuerySnapshot,
  AggregateSpec,
  DocumentData,
  FirestoreError,
  Query,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { getAggregateFromServer } from "firebase/firestore";

type FirestoreUseQueryOptions<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryFn"
>;

export function useGetAggregateFromServerQuery<
  T extends AggregateSpec,
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  query: Query<AppModelType, DbModelType>,
  aggregateSpec: T,
  options: FirestoreUseQueryOptions<
    AggregateQuerySnapshot<T, AppModelType, DbModelType>,
    FirestoreError
  >,
) {
  return useQuery<
    AggregateQuerySnapshot<T, AppModelType, DbModelType>,
    FirestoreError
  >({
    ...options,
    queryFn: () => getAggregateFromServer(query, aggregateSpec),
  });
}
