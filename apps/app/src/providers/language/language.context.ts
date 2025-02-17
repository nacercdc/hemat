/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";
export enum Language {
  EN = "en",
}
export interface LanguageContextValue {
  language: Language;
  isLoading: boolean;
  changeLanguage: (language: Language) => Promise<void>;
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: Language.EN,
  isLoading: false,
  changeLanguage: async () => {},
});
