import React from "react";
import { Badge } from "@etm/web-ui-components";
import AssessmentAction from "./AssessmentsAction";

import type { BadgeVariants, ColumnDef } from "@etm/web-ui-components";
import type { Assessment, StatusType } from "~/libs/models/assessment.model";

const StatusVariantClasses: Record<StatusType, BadgeVariants["variant"]> = {
  Draft: "dark",
  Pending: "warning",
  Closed: "destructive",
  Ready: "info",
  "In-Progress": "progress",
  Completed: "success",
};

export const AssessmentsTableColumns: ColumnDef<Assessment>[] = [
  {
    header: "Name",
    accessorKey: "name",
    enableColumnFilter: true,
    cell: ({ row }) => {
      return <span>{row.original.name}</span>;
    },
  },

  {
    header: "Start Date",
    accessorKey: "startDate",
    enableColumnFilter: false,
    cell: ({ row }) => (
      <span>
        {row.original.startDate
          ? new Date(row.original.startDate).toLocaleDateString()
          : "--"}
      </span>
    ),
  },

  {
    header: "End Date",
    accessorKey: "endDate",
    enableColumnFilter: false,
    cell: ({ row }) => (
      <span>
        {row.original.endDate
          ? new Date(row.original.endDate).toLocaleDateString()
          : "--"}
      </span>
    ),
  },

  {
    header: "Country",
    accessorKey: "country",
    enableColumnFilter: false,
    cell: ({ row }) => <span>{row.original.countryCode}</span>,
  },

  {
    header: "Status",
    accessorKey: "status",
    enableColumnFilter: false,
    cell: ({ row }) => {
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
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
    ),
  },
  {
    header: "Action",
    accessorKey: "",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => <AssessmentAction assessment={row.original} />,
  },
];
