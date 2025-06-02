import React from "react";
import MeProvider from "~/providers/me/MeProvider";
interface Props {
  children: React.ReactNode;
}
export default function ProtectedLayout({ children }: Props) {
  return <MeProvider>{children}</MeProvider>;
}
