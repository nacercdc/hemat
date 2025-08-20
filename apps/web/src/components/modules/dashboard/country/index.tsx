"use client";

import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { AssessmentMeasurementScale } from "~/libs/models/assessment-measurement-scale.model";
import { PageContainer } from "../../components/PageContainer";
import MetricsContainer from "../components/MetricsContainer";
import MetricsCard, { MetricsCardSkeleton } from "../components/MetricsCard";
import { useParams, useRouter } from "next/navigation";
import africanCountries from "../components/AfricaMap/africa.geo.json";
import { useMemo } from "react";
import DomainMetricsCard, {
  DomainMetricsCardSkeleton,
} from "../components/DomainMetricsCard";
import { cn } from "~/utils/cn.util";
import { isLightColor } from "../utils/luminacity.util";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface Domain {
  id: string;
  name: string;
  averageRate: number;
}

interface CountryDomainRatesWithBenchmark {
  id: string;
  name: string;
  averagePrimaryRate: number;
  averageRoadmapRate: number;
  africaAveragePrimaryRate: number;
  africaAverageRoadmapRate: number;
}

export default function CountryDashboard() {
  const router = useRouter();
  const params = useParams();
  const countryCode = params.code as string;

  const { data: measurementScales, ...measurementScalesState } = useFindAll<{
    data: AssessmentMeasurementScale[];
  }>({
    path: "/dashboard/measurement-scales",
    queries: { sorts: { ascending: "rate" } },
  });

  const measurementScaleLoading =
    measurementScalesState.isLoading || measurementScalesState.isFetching;

  const { data: countryDomainsRate, ...countryDomainsRateState } = useFindAll<
    Domain[]
  >({
    path: `/dashboard/domains/average-rate/country/${countryCode}`,
    isProtected: false,
  });

  const {
    data: countryDomainsRateWithBenchmark,
    ...countryDomainsRateWithBenchmarkState
  } = useFindAll<CountryDomainRatesWithBenchmark[]>({
    path: `/dashboard/domains/average-rate/country/${countryCode}/africa`,
    isProtected: false,
  });

  const radarChartData = useMemo(() => {
    if (!countryDomainsRateWithBenchmark) return [];
    return countryDomainsRateWithBenchmark.map((domain, index) => ({
      subject: domain.name,
      countryRate: domain.averagePrimaryRate,
      africaRate: domain.africaAveragePrimaryRate,
      fullMark: 5,
    }));
  }, [countryDomainsRateWithBenchmark]);

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
                      ).find((s) => s?.rate === countryAverage)?.color ?? "*:"
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
        {Object.keys(mappedCountryDomainRate).length !== 0 && (
          <MetricsContainer
            title={`Domains Metrics for ${africanCountries.features.find((f) => f.properties.postal === countryCode)?.properties.name}`}
          >
            <>
              <div className="flex flex-row gap-3 w-full py-5 overflow-x-auto">
                {!measurementScaleLoading &&
                  Object.entries(mappedCountryDomainRate).map(
                    ([domain, { rate, name, color }], index) => (
                      <DomainMetricsCard
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
            </>
          </MetricsContainer>
        )}
        <MetricsContainer title={`Domain Overview`}>
          <div className="bg-card rounded-md w-full h-[600px]">
            <ResponsiveContainer width="50%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={radarChartData}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 5]} />
                <Radar
                  name="Country"
                  dataKey="countryRate"
                  stroke="#348F41"
                  fill="#348F41"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Africa Average"
                  dataKey="africaRate"
                  stroke="#782C2D"
                  fill="#782C2D"
                  fillOpacity={0.4}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </MetricsContainer>
      </div>
    </PageContainer>
  );
}
