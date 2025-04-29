/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from "react";
import { Select } from "@etm/web-ui-components";
import type { DefaultLegendContentProps } from "recharts";
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { COLORS } from "../constants";
import { SummaryContainer } from "./SummaryContainer";

type CaseStatusType = "Closed" | "Pending";

const ColorClasses: Record<CaseStatusType, string> = {
  Closed: COLORS.Warning,
  Pending: COLORS.Info,
};

interface CaseYearOptionType {
  label: string;
  value: string;
}

const CaseYearOptions: CaseYearOptionType[] = [
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
];

// Temporary dummy data
const data: Record<CaseStatusType | "month", string | number>[] = [
  { month: "Jan", Closed: 1500, Pending: 1000 },
  { month: "Feb", Closed: 5000, Pending: 800 },
  { month: "Mar", Closed: 1000, Pending: 500 },
  { month: "Apr", Closed: 7500, Pending: 5000 },
  { month: "May", Closed: 2000, Pending: 3500 },
  { month: "Jun", Closed: 8000, Pending: 6000 },
  { month: "Jul", Closed: 700, Pending: 1000 },
  { month: "Aug", Closed: 4000, Pending: 3800 },
  { month: "Sep", Closed: 9000, Pending: 1200 },
  { month: "Oct", Closed: 2500, Pending: 6000 },
  { month: "Nov", Closed: 4000, Pending: 30 },
  { month: "Dec", Closed: 6000, Pending: 5000 },
];

export function CasesDetailCard() {
  const [selectedCaseOption, setSelectedCaseOption] =
    useState<CaseYearOptionType>({ label: "2025", value: "2025" });

  const onCaseYearFilterChangeHandler = (value: CaseYearOptionType) => {
    setSelectedCaseOption(value);
  };

  return (
    <SummaryContainer>
      <div className="flex flex-col w-full h-[400px]">
        <div className="flex justify-between">
          <h6 className="font-bold">Cases</h6>
          <div className="w-fit">
            <Select
              name="CasesYear"
              size="lg"
              valueKey="value"
              labelKey="label"
              options={CaseYearOptions}
              onSelect={(value) => onCaseYearFilterChangeHandler(value!)}
              value={selectedCaseOption}
              searchPlaceholder=""
            />
          </div>
        </div>
        <LineChart />
      </div>
    </SummaryContainer>
  );
}

function CasesLegend({ payload }: DefaultLegendContentProps) {
  return (
    <div className="sm:visible flex lg:invisible min-[1260px]:visible gap-3 invisible mb-10">
      {payload?.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-1">
          <div
            className={"w-3 h-3 rounded-sm"}
            style={{
              backgroundColor: ColorClasses[entry.dataKey! as CaseStatusType],
            }}
          />
          <span className="text-dark-light text-xs font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function LineChart() {
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data} margin={{ top: -40, right: 5, left: -10 }}>
          <CartesianGrid horizontal={true} vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            className="text-dark-light text-xs"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-dark-light text-xs"
          />
          <Tooltip contentStyle={{ borderRadius: "10px" }} />
          <Legend
            align="center"
            verticalAlign="top"
            layout="vertical"
            content={<CasesLegend />}
          />
          <Line
            type="monotone"
            dataKey="Closed"
            stroke={ColorClasses.Closed}
            strokeWidth={2}
            name="Closed"
          />
          <Line
            type="monotone"
            dataKey="Pending"
            stroke={ColorClasses.Pending}
            strokeWidth={2}
            name="Pending"
          />
        </RLineChart>
      </ResponsiveContainer>
    </>
  );
}
