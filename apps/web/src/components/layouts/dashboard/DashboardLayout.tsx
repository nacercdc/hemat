import React, { Suspense } from "react";
import { NavBar } from "../components/navbar";
import Loading from "~/app/(protected)/(dashboard)/loading";
import Sidebar from "../components/sidebar/Sidebar";
import UserAbilityProvider from "~/providers/ability/UserAbilityProvider";

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  return (
    <UserAbilityProvider>
      <div className="flex w-full h-full gap-2 bg-basic-200">
        <Sidebar />
        <div className="flex flex-col flex-1 gap-1 w-full h-full px-5 min-[1920px]:px-72 overflow-hidden">
          <NavBar />
          <Suspense fallback={<Loading />}>
            <main className="w-full h-full rounded-md">{children}</main>
          </Suspense>
        </div>
      </div>
    </UserAbilityProvider>
  );
}
