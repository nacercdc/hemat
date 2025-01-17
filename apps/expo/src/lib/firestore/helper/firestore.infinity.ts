import type { UndefinedInitialDataInfiniteOptions } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import type { QueryFn } from "./types/query.type";

type TanstackInfinityRQOptions<T> = Omit<
  UndefinedInitialDataInfiniteOptions<T, Error, T, string[], number>,
  | "queryFn"
  | "getNextPageParam"
  | "getPreviousPageParam"
  | "initialPageParam"
  | "select"
>;

export interface UseInfiniteQueryDocuments<Res> extends QueryFn<Res> {
  tqOptions: TanstackInfinityRQOptions<Res>;
}

function useFirestoreInfiniteQuery<
  T extends FirebaseFirestoreTypes.DocumentData,
>() {
  return useInfiniteQuery<
    T[], // The type of each page (array of documents)
    Error, // The error type
    T[], // The return type of each page,
    string[],
    number
  >({
    queryKey: ["key"],
    queryFn: async ({ pageParam }) => {
      let query = firestore().collection("languages").limit(2);

      if (pageParam) {
        query = query.startAfter(pageParam);
      }

      const snapshot = await query.get();

      const results = snapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as T[];
      return results;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
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
  });
}

export default useFirestoreInfiniteQuery;
