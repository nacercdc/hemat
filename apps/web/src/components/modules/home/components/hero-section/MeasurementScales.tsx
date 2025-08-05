"use client";

import React from "react";
import { Skeleton, Tooltip } from "@etm/web-ui-components";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { AssessmentMeasurementScale } from "~/libs/models/assessment-measurement-scale.model";

export function MeasurementScales() {
  const { data: measurementScales, ...measurementScalesState } = useFindAll<{
    data: AssessmentMeasurementScale[];
  }>({
    path: "/dashboard/measurement-scales",
    isProtected: false,
    queries: { sorts: { ascending: "rate" } },
  });

  const isLoading =
    measurementScalesState.isLoading || measurementScalesState.isFetching;

  if (isLoading) {
    return <MeasurementScalesLoading />;
  }

  return (
    <div className="flex gap-4">
      {(
        measurementScales?.data as unknown as AssessmentMeasurementScale[]
      )?.map((measurementScale) => (
        <Tooltip
          key={measurementScale.id}
          content={
            <div className="flex flex-col gap-1">
              <span className="font-bold">{measurementScale.name}:</span>
              <span className="text-xs text-wrap">
                {measurementScale.description}
              </span>
            </div>
          }
          color="dark"
          trigger={
            <div
              className="text-white w-8 h-6 rounded-sm font-semibold text-center cursor-context-menu"
              style={{ backgroundColor: `${measurementScale.color}` }}
            >
              {measurementScale.rate}
            </div>
          }
        />
      ))}
    </div>
  );
}

function MeasurementScalesLoading() {
  return (
    <div className="flex gap-4">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-7 w-9 rounded-sm" />
      ))}
    </div>
  );
}
