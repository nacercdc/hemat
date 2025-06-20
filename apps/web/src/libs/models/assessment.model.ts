import { Filter, Sort } from "../tanstack-api-query/helpers/types";
import { Language } from "./language.model";

export interface User {
  name: string;
}

export interface Country {
  name: string;
  emojiU: symbol | string;
}

export interface GroupMember {
  name: string;
  email: string;
  isLeader: boolean;
  avatarUrl: string;
}

export interface Group {
  groupName: string;
  members: GroupMember[];
}

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
  startDate: Date | string;
  endDate: Date | string;
  countryCode: string;
  status: StatusType;
  createdAt: string;
  organization?: string;
  description?: string;
  languages?: Language[];
  members?: User[];
  groups?: Group[];
}

export interface AssessmentCreate {
  name: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  organization?: string;
  countryCode: string;
  languages?: string[];
  description?: string;
}

export interface AssessmentUpdate {
  id: string;
  name: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
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
