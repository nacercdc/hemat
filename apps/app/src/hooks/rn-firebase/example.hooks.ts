import {
  useCollectionQuery,
  useDocumentQuery,
} from "@etm/tanstack-rn-firebase-query";
export enum Collection {
  LANGUAGES = "languages",
}
interface Language {
  id: string;
  name: string;
  code: string;
}
export function useGetLanguages() {
  return useCollectionQuery<Language>({
    collectionName: Collection.LANGUAGES,
    tqQueryOptions: {
      queryKey: ["useGetLanguages"],
    },
    firestoreOptions: {
      subscribe: true,
    },
  });
}

export function useGetLanguage() {
  return useDocumentQuery<Language>({
    collectionName: Collection.LANGUAGES,
    id: "k9OoD2tLotxFZAdpjeCY",
    firestoreOptions: {
      subscribe: false,
    },
  });
}
