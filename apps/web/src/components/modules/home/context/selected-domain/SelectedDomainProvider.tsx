"use client";

import { useState } from "react";
import { SelectedDomainContext } from "./selected-domain.context";
import type { IDomainCardType } from "../../components/assessment-detail-section/DomainCardList";
import type { YearOption } from "../../components/assessment-detail-section/SectionHeader";

export function SelectedDomainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedDomain, setSelectedDomain] = useState<
    IDomainCardType | undefined
  >();

  const [selectedFilterYear, setSelectedFilterYear] = useState<
    YearOption | undefined
  >();

  return (
    <SelectedDomainContext.Provider
      value={{
        selectedDomain,
        selectedFilterYear,
        setSelectedDomain,
        setSelectedFilterYear,
      }}
    >
      {children}
    </SelectedDomainContext.Provider>
  );
}
