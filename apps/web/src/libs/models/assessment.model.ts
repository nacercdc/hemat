import type { Filter, Sort } from "../tanstack-api-query/helpers/types";
import type { Country } from "./country.model";
import type { Language } from "./language.model";
import { User } from "./user.model";

export type StatusType =
  | "Draft"
  | "Pending"
  | "Closed"
  | "Ready"
  | "In-Progress"
  | "Completed";

export interface Assessment {
  id: number;
  name: string;
  user: User;
  country: Country;
  startDate: string;
  endDate: string;
  countryCode: string;
  status: StatusType;
  createdAt: string;
  organization?: string;
  description?: string;
  languages?: Language[];
}

export interface AssessmentCreate {
  name: string;
  startDate: string;
  endDate: string;
  organization?: string;
  countryCode: string;
  languages?: string[];
  description?: string;
}

export interface AssessmentUpdate {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  organization?: string;
  countryCode: string;
  languages?: string[];
  description?: string;
}

export interface AssessmentDetail {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  organization?: string;
  countryCode: string;
  description?: string;
}

export type AssessmentFilterable = "rate";
export type AssessmentSortable = "createdAt" | "rate" | "name" | "color";
export type AssessmentsIncludeAble = "user" | "country" | "members" | "groups";
export type AssessmentSorts = Sort<AssessmentSortable>[];
export type AssessmentFilters = Filter<AssessmentFilterable>[];
