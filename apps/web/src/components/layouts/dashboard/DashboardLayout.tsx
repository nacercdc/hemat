import React, { Suspense } from "react";
import { Sidebar } from "../components/sidebar";
import { NavBar } from "../components/navbar";
import Loading from "~/app/[locale]/(protected)/(dashboard)/loading";

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  return (
    <div className="flex w-full h-full gap-2">
      <Sidebar />
      <div className="flex flex-col flex-1 gap-1 w-full h-full px-5 min-[1920px]:px-72 overflow-hidden">
        <NavBar />
        <Suspense fallback={<Loading />}>
          <main className="w-full h-full rounded-md">{children}</main>
        </Suspense>
      </div>
    </div>
  );
}
