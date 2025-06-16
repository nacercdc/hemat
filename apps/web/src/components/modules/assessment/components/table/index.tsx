"use client";

import { Icon } from "@iconify/react";
import type { PaginationState, SortingState } from "@etm/web-ui-components";
import { Table as ETMTable } from "@etm/web-ui-components";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import { Assessment } from "~/libs/models/assessment.model";
import { AssessmentsTableColumns } from "./AssessmentsTableColumns";

interface Props {
  assessments: Assessment[];
  isLoading: boolean;
  refetch: () => void;
  onSortingChange: (sortingState: SortingState) => void;
  onSearchFilterChange: (value: string) => void;
  onPaginationChange: (pagination: PaginationState) => void;
}

export function AssessmentsTable({
  assessments,
  isLoading,
  refetch,
  onSortingChange,
  onSearchFilterChange,
  onPaginationChange,
}: Props) {
  const OnEmptyDataElement = (
    <EmptyTableDataElement
      icon={
        <Icon
          icon="material-symbols-light:scale-balance"
          className="w-16 h-16"
        />
      }
      title="No Assessment Found"
      body="You can add a new assessment by clicking the button below."
      actionText="Add Assessment"
    />
  );

  return (
    <div className="h-full bg-card pt-4 rounded-md">
      <ETMTable<Assessment>
        columns={AssessmentsTableColumns({ refetch })}
        data={assessments}
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
