import React from "react";
import LanguageProvider from "~/providers/language/LanguageProvider";
import TanstackQueryProvider from "~/providers/tanstack-query/TanstackQueryProvider";
interface Props {
  children: React.ReactNode;
}
export default function MainLayout({ children }: Props) {
  return (
    <TanstackQueryProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </TanstackQueryProvider>
  );
}
