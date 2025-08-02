"use client";

import { Icon } from "@iconify/react";
import type { PaginationState, SortingState } from "@etm/web-ui-components";
import { Table as ETMTable } from "@etm/web-ui-components";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";

import { useState } from "react";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type {
  RoadmapList,
  RoadmapListFilterable,
  RoadmapListIncludable,
  RoadmapListSortable,
} from "~/libs/models/roadmap.model";
import { RoadmapsTableColumns } from "./RoadmapsTableColumns";
export const ROADMAP_LIST_KEY = "all-roadmap-list";

export function RoadmapsTable() {
  const [search, setSearch] = useState("");
  const [_sort, setSort] = useState<
    {
      direction: string;
      field: string | number | symbol;
    }[]
  >([
    {
      direction: "desc",
      field: "created_at",
    },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { data: roadmaps, ...roadmapsState } = useFindAll<
    RoadmapList,
    RoadmapListIncludable,
    RoadmapListFilterable,
    RoadmapListSortable
  >({
    path: "/assessments/roadmaps/info",
    queries: {
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      search,
    },
    tqOptions: {
      queryKey: [ROADMAP_LIST_KEY],
    },
  });

  const onSortingChangeHandler = (sortingState: SortingState) => {
    setSort(
      sortingState.map((v) => ({
        direction: v.desc ? "desc" : "asc",
        field: v.id as keyof RoadmapList,
      }))
    );
    setPagination({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  };
  const onSearchFilterChangeHandler = (value: string) => {
    setSearch(value);
    setPagination({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  };

  const OnEmptyDataElement = (
    <EmptyTableDataElement
      icon={
        <Icon
          icon="material-symbols-light:scale-balance"
          className="w-16 h-16"
        />
      }
      title="No roadmap Found"
      body="No roadmaps to show."
    />
  );

  return (
    <div className="h-full bg-card pt-4 rounded-md">
      <ETMTable<RoadmapList>
        columns={RoadmapsTableColumns}
        data={roadmaps?.data}
        totalItems={roadmaps?.total ?? DEFAULT_PAGE_SIZE}
        isLoading={roadmapsState.isLoading}
        onSortingChange={onSortingChangeHandler}
        onSearchFilterChange={onSearchFilterChangeHandler}
        onPaginationChange={setPagination}
        pageSizeOptions={[10, 25, 50, 100]}
        enableRowSelection={false}
        onEmptyDataElement={OnEmptyDataElement}
      />
    </div>
  );
}
