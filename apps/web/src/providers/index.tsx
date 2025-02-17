"use client";

import { FirebaseProvider } from "@e-market/tanstack-web-firebase-query";
import { firestore, storage } from "~/configs/firebase.config";
import TanstackQueryProvider from "./tanstack-query/TanstackQueryProvider";
import { SidebarProvider } from "@e-market/web-ui-components";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanstackQueryProvider>
      <FirebaseProvider firestore={firestore} storage={storage}>
        <SidebarProvider>
           {children}
         </SidebarProvider>
      </FirebaseProvider>
    </TanstackQueryProvider>
  );
}
