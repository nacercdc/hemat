import React from "react";
import TanstackReactQueryProvider from "~/providers/tanstack-query/TanstackReactQueryProvider";
import UIKittenProvider from "~/providers/ui-kitten/UIKittenProvider";
interface Props {
  children: React.ReactNode;
}
export default function MainLayout({ children }: Props) {
  return (
    <TanstackReactQueryProvider>
      <UIKittenProvider>{children}</UIKittenProvider>
    </TanstackReactQueryProvider>
  );
}
