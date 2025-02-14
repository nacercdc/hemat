"use client";

import { FirestoreProvider } from "@e-market/tanstack-web-firebase-query";
import { firestore } from "~/configs/firebase.config";
import TanstackQueryProvider from "./tanstack-query/TanstackQueryProvider";
import { SidebarProvider } from "@e-market/web-ui-components";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanstackQueryProvider>
      <SidebarProvider>
        <FirestoreProvider firestore={firestore}>{children}</FirestoreProvider>
      </SidebarProvider>
    </TanstackQueryProvider>
  );
}
