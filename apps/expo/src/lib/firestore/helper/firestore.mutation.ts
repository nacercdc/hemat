import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import firestore from "@react-native-firebase/firestore";

interface MutationRequest<P> {
  data: P;
  docId?: string;
}

type TanstackRQMutateOptions<T, P = T> = Omit<
  UseMutationOptions<T, Error, MutationRequest<P>>,
  "mutationFn"
>;

interface UseMutationDocument<T, P> {
  collectionName: string;
  options: TanstackRQMutateOptions<T, P>;
}

export const useFirestoreCreate = <
  T extends FirebaseFirestoreTypes.DocumentData,
  C = T,
>({
  collectionName,
  options,
}: UseMutationDocument<T, C>) => {
  return useMutation<T, Error, MutationRequest<C>>({
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

interface MutationURequest<P> {
  data: P;
  docId: string;
}

export const useFirestoreUpdateMutation = <
  T extends FirebaseFirestoreTypes.DocumentData,
  U = T,
>({
  collectionName,
  options,
}: UseMutationDocument<T, U>) => {
  return useMutation<T, Error, MutationURequest<U>>({
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

interface MutationURequest<P> {
  data: P;
  docId: string;
}

export const useFirestoreDeleteMutation = <
  T extends FirebaseFirestoreTypes.DocumentData,
  U = T,
>({
  collectionName,
  options,
}: UseMutationDocument<T, U>) => {
  return useMutation<T, Error, MutationURequest<U>>({
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

interface FirestoreDocumentId {
  collectionName: string;
}
export const useFirestoreDocumentId = <
  T extends FirebaseFirestoreTypes.DocumentData,
>({
  collectionName,
}: FirestoreDocumentId) => {
  return firestore().collection<T>(collectionName).id;
};
