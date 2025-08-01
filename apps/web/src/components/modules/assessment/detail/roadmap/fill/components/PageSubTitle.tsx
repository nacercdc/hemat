"use client";

import React from "react";
import { Skeleton } from "@etm/web-ui-components";
import type { Domain } from "~/libs/models/domain.model";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";

interface Props {
  assessmentId: string;
  domainId: string;
}
export function PageSubTitle({ assessmentId, domainId }: Props) {
  const { data: domain, ...domainState } = useFindById<
    QueryManyResponse<Domain>
  >({
    path: `/assessments/${assessmentId}/domains/${domainId}`,
  });

  if (domainState.isLoading || domainState.isFetching) {
    return <Skeleton className="max-w-80 w-full h-7 rounded-sm" />;
  }
  return (
    <span className="text-xl font-bold">{`${(domain as unknown as Domain).name} / Components`}</span>
  );
}
