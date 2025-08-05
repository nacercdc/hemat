"use client";

import { useState } from "react";
import type { YearOption } from "../../components/assessment-detail-section/SectionHeader";
import { SelectedFilterYearContext } from "./selected-filter-year.context";

export function SelectedFilterYearProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedFilterYear, setSelectedFilterYear] = useState<
    YearOption | undefined
  >();

  return (
    <SelectedFilterYearContext.Provider
      value={{
        selectedFilterYear,
        setSelectedFilterYear,
      }}
    >
      {children}
    </SelectedFilterYearContext.Provider>
  );
}
