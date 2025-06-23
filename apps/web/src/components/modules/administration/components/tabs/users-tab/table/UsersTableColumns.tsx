import React from "react";
import { Badge } from "@etm/web-ui-components";
import UserAction from "./UsersAction";

import type { BadgeVariants, ColumnDef } from "@etm/web-ui-components";
import type { User, UserStatus } from "~/libs/models/user.model";
import type { PermissionModule } from "../form";
import type { Permission } from "~/libs/models/permission.model";

const StatusVariantClasses: Record<UserStatus, BadgeVariants["variant"]> = {
  active: "success",
  inactive: "destructive",
};

interface Props {
  refetch: () => void;
  modules: PermissionModule[];
  permissions?: Permission[];
}
export const UsersTableColumns = ({
  refetch,
  modules,
  permissions,
}: Props): ColumnDef<User>[] => [
  {
    header: "Name",
    accessorKey: "name",
    enableColumnFilter: true,
    cell: ({ row }) => {
      return <span>{row.original.name}</span>;
    },
  },

  {
    header: "Email",
    accessorKey: "email",
    enableColumnFilter: false,
    cell: ({ row }) => {
      return <span>{row.original.email}</span>;
    },
  },

  {
    header: "Date created",
    accessorKey: "created_at",
    enableColumnFilter: false,
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt ?? "").toLocaleDateString()}</span>
    ),
  },

  {
    header: "Role",
    accessorKey: "roles",
    enableColumnFilter: false,
    cell: ({
      row: {
        original: { roles },
      },
    }) => <span>{roles?.map((role) => role.name).join(", ")}</span>,
  },

  {
    header: "Status",
    accessorKey: "status",
    enableColumnFilter: false,
    cell: ({
      row: {
        original: { status },
      },
    }) => {
      return (
        <Badge
          text={status as string}
          variant={StatusVariantClasses[status]}
          shape="circular"
        />
      );
    },
  },

  {
    header: "Action",
    accessorKey: "",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <UserAction
        user={row.original}
        refetch={refetch}
        modules={modules}
        permissions={permissions}
      />
    ),
  },
];
