import type { Sort } from "../tanstack-api-query/helpers/types";
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

export interface UpdateRole extends CreateRole {
  id: string;
}

export type RoleIncludable = "permissions";
export type RoleSortable = "name" | "createdAt" | "updatedAt";

export type RoleSorts = Sort<RoleSortable>;
