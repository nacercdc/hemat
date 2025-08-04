"use client";

import { useState } from "react";
import { SelectedDomainContext } from "./selected-domain.context";
import type { IDomainCardType } from "../../components/assessment-detail-section/DomainCardList";

export function SelectedDomainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedDomain, setSelectedDomain] = useState<
    IDomainCardType | undefined
  >();

  return (
    <SelectedDomainContext.Provider
      value={{ selectedDomain, setSelectedDomain }}
    >
      {children}
    </SelectedDomainContext.Provider>
  );
}
