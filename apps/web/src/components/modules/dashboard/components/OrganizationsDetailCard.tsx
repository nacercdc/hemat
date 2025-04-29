import React from "react";
import { Icon } from "@iconify/react";
import type { DefaultLegendContentProps } from "recharts";
import {
  Legend,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
} from "recharts";

import { COLORS } from "../constants";
import { SummaryContainer } from "./SummaryContainer";

type OrganizationDataType = "WVL" | "Rest";

const ColorClasses: Record<OrganizationDataType, string> = {
  WVL: COLORS.Info,
  Rest: COLORS.Accent,
};

// Temporary dummy data
const data: { name: OrganizationDataType; label: string; value: number }[] = [
  { name: "WVL", label: "WVL", value: 10 },
  { name: "Rest", label: "Rest", value: 90 },
];

export function OrganizationsDetailCard() {
  return (
    <SummaryContainer>
      <div className="flex flex-col w-full h-[400px]">
        <div className="flex justify-between">
          <h6 className="font-bold">Organizations</h6>
          <Icon
            icon="pixel:ellipses-horizontal-solid"
            className="text-dark-light"
          />
        </div>
        <PieChart />
      </div>
    </SummaryContainer>
  );
}

function OrganizationsLegend({ payload }: DefaultLegendContentProps) {
  return (
    <div className="flex flex-col gap-1 absolute bottom-0 -m-3 -ml-6">
      {payload?.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-1">
          <div
            className={"w-3 h-3 rounded-sm"}
            style={{
              backgroundColor: entry.color,
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

const PieChart = () => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ResponsiveContainer>
        <RPieChart className="relative">
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {(["WVL", "Rest"] as OrganizationDataType[]).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={ColorClasses[entry]} />
            ))}
          </Pie>
          <Legend
            content={<OrganizationsLegend />}
            className="w-full"
            align="center"
            verticalAlign="bottom"
            layout="vertical"
          />
        </RPieChart>
      </ResponsiveContainer>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-2xl text-info font-bold">{data[0]?.value}%</div>
        <div className="text-dark-light">Increase</div>
      </div>
    </div>
  );
};
