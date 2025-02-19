import { TanstackQueryProvider as TanstackQueryRNFirebaseProvider } from "@etm/tanstack-rn-firebase-query";
import { TanstackQueryProvider as TanstackQueryAPIProvider } from "@etm/tanstack-api-query";
import React from "react";
import LanguageProvider from "~/providers/language/LanguageProvider";
interface Props {
  children: React.ReactNode;
}
export default function MainLayout({ children }: Props) {
  return (
    <TanstackQueryRNFirebaseProvider
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
        <LanguageProvider>{children}</LanguageProvider>
      </TanstackQueryAPIProvider>
    </TanstackQueryRNFirebaseProvider>
  );
}
