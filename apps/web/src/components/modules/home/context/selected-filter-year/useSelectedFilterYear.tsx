import { useContext } from "react";
import { SelectedFilterYearContext } from "./selected-filter-year.context";

export const useSelectedFilterYear = () =>
  useContext(SelectedFilterYearContext);
