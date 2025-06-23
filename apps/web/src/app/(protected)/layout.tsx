import React from "react";
import ProtectedInternalLayout from "~/components/layouts/protected";
import MeProvider from "~/providers/me/MeProvider";
interface Props {
  children: React.ReactNode;
}
export default function ProtectedLayout({ children }: Props) {
  return (
    <MeProvider>
      <ProtectedInternalLayout>{children}</ProtectedInternalLayout>
    </MeProvider>
  );
}
