import type { Filter, Sort } from "../tanstack-api-query/helpers/types";

export interface Domain {
  id: string;
  name: string;
  code: string;
  description: string;
  translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
  componentsCount?: number;
  subComponentsCount?: number;
}

export interface DomainCreate {
  name: string;
  code: string;
  description: string;
  translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
}

export interface DomainEdit {
  id: string;
  name: string;
  code: string;
  description: string;
  translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
}

export type DomainFilterable = "name" | "code";
export type DomainSortable = "created_at";

export type DomainSorts = Sort<DomainSortable>[];
export type DomainFilters = Filter<DomainFilterable>[];
export type DomainIncludable = "components";
