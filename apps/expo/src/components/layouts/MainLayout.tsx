import React from "react";
import TanstackReactQueryProvider from "~/providers/TanstackReactQueryProvider";
interface Props {
  children: React.ReactNode;
}
export default function MainLayout({ children }: Props) {
  return <TanstackReactQueryProvider>{children}</TanstackReactQueryProvider>;
}
