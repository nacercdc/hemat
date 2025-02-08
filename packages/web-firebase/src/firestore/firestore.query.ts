import type { Firestore } from "firebase/firestore";
import { useCollectionQuery } from "./helper/hooks/useCollectionQuery";
import { queryReference } from "./helper/references";
interface Language {
  id: string;
  name: string;
  code: string;
}
enum Collection {
  LANGUAGES = "languages",
}
export const useFirestoreCollectionQuery = (firestore: Firestore) => {
  const queryRef = queryReference<Language>(
    firestore,
    Collection.LANGUAGES,
    []
  );
  return useCollectionQuery<Language, Language>(queryRef, {
    firestore: { subscribe: false, source: "server" },
    queryKey: ["useFirestoreCollectionQuery"],
    enabled: true,
  });
};
