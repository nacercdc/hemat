import type { UndefinedInitialDataInfiniteOptions } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type { QueryFn } from "./types/query.type";
import { collectionReference } from "./firestore.ref";
import { Query } from "./query";

type TanstackInfinityRQOptions<T> = Omit<
  UndefinedInitialDataInfiniteOptions<T[], Error, T[], string[], number>,
  | "queryFn"
  | "getNextPageParam"
  | "getPreviousPageParam"
  | "initialPageParam"
  | "select"
>;

export interface UseFirestoreInfiniteQuery<T> extends QueryFn<T> {
  tqOptions: TanstackInfinityRQOptions<T>;
}

function useFirestoreInfiniteQuery<
  T extends FirebaseFirestoreTypes.DocumentData,
>({
  collectionName,
  queryOptions,
  tqOptions: { queryKey, ...rest },
}: UseFirestoreInfiniteQuery<T>) {
  return useInfiniteQuery<
    T[], // The type of each page (array of documents)
    Error, // The error type
    T[], // The return type of each page,
    string[],
    number
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const collectionRef = collectionReference<T>(collectionName);
      let query = new Query<T>(collectionRef);
      query.filter(queryOptions?.filters).orderBy(queryOptions?.orderBy);

      if (pageParam) {
        query.startAfter(pageParam);
      }
      query = query.limit(queryOptions?.limit);
      const snapshot = await query.get();

      const results = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      return results;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (allPages.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
    ...rest,
  });
}

export default useFirestoreInfiniteQuery;
