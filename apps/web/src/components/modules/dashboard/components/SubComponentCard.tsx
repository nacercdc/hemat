import { Skeleton } from "@etm/web-ui-components";
import React from "react";

interface Props {
  title: string;
  content: string;
  primaryRate: number;
  roadmapRate: number;
  benchmarkRate: number;
}

export function SubComponentCard({
  title,
  content,
  primaryRate,
  roadmapRate,
  benchmarkRate,
}: Props) {
  return (
    <div className="h-fit  min-h-64  flex flex-col justify-between rounded-sm border-dark-lighter/20 border-[1px] bg-white">
      <div className="flex flex-col gap-4">
        <div className="bg-[#F0F7FA] text-dark text-xs font-bold p-2 py-4 rounded-sm">
          {title}
        </div>
        <div className="text-dark-light text-xs p-2 overflow-y-auto">
          {content}
        </div>
      </div>
      <div className="flex flex-col min-[600px]:flex-row flex-wrap justify-evenly gap-0 items-center">
        <div className="flex w-full gap-4 justify-center items-center p-2 bg-[#FFC000]/10">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Current</span>
          </div>
          <div className="w-7 h-6 rounded-sm text-center bg-[#FFC000] text-white font-semibold">
            {primaryRate.toString()}
          </div>
        </div>{" "}
        <div className="flex w-full gap-4 justify-center items-center p-2 bg-[#00B0F0]/10">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Roadmap</span>
          </div>
          <div className="w-7 h-6 rounded-sm text-center bg-[#00B0F0] text-white font-semibold">
            {roadmapRate.toString()}
          </div>
        </div>{" "}
        <div className="flex w-full gap-4 justify-center items-center p-[2px] bg-[#11B050]/10">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Benchmark</span>
            <span className="text-xs text-dark-light">Africa Average</span>
          </div>
          <div className="w-7 h-6 rounded-sm text-center bg-[#11B050] text-white font-semibold">
            {benchmarkRate.toString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DomainComponentCardSkeleton() {
  return (
    <div className="h-64 flex flex-col justify-between rounded-sm border-dark-lighter/20 border-[1px] bg-white">
      <div className="flex flex-col gap-4 p-2">
        <Skeleton className="rounded-sm w-28 h-4" />
        <Skeleton className="rounded-sm w-28 h-4" />
      </div>
      <div className="flex justify-between items-center p-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="rounded-sm w-28 h-4" />
          <Skeleton className="rounded-sm w-32 h-4" />
        </div>
        <div className="w-7 h-6 rounded-sm text-center">
          <Skeleton className="rounded-sm h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
