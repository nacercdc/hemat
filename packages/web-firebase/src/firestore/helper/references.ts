import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  QueryConstraint,
} from "firebase/firestore";
import { collection, doc, query } from "firebase/firestore";
import { converter } from "./converter";

export const collectionReference = <
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  firestore: Firestore,
  collectionName: string
) => {
  return collection(firestore, collectionName) as CollectionReference<
    AppModelType,
    DbModelType
  >;
};

export const documentReference = <T = DocumentData>(
  firestore: Firestore,
  collectionName: string,
  id: string
) => doc(firestore, collectionName, id) as DocumentReference<T>;

export const queryReference = <T extends DocumentData>(
  firestore: Firestore,
  collectionName: string,
  queryConstraint: QueryConstraint[]
) =>
  query(
    collectionReference<T>(firestore, collectionName),
    ...queryConstraint
  ).withConverter(converter<T>());
