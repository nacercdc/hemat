"use client";

import MetricsContainer from "./components/MetricsContainer";
import MetricsCard, { MetricsCardSkeleton } from "./components/MetricsCard";
import { CountriesAccordion } from "./components/CountriesAccordion";
import { PageContainer } from "../components/PageContainer";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { OverallDomainMetricsSection } from "./components/OverallDomainMetricsSection";
import type { AssessmentMeasurementScale } from "~/libs/models/assessment-measurement-scale.model";
import { AfricaMap } from "./components/AfricaMap";

export default function Dashboard() {
  const { data: measurementScales, ...measurementScalesState } = useFindAll<{
    data: AssessmentMeasurementScale[];
  }>({
    path: "/dashboard/measurement-scales",
    queries: { sorts: { ascending: "rate" } },
  });

  const measurementScaleLoading =
    measurementScalesState.isLoading || measurementScalesState.isFetching;

  return (
    <PageContainer pageTitle="Dashboard" includeBreadcrumb={false}>
      <div className="flex flex-col gap-3 w-full mt-2">
        <MetricsContainer title="Measurement Scale">
          <div className="flex flex-col-reverse items-start sm:flex-row justify-between sm:items-center">
            <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8 py-6">
              {!measurementScaleLoading &&
                (
                  measurementScales?.data as unknown as AssessmentMeasurementScale[]
                )?.map((mScale, index) => (
                  <MetricsCard
                    key={index}
                    name={mScale.name}
                    rate={mScale.rate}
                    color={mScale.color}
                  />
                ))}
              {measurementScaleLoading &&
                Array.from({ length: 5 }, (_, i) => (
                  <MetricsCardSkeleton key={i} />
                ))}
            </div>
          </div>
        </MetricsContainer>
        <MetricsContainer title="Domains">
          <OverallDomainMetricsSection
            measurementScaleLoading={measurementScaleLoading}
            measurementScales={
              measurementScales?.data as unknown as AssessmentMeasurementScale[]
            }
          />
        </MetricsContainer>

        <div className="p-4 bg-layout-bg/15 rounded-md">
          <AfricaMap />
        </div>
        <CountriesAccordion />
      </div>
    </PageContainer>
  );
}
