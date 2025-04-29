import React from "react";
import { Icon } from "@iconify/react";
import {
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
} from "recharts";

import { COLORS } from "../constants";
import { SummaryContainer } from "./SummaryContainer";

type ResolvedCasesDataType = "Data" | "Rest";

const ColorClasses: Record<ResolvedCasesDataType, string> = {
  Data: COLORS.Destructive,
  Rest: COLORS.Accent,
};

// Temporary dummy data
const data: { name: ResolvedCasesDataType; label: string; value: number }[] = [
  { name: "Data", label: "Data", value: 15 },
  { name: "Rest", label: "Rest", value: 85 },
];

export function ResolvedCasesDetailCard() {
  return (
    <SummaryContainer>
      <div className="flex flex-col w-full h-[175px]">
        <div className="flex justify-between">
          <h6 className="font-bold">Resolved Cases</h6>
          <Icon
            icon="pixel:ellipses-horizontal-solid"
            className="text-dark-light"
          />
        </div>
        <div className="flex gap-1 relative">
          <PieChart />
          <div className="absolute right-2 left-32 top-5 gap-4">
            <div className="flex flex-col text-xs">
              <span className="font-bold">Time to resolve cases</span>
              <span className="text-dark-light">
                How long it took us to resolve cases
              </span>
            </div>
            <div className="flex gap-1 font-bold text-xs mt-4">
              <span className="font-bold">25 days</span>
              <span>/</span>
              <span className="font-normal text-dark-light">Goal: 2 days</span>
            </div>
          </div>
        </div>
      </div>
    </SummaryContainer>
  );
}

const PieChart = () => {
  return (
    <div className="relative" style={{ width: "100%", height: "150px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RPieChart>
          <Pie
            cx="50"
            cy="50%"
            data={data}
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {(["Data", "Rest"] as ResolvedCasesDataType[]).map(
              (entry, index) => (
                <Cell key={`cell-${index}`} fill={ColorClasses[entry]} />
              )
            )}
          </Pie>
        </RPieChart>
      </ResponsiveContainer>

      <div className="absolute top-1/2 left-[57px] -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-lg text-info font-bold">{data[0]?.value}%</div>
        <div className="text-dark-light text-xs">Reached</div>
      </div>
    </div>
  );
};
