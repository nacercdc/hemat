import type { Filter, Sort } from "../tanstack-api-query/helpers/types";

export interface AssessmentComponent {
  id: string;
  name: string;
  code: string;
  description: string;
  assessmentId: string;
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
export interface AssessmentComponentUpdate {
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
export type AssessmentComponentFilterable = "name" | "code";
export type AssessmentComponentSortable = "created_at";

export type AssessmentComponentSorts = Sort<AssessmentComponentSortable>[];
export type AssessmentComponentFilters =
  Filter<AssessmentComponentFilterable>[];
