"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { OverallSummaryCard } from "./OverallSummaryCard";

export function TotalComponents() {
  const { data: componentsCount, ...componentsCountState } = useFindById<{
    count: number;
  }>({
    path: "/dashboard/components/count",
    isProtected: false,
    tqOptions: { queryKey: ["total-components"] },
  });

  const isLoading =
    componentsCountState.isLoading || componentsCountState.isFetching;

  return (
    <OverallSummaryCard
      icon={<Icon icon="la:map" className="!w-6 !h-6" />}
      count={componentsCount?.count || 0}
      isLoading={isLoading}
      title="Components"
    />
  );
}
