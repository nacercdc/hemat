import React from "react";
import type { BadgeVariants } from "@etm/web-ui-components";
import { Badge } from "@etm/web-ui-components";
import type { ColumnDef } from "@etm/web-ui-components";

import type { RoadmapList } from "~/libs/models/roadmap.model";
import type { StatusType } from "~/libs/models/assessment.model";
import RoadmapAction from "./RoadmapAction";

const StatusVariantClasses: Record<StatusType, BadgeVariants["variant"]> = {
  Draft: "dark",
  Pending: "warning",
  Closed: "destructive",
  Ready: "info",
  "In-Progress": "progress",
  Completed: "success",
};

export const RoadmapsTableColumns: ColumnDef<RoadmapList>[] = [
  {
    header: "Assessment name",
    id: "name",
    enableColumnFilter: false,
    enableSorting: true,
    accessorFn: (row: RoadmapList) => row.assessment?.name ?? "--",
  },
  {
    header: "Created by",
    accessorKey: "user.name",
    enableColumnFilter: true,
    cell: ({ row }: { row: { original: RoadmapList } }) => {
      return <span>{row.original.user.name}</span>;
    },
  },
  {
    header: "Percentage",
    enableColumnFilter: false,
    enableSorting: true,
    id: "rate",
    accessorFn: (row: RoadmapList) => row.percentage ?? "--",
  },
  {
    header: "Country",
    accessorKey: "country",
    enableColumnFilter: false,
    cell: ({ row }: { row: { original: RoadmapList } }) => (
      <span>{row.original.assessment.countryCode}</span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    enableColumnFilter: false,
    cell: ({ row }: { row: { original: RoadmapList } }) => {
      return (
        <Badge
          text={row.original.status}
          variant={StatusVariantClasses[row.original.status as StatusType]}
          shape="circular"
        />
      );
    },
  },
  {
    header: "Date created",
    accessorKey: "created_at",
    enableColumnFilter: false,
    cell: ({ row }: { row: { original: RoadmapList } }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
    ),
  },
  {
    header: "Action",
    accessorKey: "",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }: { row: { original: RoadmapList } }) => (
      <RoadmapAction roadmap={row.original} />
    ),
  },
];
