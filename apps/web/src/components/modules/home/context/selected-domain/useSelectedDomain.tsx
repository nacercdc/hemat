import { useContext } from "react";
import { SelectedDomainContext } from "./selected-domain.context";

export const useSelectedDomain = () => useContext(SelectedDomainContext);
