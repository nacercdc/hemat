import type { Filter, Sort } from "../tanstack-api-query/helpers/types";

export interface SubComponent {
  id: string;
  name: string;
  code: string;
  componentId: string;
  description: string;
  translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
}

export interface SubComponentCreate {
  name: string;
  code: string;
  componentId: string;
  description: string;
  translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
}

export interface SubComponentEdit {
  id: string;
  name: string;
  code: string;
  componentId: string;
  description: string;
  translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
}

export type SubComponentFilterable = "name" | "code";
export type SubComponentSortable = "created_at";

export type SubComponentSorts = Sort<SubComponentSortable>[];
export type SubComponentFilters = Filter<SubComponentFilterable>[];
