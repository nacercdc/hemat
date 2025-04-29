/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { Icon } from "@iconify/react";
import type { BarProps } from "recharts";
import {
  LineChart as RLineChart,
  Line,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { cn } from "~/utils/cn.util";
import { SummaryContainer } from "./SummaryContainer";
import { COLORS } from "../constants";
import type { DataKey } from "recharts/types/util/types";

type SummaryFor = "Cases" | "Organizations" | "Employees" | "Consultants";

const SummaryForColors: Record<SummaryFor, string> = {
  Cases: "info",
  Organizations: "destructive",
  Employees: "warning",
  Consultants: "dark-light",
};

// Temporary dummy data
const currentMonth = new Date().toLocaleString("default", { month: "short" });
const data = [
  { name: "Feb", uv: 5000 },
  { name: "Mar", uv: 6000 },
  { name: "Apr", uv: 9000 },
  { name: "May", uv: 6790 },
].map((item) => ({
  ...item,
  isCurrent: item.name === currentMonth,
}));

const LineChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RLineChart width={300} height={100} data={data}>
        <Line
          type="monotone"
          dataKey="uv"
          stroke={COLORS.Info}
          strokeWidth={2}
          dot={false}
        />
      </RLineChart>
    </ResponsiveContainer>
  );
};

interface RoundedBarProps extends BarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  isCurrent?: boolean;
  dataKey: DataKey<string>;
}

const RoundedBar = (props: RoundedBarProps) => {
  const { x, y, width, height, isCurrent } = props;
  const path = `
    M${x},${y! + 5} 
    Q${x},${y} ${x! + 5},${y}
    L${x! + width! - 5},${y}
    Q${x! + width!},${y} ${x! + width!},${y! + 5}
    L${x! + width!},${y! + height!}
    L${x},${y! + height!}
    Z
  `;

  return (
    <path d={path} fill={isCurrent ? COLORS.Info : COLORS.InfoForeground} />
  );
};

const BarChart = () => {
  return (
    <ResponsiveContainer>
      <RBarChart data={data} barSize={40}>
        <CartesianGrid strokeDasharray="3 3" opacity={0} />
        <XAxis hide />
        <YAxis hide />

        <Bar
          dataKey="uv"
          shape={<RoundedBar dataKey="uv" />}
          animationDuration={1500}
        />
      </RBarChart>
    </ResponsiveContainer>
  );
};

interface Props {
  icon: React.ReactNode;
  summaryFor: SummaryFor;
  totalAmount: number;
  summaryDir: "UP" | "DOWN";
  summaryDirAmount: number;
}

export function AnalyticsSummaryCard({
  icon,
  summaryFor,
  totalAmount,
  summaryDir,
  summaryDirAmount,
}: Props) {
  return (
    <SummaryContainer>
      <div className="flex flex-col gap-10 w-full">
        <div className="flex flex-col gap-4">
          <span className={`text-${SummaryForColors[summaryFor]}`}>{icon}</span>
          <div className="flex">
            <div className="flex flex-col gap-2 flex-1">
              <h2 className="text-2xl">{totalAmount.toLocaleString()}</h2>
              <h5 className="text-sm text-dark-light">{`Total ${summaryFor}`}</h5>
            </div>
            <div className="justify-self-end max-w-14 w-full max-h-12 h-full">
              {(summaryFor === "Cases" || summaryFor === "Employees") && (
                <BarChart />
              )}
              {(summaryFor === "Organizations" ||
                summaryFor === "Consultants") && <LineChart />}
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div
            className={`flex gap-1 items-center text-${SummaryForColors[summaryFor]}`}
          >
            <div
              className={cn(
                `flex items-center justify-center p-0.5 rounded-full bg-tbaccent/80`
              )}
            >
              {summaryDir === "UP" && (
                <Icon icon="solar:arrow-up-broken" className="text-sm" />
              )}
              {summaryDir === "DOWN" && (
                <Icon icon="solar:arrow-up-broken" className="text-sm" />
              )}
            </div>
            <span className="text-xs">{summaryDirAmount}%</span>
          </div>
          <h6 className="text-xs text-dark-light">Compared to last month</h6>
        </div>
      </div>
    </SummaryContainer>
  );
}
