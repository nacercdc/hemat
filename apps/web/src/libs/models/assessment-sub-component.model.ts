import type { Filter, Sort } from "../tanstack-api-query/helpers/types";
import type { AssessmentMeasurementScale } from "./assessment-measurement-scale.model";

export interface AssessmentSubComponent {
  id: string;
  name: string;
  code: string;
  description: string;
  assessmentId: string;
  componentId: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  translations: Record<
    string,
    {
      name: string;
      code: string;
      description: string;
    }
  >;
}
export interface AssessmentSubComponentUpdate {
  id: string;
  name: string;
  code: string;
  description: string;
  componentId: string;
  translations: Record<
    string,
    {
      name: string;
      code: string;
      description: string;
    }
  >;
}

export interface AssessmentSubComponentMeasurementScale {
  description: string;
  subComponentId: string;
  measurementScaleId: string;
  measurementScale?: AssessmentMeasurementScale;
  translations: Record<string, { description: string }>;
}

export type AssessmentSubComponentFilterable = "name" | "code";
export type AssessmentSubComponentSortable = "created_at";

export type AssessmentSubComponentMeasurementScaleIncludable =
  "measurementScale";

export type AssessmentSubComponentSorts =
  Sort<AssessmentSubComponentSortable>[];
export type AssessmentSubComponentFilters =
  Filter<AssessmentSubComponentFilterable>[];
