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
