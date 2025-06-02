import React from "react";
import type { ColumnDef } from "@etm/web-ui-components";
import ScaleAction from "./ScaleAction";
import type { Scale } from "~/libs/models/scale.model";
// import type {
//   QueryObserverResult,
//   RefetchOptions,
// } from "@tanstack/react-query";
// import type { UseSearchResponse } from "~/libs/tanstack-api-query/hooks/useSearch";



interface Props {
  // refetch: (
  //   options?: RefetchOptions
  // ) => Promise<QueryObserverResult<UseSearchResponse<Account>, Error>>;
  refetch: () => void;
}

export const ScaleTableColumns = ({ refetch }: Props): ColumnDef<Scale>[] => [
  {
    header: "Name",
    id: "name",
    enableColumnFilter: false,
    enableSorting: true,
    accessorFn: (row) => row.name ?? "--",
  },

  {
    header: " Rate",
    enableColumnFilter: false,
    enableSorting: true,
    id: "rate",
    accessorFn: (row) => row.rate ?? "--",
  },

  {
    header: "Color",
    enableSorting: false,
    accessorFn: (row) => row.color ?? "--",
    cell: ({ row }) => (
      <div
        className="w-12 h-6 rounded-md"
        style={{ backgroundColor: row.original.color }}
      ></div>
    ),
  },
  {
    header: "Action",
    accessorKey: "",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => <ScaleAction scale={row.original} onRefetch={refetch} />,
  },
];
