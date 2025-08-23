"use client";

import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { AssessmentMeasurementScale } from "~/libs/models/assessment-measurement-scale.model";
import { PageContainer } from "../../components/PageContainer";
import MetricsContainer from "../components/MetricsContainer";
import MetricsCard, { MetricsCardSkeleton } from "../components/MetricsCard";
import { useParams, useRouter } from "next/navigation";
import africanCountries from "../components/AfricaMap/africa.geo.json";
import { useMemo, useState } from "react";
import DomainMetricsCard, {
  DomainMetricsCardSkeleton,
} from "../components/DomainMetricsCard";
import { cn } from "~/utils/cn.util";
import { isLightColor } from "../utils/luminacity.util";
import type { Domain } from "../components/DomainsAccordion";
import { DomainsAccordion } from "../components/DomainsAccordion";
import { Select } from "@etm/web-ui-components";
import { RadarChartComponent } from "../components/RadarChartComponent";
import { yearOptions } from "../constants";

export interface YearOption {
  label: number;
  value: number;
}

export interface CountryDomainRatesWithBenchmark {
  id: string;
  name: string;
  averagePrimaryRate: number;
  averageRoadmapRate: number;
  africaAveragePrimaryRate: number;
  africaAverageRoadmapRate: number;
}

export default function CountryDashboard() {
  const [selectedFilterYear, setSelectedFilterYear] = useState<
    YearOption | undefined
  >();
  const router = useRouter();
  const params = useParams();
  const countryCode = params.code as string;

  const { data: measurementScales, ...measurementScalesState } =
    useFindAll<AssessmentMeasurementScale>({
      path: "/dashboard/measurement-scales",
      queries: {
        sorts: { ascending: "rate" },
      },
    });

  const measurementScaleLoading =
    measurementScalesState.isLoading || measurementScalesState.isFetching;

  const { data: countryDomainsRate, ...countryDomainsRateState } =
    useFindAll<Domain>({
      path: `/dashboard/domains/average-rate/country/${countryCode}`,
      queries: {
        filters: { year: `${selectedFilterYear?.value}` },
      },
      tqOptions: {
        queryKey: ["country-domains-rate", selectedFilterYear],
      },
    });

  const {
    data: countryDomainsRateWithBenchmark,
    ...countryDomainsRateWithBenchmarkState
  } = useFindAll<CountryDomainRatesWithBenchmark>({
    path: `/dashboard/domains/average-rate/country/${countryCode}/africa`,
    queries: {
      filters: { year: `${selectedFilterYear?.value}` },
    },
    tqOptions: {
      queryKey: [selectedFilterYear],
    },
  });

  const countryAverage = Array.isArray(countryDomainsRate)
    ? Math.round(
        countryDomainsRate.reduce(
          (acc, domain) => acc + domain.averageRate,
          0
        ) / (countryDomainsRate.filter((d) => d.averageRate !== 0).length || 1)
      )
    : 0;

  const mappedCountryDomainRate = useMemo(() => {
    const result: Record<
      string,
      { rate: number; name: string; color: string }
    > = {};

    (countryDomainsRate as unknown as Domain[])?.forEach((domain) => {
      const rate = domain.averageRate;
      const scale = (
        measurementScales?.data as unknown as AssessmentMeasurementScale[]
      )?.find((s) => rate === s.rate);
      result[domain.name] = {
        rate,
        name: scale ? scale.name : "",
        color: scale ? scale.color : "#DDD",
      };
    });

    return result;
  }, [countryDomainsRate, measurementScales]);

  const handleSelect = (value?: number) => {
    const selected = yearOptions.find((c) => c.label === value);

    if (selected) {
      setSelectedFilterYear(selected);
    } else {
      setSelectedFilterYear(undefined);
    }
  };

  return (
    <PageContainer
      pageTitle="Dashboard"
      includeBreadcrumb={false}
      onBack={() => {
        router.push("/");
      }}
    >
      <div className="flex flex-col gap-3 w-full mt-2">
        <MetricsContainer title="Measurement Metrics">
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
        <div className="flex w-full justify-between">
          <div className="flex gap-4 items-center py-9 px-4">
            <div className=" w-20 h-14 rounded-md border-[1px] flex items-center justify-center overflow-hidden">
              <span
                className={`fi fi-${africanCountries.features.find((f) => f.properties.postal === countryCode)?.properties.iso_a2.toLowerCase()} text-[12rem]`}
              />
            </div>
            <span className="text-4xl font-bold text-dark">
              {
                africanCountries.features.find(
                  (f) => f.properties.postal === countryCode
                )?.properties.name
              }
            </span>
          </div>
          <div className="flex gap-4 items-center py-9 px-4">
            <span className="text-lg font-bold text-dark">Average</span>
            <div
              style={{
                background:
                  countryAverage !== 0
                    ? (
                        measurementScales?.data as unknown as AssessmentMeasurementScale[]
                      )?.find((s) => s?.rate === countryAverage)?.color
                    : "#eeeeee",
              }}
              className={cn(
                `flex items-center justify-center min-w-16 min-h-12 rounded-sm font-bold text-4xl`,
                countryAverage !== 0
                  ? isLightColor(
                      (
                        measurementScales?.data as unknown as AssessmentMeasurementScale[]
                      )?.find((s) => s?.rate === countryAverage)?.color ?? "*:"
                    )
                    ? "text-dark"
                    : "text-card"
                  : "text-dark"
              )}
            >
              {countryAverage}
            </div>
          </div>
        </div>
        <MetricsContainer
          title={`Assessment result for ${africanCountries.features.find((f) => f.properties.postal === countryCode)?.properties.name}`}
          rightAction={
            <Select<YearOption>
              options={yearOptions}
              onSelect={(c) => handleSelect(c?.value)}
              labelKey="label"
              valueKey="value"
              value={selectedFilterYear}
              placeholder="Filter by Year"
            />
          }
        >
          <div className="flex flex-col lg:flex-row gap-3 w-full m-5">
            {Object.keys(mappedCountryDomainRate).length !== 0 && (
              <div className="flex flex-row lg:flex-col bg-card gap-6 w-full lg:w-1/3 py-6 px-8  overflow-x-auto">
                {!measurementScaleLoading &&
                  Object.entries(mappedCountryDomainRate).map(
                    ([domain, { rate, name, color }], index) => (
                      <DomainMetricsCard
                        isInDetail={true}
                        key={index}
                        scale={{ rate, name, color }}
                        domain={{ id: domain, name: domain }}
                      />
                    )
                  )}
                {(measurementScaleLoading ||
                  countryDomainsRateState.isLoading) &&
                  Array.from({ length: 4 }, (_, i) => (
                    <DomainMetricsCardSkeleton key={i} />
                  ))}
              </div>
            )}
            <RadarChartComponent
              data={countryDomainsRateWithBenchmark?.data ?? []}
              countryCode={countryCode}
              isLoading={countryDomainsRateWithBenchmarkState.isLoading}
            />
          </div>
        </MetricsContainer>
        <DomainsAccordion
          countryCode={countryCode}
          selectedFilterYear={selectedFilterYear}
        />
      </div>
    </PageContainer>
  );
}
