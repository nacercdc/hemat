import type { Filter, Sort } from "../tanstack-api-query/helpers/types";
import type { Permission } from "./permission.model";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRole {
  name: string;
  description?: string;
  permissionsIds: string[];
}

export type RoleSortable = "name" | "created_at";
export type RoleFilterable = "is_active" | "created_at";
export type RoleIncludable = "permissions";

export type RoleSorts = Sort<RoleSortable>[];
export type RoleFilters = Filter<RoleFilterable>[];
