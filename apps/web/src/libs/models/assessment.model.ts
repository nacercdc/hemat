import { Filter, Sort } from "../tanstack-api-query/helpers/types";
import { Language } from "./language.model";

export interface User {
  name: string;
}

//Temporary dummy Country interface
export interface Country {
  name: string;
}

//Temporary dummy Status type
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
  startDate: Date | undefined;
  endDate: Date | undefined;
  countryCode: string;
  status: StatusType;
  createdAt: string;
  organization?: string;
  languages?: Language;
  description?: string;
}

export interface AssessmentCreate {
  name: string;
  startDate: Date;
  endDate: Date;
  organization?: string;
  countryCode: string;
  languages?: string[];
  description?: string;
}

export interface AssessmentUpdate {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
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
  languages?: string[];
  description?: string;
}

export type AssessmentFilterable = "rate";
export type AssessmentSortable = "createdAt" | "rate" | "name" | "color";
export type AssessmentsIncludeAble = "user";

export type AssessmentSorts = Sort<AssessmentSortable>[];
export type AssessmentFilters = Filter<AssessmentFilterable>[];
