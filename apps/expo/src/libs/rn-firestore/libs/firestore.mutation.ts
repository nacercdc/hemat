import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useMutation } from "@tanstack/react-query";

import {
  batchReference,
  collectionReference,
  documentReference,
} from "./helper/firestore.ref";
import type {
  UseCreateMutationDocument,
  MutationCreateRequest,
  UseUpdateMutationDocument,
  MutationUpdateRequest,
  UseMBatchMutationDocument,
  BatchDocument,
  FirestoreDocumentId,
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
      const collectionRef = collectionReference<T>(collectionName);
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
      const docRef = documentReference<T>(collectionName, request.docId);
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
      const docRef = documentReference<T>(collectionName, request.docId);
      await docRef.delete();
      const updatedDoc = await docRef.get();
      return updatedDoc.data() as unknown as T;
    },
    ...options,
  });
};

export const useFirestoreBatch = ({ options }: UseMBatchMutationDocument) => {
  return useMutation<void, Error, BatchDocument[]>({
    mutationFn: async (batchDocuments) => {
      const batch = batchReference;
      batchDocuments.forEach((operation) => {
        const collectionRef = collectionReference(operation.collection);
        switch (operation.type) {
          case "create": {
            if (!operation.data)
              throw new Error("Data is required for create operation");
            const docRef = collectionRef.doc();
            batch.set(docRef, operation.data);
            break;
          }
          case "update": {
            if (!operation.id || !operation.data)
              throw new Error("ID and data are required for update operation");
            const docRef = collectionRef.doc(operation.id);
            batch.update(docRef, operation.data);
            break;
          }
          case "delete": {
            if (!operation.id)
              throw new Error("ID is required for delete operation");
            const docRef = collectionRef.doc(operation.id);
            batch.delete(docRef);
            break;
          }
          default:
            throw new Error("Invalid operation type");
        }
      });
      await batch.commit();
    },
    ...options,
  });
};

export const useFirestoreDocumentId = <
  T extends FirebaseFirestoreTypes.DocumentData,
>({
  collectionName,
}: FirestoreDocumentId) => collectionReference<T>(collectionName).id;
