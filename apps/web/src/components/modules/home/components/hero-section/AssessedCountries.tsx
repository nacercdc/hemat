"use client";

import React from "react";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { AnimatedCounter } from "./AnimatedCounter";
import { Skeleton } from "@etm/web-ui-components";

export function AssessedCountries() {
  const { data: assessedCountries, ...assessedCountriesCountState } =
    useFindById<{
      count: number;
    }>({ path: "/dashboard/completed-assessment/count", isProtected: false });

  const isLoading =
    assessedCountriesCountState.isFetching ||
    assessedCountriesCountState.isLoading;

  return (
    <div className="flex flex-col justify-center items-center h-full gap-2">
      {!isLoading && (
        <span className="text-5xl text-[#E8D8A6] font-bold">
          <AnimatedCounter
            from={0}
            to={assessedCountries?.count || 0}
            duration={4}
            delay={2}
          />
        </span>
      )}
      {isLoading && <Skeleton className="h-11 w-11 rounded-full" />}
      <span className="rounded-md text-xs text-center text-white bg-[#E8D8A6]/25 p-1">
        Countries
      </span>
      <span className="text-xs text-white text-wrap text-center">
        Assessment <br />
        Collected
      </span>
    </div>
  );
}
