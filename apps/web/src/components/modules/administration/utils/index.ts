/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { Permission } from "~/libs/models/permission.model";
import type { PermissionModule } from "../components/tabs/roles-tab/form";
import type { PermissionType } from "../types";

export const getPermissionIds = (
  modules: PermissionModule[],
  permissions: Permission[] | undefined,
  modulePermissions: Record<string, Record<PermissionType, boolean>>
) => {
  const permissionIds: string[] = [];

  modules.forEach((module) => {
    const mpObj = modulePermissions[module.name];

    Object.keys(mpObj!).forEach((mPKey) => {
      if (mpObj![mPKey as PermissionType]) {
        return permissionIds.push(
          permissions?.find(
            (p) => `${p.action}:${p.subject}` === `${mPKey}:${module.name}`
          )?.id || ""
        );
      }
    });
  });

  return permissionIds.filter(Boolean);
};

export const rolePermissions = (permissions: Permission[]) => {
  let rolePerms: Record<string, Partial<Record<PermissionType, boolean>>> = {};
  permissions.forEach((perm) => {
    const { action, subject } = perm;
    rolePerms = {
      ...rolePerms,
      [subject]: {
        ...rolePerms[subject],
        [action]: true,
      },
    };
  });

  return rolePerms;
};

//Temporary (be deleted), until the backend is ready
export const generatePassword = (length = 10) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
