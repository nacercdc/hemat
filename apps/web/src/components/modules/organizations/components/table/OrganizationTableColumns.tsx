import React from "react";
import type { ColumnDef } from "@etm/web-ui-components";
import type { Organization } from "./OrganizationAction";
import OrganizationAction from "./OrganizationAction";

interface Props {
  refetch?: () => void;
}
export const OrganizationTableColumns = ({
  refetch: _,
}: Props): ColumnDef<Organization>[] => [
  {
    header: "Organization name",
    id: "organizationName",
    enableSorting: true,
    accessorFn: (row) => row.name ?? "--",
  },

  {
    header: "Address",
    enableSorting: true,
    id: "address",
    accessorFn: (row) => row.address ?? "--",
  },

  {
    header: "Phone No.",
    enableSorting: true,
    id: "phoneNumber",
    accessorFn: (row) => row.phoneNumber ?? "--",
  },

  {
    header: "Email address",
    enableSorting: true,
    id: "email",
    accessorFn: (row) => row.email ?? "--",
  },

  {
    header: "Action",
    accessorKey: "",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => <OrganizationAction organization={row.original} />,
  },
];
