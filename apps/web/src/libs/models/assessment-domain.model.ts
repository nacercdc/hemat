import type { Filter, Sort } from "../tanstack-api-query/helpers/types";

export interface AssessmentDomain {
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
export interface AssessmentDomainUpdate {
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
export type AssessmentDomainFilterable = "name" | "code";
export type AssessmentDomainSortable = "created_at";

export type AssessmentDomainSorts = Sort<AssessmentDomainSortable>[];
export type AssessmentDomainFilters = Filter<AssessmentDomainFilterable>[];
