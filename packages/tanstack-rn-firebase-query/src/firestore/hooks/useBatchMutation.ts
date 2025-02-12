/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useMutation } from "@tanstack/react-query";
import type { BatchDocument, UseMBatchMutation } from "./types/mutation.type";
import { batchReference, collectionReference } from "../helper/firestore.ref";

export const useBatchMutation = ({ options }: UseMBatchMutation) => {
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
