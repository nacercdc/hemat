"use client";

import { SidebarProvider } from "@etm/web-ui-components";
import { BreadcrumbProvider } from "./breadcrumb/BreadcrumbProvider";
import TanstackReactQueryProvider from "./tanstack-react-query/TanstackReactQueryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanstackReactQueryProvider>
      <SidebarProvider>
        <BreadcrumbProvider
          initialPath={
            typeof window !== "undefined" ? window.location.pathname : "/"
          }
        >
          {children}
        </BreadcrumbProvider>
      </SidebarProvider>
    </TanstackReactQueryProvider>
  );
}
