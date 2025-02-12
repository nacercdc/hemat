import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type { InfiniteQueryFirestoreOption, Page } from "./types/query.type";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { collectionReference } from "../helpers/firestore.ref";
import { Query } from "../helpers/query";

export default function useCollectionInfiniteQuery<
  T extends FirebaseFirestoreTypes.DocumentData,
>({
  collectionName,
  queryOptions,
  tqQueryOptions: { queryKey, ...rest },
}: InfiniteQueryFirestoreOption<T>) {
  return useInfiniteQuery<
    Page<T>,
    Error,
    InfiniteData<T, FirebaseFirestoreTypes.QueryDocumentSnapshot<T>>,
    string[],
    FirebaseFirestoreTypes.QueryDocumentSnapshot<T> | undefined
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const collectionRef = collectionReference<T>(collectionName);
      let queryRef = new Query<T>(collectionRef);

      queryRef.filter(queryOptions?.filters).orderBy(queryOptions?.orderBy);

      if (pageParam) {
        queryRef = queryRef.startAfter(pageParam);
      }
      queryRef = queryRef.limit(queryOptions?.limit);

      const snapshot = await queryRef.get();

      const results = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      return {
        data: results,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
      } as Page<T>;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.lastDoc,
    ...rest,
  });
}
