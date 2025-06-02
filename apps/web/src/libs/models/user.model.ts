import type { Permission } from "./permission.model";
import type { Role } from "./role.model";

export enum UseStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface User {
  id: string;
  isAdmin: boolean;
  name: string;
  email: string;
  status: UseStatus;
  lastLoggedInAt: string;
  lastPasswordUpdatedAt: string;
  lang: string;
  roles: Role[];
  permissions: Permission[];
}
