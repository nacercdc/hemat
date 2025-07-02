"use client";

import React, { Suspense } from "react";
import { NavBar } from "../components/navbar";
import Loading from "~/app/(protected)/(dashboard)/loading";
import Sidebar from "../components/sidebar/Sidebar";
import UserAbilityProvider from "~/providers/ability/UserAbilityProvider";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  const pathname = usePathname();

  return (
    <UserAbilityProvider>
      <div className="flex w-full h-full gap-2 bg-basic-200">
        <Sidebar />
        <div className="flex flex-col flex-1 gap-1 w-full h-full px-5 min-[2160px]:px-72 overflow-hidden py-6">
          <Suspense fallback={<Loading />}>
            <NavBar />
          </Suspense>
          <Suspense fallback={<Loading />}>
            <motion.div
              key={pathname}
              initial={{
                opacity: 0,
                scale: 0.975,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              className="min-h-screen"
            >
              <main className="w-full h-full rounded-md">{children}</main>
            </motion.div>
          </Suspense>
        </div>
      </div>
    </UserAbilityProvider>
  );
}
