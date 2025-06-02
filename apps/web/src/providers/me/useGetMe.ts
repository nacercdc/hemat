import { useContext } from "react";
import { MeContext } from "./me.context";

export const useGetMe = () => useContext(MeContext);
