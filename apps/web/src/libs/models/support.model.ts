import type { Sort } from "../tanstack-api-query/helpers/types";
import type { User } from "./user.model";

export enum StatusEnum {
  OPEN = "open",
  CLOSE = "close",
  PROCESSING = "processing",
}

export enum VisibilityEnum {
  PUBLIC = "public",
  INTERNAL = "internal",
}

export enum PriorityEnum {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
}

export interface SupportReply {
  id: string;
  supportId: string;
  repliedById: string;
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
  status: StatusEnum;
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
