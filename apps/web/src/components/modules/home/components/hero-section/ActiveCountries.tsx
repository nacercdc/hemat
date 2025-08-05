"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { OverallSummaryCard } from "./OverallSummaryCard";

export function ActiveCountries() {
  const { data: countriesCount, ...countriesCountState } = useFindById<{
    count: number;
  }>({
    path: "/dashboard/countries/count",
    isProtected: false,
    tqOptions: { queryKey: ["active-countries"] },
  });

  const isLoading =
    countriesCountState.isLoading || countriesCountState.isFetching;

  return (
    <OverallSummaryCard
      icon={<Icon icon="la:map" className="!w-6 !h-6" />}
      count={countriesCount?.count || 0}
      isLoading={isLoading}
      title="Active Countries"
    />
  );
}
