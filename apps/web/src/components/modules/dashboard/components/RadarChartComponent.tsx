"use client";

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
import africanCountries from "./AfricaMap/africa.geo.json";
import { Skeleton } from "@etm/web-ui-components";
import type { AssessmentMeasurementScale } from "~/libs/models/assessment-measurement-scale.model";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";

export interface CountryDomainRatesWithBenchmark {
  id: string;
  name: string;
  averagePrimaryRate: number;
  averageRoadmapRate: number;
  africaAveragePrimaryRate: number;
  africaAverageRoadmapRate: number;
}

interface RadarChartProps {
  data: CountryDomainRatesWithBenchmark[];
  countryCode: string;
  isLoading: boolean;
}

export function RadarChartComponent({
  data,
  countryCode,
  isLoading,
}: RadarChartProps) {
  const { data: measurementScales, ...measurementScalesState } =
    useFindAll<AssessmentMeasurementScale>({
      path: "/dashboard/measurement-scales",
      queries: { sorts: { ascending: "rate" } },
    });

  const maxRate = measurementScales?.data.reduce(
    (max, scale) => Math.max(max, scale.rate),
    0
  );
  const minRate = measurementScales?.data.reduce(
    (min, scale) => Math.min(min, scale.rate),
    Infinity
  );

  const radarChartData =
    data?.map((domain) => ({
      subject: domain.name,
      countryRate: domain.averagePrimaryRate,
      africaRate: domain.africaAveragePrimaryRate,
      fullMark: 5,
    })) ?? [];

  if (isLoading || measurementScalesState.isLoading) {
    return (
      <div className="bg-card rounded-md w-full h-[600px] p-12">
        <Skeleton className="w-full h-full rounded-md" />
      </div>
    );
  }

  if (radarChartData.length === 0) {
    return (
      <div className="bg-card rounded-md w-full h-[600px] p-12 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold">No data available</p>
          <p>Please select a different year or check your data source</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-md w-full h-[600px]">
      <ResponsiveContainer width="100%" height="100%" className="p-12">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis domain={[minRate ?? 0, maxRate ?? 5]} />
          <Radar
            name="Africa"
            dataKey="africaRate"
            stroke="#782C2D"
            fill="#782C2D"
            fillOpacity={0.6}
          />
          <Radar
            name={
              africanCountries.features.find(
                (f) => f.properties.postal === countryCode
              )?.properties.name
            }
            dataKey="countryRate"
            stroke="#348F41"
            fill="#348F41"
            fillOpacity={0.6}
          />
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
