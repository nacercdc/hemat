"use client";

import { Icon } from "@iconify/react";
import type { PaginationState, SortingState } from "@etm/web-ui-components";
import { Button, useToast } from "@etm/web-ui-components";
import { AssessmentsTable } from "./components/table";
import { PageContainer } from "../components/PageContainer";
import { useState, useCallback } from "react";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";
import {
  Assessment,
  AssessmentFilterable,
  AssessmentSortable,
} from "~/libs/models/assessment.model";
import { useRouter } from "next/navigation";

export function Assessments() {
  const router = useRouter();
  const toaster = useToast();
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

  const { data: assessments, ...assessmentsState } = useFindAll<
    QueryManyResponse<Assessment>,
    unknown,
    AssessmentSortable,
    AssessmentFilterable
  >({
    path: "/assessments",
    queries: {
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      search,
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

  const onSearchFilterChangeHandler = useCallback((value: string) => {
    setSearch(value);
    setPagination({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  }, []);

  return (
    <PageContainer
      pageTitle="Assessments"
      includeBreadcrumb={false}
      actionNodes={
        <Button
          leftNode={
            <Icon icon={"material-symbols:add"} className="!w-5 !h-5" />
          }
          size="lg"
          onClick={() => {
            router.push("/assessment/create");
          }}
        >
          Create
        </Button>
      }
    >
      <AssessmentsTable
        assessments={(assessments?.data as unknown as Assessment[]) ?? []}
        isLoading={assessmentsState.isFetching}
        refetch={assessmentsState.refetch}
        onSortingChange={onSortingChangeHandler}
        onSearchFilterChange={onSearchFilterChangeHandler}
        onPaginationChange={setPagination}
      />
    </PageContainer>
  );
}
