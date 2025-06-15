"use client";
import React from "react";
import { LanguagesContext } from "./languages.context";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { Language } from "~/libs/models/language.model";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";

interface Props {
  children: React.ReactNode;
}
export default function LanguagesProvider({ children }: Props) {
  const languages = useFindAll<QueryManyResponse<Language>>({
    path: "/languages",
  });

  return (
    <LanguagesContext.Provider value={languages}>
      {children}
    </LanguagesContext.Provider>
  );
}
