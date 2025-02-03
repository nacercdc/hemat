import React from "react";
import LanguageProvider from "~/providers/language/LanguageProvider";
import TanstackReactQueryProvider from "~/providers/tanstack-query/TanstackReactQueryProvider";
interface Props {
  children: React.ReactNode;
}
export default function MainLayout({ children }: Props) {
  return (
    <TanstackReactQueryProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </TanstackReactQueryProvider>
  );
}
