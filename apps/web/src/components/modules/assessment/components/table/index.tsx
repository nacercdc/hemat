"use client";

import { Icon } from "@iconify/react";
import type { PaginationState, SortingState } from "@etm/web-ui-components";
import { Table as ETMTable } from "@etm/web-ui-components";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import type {
  Assessment,
  AssessmentFilterable,
  AssessmentSortable,
} from "~/libs/models/assessment.model";
import { AssessmentsTableColumns } from "./AssessmentsTableColumns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
export const ASSESSMENT_LIST_KEY = "assessment-list";
export function AssessmentsTable() {
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

  const router = useRouter();

  const { data: assessments, ...assessmentsState } = useFindAll<
    Assessment,
    unknown,
    AssessmentFilterable,
    AssessmentSortable
  >({
    path: "/assessments",
    queries: {
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      search,
    },
    tqOptions: {
      queryKey: [ASSESSMENT_LIST_KEY],
    },
  });

  const onSortingChangeHandler = (sortingState: SortingState) => {
    setSort(
      sortingState.map((v) => ({
        direction: v.desc ? "desc" : "asc",
        field: v.id as keyof Assessment,
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
      title="No Assessment Found"
      body="You can add a new assessment by clicking the button below."
      actionText="Add Assessment"
      action={() => {
        router.push("/assessment/create");
      }}
    />
  );

  return (
    <div className="h-full bg-card pt-4 rounded-md">
      <ETMTable<Assessment>
        columns={AssessmentsTableColumns}
        data={assessments?.data}
        totalItems={assessments?.total ?? DEFAULT_PAGE_SIZE}
        isLoading={assessmentsState.isLoading}
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
