"use client";

import React from "react";
import { Skeleton } from "@etm/web-ui-components";

interface Props {
  icon: React.ReactNode;
  count: number;
  title: string;
  isLoading: boolean;
}
export function OverallSummaryCard({
  icon,
  count,
  title,
  isLoading = false,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col">
        {!isLoading && (
          <span className="text-xl font-bold text-[#F2D98C]">{count}</span>
        )}
        {isLoading && <Skeleton className="h-6 w-8 rounded-sm" />}
        <span className="text-white/65 font-medium text-sm">{title}</span>
      </div>
    </div>
  );
}
