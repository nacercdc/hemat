"use client";

import React, { useEffect, useState } from "react";
import { Progress } from "@etm/web-ui-components";
import { cn } from "~/utils/cn.util";
import { useSelectedDomain } from "../../context/selected-domain/useSelectedDomain";
import type { IDomainCardType } from "./DomainCardList";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { AssessmentMeasurementScale } from "~/libs/models/assessment-measurement-scale.model";

interface Props {
  domain: IDomainCardType;
}

export function DomainCard({ domain }: Props) {
  const selectedDomainCtx = useSelectedDomain();

  const [activeMeasurementScale, setActiveMeasurementScale] =
    useState<AssessmentMeasurementScale>();

  const { data: measurementScales } = useFindAll<{
    data: AssessmentMeasurementScale[];
  }>({
    path: `/dashboard/measurement-scales`,
    isProtected: false,
    queries: { sorts: { ascending: "rate" } },
  });

  useEffect(() => {
    const mScales =
      measurementScales?.data as unknown as AssessmentMeasurementScale[];

    if (mScales?.length) {
      setActiveMeasurementScale(
        mScales.find((mScale) => mScale.rate === domain.averageRate)
      );
    }
  }, [domain.averageRate, measurementScales?.data]);

  return (
    <div
      onClick={() => {
        if (selectedDomainCtx?.selectedDomain?.name === name) {
          selectedDomainCtx?.setSelectedDomain(undefined);
          return;
        }
        selectedDomainCtx?.setSelectedDomain(domain);
      }}
      className={cn(
        "flex gap-2 rounded-md bg-white min-w-72 max-w-min h-28 p-4 cursor-pointer",
        domain.type === "summary" && "border-t-2",
        domain.type === "single" && "border-l-2"
      )}
      style={{
        borderColor: `${activeMeasurementScale?.color}`,
        backgroundColor: `${selectedDomainCtx?.selectedDomain?.name === domain.name ? `${activeMeasurementScale?.color}30` : "#fff"}`,
      }}
    >
      {/* {domain.type !== "summary" && icon} */}
      <div className="flex flex-col justify-between gap-2 w-full">
        <span
          className={cn(
            "text-xs font-medium",
            domain.type === "summary" && "font-bold text-2xl"
          )}
        >
          {domain.name}
        </span>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs">{activeMeasurementScale?.name}</span>
            <div
              className={cn(
                "flex items-center justify-center rounded-sm text-white w-5 h-5 text-xs font-medium",
                domain.averageRate === 3 && "text-black"
              )}
              style={{
                backgroundColor: `${activeMeasurementScale?.color}`,
              }}
            >
              {domain.averageRate ? domain.averageRate : "?"}
            </div>
          </div>
          <Progress
            color={`${activeMeasurementScale?.color}`}
            value={domain.averageRate * 20}
          />
        </div>
      </div>
    </div>
  );
}
