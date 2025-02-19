"use client";
import {
  useCollectionQuery,
  useDocumentQuery,
} from "@etm/tanstack-web-firebase-query";
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
    queryOptions: { filters: { code: { eq: "en" } } },
    tqQueryOptions: { queryKey: ["useGetLanguages"] },
    firestoreOptions: { subscribe: true },
  });
};

export const useGetLanguageById = (id: string) => {
  return useDocumentQuery<Language>({
    collectionName: Collection.LANGUAGES,
    id,
    firestoreOptions: { subscribe: true, source: "default" },
  });
};
