import type { Filter, Sort } from "../tanstack-api-query/helpers/types";
import type { Group } from "./assessment-group.model";
import type { Country } from "./country.model";
import type { Domain } from "./domain.model";
import type { Language } from "./language.model";
import type { User } from "./user.model";

export interface Access {
  domains: Domain[];
  groupId: string;
  groupName: string;
  role: "primary" | "member" | "team-leader";
}

export interface GroupMember {
  name: string;
  email: string;
  isLeader: boolean;
  avatarUrl: string;
}

export type StatusType =
  | "draft"
  | "pending"
  | "closed"
  | "ready"
  | "in_progress"
  | "completed";

export interface Assessment {
  id: string;
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
  members?: User[];
  groups?: Group[];
  access?: Access;
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

export interface AssessmentFilterable {
  status: string;
}
export type AssessmentSortable = "createdAt" | "name" | "color";
export type AssessmentsIncludeAble = "user" | "country" | "members" | "groups";
export type AssessmentSorts = Sort<AssessmentSortable>;
export type AssessmentFilters = Filter<AssessmentFilterable>;
