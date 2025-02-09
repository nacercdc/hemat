"use client";

import { FirestoreProvider } from "@e-market/web-tanstack-firebase-query";
import { firestore } from "~/configs/firebase.config";
import TanstackQueryProvider from "./tanstack-query/TanstackQueryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanstackQueryProvider>
      <FirestoreProvider firestore={firestore}>{children}</FirestoreProvider>
    </TanstackQueryProvider>
  );
}
