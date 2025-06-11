import type { Filter, Sort } from "../tanstack-api-query/helpers/types";

export interface Scale {
  id: string;
  name: string;
  rate: number;
  color: string;
  description: string;
  translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
}

export interface ScaleCreate {
  name: string;
  rate: number;
  color: string;
  description: string;
  translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
}

export type ScaleFilterable = "rate";
export type ScaleSortable = "createdAt" | "rate" | "name" | "color";

export type ScaleSorts = Sort<ScaleSortable>[];
export type ScaleFilters = Filter<ScaleFilterable>[];
