import type { UseMutationOptions } from "@tanstack/react-query";

export interface MutationCreateRequest<C> {
  data: C;
  id?: string;
}

type TanstackRQCreateMutateOptions<T, C = T> = Omit<
  UseMutationOptions<T, Error, MutationCreateRequest<C>>,
  "mutationFn"
>;

export interface UseCreateMutationDocument<T, C> {
  collectionName: string;
  options: TanstackRQCreateMutateOptions<T, C>;
}
