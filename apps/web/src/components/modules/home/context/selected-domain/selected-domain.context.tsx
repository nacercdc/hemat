import React from "react";
import type { IDomainCardType } from "../../components/assessment-detail-section/DomainCardList";
import type { YearOption } from "../../components/assessment-detail-section/SectionHeader";

interface ISelectedDomain {
  selectedFilterYear?: YearOption;
  selectedDomain?: IDomainCardType;
  setSelectedDomain: React.Dispatch<
    React.SetStateAction<IDomainCardType | undefined>
  >;
  setSelectedFilterYear: React.Dispatch<
    React.SetStateAction<YearOption | undefined>
  >;
}

export const SelectedDomainContext = React.createContext<
  ISelectedDomain | undefined
>(undefined);
