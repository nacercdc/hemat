import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useMutation } from "@tanstack/react-query";
import firestore from "@react-native-firebase/firestore";
import type {
  FirestoreDocumentId,
  MutationCreateRequest,
  MutationUpdateRequest,
  UseCreateMutationDocument,
  UseUpdateMutationDocument,
} from "./types/mutation.type";

export const useFirestoreCreate = <
  T extends FirebaseFirestoreTypes.DocumentData,
  C = T,
>({
  collectionName,
  options,
}: UseCreateMutationDocument<T, C>) => {
  return useMutation<T, Error, MutationCreateRequest<C>>({
    mutationFn: async (request) => {
      const collectionRef = firestore().collection<T>(collectionName);
      const docId = request.docId ?? collectionRef.id;
      const docRef = await collectionRef.add({
        id: docId,
        ...request.data,
      } as unknown as T);
      const docSnapshot = await docRef.get();

      const docData = docSnapshot.data();
      if (!docData) {
        throw new Error("Document data not found");
      }

      return docData;
    },
    ...options,
  });
};

export const useFirestoreUpdateMutation = <
  T extends FirebaseFirestoreTypes.DocumentData,
  U = T,
>({
  collectionName,
  options,
}: UseUpdateMutationDocument<T, U>) => {
  return useMutation<T, Error, MutationUpdateRequest<U>>({
    mutationFn: async (request) => {
      const docRef = firestore()
        .collection<T>(collectionName)
        .doc(request.docId);

      await docRef.update(
        request.data as Partial<FirebaseFirestoreTypes.SetValue<T>>
      );

      const updatedDoc = await docRef.get();
      return updatedDoc.data() as unknown as T;
    },
    ...options,
  });
};

export const useFirestoreDeleteMutation = <
  T extends FirebaseFirestoreTypes.DocumentData,
  U = T,
>({
  collectionName,
  options,
}: UseUpdateMutationDocument<T, U>) => {
  return useMutation<T, Error, MutationUpdateRequest<U>>({
    mutationFn: async (request) => {
      const docRef = firestore()
        .collection<T>(collectionName)
        .doc(request.docId);

      await docRef.delete();

      const updatedDoc = await docRef.get();
      return updatedDoc.data() as unknown as T;
    },
    ...options,
  });
};

export const useFirestoreDocumentId = <
  T extends FirebaseFirestoreTypes.DocumentData,
>({
  collectionName,
}: FirestoreDocumentId) => {
  return firestore().collection<T>(collectionName).id;
};
