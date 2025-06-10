"use client";

import { Icon } from "@iconify/react";
import type { PaginationState, SortingState } from "@etm/web-ui-components";
import { Table as ETMTable } from "@etm/web-ui-components";
import { LanguageTableColumns } from "./LanguageTableColumns";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import type { Language } from "~/libs/models/language.model";

interface Props {
  languages: Language[];
  isLoading: boolean;
  refetch: () => void;
  onSortingChange: (sortingState: SortingState) => void;
  onSearchFilterChange: (value: string) => void;
  onPaginationChange: (pagination: PaginationState) => void;
  openAddLanguageModal: () => void;
}

export function LanguageTable({
  languages,
  isLoading,
  refetch,
  onSortingChange,
  onSearchFilterChange,
  onPaginationChange,
  openAddLanguageModal,
}: Props) {
  const OnEmptyDataElement = (
    <EmptyTableDataElement
      icon={
        <Icon
          icon="material-symbols-light:scale-balance"
          className="w-16 h-16"
        />
      }
      title="No Language Found"
      body="You can add a new language by clicking the button below."
      actionText="Add Language"
      action={openAddLanguageModal}
    />
  );

  return (
    <div className="h-full bg-card pt-4 rounded-md">
      <ETMTable<Language>
        collectionName="Language"
        columns={LanguageTableColumns({ refetch })}
        data={languages}
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
