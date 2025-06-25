import { useContext } from "react";
import { LanguagesContext } from "./languages.context";

export const useGetLanguages = () => useContext(LanguagesContext);
