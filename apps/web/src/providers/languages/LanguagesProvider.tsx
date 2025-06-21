"use client";
import React from "react";
import { LanguagesContext } from "./languages.context";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { Language } from "~/libs/models/language.model";

interface Props {
  children: React.ReactNode;
}
export default function LanguagesProvider({ children }: Props) {
  const languages = useFindAll<Language>({
    path: "/languages",
  });

  return (
    <LanguagesContext.Provider value={languages}>
      {children}
    </LanguagesContext.Provider>
  );
}
