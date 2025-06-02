"use client";
import React from "react";
import type { User } from "~/libs/models/user.model";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { MeContext } from "./me.context";

interface Props {
  children: React.ReactNode;
}
export default function MeProvider({ children }: Props) {
  const currentUser = useFindById<User>({
    path: "/auth/me",
  });
  return (
    <MeContext.Provider value={currentUser}>{children}</MeContext.Provider>
  );
}
