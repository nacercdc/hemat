"use client";

import { SidebarProvider } from "@etm/web-ui-components";
import { BreadcrumbProvider } from "./breadcrumb/BreadcrumbProvider";
import TanstackReactQueryProvider from "./tanstack-react-query/TanstackReactQueryProvider";
import LanguagesProvider from "./languages/LanguagesProvider";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanstackReactQueryProvider>
      <SidebarProvider>
        <BreadcrumbProvider
          initialPath={
            typeof window !== "undefined" ? window.location.pathname : "/"
          }
        >
          <LanguagesProvider>{children}</LanguagesProvider>
        </BreadcrumbProvider>
      </SidebarProvider>
    </TanstackReactQueryProvider>
  );
}
