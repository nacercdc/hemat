import type { Filter, Sort } from "../tanstack-api-query/helpers/types";

export interface AssessmentMeasurementScale {
  id: string;
  name: string;
  rate: number;
  color: string;
  description: string;
  assessmentId: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
}
export interface AssessmentMeasurementScaleUpdate {
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
export type AssessmentMeasurementScaleFilterable = "name" | "code";
export type AssessmentMeasurementScaleSortable = "created_at";

export type AssessmentMeasurementScaleSorts =
  Sort<AssessmentMeasurementScaleSortable>[];
export type AssessmentMeasurementScaleFilters =
  Filter<AssessmentMeasurementScaleFilterable>[];
