import { useContext } from "react";
import { ActiveListContext } from "./active-list.context";

export const useActiveList = () => useContext(ActiveListContext);
