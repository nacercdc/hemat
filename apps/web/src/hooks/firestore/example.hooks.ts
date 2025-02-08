import { useCollectionQuery } from "@e-market/web-firebase";
import { firestore } from "~/config/firebase.config";
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
    firestore,
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
      subscribe: false,
    },
  });
};
