import React from "react";
import LanguagesProvider from "~/providers/languages/LanguagesProvider";
import MeProvider from "~/providers/me/MeProvider";
interface Props {
  children: React.ReactNode;
}
export default function ProtectedLayout({ children }: Props) {
  return (
    <MeProvider>
      <LanguagesProvider>{children}</LanguagesProvider>
    </MeProvider>
  );
}
