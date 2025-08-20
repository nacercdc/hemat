"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { OverallSummaryCard } from "./OverallSummaryCard";

export function TotalSubComponents() {
  const { data: subComponentsCount, ...subComponentsCountState } = useFindById<{
    count: number;
  }>({
    path: "/dashboard/subcomponents/count",
    isProtected: false,
    tqOptions: { queryKey: ["total-domains"] },
  });

  const isLoading =
    subComponentsCountState.isLoading || subComponentsCountState.isFetching;

  return (
    <OverallSummaryCard
      icon={<Icon icon="tdesign:component-steps" className="!w-6 !h-6" />}
      count={subComponentsCount?.count || 0}
      isLoading={isLoading}
      title="Sub-Components"
    />
  );
}
