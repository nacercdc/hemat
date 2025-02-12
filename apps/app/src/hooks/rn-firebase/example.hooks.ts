import { useFirestoreQuery } from "@e-market/tanstack-rn-firebase-query";
export enum Collection {
  LANGUAGES = "languages",
}
interface Language {
  id: string;
  name: string;
  code: string;
}
export default function useGetLanguages() {
  return useFirestoreQuery<Language>({
    collectionName: Collection.LANGUAGES,
    tqOptions: {
      enabled: true,
      queryKey: ["useGetLanguages"],
    },
  });
}
