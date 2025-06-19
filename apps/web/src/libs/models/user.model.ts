import type { Sort } from "../tanstack-api-query/helpers/types";
import type { Permission } from "./permission.model";
import type { Role } from "./role.model";

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface User {
  id: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  status: UserStatus;
  lastLoggedInAt: string;
  lastPasswordUpdatedAt: string;
  lang: string;
  roles: Role[];
  permissions: Permission[];
  createdAt: string;
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  roleIds: string[];
  permissionsIds?: string[];
  password: string;
  confirmPassword?: string;
}

export interface UpdateUser extends CreateUser {
  id: string;
}

export type UserIncludable = "permissions" | "roles";
export type UserSortable = "name" | "createdAt" | "updatedAt";

export type UserSorts = Sort<UserSortable>;
