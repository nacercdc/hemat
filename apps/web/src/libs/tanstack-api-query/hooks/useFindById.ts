import type {
  QueryKey,
  UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import useFetch from "../helpers/hooks/useFetch";
import type { QueryOneRequest, RequestConfig } from "../helpers/types";

export type TanstackRQFetchOptions<T> = Omit<
  UndefinedInitialDataOptions<T, Error, T, QueryKey>,
  "queryFn"
>;

export type TanstackOptions<Entity> = Partial<TanstackRQFetchOptions<Entity>>;

export interface OneRequest<Entity, Include> {
  path: string;
  isProtected?: boolean;
  tqOptions?: TanstackOptions<Entity>;
  queries?: QueryOneRequest<Include>;
  configs?: Omit<RequestConfig, "data">;
}

export function useFindById<Entity, Include = unknown>(
  options: OneRequest<Entity, Include>
) {
  const {
    methods: { get },
  } = useFetch();

  const queryKey = [
    options.path,
    ...(options.tqOptions?.queryKey?.map(String) || []),
  ].filter(Boolean);

  const { tqOptions, ...rest } = options;
  return useQuery({
    ...tqOptions,
    queryKey,
    queryFn: async () => {
      return await get<Entity, Entity, Include>({
        ...rest,
        isProtected: rest.isProtected ?? true,
      });
    },
  });
}
