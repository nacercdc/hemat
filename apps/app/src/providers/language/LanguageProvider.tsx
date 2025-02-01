import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

import "intl-pluralrules";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translation.json";
import { Language, LanguageContext } from "./language.context";
import { MMKV_STORAGE } from "~/constants";

const LANGUAGE_STORAGE_KEY = "lang";

interface Props {
  children: React.ReactNode;
}
export default function LanguageProvider({ children }: Props) {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = async (lang: Language) => {
    setIsLoading(true);
    setLanguage(lang);
    await i18n.changeLanguage(lang);
    MMKV_STORAGE.set(LANGUAGE_STORAGE_KEY, lang);
    setIsLoading(false);
  };

  useEffect(() => {
    const lang = MMKV_STORAGE.getString(LANGUAGE_STORAGE_KEY);
    if (lang) setLanguage(lang as Language);
  }, []);

  useEffect(() => {
    i18n.use(initReactI18next).init({
      debug: false,
      fallbackLng: Language.EN,
      supportedLngs: [Language.EN],
      resources: {
        [Language.EN]: {
          translation: enTranslation,
        },
      },
    });
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        isLoading,
        changeLanguage: handleLanguageChange,
      }}
    >
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
}
