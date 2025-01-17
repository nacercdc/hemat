import useFirestoreInfiniteQuery from "../helper/firestore.infinity";
import { useFirestoreQuery } from "../helper/firestore.query";

export enum Collection {
  LANGUAGES = "languages",
}
interface Language {
  id: string;
  name: string;
  code: string;
}
// export default function useGetLanguages() {
//   return useFirestoreQuery<Language>({
//     collectionName: Collection.LANGUAGES,
//     firestoreOptions: {
//       enabled: true,
//       queryKey: ["useGetLanguages", "en"],
//     },
//     queryOptions: {
//       filters: { code: { eq: "en" } },
//     },
//   });
// }

export default function useGetLanguages() {
  return useFirestoreInfiniteQuery<Language>();
}
