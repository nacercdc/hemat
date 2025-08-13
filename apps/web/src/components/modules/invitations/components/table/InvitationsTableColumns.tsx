import React from "react";
import type { BadgeVariants } from "@etm/web-ui-components";
import { Badge } from "@etm/web-ui-components";
import type { ColumnDef } from "@etm/web-ui-components";

import type { Invitation, StatusType } from "~/libs/models/invitaion.model";
import InvitationAction from "./InvitationAction";

const StatusVariantClasses: Record<StatusType, BadgeVariants["variant"]> = {
  pending: "warning",
  accepted: "success",
  rejected: "destructive",
  expired: "destructive",
};

export const InvitationsTableColumns: ColumnDef<Invitation>[] = [
  {
    header: "Assessment name",
    id: "name",
    enableColumnFilter: false,
    enableSorting: true,
    accessorFn: (row: Invitation) => row.assessment?.name ?? "--",
  },
  {
    header: "Country",
    accessorKey: "country",
    enableColumnFilter: false,
    cell: ({ row }: { row: { original: Invitation } }) => (
      <span>{row.original.assessment?.countryCode ?? "--"}</span>
    ),
  },
  {
    header: "Invited as",
    accessorKey: "role",
    enableColumnFilter: false,
    cell: ({ row }: { row: { original: Invitation } }) => (
      <span>{row.original.role}</span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    enableColumnFilter: false,
    cell: ({ row }: { row: { original: Invitation } }) => {
      return (
        <Badge
          text={row.original.status}
          variant={StatusVariantClasses[row.original.status]}
          shape="circular"
        />
      );
    },
  },
  {
    header: "Date created",
    accessorKey: "created_at",
    enableColumnFilter: false,
    cell: ({ row }: { row: { original: Invitation } }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
    ),
  },
  {
    header: "Action",
    accessorKey: "",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }: { row: { original: Invitation } }) => (
      <InvitationAction invitation={row.original} />
    ),
  },
];
