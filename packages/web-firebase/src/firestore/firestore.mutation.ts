import type { Firestore } from "firebase/firestore";
import { useAddDocumentMutation } from "./helper/hooks/useAddDocumentMutation";
import { useSetDocumentMutation } from "./helper/hooks/useSetDocumentMutation";
import { useUpdateDocumentMutation } from "./helper/hooks/useUpdateDocumentMutation";
import { useDeleteDocumentMutation } from "./helper/hooks/useDeleteDocumentMutation";
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

export const useFirestoreSetDocument = (firestore: Firestore) => {
  return useSetDocumentMutation<Language>(firestore, Collection.LANGUAGES);
};

export const useFirestoreUpdateDocument = (firestore: Firestore) => {
  return useUpdateDocumentMutation<Language>(firestore, Collection.LANGUAGES);
};

export const useFirestoreDeleteDocument = (firestore: Firestore) => {
  return useDeleteDocumentMutation(firestore, Collection.LANGUAGES);
};
