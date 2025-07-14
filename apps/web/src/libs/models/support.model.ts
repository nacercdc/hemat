import type { Sort } from "../tanstack-api-query/helpers/types";
import type { User } from "./user.model";

export enum SupportStatus {
  OPEN = "open",
  CLOSED = "closed",
  PROCESSING = "processing",
}

export enum VisibilityEnum {
  PUBLIC = "public",
  INTERNAL = "internal",
}

export enum PriorityEnum {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

interface SupportReply {
  id: string;
  supportId: string;
  repliedBy: User;
  description: string;
  visibility: VisibilityEnum;
  priority: PriorityEnum;
  createdAt: string;
}

export interface Support {
  id: string;
  title: string;
  description: string;
  issuedBy: User;
  status: SupportStatus;
  replies?: SupportReply[];
  createdAt: string;
}

export interface CreateSupport {
  title: string;
  description: string;
}

export type SupportIncludable = "replies" | "issuedBy";
export type SupportSortable = "name" | "createdAt";

export type SupportSorts = Sort<SupportSortable>;
