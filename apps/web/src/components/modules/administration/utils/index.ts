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

  return permissionIds;
};
