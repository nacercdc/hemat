import React from "react";
import type { IDomainCardType } from "../../components/assessment-detail-section/DomainCardList";

interface ISelectedDomain {
  selectedDomain?: IDomainCardType;
  setSelectedDomain: React.Dispatch<
    React.SetStateAction<IDomainCardType | undefined>
  >;
}

export const SelectedDomainContext = React.createContext<
  ISelectedDomain | undefined
>(undefined);
