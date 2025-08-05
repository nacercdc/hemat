"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { OverallSummaryCard } from "./OverallSummaryCard";

export function TotalDomains() {
  const { data: domainsCount, ...domainsCountState } = useFindById<{
    count: number;
  }>({
    path: "/dashboard/domains/count",
    isProtected: false,
    tqOptions: { queryKey: ["total-domains"] },
  });

  const isLoading = domainsCountState.isLoading || domainsCountState.isFetching;

  return (
    <OverallSummaryCard
      icon={
        <Icon icon="material-symbols:domain-rounded" className="!w-6 !h-6" />
      }
      count={domainsCount?.count || 0}
      isLoading={isLoading}
      title="Domain"
    />
  );
}
