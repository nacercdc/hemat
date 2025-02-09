"use client";
import {
  useCollectionQuery,
  useDocumentQuery,
} from "@e-market/web-tanstack-firebase-query";
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
    firestoreOptions: { source: "server" },
  });
};

export const useGetLanguageById = (id: string) => {
  return useDocumentQuery<Language>({
    collectionName: Collection.LANGUAGES,
    id,
    firestoreOptions: { subscribe: true, source: "default" },
  });
};
