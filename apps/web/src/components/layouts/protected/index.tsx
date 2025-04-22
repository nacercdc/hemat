import React from "react";
import UserAbilityProvider from "~/providers/ability/UserAbilityProvider";
interface Props {
  children: React.ReactNode;
}

export default function ProtectedInternalLayout({ children }: Props) {
  return (
    <UserAbilityProvider>
      <div className="w-full h-full">{children}</div>
    </UserAbilityProvider>
  );
}
