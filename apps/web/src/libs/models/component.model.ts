import type { Filter, Sort } from "../tanstack-api-query/helpers/types";

export interface Component {
  id: string;
  name: string;
  code: string;
  domainId: string;
  description: string;
  subComponentsCount?: number;
  translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
}

export interface ComponentCreate {
  name: string;
  code: string;
  domainId: string;
  description: string;
  translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
}

export interface ComponentEdit {
  id: string;
  name: string;
  code: string;
  domainId: string;
  description: string;
  translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
}

export type ComponentFilterable = "name" | "code";
export type ComponentSortable = "created_at";

export type ComponentSorts = Sort<ComponentSortable>[];
export type ComponentFilters = Filter<ComponentFilterable>[];
