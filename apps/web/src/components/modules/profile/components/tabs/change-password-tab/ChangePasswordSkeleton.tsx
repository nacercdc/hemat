"use client";

import React from "react";
import { Skeleton } from "@etm/web-ui-components";

export default function ChangePasswordTabSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="w-40 h-6 rounded-sm" />
        <Skeleton className="w-60 h-4 rounded-sm" />
      </div>

      <div className="flex flex-col gap-5 w-full sm:w-11/12 lg:w-4/5 xl:w-3/4 2xl:w-1/2">
        <Skeleton className="w-full h-6 rounded-sm" />
        <Skeleton className="w-full h-12 rounded-sm" />

        <Skeleton className="w-full h-6 rounded-sm" />
        <Skeleton className="w-full h-12 rounded-sm" />

        <Skeleton className="w-full h-6 rounded-sm" />
        <Skeleton className="w-full h-12 rounded-sm" />

        <div className="flex flex-col gap-1 mt-4">
          <Skeleton className="w-40 h-6 rounded-sm" />
          <Skeleton className="w-60 h-4 rounded-sm" />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <Skeleton className="w-full h-3 rounded-sm" />
          <Skeleton className="w-full h-3 rounded-sm" />
          <Skeleton className="w-full h-3 rounded-sm" />
          <Skeleton className="w-full h-3 rounded-sm" />
          <Skeleton className="w-full h-3 rounded-sm" />
        </div>

        <div className="w-full flex justify-end mt-2">
          <Skeleton className="w-32 h-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}
