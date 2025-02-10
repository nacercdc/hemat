/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  InfiniteData,
  UndefinedInitialDataInfiniteOptions,
  UndefinedInitialDataOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import type { Filter, OrderBy } from "./filter.type";
import type {
  FirebaseFirestoreTypes,
  OrderByDirection,
} from "@react-native-firebase/firestore";

interface IQueryOption<T> {
  filters?: Filter<T>;
  orderBy?: OrderBy<T>;
  limit?: number;
}

interface IQueryOptionGet<T> extends IQueryOption<T> {
  source?: FirebaseFirestoreTypes.GetOptions;
}
interface IQueryOptionCount<T> extends IQueryOption<T> {
  countFromServer?: boolean;
}

interface QueryFn<T> {
  collectionName: string;
  queryOptions?: IQueryOption<T>;
}

export interface QueryFnGet<T> {
  collectionName: string;
  queryOptions?: IQueryOptionGet<T>;
}

export interface QueryFnCount<T> {
  collectionName: string;
  queryOptions?: IQueryOptionCount<T>;
}

export type MutationOpr = "add" | "update" | "delete";
export interface MutationFn<T> {
  data?: T;
  docId?: string;
}

export interface FirestoreMutationFn<T> {
  collectionName: string;
  operation: MutationOpr;
  mutationOptions?: UseMutationOptions<T, Error, MutationFn<T>>;
}

export interface UseFirestoreQuery<Req, Res> extends QueryFn<Req> {
  tqOptions: Omit<UndefinedInitialDataOptions<Res, Error>, "queryFn">;
}
export interface UseFirestoreQueryGet<Req, Res> extends QueryFnGet<Req> {
  tqOptions: Omit<UndefinedInitialDataOptions<Res, Error>, "queryFn">;
}

export interface UseFirestoreQueryCount<Req, Res> extends QueryFnCount<Req> {
  tqOptions: Omit<UndefinedInitialDataOptions<Res, Error>, "queryFn">;
}

export type WhereFilterOp =
  | "<"
  | "<="
  | "=="
  | ">"
  | ">="
  | "!="
  | "array-contains"
  | "array-contains-any"
  | "in"
  | "not-in";

export type ObjectLiteral = Record<string, any>;
export interface IWhere {
  field: string;
  operator: WhereFilterOp;
  value: any;
}
export const QUERY_OPERATORS: Record<string, WhereFilterOp> = {
  eq: "==",
  notEq: "!=",
  lt: "<",
  lte: "<=",
  gt: ">",
  gte: ">=",
  in: "in",
  notIn: "not-in",
  arrayContains: "array-contains",
  arrayContainsAny: "array-contains-any",
};

export interface IOrderBy {
  field: string;
  direction: OrderByDirection;
}

// Infinity query types
export type TanstackInfinityRQOptions<
  T extends FirebaseFirestoreTypes.DocumentData,
> = Omit<
  UndefinedInitialDataInfiniteOptions<
    Page<T>,
    Error,
    InfiniteData<T, FirebaseFirestoreTypes.QueryDocumentSnapshot<T>>,
    string[],
    FirebaseFirestoreTypes.QueryDocumentSnapshot<T> | undefined
  >,
  | "queryFn"
  | "getNextPageParam"
  | "getPreviousPageParam"
  | "initialPageParam"
  | "select"
>;

export interface UseFirestoreInfiniteQuery<
  T extends FirebaseFirestoreTypes.DocumentData,
> extends QueryFn<T> {
  tqOptions: TanstackInfinityRQOptions<T>;
}

export interface Page<T extends FirebaseFirestoreTypes.DocumentData> {
  data: T[];
  lastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot<T>;
}
