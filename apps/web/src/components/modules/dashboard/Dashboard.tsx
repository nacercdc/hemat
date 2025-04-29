"use client";

import React from "react";
import { AnalyticsSummaryCard } from "./components/AnalyticsSummaryCard";
import { Icon } from "@iconify/react";
import { CasesDetailCard } from "./components/CasesDetailCard";

export default function Dashboard() {
  return (
    // Page container component will be replaced here
    <div className="flex flex-col gap-11">
      {/* Page Header Component will be replaced here */}
      <div className="text-2xl font-bold">Dashboard</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_2fr_2fr_3fr] gap-4 w-full h-full">
        <AnalyticsSummaryCard
          icon={<Icon icon="solar:folder-broken" className="text-2xl" />}
          summaryFor="Cases"
          totalAmount={120000}
          summaryDir="UP"
          summaryDirAmount={12}
        />
        <AnalyticsSummaryCard
          icon={<Icon icon="octicon:organization-24" className="text-2xl" />}
          summaryFor="Organizations"
          totalAmount={50000}
          summaryDir="DOWN"
          summaryDirAmount={8}
        />
        <AnalyticsSummaryCard
          icon={
            <Icon icon="clarity:employee-group-line" className="text-2xl" />
          }
          summaryFor="Employees"
          totalAmount={120000}
          summaryDir="UP"
          summaryDirAmount={10}
        />
        <AnalyticsSummaryCard
          icon={<Icon icon="solar:user-check-linear" className="text-2xl" />}
          summaryFor="Consultants"
          totalAmount={50000}
          summaryDir="UP"
          summaryDirAmount={8}
        />
        <div className="sm:col-span-2 lg:col-span-2 col-span-1 row-span-2">
          <CasesDetailCard />
        </div>
      </div>
    </div>
  );
}
