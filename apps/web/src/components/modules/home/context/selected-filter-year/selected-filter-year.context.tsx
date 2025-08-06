import React from "react";
import type { YearOption } from "../../components/assessment-detail-section/SectionHeader";

interface ISelectedFilterYear {
  selectedFilterYear?: YearOption;
  setSelectedFilterYear: React.Dispatch<
    React.SetStateAction<YearOption | undefined>
  >;
}

export const SelectedFilterYearContext = React.createContext<
  ISelectedFilterYear | undefined
>(undefined);
