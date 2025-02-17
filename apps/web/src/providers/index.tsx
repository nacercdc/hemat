"use client";
import {
  FirebaseProvider,
  initFirebaseApp,
} from "@e-market/tanstack-web-firebase-query";
import { SidebarProvider } from "@e-market/web-ui-components";
import { env } from "~/env";
import { TanstackQueryProvider as TanstackQueryWebFirebaseProvider } from "@e-market/tanstack-web-firebase-query";
import { TanstackQueryProvider as TanstackQueryAPIProvider } from "@e-market/tanstack-api-query";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanstackQueryWebFirebaseProvider
      queryClientConfig={{
        defaultOptions: {
          queries: {
            experimental_prefetchInRender: true,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            staleTime: Infinity,
          },
        },
      }}
    >
      <TanstackQueryAPIProvider
        queryClientConfig={{
          defaultOptions: {
            queries: {
              experimental_prefetchInRender: true,
              refetchOnMount: false,
              refetchOnWindowFocus: false,
              refetchOnReconnect: false,
              staleTime: Infinity,
            },
          },
        }}
      >
        <FirebaseProvider
          {...initFirebaseApp({
            apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
            appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
          })}
        >
          <SidebarProvider>{children}</SidebarProvider>
        </FirebaseProvider>
      </TanstackQueryAPIProvider>
    </TanstackQueryWebFirebaseProvider>
  );
}
