import type {
  QueryKey,
  UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import useFetch from "../helpers/hooks/useFetch";
import type {
  QueryManyRequest,
  QueryManyResponse,
  RequestConfig,
} from "../helpers/types";

export type TanstackRQFetchOptions<T> = Omit<
  UndefinedInitialDataOptions<T, Error, T, QueryKey>,
  "queryFn"
>;

export type TanstackOptions<Entity> = Partial<TanstackRQFetchOptions<Entity>>;

export interface ManyRequest<Entity, Include, Filterable, Sortable> {
  path: string;
  isProtected?: boolean;
  tqOptions?: TanstackOptions<QueryManyResponse<Entity>>;
  queries?: QueryManyRequest<Include, Filterable, Sortable>;
  configs?: Omit<RequestConfig, "data">;
}

export function useFindAll<
  Entity,
  Include = unknown,
  Filterable = unknown,
  Sortable = unknown,
>(options: ManyRequest<Entity, Include, Filterable, Sortable>) {
  const {
    methods: { get },
  } = useFetch();

  const queryKey = [
    options.path,
    options.queries?.filters,
    options.queries?.search,
    options.queries?.sorts,
    options?.queries?.take?.toString(),
    options?.queries?.skip?.toString(),
    ...(options.tqOptions?.queryKey?.map(String) || []),
  ].filter(Boolean);

  const { tqOptions, ...rest } = options;
  return useQuery({
    ...tqOptions,
    queryKey,
    queryFn: async () => {
      return await get<
        Entity,
        QueryManyResponse<Entity>,
        Include,
        Filterable,
        Sortable
      >({ ...rest, isProtected: rest.isProtected ?? true });
    },
  });
}
