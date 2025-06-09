import type { Filter, Sort } from "../tanstack-api-query/helpers/types";

export interface Language {
  id: string;
  name: string;
  code: string;
  native: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface LanguageCreate {
  name: string;
  code: string;
  native: string;
}

export type LanguageFilterable = "name" | "code";
export type LanguageSortable = "created_at";

export type LanguageSorts = Sort<LanguageSortable>[];
export type LanguageFilters = Filter<LanguageFilterable>[];
