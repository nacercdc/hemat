import React, { useContext, useState } from "react";
import { Domain } from "~/libs/models/domain.model";

interface ISelectedDomain {
  selectedDomain?: Domain;
  setSelectedDomain: React.Dispatch<React.SetStateAction<Domain | undefined>>;
}

export const SelectedDomainContext = React.createContext<
  ISelectedDomain | undefined
>(undefined);
