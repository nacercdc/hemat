"use client";

import { Skeleton } from "@etm/web-ui-components";
import React from "react";
import type { Assessment } from "~/libs/models/assessment.model";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";

interface Props {
  assessmentId: string;
}
export function PageTitle({ assessmentId }: Props) {
  const { data: assessment, ...assessmentState } = useFindById<
    QueryManyResponse<Assessment>
  >({
    path: `/assessments/${assessmentId}`,
  });

  if (assessmentState.isLoading || assessmentState.isFetching) {
    return <Skeleton className="w-80 h-7 rounded-sm" />;
  }
  return (
    <div>{`${(assessment as unknown as Assessment).name} / Assessment Fill`}</div>
  );
}
