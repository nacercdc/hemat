import React from "react";
import LanguagesProvider from "~/providers/languages/LanguagesProvider";
import ProtectedInternalLayout from "~/components/layouts/protected";
import MeProvider from "~/providers/me/MeProvider";
interface Props {
  children: React.ReactNode;
}
export default function ProtectedLayout({ children }: Props) {
  return (
    <MeProvider>
      <ProtectedInternalLayout>
        <LanguagesProvider>{children}</LanguagesProvider>
      </ProtectedInternalLayout>
    </MeProvider>
  );
}
