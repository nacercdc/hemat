import type { Firestore } from "firebase/firestore";
import { useAddDocumentMutation } from "./helper/hooks/useAddDocumentMutation";
interface Language {
  id: string;
  name: string;
  code: string;
}
interface ICreateLanguage {
  name: string;
  code: string;
}

enum Collection {
  LANGUAGES = "languages",
}
export const useFirestoreAddDocument = (firestore: Firestore) => {
  return useAddDocumentMutation<Language, ICreateLanguage>(
    firestore,
    Collection.LANGUAGES
  );
};
