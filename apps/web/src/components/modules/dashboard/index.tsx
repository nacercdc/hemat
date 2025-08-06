"use client";

import MetricsContainer from "./components/MetricsContainer";
import MetricsCard, { MetricsCardSkeleton } from "./components/MetricsCard";
import { CountriesAccordion } from "./components/CountriesAccordion";
import { PageContainer } from "../components/PageContainer";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { OverallDomainMetricsSection } from "./components/OverallDomainMetricsSection";
import { AfricaMap } from "../home/components/assessment-detail-section/Map";
import type { AssessmentMeasurementScale } from "~/libs/models/assessment-measurement-scale.model";
import type { Scale } from "~/libs/models/scale.model";

export default function Dashboard() {
  const { data: measurementScales, ...measurementScalesState } = useFindAll<{
    data: AssessmentMeasurementScale[];
  }>({
    path: "/dashboard/measurement-scales",
    queries: { sorts: { ascending: "rate" } },
  });

  // TODO: Replace with real API call
  const fetchedData: Record<string, Pick<Scale, "name" | "rate" | "color">> = {
    Ethiopia: { name: "Developing", rate: 4, color: "#FFA50080" },
    Kenya: { name: "Defined", rate: 3, color: "#FFFF0080" },
    Chad: { name: "Initial", rate: 4, color: "#ff00b780" },
    Sudan: { name: "Managed", rate: 2, color: "#000FF990" },
    "South Africa": { name: "Optimized", rate: 5, color: "#00FF0080" },
  };

  const onCountryClickHandler = (_countryName: string) => {
    // TODO: handle country click event
  };

  const onDomainSelectHandler = (_value?: unknown) => {
    // TODO: handle domain select event
  };

  const onCountrySelectHandler = (_value?: unknown) => {
    // TODO: handle country select event
  };

  const countryOptions = Object.keys(fetchedData).map((country) => ({
    name: country,
  }));

  const measurementScaleLoading =
    measurementScalesState.isLoading || measurementScalesState.isFetching;

  return (
    <PageContainer pageTitle="Dashboard" includeBreadcrumb={false}>
      <div className="flex flex-col gap-3 w-full">
        <MetricsContainer title="Measurement Metrics">
          <div className="flex flex-col-reverse items-start sm:flex-row justify-between sm:items-center">
            <div className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8 py-6">
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
        <MetricsContainer title="Overall Domains Metrics">
          <OverallDomainMetricsSection
            measurementScaleLoading={measurementScaleLoading}
            measurementScales={
              measurementScales?.data as unknown as AssessmentMeasurementScale[]
            }
          />
        </MetricsContainer>

        {/* <FilterSection
          countryOptions={countryOptions}
          onDomainSelect={onDomainSelectHandler}
          onCountrySelect={onCountrySelectHandler}
        /> */}

        <div className="p-4 bg-layout-bg/15 rounded-md">
          <AfricaMap />
        </div>
        <div className="mt-4 bg-layout-bg/15 p-4 rounded-md h-14">
          <CountriesAccordion countryStatuses={fetchedData} />
        </div>
      </div>
    </PageContainer>
  );
}
