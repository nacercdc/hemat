import type {
  QueryKey,
  UndefinedInitialDataInfiniteOptions,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseQueryResult,
} from "@tanstack/react-query";

export type FetchMethod = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

export interface MutationRequest<T> {
  params?: string | number;
  data?: T;
  query?: object;
  multipart?: boolean;
  webUpload?: boolean;
  token?: string;
  lang?: string;
}
export interface MutateFn<C> {
  url: string;
  request?: MutationRequest<C>;
  method: FetchMethod;
}

type TanstackInfinityRQOptions<T> = Omit<
  UndefinedInitialDataInfiniteOptions<T, Error, T, string[], number>,
  | "queryFn"
  | "getNextPageParam"
  | "getPreviousPageParam"
  | "initialPageParam"
  | "select"
>;

export interface UseInfiniteQueryDocuments<Res, Req extends object> {
  url: string;
  params?: string | number;
  query?: Req;
  options: TanstackInfinityRQOptions<Res>;
}

type TanstackRQMutateOptions<T, C = T> = Omit<
  UseMutationOptions<T, Error, C>,
  "mutationFn"
>;

type TanstackRQFetchOptions<T> = Omit<
  UndefinedInitialDataOptions<T, Error, T, QueryKey>,
  "queryFn"
>;
export interface UseGetQueryDocument<Res, Req extends object> {
  url: string;
  query?: Req;
  params?: string | number;
  options: TanstackRQFetchOptions<Res>;
}

export interface UseMutationDocument<T, P> {
  url: string;
  params?: string | number;
  options: TanstackRQMutateOptions<T, P>;
  multipart?: boolean;
  webUpload?: boolean;
}

export type IUseQueryResult<T, TError = Error> = UseQueryResult<T, TError>;
