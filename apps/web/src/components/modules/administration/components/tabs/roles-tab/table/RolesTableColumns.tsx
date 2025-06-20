import React from "react";
import type { ColumnDef } from "@etm/web-ui-components";
import RolesAction from "./RolesAction";
import type { Role } from "~/libs/models/role.model";
import type { PermissionModule } from "../form";

interface Props {
  refetch: () => void;
  modules: PermissionModule[];
  permissions?: Permission[];
}

export const RolesTableColumns = ({
  refetch,
  modules,
  permissions,
}: Props): ColumnDef<Role>[] => [
  {
    header: "Role Name",
    id: "name",
    enableSorting: true,
    accessorFn: (row) => row.name ?? "--",
  },

  {
    header: "Permissions",
    enableSorting: false,
    id: "permissions",
    accessorFn: (row) => row.permissions?.length.toString() ?? "--",
  },

  {
    header: "Date Created",
    enableSorting: true,
    id: "createdAt",
    accessorFn: (row) => new Date(row.createdAt).toLocaleString(),
  },

  {
    header: "Date Updated",
    enableSorting: true,
    id: "updatedAt",
    accessorFn: (row) => new Date(row.updatedAt).toLocaleString(),
  },

  {
    header: "Action",
    accessorKey: "",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <RolesAction
        role={row.original}
        onRefetch={refetch}
        modules={modules}
        permissions={permissions}
      />
    ),
  },
];
