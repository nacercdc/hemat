import type { UseQueryOptions } from "@tanstack/react-query";
import type {
  AggregateField,
  AggregateQuerySnapshot,
  DocumentData,
  FirestoreError,
  Query,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { getCountFromServer } from "firebase/firestore";

type FirestoreUseQueryOptions<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryFn"
>;

export function useGetCountFromServerQuery<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  query: Query<AppModelType, DbModelType>,
  options: FirestoreUseQueryOptions<
    AggregateQuerySnapshot<
      { count: AggregateField<number> },
      AppModelType,
      DbModelType
    >,
    FirestoreError
  >,
) {
  return useQuery<
    AggregateQuerySnapshot<
      { count: AggregateField<number> },
      AppModelType,
      DbModelType
    >,
    FirestoreError
  >({
    ...options,
    queryFn: () => getCountFromServer(query),
  });
}
