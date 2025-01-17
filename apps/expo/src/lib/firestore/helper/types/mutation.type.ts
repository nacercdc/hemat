import type { UseMutationOptions } from "@tanstack/react-query";
// Create mutation types
export interface MutationCreateRequest<C> {
  data: C;
  docId?: string;
}

type TanstackRQCreateMutateOptions<T, C = T> = Omit<
  UseMutationOptions<T, Error, MutationCreateRequest<C>>,
  "mutationFn"
>;

export interface UseCreateMutationDocument<T, C> {
  collectionName: string;
  options: TanstackRQCreateMutateOptions<T, C>;
}

// Update mutation types
export interface MutationUpdateRequest<U> {
  data: U;
  docId: string;
}

type TanstackRQUpdateMutateOptions<T, U = T> = Omit<
  UseMutationOptions<T, Error, MutationUpdateRequest<U>>,
  "mutationFn"
>;

export interface UseUpdateMutationDocument<T, U> {
  collectionName: string;
  options: TanstackRQUpdateMutateOptions<T, U>;
}

// Generate id type
export interface FirestoreDocumentId {
  collectionName: string;
}
