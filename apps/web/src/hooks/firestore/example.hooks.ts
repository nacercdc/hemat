"use client";
import { useCollectionQuery } from "@e-market/web-firebase";
interface Language {
  id: string;
  name: string;
  code: string;
}
enum Collection {
  LANGUAGES = "languages",
}

export const useGetLanguages = () => {
  return useCollectionQuery<Language>({
    collectionName: Collection.LANGUAGES,
    queryOptions: {
      filters: {
        code: {
          eq: "en",
        },
      },
    },
    tqQueryOptions: {
      queryKey: ["useGetLanguages"],
    },
    firestoreOptions: {
      source: "server",
    },
  });
};
