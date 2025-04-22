import React from "react";
import UserAbilityProvider from "~/providers/ability/UserAbilityProvider";
import FetchMeProvider from "~/providers/fetch-me/FetchMeProvider";
// import ProtectInternalLayout from "./ProtectInternalLayout";
interface Props {
  children: React.ReactNode;
}

export default function ProtectedInternalLayout({ children }: Props) {
  return (
    // <ProtectInternalLayout>
    <FetchMeProvider>
      <UserAbilityProvider>
        <div className="w-full h-full">{children}</div>
      </UserAbilityProvider>
    </FetchMeProvider>
    // </ProtectInternalLayout>
  );
}
