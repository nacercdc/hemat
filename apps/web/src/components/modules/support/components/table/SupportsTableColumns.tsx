import React from "react";
import { Badge } from "@etm/web-ui-components";
import SupportAction from "./SupportsAction";

import type { BadgeVariants, ColumnDef } from "@etm/web-ui-components";
import type { Support, SupportStatus } from "~/libs/models/support.model";

const StatusVariantClasses: Record<SupportStatus, BadgeVariants["variant"]> = {
  open: "success",
  closed: "destructive",
  processing: "info",
};

export const SupportsTableColumns = (): ColumnDef<Support>[] => [
  {
    header: "Title",
    accessorKey: "title",
    enableSorting: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      return <span>{row.original.title}</span>;
    },
  },

  {
    header: "Issued By",
    accessorKey: "issuedBy",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      return <span>{`${row.original.issuedBy?.name ?? "--"}`}</span>;
    },
  },

  {
    header: "Created Date",
    accessorKey: "createdAt",
    enableColumnFilter: false,
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt ?? "").toLocaleDateString()}</span>
    ),
  },

  {
    header: "Status",
    accessorKey: "status",
    enableColumnFilter: false,
    enableSorting: false,
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
    cell: ({ row }) => <SupportAction support={row.original} />,
  },
];
