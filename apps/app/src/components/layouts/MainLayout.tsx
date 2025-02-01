import React from "react";
import LanguageProvider from "~/providers/language/LanguageProvider";
import TanstackReactQueryProvider from "~/providers/tanstack-query/TanstackReactQueryProvider";
import UIKittenProvider from "~/providers/ui-kitten/UIKittenProvider";
interface Props {
  children: React.ReactNode;
}
export default function MainLayout({ children }: Props) {
  return (
    <TanstackReactQueryProvider>
      <LanguageProvider>
        <UIKittenProvider>{children}</UIKittenProvider>
      </LanguageProvider>
    </TanstackReactQueryProvider>
  );
}
