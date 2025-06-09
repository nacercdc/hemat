import React from "react";
import type { ColumnDef } from "@etm/web-ui-components";
import LanguageAction from "./LanguageAction";
import type { Language } from "~/libs/models/language.model";

interface Props {
  refetch: () => void;
}

export const LanguageTableColumns = ({
  refetch,
}: Props): ColumnDef<Language>[] => [
  {
    header: "Name",
    id: "name",
    enableColumnFilter: false,
    enableSorting: true,
    accessorFn: (row) => row.name ?? "--",
  },
  {
    header: "Code",
    id: "code",
    enableColumnFilter: true,
    enableSorting: true,
    accessorFn: (row) => row.code ?? "--",
  },
  {
    header: "Native",
    id: "native",
    enableColumnFilter: false,
    enableSorting: true,
    accessorFn: (row) => row.native ?? "--",
  },
  {
    header: "Action",
    accessorKey: "",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      return <LanguageAction language={row.original} onRefetch={refetch} />;
    },
  },
];
