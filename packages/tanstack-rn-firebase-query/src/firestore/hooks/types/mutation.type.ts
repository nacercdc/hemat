import type { UseMutationOptions } from "@tanstack/react-query";

export interface AddDocumentRequest<C> {
  data: C;
  id?: string;
}

type TanstackRQCreateMutateOptions<T, C = T> = Omit<
  UseMutationOptions<T, Error, AddDocumentRequest<C>>,
  "mutationFn"
>;

export interface UseAddDocumentMutation<T, C> {
  collectionName: string;
  options: TanstackRQCreateMutateOptions<T, C>;
}

export interface UpdateDocumentRequest<U> {
  data: U;
  id: string;
}

type TanstackRQUpdateMutateOptions<T, U = T> = Omit<
  UseMutationOptions<T, Error, UpdateDocumentRequest<U>>,
  "mutationFn"
>;

export interface UseUpdateDocumentMutation<T, U> {
  collectionName: string;
  options: TanstackRQUpdateMutateOptions<T, U>;
}
