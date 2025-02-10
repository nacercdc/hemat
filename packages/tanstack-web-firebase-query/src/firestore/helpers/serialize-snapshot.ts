import type {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";

export function serializeQuerySnapshot<T extends DocumentData>(
  querySnapshot: QuerySnapshot<T>
) {
  const results: T[] = [];
  querySnapshot.docs.forEach((doc) => {
    const data = serializeDocumentSnapshot<T>(doc);
    if (data) {
      results.push(data);
    }
  });
  return results;
}

export function serializeDocumentSnapshot<T extends DocumentData>(
  document: QueryDocumentSnapshot<T>
) {
  const data = document.data();

  if (!data) return;
  return data;
}
