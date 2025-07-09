"use client";

import { useState } from "react";
import { SelectedDomainContext } from "./selected-domain.context";
import { Domain } from "~/libs/models/domain.model";

export function SelectedDomainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedDomain, setSelectedDomain] = useState<Domain | undefined>();

  return (
    <SelectedDomainContext.Provider
      value={{ selectedDomain, setSelectedDomain }}
    >
      {children}
    </SelectedDomainContext.Provider>
  );
}
