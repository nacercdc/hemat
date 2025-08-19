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
import type { Country } from "~/libs/models/country.model";

interface Domain {
  id: string;
  name: string;
  averageRate: number;
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

  const { data: countryDomainsRate } = useFindAll<Domain[]>({
    path: `/dashboard/domains/average-rate/country/${countryCode}`,
    isProtected: false,
  });

  const { data: countries, ...countriesState } = useFindAll<Country>({
    path: "/countries",
    isProtected: false,
    queries: {
      take: 100,
    },
  });

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

  console.log(countryDomainsRate);
  console.log(mappedCountryDomainRate);
  console.log(countries?.data.find((c) => c.code === countryCode));

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
        <div className="flex gap-4 items-center py-9">
          <span className="w-24 h-14 rounded-md flex items-center justify-center text-[10rem] p-8 overflow-hidden">
            {countries?.data.find((c) => c.code === countryCode)?.emoji}
          </span>
          <span className="text-4xl font-bold text-dark">
            {
              africanCountries.features.find(
                (f) => f.properties.postal === countryCode
              )?.properties.name
            }
          </span>
        </div>
        <MetricsContainer
          title={`Domains Metrics for ${africanCountries.features.find((f) => f.properties.postal === countryCode)?.properties.name}`}
        >
          {/* <OverallDomainMetricsSection
            measurementScaleLoading={measurementScaleLoading}
            measurementScales={
              mappedCountryDomainRate?.data as unknown as AssessmentMeasurementScale[]
            }
          /> */}
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
              {measurementScaleLoading &&
                Array.from({ length: 4 }, (_, i) => (
                  <DomainMetricsCardSkeleton key={i} />
                ))}
            </div>
          </>
        </MetricsContainer>

        <div className="p-4 bg-layout-bg/15 rounded-md">
          {/* <AfricaMap /> */}
        </div>
      </div>
    </PageContainer>
  );
}
