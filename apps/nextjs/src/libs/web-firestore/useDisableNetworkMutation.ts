/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { UseMutationOptions } from "@tanstack/react-query";
import type { Firestore, FirestoreError } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";
import { disableNetwork } from "firebase/firestore";

type FirestoreUseMutationOptions<TData = unknown, TError = Error> = Omit<
  UseMutationOptions<TData, TError, void>,
  "mutationFn"
>;

export function useDisableNetworkMutation(
  firestore: Firestore,
  options?: FirestoreUseMutationOptions<void, FirestoreError>,
) {
  return useMutation<void, FirestoreError>({
    ...options,
    mutationFn: () => disableNetwork(firestore),
  });
}
