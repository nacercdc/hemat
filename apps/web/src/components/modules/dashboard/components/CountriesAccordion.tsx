"use client";

import React, { useMemo } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { isLightColor } from "../utils/luminacity.util";
import { Accordion, Tooltip } from "@etm/web-ui-components";
import { cn } from "~/utils/cn.util";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { Country } from "./AfricaMap";
import type { AssessmentMeasurementScale } from "~/libs/models/assessment-measurement-scale.model";
import africanCountries from "./AfricaMap/africa-country-names.json";

export const CountriesAccordion = () => {
  const { data: countryStatuses, isLoading: isCountryStatusesLoading } =
    useFindAll<Country[]>({
      path: `/dashboard/domains/average-rate/country`,
      isProtected: false,
    });

  const { data: measurementScales, isLoading: isMeasurementScalesLoading } =
    useFindAll<{
      data: AssessmentMeasurementScale[];
    }>({
      path: "/dashboard/measurement-scales",
      queries: { sorts: { ascending: "rate" } },
    });

  const fetchedAssessmentData = useMemo(() => {
    const statusLookup = new Map(
      (countryStatuses as unknown as Country[])?.map((item) => [
        item.countryCode,
        item.averageRate,
      ])
    );

    const result: Record<
      string,
      { averageRate: number; color: string; scaleName: string }
    > = {};
    Object.entries(africanCountries).forEach(([code, name]) => {
      const averageRate = statusLookup.get(code) || 0;
      const scale = (
        measurementScales?.data as unknown as AssessmentMeasurementScale[]
      )?.find((s) => averageRate === s.rate);
      result[name] = {
        averageRate,
        color: scale ? scale.color : "#DDD",
        scaleName: scale ? scale.name : "No data",
      };
    });

    return result;
  }, [countryStatuses, measurementScales]);

  // Group countries by averageRate
  const groupedByRate = useMemo(() => {
    const groups: Record<
      string,
      {
        country: string;
        status: { averageRate: number; color: string; scaleName: string };
      }[]
    > = {};
    Object.entries(fetchedAssessmentData).forEach(([country, status]) => {
      const rateKey = status.averageRate.toString();
      if (!groups[rateKey]) {
        groups[rateKey] = [];
      }
      groups[rateKey].push({ country, status });
    });
    return groups;
  }, [fetchedAssessmentData]);

  // Skeleton loader for a single accordion group
  const SkeletonLoader = () => (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-1 gap-4 border-b border-basic-200 animate-pulse"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded-sm bg-gray-200" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="flex w-full border border-dashed border-gray-200" />
          <div className="w-9 h-6 rounded-sm bg-gray-200" />
        </div>
      ))}
    </div>
  );

  // Create nested accordion items for each averageRate group
  const nestedAccordionItems = Object.entries(groupedByRate).map(
    ([rate, countries], index) => {
      const scale = (
        measurementScales?.data as unknown as AssessmentMeasurementScale[]
      )?.find((s) => s.rate.toString() === rate);
      const scaleName = scale ? scale.name : "No data";
      const scaleColor = scale ? scale.color : "#eeeeee";

      return {
        value: `rate-${rate}-${index}`,
        trigger: (
          <div
            className="flex items-center gap-2 px-3 rounded-md"
            style={{ backgroundColor: scaleColor }}
          >
            <Icon
              icon="solar:map-linear"
              className={cn(
                isLightColor(scaleColor) ? "text-dark" : "text-card"
              )}
            />
            <span
              className={cn(
                "text-sm font-bold flex gap-2 items-center py-1",
                isLightColor(scaleColor) ? "text-dark" : "text-card"
              )}
            >
              {scaleName}
              <Tooltip
                content={
                  scale?.description ?? "No data available for these countries."
                }
                trigger={
                  <Icon
                    icon="material-symbols:info-outline-rounded"
                    className="w-4 h-4"
                  />
                }
              />
            </span>
          </div>
        ),
        content: (
          <div className="space-y-2 border">
            {isCountryStatusesLoading || isMeasurementScalesLoading ? (
              <SkeletonLoader />
            ) : (
              <div className="flex max-h-64 flex-wrap gap-2 overflow-y-scroll items-start py-1 border-b border-basic-200 px-4 m-3">
                {countries.map(({ country }) => (
                  <div
                    key={country}
                    className={cn(
                      "font-bold px-2 py-1 w-auto rounded-full text-xs",
                      scale
                        ? isLightColor(scaleColor)
                          ? "text-dark"
                          : "text-card"
                        : "text-dark"
                    )}
                    style={{ backgroundColor: scaleColor }}
                  >
                    {country}
                  </div>
                ))}
              </div>
            )}
          </div>
        ),
      };
    }
  );

  // Parent accordion with nested accordions
  const parentAccordionItems = [
    {
      value: "countries",
      trigger: (
        <div className="flex items-center gap-2 px-3 rounded-md">
          <Icon icon="solar:map-linear" className="text-dark" />
          <span className="text-sm font-bold text-dark">Countries</span>
        </div>
      ),
      content: (
        <div className="flex flex-col gap-3 p-3 border">
          {nestedAccordionItems.map((item) => (
            <div key={item.value} className="mb-1">
              <Accordion items={[item]} type="single" collapsible={true} />
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3 mt-4 bg-layout-bg/15 p-4 rounded-md">
      <Accordion
        items={parentAccordionItems}
        type="single"
        collapsible={true}
      />
    </div>
  );
};
