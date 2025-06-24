"use client";

import React from "react";
import { Skeleton } from "@etm/web-ui-components";

interface Props {
  itemCount?: number;
}

export function DomainCompListSkeleton({ itemCount = 5 }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: itemCount }).map((_, index) => (
        <div
          key={index}
          className="w-full flex items-center gap-5 rounded-lg border px-3 py-4"
        >
          <Skeleton className="w-4 h-4 rounded-full" />
          <div className="flex items-center justify-between w-full gap-5">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="w-4 h-4 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
