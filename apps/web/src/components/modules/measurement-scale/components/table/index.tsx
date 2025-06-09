"use client";

import { Icon } from "@iconify/react";
import type { PaginationState, SortingState } from "@etm/web-ui-components";
import { Table as ETMTable } from "@etm/web-ui-components";
import { ScaleTableColumns } from "./ScaleTableColumns";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import type { Scale } from "~/libs/models/scale.model";

interface ScaleTableProps {
  scales: Scale[];
  isLoading: boolean;
  refetch: () => void;
  onSortingChange: (sortingState: SortingState) => void;
  onSearchFilterChange: (value: string) => void;
  onPaginationChange: (pagination: PaginationState) => void;
  openAddScaleModal: () => void;
}

export function ScaleTable({
  scales,
  isLoading,
  refetch,
  onSortingChange,
  onSearchFilterChange,
  onPaginationChange,
  openAddScaleModal,
}: ScaleTableProps) {
  const OnEmptyDataElement = (
    <EmptyTableDataElement
      icon={
        <Icon
          icon="material-symbols-light:scale-balance"
          className="w-16 h-16"
        />
      }
      title="No Scales Found"
      body="You can add a new scale by clicking the button below."
      actionText="Add Scale"
      action={openAddScaleModal}
    />
  );

  return (
    <div className="h-full bg-card pt-4 rounded-md">
      <ETMTable<Scale>
        collectionName="Scales"
        columns={ScaleTableColumns({ refetch })}
        data={scales}
        totalItems={10}
        isLoading={isLoading}
        onSortingChange={onSortingChange}
        onSearchFilterChange={onSearchFilterChange}
        onPaginationChange={onPaginationChange}
        pageSizeOptions={[10, 25, 50, 100]}
        enableRowSelection={false}
        onEmptyDataElement={OnEmptyDataElement}
      />
    </div>
  );
}
