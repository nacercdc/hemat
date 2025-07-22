import type { Filter, Sort } from "../tanstack-api-query/helpers/types";

export interface SubComponentMeasurementScale {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  subComponentId: string;
  measurementScaleId: string;
  description: string;
  translations: Record<
    string,
    {
      description: string;
    }
  >;
}

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
  measurementScales: SubComponentMeasurementScale[];
}

export interface SubComponentMeasurementScaleCreate {
  subComponentId: string;
  measurementScaleId: string;
  description: string;
  translations: Record<
    string,
    {
      description: string;
    }
  >;
}

export interface SubComponentCreate {
  name: string;
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
export type SubComponentIncludable = "measurementScales";

export type SubComponentSorts = Sort<SubComponentSortable>[];
export type SubComponentFilters = Filter<SubComponentFilterable>[];
