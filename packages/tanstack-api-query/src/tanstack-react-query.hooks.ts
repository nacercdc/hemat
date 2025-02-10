
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { mutationFn } from "./helper/fetch.function";
import type { UseInfiniteQueryDocuments, UseGetQueryDocument, UseMutationDocument, FetchMethod, MutationRequest } from "./types/tq";
import type { QueryManyResponse, QueryManyRequest, QueryOneRequest } from "./types/query";

export function useGetInfiniteQueryDocuments<T>({
  url,
  params,
  query,
  options: { queryKey, ...rest },
}: UseInfiniteQueryDocuments<QueryManyResponse<T>, QueryManyRequest<T>>) {
  const token = ""; // TODO: call the session hook here...

  return useInfiniteQuery({
    queryFn: ({ pageParam }) => {
      return mutationFn<QueryManyResponse<T>, QueryManyRequest<T>>({
        url,
        method: "GET",
        request: {
          query: { ...query, page: pageParam },
          params,
          token: token ?? undefined,
        },
      });
    },
    queryKey: [...queryKey],
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const maxPages = Math.ceil(lastPage.total / 3);
      const nextPage = pages.length + 1;
      return nextPage <= maxPages ? nextPage : undefined;
    },
    getPreviousPageParam: (_firstPage, pages) => {
      return pages.length > 1 ? pages.length - 1 : undefined;
    },
    select: (data) =>
      data.pages.reduce(
        (acc, curr) => {
          acc.data = acc.data.concat(...curr.data);
           
          acc.total = curr.total;
          return acc;
        },
        { data: [], total: 0 },
      ),
    ...rest,
  });
}

export function useGetQueryDocuments<T>(
  request: UseGetQueryDocument<QueryManyResponse<T>, QueryManyRequest<T>>,
) {
  return useCustomQuery<QueryManyResponse<T>, QueryManyRequest<T>>(
    "GET",
    request,
  );
}

export function useGetQueryDocument<T>(
  request: UseGetQueryDocument<T, QueryOneRequest<T>>,
) {
  return useCustomQuery<T, QueryOneRequest<T>>("GET", request);
}

export function useCreateDocument<T, C = T>(
  mutation: UseMutationDocument<T, C>,
) {
  return useCustomMutation<T, C>("POST", mutation);
}

export function useUpdateDocument<T, U = T>(
  mutation: UseMutationDocument<T, U>,
) {
  return useCustomMutation<T, U>("PUT", mutation);
}

export function usePatchUpdateDocument<T, U = T>(
  mutation: UseMutationDocument<T, U>,
) {
  return useCustomMutation<T, U>("PATCH", mutation);
}

export function useDeleteDocument<T, D = T>(
  mutation: UseMutationDocument<T, D>,
) {
  return useCustomMutation<T, D>("DELETE", mutation);
}

function useCustomMutation<T, P>(
  method: FetchMethod,
  { options, url, multipart, webUpload }: UseMutationDocument<T, P>,
) {
  const token = "",
    lang = ""; // TODO: call the session hook here...

  return useMutation<T, Error, MutationRequest<P>>({
    mutationFn: (request) =>
      mutationFn({
        method,
        url,
        request: {
          ...request,
          multipart,
          token: token ?? undefined,
          lang,
          webUpload,
        },
      }),
    mutationKey: options.mutationKey,
  });
}

function useCustomQuery<Res, Req extends object>(
  method: FetchMethod,
  { options, url, query, params }: UseGetQueryDocument<Res, Req>,
) {
  const { enabled, queryKey, ...rest } = options;
  const token = "",
    lang = ""; // TODO: call the session hook here...

  return useQuery<Res>({
    queryKey: [...queryKey],
    queryFn: () =>
      mutationFn<Res, Req>({
        method,
        url,
        request: { params, query, token: token ?? undefined, lang },
      }),
    ...rest,
    enabled: !!token && enabled,
  });
}
